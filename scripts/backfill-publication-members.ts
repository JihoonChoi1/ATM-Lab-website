// One-time, idempotent helper that pre-fills Publication↔Member author tags by
// matching member names against the free-text authors/inventors strings, so
// admins only review the leftovers instead of tagging ~200 publications by hand.
//
// Matching per member:
//   - abbreviated citation form ("Kang S.", "Seo J.H.", "Doh S.Y."): surname +
//     given-name initials; given names split on spaces, hyphens, and camelCase
//     (JinHyeuk → J.H.). Used by journal/conference author strings.
//   - full name ("Sukkyung Kang"): used by patent inventor strings.
//
// Conservative by design:
//   - A pattern shared by 2+ members (three Kims, …) is only auto-applied when
//     those members share an email — the legacy "same person as Researcher and
//     Alumni" dual rows — in which case ALL of them are tagged (both profiles
//     belong to the same human). Otherwise matches are printed for manual
//     tagging, never written.
//   - External co-authors who happen to share a member's surname+initials are
//     undetectable here; skim the printed plan before applying.
//
// Dry-run by default — prints the full plan and writes nothing. Apply with:
//   npm run db:backfill-publication-members -- --apply
// (targets DATABASE_URL from .env.local; override inline for other DBs)

import { prisma } from "../lib/db";

// DB names that don't match how the person appears in author strings.
const NAME_ALIASES: Record<string, { given: string; surname: string }> = {
  이정호: { given: "Jungho", surname: "Lee" },
};

// Extra literal spellings per DB member name — domestic conference papers list
// authors in Korean, which can't be derived from the English DB names. Only
// high-confidence 1:1 romanizations are pre-filled; extend and re-run as more
// are confirmed (the dry run is the review step). 헌병찬 covers a source typo.
const EXTRA_NAMES: Record<string, string[]> = {
  "Hyunmuk Lim": ["임현묵"],
  "JinHyeuk Seo": ["서진혁"],
  "Sukkyung Kang": ["강석경"],
  "Kyuil Kim": ["김규일"],
  "ByungChan Hyun": ["현병찬", "헌병찬"],
};

