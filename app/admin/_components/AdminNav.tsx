"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; ready: boolean; exact?: boolean };

// Dashboard landing. exact match only — every admin page lives under "/admin/…",
// so prefix matching would keep this lit on every page.
const DASHBOARD: NavItem = { href: "/admin", label: "대시보드", ready: true, exact: true };

// 7 content types (CRUD pages land in 7-2+) + the two pages that already exist.
const CONTENT: NavItem[] = [
  { href: "/admin/members", label: "Members", ready: true },
  { href: "/admin/projects", label: "Projects", ready: true },
  { href: "/admin/publications", label: "Publications", ready: true },
  { href: "/admin/lectures", label: "Lectures", ready: true },
  { href: "/admin/news", label: "News", ready: true },
  { href: "/admin/gallery", label: "Gallery", ready: true },
  { href: "/admin/research", label: "Research", ready: true },
];

const SYSTEM: NavItem[] = [
  { href: "/admin/activity", label: "최근 활동", ready: true },
  { href: "/admin/security", label: "보안 설정", ready: true },
];

export default function AdminNav() {
  const pathname = usePathname();

  const renderItem = (item: NavItem) => {
    // Not-yet-built CRUD pages render as a disabled "준비중" chip — clicking a
    // 404 would read as breakage to the operator.
    if (!item.ready) {
      return (
        <span
          key={item.href}
          className="flex items-center justify-between gap-2 whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-sm font-medium text-ink-3/60"
        >
          {item.label}
          <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-medium text-ink-3">
            준비중
          </span>
        </span>
      );
    }
    const active = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname?.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-accent-soft text-accent-dark"
            : "text-ink-2 hover:bg-accent-soft hover:text-accent"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="관리자 메뉴"
      className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
    >
      {renderItem(DASHBOARD)}
      <p className="hidden px-3.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-3 md:block">
        콘텐츠
      </p>
      {CONTENT.map(renderItem)}
      <p className="hidden px-3.5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-ink-3 md:block">
        시스템
      </p>
      {SYSTEM.map(renderItem)}
    </nav>
  );
}
