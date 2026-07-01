import type { Metadata } from "next";
import Link from "next/link";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import {
  chipClass,
  tableWrapClass,
  theadRowClass,
  thClass,
  rowClass,
  emptyCellClass,
} from "@/app/admin/_components/table-ui";

export const metadata: Metadata = { title: "통계 · ATM Lab" };

// Reads the session cookie + live PageView rows → never cache.
export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// "YYYY-MM-DD" for the given instant in KST, independent of the server's tz.
function kstDate(at: Date): string {
  return new Date(at.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Subtract whole months from a KST "YYYY-MM-DD", clamping the day to the target
// month's length (Mar 31 − 1mo → Feb 28). Used for the recent-period presets.
function minusMonths(ymd: string, months: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const idx = y * 12 + (m - 1) - months;
  const ny = Math.floor(idx / 12);
  const nm = idx % 12;
  const lastDay = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  const nd = Math.min(d, lastDay);
  return `${ny}-${String(nm + 1).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
}

const dateInputClass =
  "rounded-2xl border border-line bg-surface px-3.5 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

// How far back the picker reaches and the sweep keeps. One knob for both.
const RETENTION_YEARS = 10;

// date_trunc unit + display format per granularity. These are fixed constants
// (never user input), so passing them as SQL params is safe.
const GRAN = {
  day: { unit: "day", fmt: "YYYY-MM-DD", header: "날짜", label: "일별" },
  month: { unit: "month", fmt: "YYYY-MM", header: "월", label: "월별" },
  year: { unit: "year", fmt: "YYYY", header: "연도", label: "연별" },
} as const;
type Gran = keyof typeof GRAN;

type BucketRow = { bucket: string; visitors: number };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string; gran?: string };
}) {
  await requireAdmin("/admin/analytics");

  const today = kstDate(new Date());
  // Selectable floor: RETENTION_YEARS back (same month/day). Earlier dates hold no
  // data and are swept below. Lexicographic compare is valid for ISO dates.
  const floorDate = `${Number(today.slice(0, 4)) - RETENTION_YEARS}${today.slice(4)}`;
  // Default window: last 30 days (KST). Either bound can be set independently.
  const defaultFrom = kstDate(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000));
  let from = DATE_RE.test(searchParams.from ?? "") ? searchParams.from! : defaultFrom;
  let to = DATE_RE.test(searchParams.to ?? "") ? searchParams.to! : today;
  // Clamp into [floor, today] — the input min/max guide the picker, this also
  // guards hand-edited query strings. Then tolerate a reversed range.
  const clamp = (d: string) => (d < floorDate ? floorDate : d > today ? today : d);
  from = clamp(from);
  to = clamp(to);
  if (from > to) [from, to] = [to, from];
  const singleDay = from === to;

  // Granularity toggle. 월/년 only make sense when the range touches ≥2 of that
  // calendar unit (one month/year alone = a single meaningless row); 일 is always
  // on. Span is measured in calendar months/years, not day count — 6/28~7/2 (5
  // days) still touches 2 months → 월 enabled.
  const fromY = Number(from.slice(0, 4));
  const toY = Number(to.slice(0, 4));
  const monthsSpanned =
    toY * 12 + Number(to.slice(5, 7)) - (fromY * 12 + Number(from.slice(5, 7))) + 1;
  const monthEnabled = !singleDay && monthsSpanned >= 2;
  const yearEnabled = !singleDay && toY - fromY >= 1;
  const requested: Gran =
    searchParams.gran === "month" || searchParams.gran === "year"
      ? searchParams.gran
      : "day";
  // Fall back to 일 if the requested unit isn't valid for the current range.
  const gran: Gran =
    (requested === "month" && !monthEnabled) || (requested === "year" && !yearEnabled)
      ? "day"
      : requested;

  // Recent-period shortcuts: each sets [from, today] plus a sensible default unit
  // (a 1-year window opens monthly, not 365 daily rows). The toggle can override.
  const presets: { label: string; from: string; gran: Gran }[] = [
    { label: "최근 7일", from: kstDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)), gran: "day" },
    { label: "최근 30일", from: defaultFrom, gran: "day" },
    { label: "최근 3개월", from: minusMonths(today, 3), gran: "month" },
    { label: "최근 1년", from: minusMonths(today, 12), gran: "month" },
    { label: "최근 5년", from: minusMonths(today, 60), gran: "year" },
    { label: "전체", from: floorDate, gran: "year" },
  ];

  // Opportunistic retention sweep (no cron): drop rows older than the picker floor
  // (RETENTION_YEARS) — they're unreachable from this screen anyway. Runs only on
  // this admin view (rare), so the public write path stays untouched. Built in SQL
  // like the bounds below to avoid the PrismaPg Date-param tz shift. Best-effort.
  try {
    await prisma.$executeRaw`
      DELETE FROM "PageView"
      WHERE "createdAt" < (${floorDate}::date)::timestamp AT TIME ZONE 'Asia/Seoul'
    `;
  } catch {
    // A failed sweep must never block viewing stats.
  }

  // KST-day bounds are built in SQL from the date strings (not JS Date params):
  // the PrismaPg adapter shifts timestamptz Date params by the process tz, so a
  // Date bound is off by hours. `'YYYY-MM-DD'::date::timestamp AT TIME ZONE
  // 'Asia/Seoul'` yields the exact KST-midnight instant, tz-safe on any server.
  const lower = Prisma.sql`(${from}::date)::timestamp AT TIME ZONE 'Asia/Seoul'`;
  const upper = Prisma.sql`((${to}::date + 1))::timestamp AT TIME ZONE 'Asia/Seoul'`;

  // Unique visitors per bucket (day/month/year), active buckets only, newest first.
  // visitorId embeds the KST date so it never collides across days → the per-bucket
  // counts sum to the same range total at any granularity (a repeat visitor counts
  // once per day they came). unit/fmt are fixed constants passed as params.
  const { unit, fmt, header } = GRAN[gran];
  const buckets = await prisma.$queryRaw<BucketRow[]>`
    SELECT to_char(date_trunc(${unit}, "createdAt" AT TIME ZONE 'Asia/Seoul'), ${fmt}) AS bucket,
           COUNT(DISTINCT "visitorId")::int AS visitors
    FROM "PageView"
    WHERE "createdAt" >= ${lower} AND "createdAt" < ${upper}
    GROUP BY 1
    ORDER BY 1 DESC
  `;
  const total = buckets.reduce((sum, b) => sum + b.visitors, 0);

  // Single-day view: each unique visitor's first-seen time (anonymous — no IP/UA,
  // just the arrival time). One row per visitor (writes dedupe per visitor/day).
  const visitTimes = singleDay
    ? await prisma.$queryRaw<{ time: string }[]>`
        SELECT to_char("createdAt" AT TIME ZONE 'Asia/Seoul', 'HH24:MI') AS time
        FROM "PageView"
        WHERE "createdAt" >= ${lower} AND "createdAt" < ${upper}
        ORDER BY "createdAt" ASC
      `
    : [];

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">접속자 통계</h1>
        <p className="mt-1 text-sm text-ink-3">
          순방문자 수 (KST 기준). 개인정보 최소화를 위해 IP·브라우저 정보는 저장하지 않으며,
          개인을 특정할 수는 없습니다.
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <Link
            key={p.label}
            href={`/admin/analytics?from=${p.from}&to=${today}&gran=${p.gran}`}
            className={chipClass(from === p.from && to === today)}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        {/* Preserve the chosen granularity when the date range is re-submitted. */}
        <input type="hidden" name="gran" value={gran} />
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-3">
          시작일
          <input key={from} type="date" name="from" defaultValue={from} min={floorDate} max={today} className={dateInputClass} />
        </label>
        <span className="pb-2 text-ink-3">~</span>
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-3">
          종료일
          <input key={to} type="date" name="to" defaultValue={to} min={floorDate} max={today} className={dateInputClass} />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark"
        >
          조회
        </button>
      </form>

      <p className="mb-5 text-sm text-ink-2">
        <span className="font-semibold text-ink">{from}</span>
        {!singleDay && (
          <>
            {" ~ "}
            <span className="font-semibold text-ink">{to}</span>
          </>
        )}{" "}
        기간 순방문자 <span className="text-lg font-bold text-accent">{total.toLocaleString()}</span>명
      </p>

      {!singleDay && (
        <div className="mb-4 flex gap-2">
          {(
            [
              { key: "day", enabled: true },
              { key: "month", enabled: monthEnabled },
              { key: "year", enabled: yearEnabled },
            ] as const
          ).map((t) =>
            t.enabled ? (
              <Link
                key={t.key}
                href={`/admin/analytics?from=${from}&to=${to}&gran=${t.key}`}
                className={chipClass(gran === t.key)}
              >
                {GRAN[t.key].label}
              </Link>
            ) : (
              <span
                key={t.key}
                title="이 기간에는 사용할 수 없습니다"
                className="cursor-not-allowed rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink-3/40"
              >
                {GRAN[t.key].label}
              </span>
            ),
          )}
        </div>
      )}

      {singleDay ? (
        <div className={tableWrapClass}>
          <table className="w-full min-w-[360px] text-sm">
            <thead>
              <tr className={theadRowClass}>
                <th className={thClass}>방문자</th>
                <th className={thClass}>첫 접속 시각</th>
              </tr>
            </thead>
            <tbody>
              {visitTimes.length === 0 ? (
                <tr>
                  <td colSpan={2} className={emptyCellClass}>
                    이 날짜의 방문 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                visitTimes.map((v, i) => (
                  <tr key={i} className={rowClass}>
                    <td className="px-4 py-3 text-ink-2">방문자 {i + 1}</td>
                    <td className="px-4 py-3 font-medium text-ink">{v.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={tableWrapClass}>
          <table className="w-full min-w-[360px] text-sm">
            <thead>
              <tr className={theadRowClass}>
                <th className={thClass}>{header}</th>
                <th className={`${thClass} text-right`}>순방문자</th>
              </tr>
            </thead>
            <tbody>
              {buckets.length === 0 ? (
                <tr>
                  <td colSpan={2} className={emptyCellClass}>
                    이 기간의 방문 기록이 없습니다.
                  </td>
                </tr>
              ) : (
                buckets.map((b) => (
                  <tr key={b.bucket} className={rowClass}>
                    <td className="px-4 py-3 text-ink-2">{b.bucket}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">
                      {b.visitors.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
