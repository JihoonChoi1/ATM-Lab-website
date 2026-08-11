import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import GalleryTable from "./_components/GalleryTable";

export const metadata: Metadata = { title: "Manage Gallery · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdmin("/admin/gallery");

  // Same canonical order as the public board: date desc, with order (legacy
  // wr_id) then createdAt breaking ties deterministically. No chips, search,
  // or pagination: 15 rows, and the order is computed, not curated.
  const rows = await prisma.galleryItem.findMany({
    orderBy: [{ date: "desc" }, { order: "desc" }, { createdAt: "desc" }],
    select: { id: true, date: true, title: true, imgPath: true, published: true },
  });

  const items = rows.map((g) => ({
    ...g,
    // UTC calendar date — matches the board/detail rendering exactly.
    date: g.date.toISOString().slice(0, 10),
  }));

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Gallery</h1>
          <p className="mt-1 text-sm text-ink-3">
            {items.length} gallery items — same order as the public /board Gallery
            section (by date, descending).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/board/meta"
            className="rounded-2xl border border-line px-4 py-2.5 text-sm font-medium text-ink-2 transition hover:border-accent/30 hover:text-accent"
          >
            Edit Board page meta
          </Link>
          <Link
            href="/admin/gallery/new"
            className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            Add item
          </Link>
        </div>
      </div>
      <GalleryTable items={items} />
    </div>
  );
}
