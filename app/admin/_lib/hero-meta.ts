import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";

// Shared back-end for the lightweight page-hero meta editors (Phase 2). Every
// {Section}PageMeta singleton has the same shape — a multi-line headline + an
// intro paragraph — so one schema, one form (HeroMetaForm), and one save helper
// serve members/projects/publications/lectures/board. Mirrors the Research
// pageMeta policy: re-guard with requireAdmin, findFirst → update-or-create,
// audit on success (UPDATE diffs changed fields, CREATE logs the new row).

export const heroMetaSchema = z.object({
  // Newline-separated; the public hero splits on "\n" → <br/>.
  heroHeadline: z.string().trim().min(1, "제목을 입력하세요."),
  heroParagraph: z.string().trim().min(1, "소개 문단을 입력하세요."),
});

export type HeroMetaInput = z.output<typeof heroMetaSchema>;

export type HeroMetaFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

// The narrow slice of a Prisma singleton delegate this helper needs. Each
// {Section}PageMeta delegate is passed in as this shape (see the per-section
// actions); the model is a singleton so there is exactly one row to find.
export type SingletonDelegate = {
  findFirst(): Promise<({ id: string } & Record<string, unknown>) | null>;
  update(args: { where: { id: string }; data: HeroMetaInput }): Promise<unknown>;
  create(args: { data: HeroMetaInput }): Promise<{ id: string }>;
};

type SaveOpts = {
  delegate: SingletonDelegate;
  entity: string; // Prisma model name, e.g. "MembersPageMeta" (audit + revert key)
  label: string; // human-readable audit label, e.g. "Members 페이지 메타"
  metaPath: string; // "/admin/members/meta" — the guard path and redirect target
};

// Parse → update-or-create → audit → redirect back to the meta page with the
// ?saved=1 success banner. redirect() throws, so nothing runs after it.
export async function saveHeroMeta(
  opts: SaveOpts,
  formData: FormData,
): Promise<HeroMetaFormState> {
  const session = await requireAdmin(opts.metaPath);

  const parsed = heroMetaSchema.safeParse({
    heroHeadline: String(formData.get("heroHeadline") ?? ""),
    heroParagraph: String(formData.get("heroParagraph") ?? ""),
  });
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  const existing = await opts.delegate.findFirst();
  if (existing) {
    await opts.delegate.update({ where: { id: existing.id }, data: parsed.data });
    await logAudit({
      userId: session.user.id,
      action: "UPDATE",
      entity: opts.entity,
      entityId: existing.id,
      data: { ip: getClientIp(), label: opts.label, ...diffChanges(existing, parsed.data) },
    });
  } else {
    const created = await opts.delegate.create({ data: parsed.data });
    await logAudit({
      userId: session.user.id,
      action: "CREATE",
      entity: opts.entity,
      entityId: created.id,
      data: { ip: getClientIp(), label: opts.label },
    });
  }

  redirect(`${opts.metaPath}?saved=1`);
}
