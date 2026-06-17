import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { ACTION_LABELS, fmtTime, readLabel } from "./_components/audit-format";

export const metadata: Metadata = { title: "대시보드 · ATM Lab" };

// Reads the session cookie + live counts/audit rows → never cache.
export const dynamic = "force-dynamic";

// How many recent audit rows the preview shows before "전체 보기".
const PREVIEW_SIZE = 6;

export default async function AdminDashboardPage() {
  await requireAdmin("/admin");

  // One batched round trip: total + published count per content type. Order
  // here matches the cards array below.
  const [
    memberTotal,
    memberPublished,
    projectTotal,
    projectPublished,
    publicationTotal,
    publicationPublished,
    lectureTotal,
    lecturePublished,
    newsTotal,
    newsPublished,
    galleryTotal,
    galleryPublished,
    researchTotal,
    researchPublished,
  ] = await prisma.$transaction([
    prisma.member.count(),
    prisma.member.count({ where: { published: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.publication.count(),
    prisma.publication.count({ where: { published: true } }),
    prisma.lecture.count(),
    prisma.lecture.count({ where: { published: true } }),
    prisma.news.count(),
    prisma.news.count({ where: { published: true } }),
    prisma.galleryItem.count(),
    prisma.galleryItem.count({ where: { published: true } }),
    prisma.researchTopic.count(),
    prisma.researchTopic.count({ where: { published: true } }),
  ]);

  const recent = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: PREVIEW_SIZE,
    select: {
      id: true,
      action: true,
      entity: true,
      data: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  });

  // Each card links to its CRUD list. Research counts ResearchTopic — the rows
  // /admin/research lists; subsections/figures aren't top-level entries.
  const cards = [
    { href: "/admin/members", label: "Members", total: memberTotal, published: memberPublished },
    { href: "/admin/projects", label: "Projects", total: projectTotal, published: projectPublished },
    { href: "/admin/publications", label: "Publications", total: publicationTotal, published: publicationPublished },
    { href: "/admin/lectures", label: "Lectures", total: lectureTotal, published: lecturePublished },
    { href: "/admin/news", label: "News", total: newsTotal, published: newsPublished },
    { href: "/admin/gallery", label: "Gallery", total: galleryTotal, published: galleryPublished },
    { href: "/admin/research", label: "Research", total: researchTotal, published: researchPublished },
  ];

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">대시보드</h1>
        <p className="mt-1 text-sm text-ink-3">
          ATM Lab 콘텐츠 현황과 최근 관리 활동입니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-3xl border border-line bg-surface p-5 transition hover:border-accent/30 hover:bg-accent-soft"
          >
            <p className="text-sm font-medium text-ink-2 transition-colors group-hover:text-accent">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.02em] text-ink">
              {card.total}
            </p>
            <p className="mt-1 text-xs text-ink-3">공개 {card.published}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink">최근 활동</h2>
          <Link
            href="/admin/activity"
            className="text-sm font-medium text-accent hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface px-4 py-10 text-center text-sm text-ink-3">
            기록된 활동이 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-3">
                  <th className="px-4 py-3 font-medium">시각</th>
                  <th className="px-4 py-3 font-medium">작업</th>
                  <th className="px-4 py-3 font-medium">대상</th>
                  <th className="px-4 py-3 font-medium">사용자</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((log) => {
                  const label = readLabel(log.data);
                  return (
                    <tr key={log.id} className="border-b border-line last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-2">
                        {fmtTime(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-2">
                        {log.entity}
                        {label && (
                          <span
                            className="mt-0.5 block max-w-[260px] truncate text-xs text-ink-3"
                            title={label}
                          >
                            {label}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink">
                        {log.user.email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
