import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { thumbnailDiskPath } from "@/lib/thumbnail";

// Phase 7-9: reference checks + file removal for the upload sweep
// (scripts/sweep-uploads.ts). An admin-uploaded image (original + thumbnail) is
// deletable only when it is referenced by neither (a) any current row, nor
// (b) any audit log — the audit `before`/`after`/`snapshot` keep a path
// restorable for 90 days (revert/restore, 7-3b), and audit rows auto-expire at
// 90 days (lib/audit.ts). So a file's lifecycle follows the audit window: kept
// while restorable, reclaimed by the next sweep once its audit has aged out.
// Only /uploads is ever deleted — /legacy is a shared, committed asset. There is
// no inline replace-time deletion: every form edit logs the old path for restore,
// so immediate deletion would always break the 90-day window (2026-06-14).

// Models with an imgPath column — the only places a path can be referenced, in a
// current row or inside an audit before/after/snapshot.
const IMG_ENTITIES = ["Member", "Publication", "GalleryItem", "ResearchFigure"];

// Audit entities whose serialized data can embed an upload path. Beyond the
// imgPath-bearing models, a deleted ResearchTopic/ResearchSubsection snapshots
// its whole subtree (7-10b), so a figure's imgPath rides inside a ResearchTopic/
// ResearchSubsection DELETE entry. These two MUST stay out of IMG_ENTITIES —
// they have no imgPath column, so countImgPathRefs' count({ where: { imgPath } })
// would break on them. Audit-scan only.
const AUDIT_IMG_ENTITIES = [...IMG_ENTITIES, "ResearchTopic", "ResearchSubsection"];

// Count current rows across every imgPath-bearing model that point at this path.
export async function countImgPathRefs(webPath: string): Promise<number> {
  const [members, publications, gallery, figures] = await Promise.all([
    prisma.member.count({ where: { imgPath: webPath } }),
    prisma.publication.count({ where: { imgPath: webPath } }),
    prisma.galleryItem.count({ where: { imgPath: webPath } }),
    prisma.researchFigure.count({ where: { imgPath: webPath } }),
  ]);
  return members + publications + gallery + figures;
}

// True if any (≤90-day) audit log still references this path — i.e. it is still
// restorable via revert/restore and must not be deleted yet. The path is a unique
// /uploads/<uuid> string, so a substring match over the serialized data is exact.
export async function isReferencedInAudit(webPath: string): Promise<boolean> {
  const rows = await prisma.auditLog.findMany({
    where: { entity: { in: AUDIT_IMG_ENTITIES } },
    select: { data: true },
  });
  return rows.some((r) => r.data != null && JSON.stringify(r.data).includes(webPath));
}

// A file may be deleted only when nothing — row or audit — still points at it.
export async function isUploadReferenced(webPath: string): Promise<boolean> {
  if ((await countImgPathRefs(webPath)) > 0) return true;
  return isReferencedInAudit(webPath);
}

// Remove an upload's original file and its thumbnail. Missing files are ignored.
export async function removeUploadFiles(webPath: string): Promise<void> {
  const original = path.join(process.cwd(), "public", webPath.replace(/^\//, ""));
  await unlink(original).catch(() => {});
  await unlink(thumbnailDiskPath(webPath)).catch(() => {});
}
