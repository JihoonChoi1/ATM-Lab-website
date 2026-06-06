// Strips inline `background-color` declarations from News bodies. The legacy CMS
// (froala) baked `background-color: rgb(255,255,255)` into every pasted
// paragraph, which renders as white boxes/bars over the site's grey background
// (and would reappear in a future admin rich-text editor that loads the raw
// HTML). This removes the declaration from the stored content for good.
//
// Idempotent: re-running finds nothing to change.
//
// Run with: npm run db:clean-news-styles

import { prisma } from "../lib/db";

// `background-color: <value>` up to the next `;` or the closing `"` of the
// style attribute, plus that optional trailing `;`. The value (e.g.
// "rgb(255, 255, 255)") never contains `;` or `"`, so this is safe.
const BG_DECL_RE = /background-color\s*:\s*[^;"]*;?/gi;

async function main() {
  const news = await prisma.news.findMany();
  let scanned = 0;
  let cleaned = 0;
  let removed = 0;

  for (const n of news) {
    scanned++;
    const content = n.content ?? "";
    if (!content) continue;

    const hits = content.match(BG_DECL_RE)?.length ?? 0;
    if (hits === 0) continue;

    const next = content.replace(BG_DECL_RE, "");
    await prisma.news.update({ where: { id: n.id }, data: { content: next } });
    cleaned++;
    removed += hits;
    console.log(`  ✎ News#${n.order} — removed ${hits} bg decl(s) — ${n.title.slice(0, 44)}`);
  }

  console.log(`\nDone. scanned=${scanned} posts_cleaned=${cleaned} declarations_removed=${removed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