// "Su-Yoon" → [Su, Yoon]; "JinHyeuk" → [Jin, Hyeuk]; "Seung Woo" → [Seung, Woo]
function givenParts(given: string): string[] {
  return given
    .split(/[\s-]+/)
    .flatMap((part) => part.split(/(?<=[a-z])(?=[A-Z])/))
    .filter(Boolean);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Candidate = {
  memberId: string;
  name: string;
  email: string | null;
  key: string; // ambiguity key: surname + initials
  regexes: RegExp[];
};

// Delimited so "Seo J.H." never matches inside "Seo J.H.K." or "Aseo J.H.".
// `*` closes a match too — corresponding authors appear as "Jungho Lee*".
const BOUNDARY = "(?=$|[\\s,;*])";

function literalRe(name: string): RegExp {
  return new RegExp(`(?:^|[\\s,;])${escapeRe(name)}${BOUNDARY}`, "i");
}

function buildCandidate(m: {
  id: string;
  name: string;
  email: string | null;
}): Candidate {
  // Literal spellings always match: the DB name itself (catches Korean author
  // strings for the professor row) plus any confirmed EXTRA_NAMES.
  const literals = [m.name, ...(EXTRA_NAMES[m.name] ?? [])].map(literalRe);

  const alias = NAME_ALIASES[m.name];
  let given: string;
  let surname: string;
  if (alias) {
    ({ given, surname } = alias);
  } else {
    const tokens = m.name.trim().split(/\s+/);
    // Non-Latin or single-token names get no derived patterns — literals only.
    if (tokens.length < 2 || !/^[A-Za-z]/.test(m.name)) {
      return {
        memberId: m.id,
        name: m.name,
        email: m.email,
        key: m.name,
        regexes: literals,
      };
    }
    surname = tokens[tokens.length - 1];
    given = tokens.slice(0, -1).join(" ");
  }

  const parts = givenParts(given);
  const initials = parts.map((p) => p[0].toUpperCase());
  const abbrev = new RegExp(
    `(?:^|[\\s,;])${escapeRe(surname)}\\s+${initials
      .map((i) => `${i}\\s*\\.`)
      .join("\\s*")}${BOUNDARY}`,
  );
  // Given-name parts joined flexibly so "Su-Yoon" also matches "Su Yoon" /
  // "Suyoon" spellings (and vice versa).
  const fullName = new RegExp(
    `(?:^|[\\s,;])${parts.map(escapeRe).join("[\\s-]*")}\\s+${escapeRe(surname)}${BOUNDARY}`,
    "i",
  );

  return {
    memberId: m.id,
    name: m.name,
    email: m.email,
    key: `${surname} ${initials.join("")}`,
    regexes: [abbrev, fullName, ...literals],
  };
}

async function main() {
  const apply = process.argv.includes("--apply");

  const [members, publications] = await Promise.all([
    prisma.member.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { order: "asc" },
    }),
    prisma.publication.findMany({
      select: {
        id: true,
        title: true,
        authors: true,
        inventors: true,
        members: { select: { id: true } },
      },
      orderBy: [{ year: "desc" }, { order: "desc" }],
    }),
  ]);

  const candidates = members.map(buildCandidate);

  // Ambiguity: same key = identical patterns. Auto-taggable only when every
  // key-sharer has the same email (the same person's dual rows).
  const byKey = new Map<string, Candidate[]>();
  for (const c of candidates) {
    byKey.set(c.key, [...(byKey.get(c.key) ?? []), c]);
  }
  const ambiguousKeys = new Set(
    Array.from(byKey.entries())
      .filter(
        ([, cs]) =>
          cs.length > 1 && !cs.every((c) => c.email && c.email === cs[0].email),
      )
      .map(([key]) => key),
  );

  let plannedConnections = 0;
  const plans: { id: string; title: string; add: Candidate[] }[] = [];
  const ambiguousHits: { title: string; key: string; names: string[] }[] = [];
  const untagged: { title: string; text: string }[] = [];

  for (const pub of publications) {
    const text = [pub.authors, pub.inventors].filter(Boolean).join(", ");
    const existing = new Set(pub.members.map((m) => m.id));

    const add: Candidate[] = [];
    for (const [key, cs] of byKey) {
      if (!text || !cs[0].regexes.some((re) => re.test(text))) continue;
      if (ambiguousKeys.has(key)) {
        ambiguousHits.push({
          title: pub.title,
          key,
          names: cs.map((c) => c.name),
        });
        continue;
      }
      add.push(...cs.filter((c) => !existing.has(c.memberId)));
    }

    if (add.length > 0) {
      plans.push({ id: pub.id, title: pub.title, add });
      plannedConnections += add.length;
    }
    // Manual-work list: nothing tagged before, nothing tagged now.
    if (existing.size === 0 && add.length === 0) {
      untagged.push({ title: pub.title, text: text || "(저자 없음)" });
    }
  }

  // ── Report ──
  const short = (t: string) => (t.length > 72 ? `${t.slice(0, 69)}...` : t);
  console.log(`\n${apply ? "APPLY" : "DRY RUN"} — publication↔member tag backfill\n`);
  for (const p of plans) {
    console.log(`+ ${short(p.title)}`);
    console.log(`    → ${p.add.map((c) => c.name).join(", ")}`);
  }
  console.log(
    `\n${plans.length} publications, ${plannedConnections} new tags planned.`,
  );

  if (ambiguousHits.length > 0) {
    console.log(`\nAmbiguous matches (NOT applied — tag manually in the admin):`);
    for (const hit of ambiguousHits) {
      console.log(
        `  ? ${short(hit.title)}\n      "${hit.key}" could be: ${hit.names.join(" / ")}`,
      );
    }
  }

  if (untagged.length > 0) {
    console.log(
      `\nUntagged publications (${untagged.length} — no member matched; tag manually or extend EXTRA_NAMES):`,
    );
    for (const u of untagged) {
      console.log(`  - ${short(u.title)}\n      ${short(u.text)}`);
    }
  }

  if (!apply) {
    console.log(`\nDry run only — re-run with --apply to write these tags.`);
    return;
  }

  for (const p of plans) {
    await prisma.publication.update({
      where: { id: p.id },
      data: { members: { connect: p.add.map((c) => ({ id: c.memberId })) } },
    });
  }
  console.log(`\nApplied.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
