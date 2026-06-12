import type { Metadata } from "next";
import AdminNav from "./_components/AdminNav";
import { signOutAction } from "./security/actions";

export const metadata: Metadata = { title: "관리자 · ATM Lab" };

// Phase 7-1: shared admin shell — vertical sidebar on desktop, a horizontal
// scrollable nav bar on mobile (CSS-only, no toggle state). No auth here: the
// guard is per-page via requireAdmin (see lib/auth/guard.ts).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      {/* Sticky viewport-height sidebar: without it the aside stretches to the
          page height and mt-auto pushes 로그아웃 below the fold on long pages. */}
      <aside className="flex flex-col gap-4 border-b border-line bg-surface p-4 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:self-start md:overflow-y-auto md:border-b-0 md:border-r md:p-6">
        <p className="px-3.5 text-base font-bold tracking-[-0.02em] text-ink">
          ATM Lab <span className="font-medium text-ink-3">Admin</span>
        </p>
        <AdminNav />
        <form action={signOutAction} className="md:mt-auto">
          <button
            type="submit"
            className="w-full rounded-2xl border border-line px-3.5 py-2.5 text-left text-sm font-medium text-ink-2 transition hover:border-ink-3 hover:text-ink"
          >
            로그아웃
          </button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
