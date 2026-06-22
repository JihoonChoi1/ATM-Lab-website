"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; external?: boolean };

const NAV_LINKS: NavItem[] = [
  { href: "/members", label: "Members" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/lectures", label: "Lectures" },
  { href: "/board", label: "Board" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Closed drawer: pull its links out of the tab order + accessibility tree. The
  // panel stays mounted (opacity-0) for the open/close transition, so otherwise
  // its links stay focusable and keyboard focus disappears into an invisible menu
  // (axe aria-hidden-focus). Set via the IDL property — react-dom 18.3 doesn't
  // serialize the `inert` attribute, so the JSX prop wouldn't take effect.
  useEffect(() => {
    const el = drawerRef.current;
    if (el) el.inert = !open;
  }, [open]);

  // Open drawer acts like a modal menu: focus moves in, Esc closes it (returning
  // focus to the toggle), and Tab is trapped within the panel.
  useEffect(() => {
    if (!open) return;
    const links = drawerRef.current
      ? Array.from(drawerRef.current.querySelectorAll<HTMLElement>("a[href]"))
      : [];
    links[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && links.length) {
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const renderLink = (
    item: NavItem,
    className: string,
    onClick?: () => void
  ) =>
    item.external ? (
      <a key={item.label} href={item.href} className={className} onClick={onClick}>
        {item.label}
      </a>
    ) : (
      <Link key={item.label} href={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-[350ms] ease-out ${
          scrolled
            ? "bg-white/[0.72] backdrop-blur-[18px] backdrop-saturate-[180%] border-black/[0.06]"
            : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-8 max-[640px]:px-5">
          <Link href="/" className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/univ_logo.png" alt="Ajou University" className="h-12 w-auto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ATM_LAB_logo.png" alt="ATM Lab" className="h-9 w-auto" />
          </Link>

          <div className="hidden items-center gap-1 min-[880px]:flex">
            {NAV_LINKS.map((item) =>
              renderLink(
                item,
                "rounded-lg px-4 py-2.5 text-[14.5px] font-medium transition-colors duration-200 text-ink-2 hover:bg-accent-soft hover:text-accent"
              )
            )}
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-label="메뉴"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg min-[880px]:hidden text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      <div
        ref={drawerRef}
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-[72px] z-[49] flex flex-col gap-1.5 border-t border-line bg-white p-6 transition-[opacity,transform] duration-[280ms] ease-out min-[880px]:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {NAV_LINKS.map((item) =>
          renderLink(
            item,
            "rounded-[10px] px-3 py-3.5 text-[17px] font-medium text-ink-2 hover:bg-accent-soft hover:text-accent",
            () => setOpen(false)
          )
        )}
      </div>
    </>
  );
}
