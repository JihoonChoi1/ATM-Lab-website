import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site-url";

// Reads published rows per request: AUTH_URL (siteUrl) is injected at runtime so
// the absolute URLs resolve to the deploy's real host, and admin edits show up
// immediately instead of a build-time snapshot.
export const dynamic = "force-dynamic";

// Public list/landing pages (no per-page lastModified source).
const staticRoutes: MetadataRoute.Sitemap = [
  { url: siteUrl, changeFrequency: "weekly", priority: 1.0 },
  { url: `${siteUrl}/members`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${siteUrl}/research`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${siteUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${siteUrl}/publications`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteUrl}/lectures`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${siteUrl}/board`, changeFrequency: "weekly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only published rows are reachable publicly (lists filter, detail pages
  // notFound() unpublished), so mirror that filter here.
  const [news, gallery, publications] = await Promise.all([
    prisma.news.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.galleryItem.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.publication.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const detailRoutes: MetadataRoute.Sitemap = [
    ...news.map((n) => ({
      url: `${siteUrl}/board/news/${n.id}`,
      lastModified: n.updatedAt,
    })),
    ...gallery.map((g) => ({
      url: `${siteUrl}/board/gallery/${g.id}`,
      lastModified: g.updatedAt,
    })),
    ...publications.map((p) => ({
      url: `${siteUrl}/publications/${p.id}`,
      lastModified: p.updatedAt,
    })),
  ];

  return [...staticRoutes, ...detailRoutes];
}
