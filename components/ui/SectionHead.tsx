import type { ReactNode } from "react";

type SectionHeadProps = {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  variant?: "light" | "dark";
  stacked?: boolean;
  className?: string;
};

export default function SectionHead({
  eyebrow,
  title,
  sub,
  variant = "light",
  stacked = false,
  className = "",
}: SectionHeadProps) {
  const isDark = variant === "dark";
  const eyebrowColor = isDark ? "text-accent-lighter" : "text-accent";
  const eyebrowLine = isDark ? "before:bg-accent-lighter" : "before:bg-accent";
  const subColor = isDark ? "text-white/55" : "text-ink-3";

  return (
    <div
      className={`mb-16 ${stacked ? "flex flex-col gap-5" : "flex flex-wrap items-end justify-between gap-10"} ${className}`}
    >
      <div className={stacked ? "w-full" : ""}>
        <div
          className={`mb-3.5 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] ${eyebrowColor} before:block before:h-px before:w-[18px] before:content-[''] ${eyebrowLine}`}
        >
          {eyebrow}
        </div>
        <h2 className={`${sub && !stacked ? "max-w-[680px]" : "max-w-full"} text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.025em]`}>
          {title}
        </h2>
      </div>
      {sub && (
        <p className={`${stacked ? "" : "max-w-[380px]"} text-base leading-[1.6] ${subColor}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
