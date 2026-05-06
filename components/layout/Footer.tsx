const EMAILS = [
  { address: "jungholee@ajou.ac.kr", role: "Professor" },
  { address: "suyoon2002@ajou.ac.kr", role: "Lab Leader" },
];

export default function Footer() {
  return (
    <footer className="relative bg-dark text-white/60">
      <svg
        className="block h-[90px] w-full"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,0 L0,0 Z"
          fill="#fbfbfb"
        />
      </svg>
      <div className="mx-auto max-w-container px-8 pb-10 pt-[60px] max-[640px]:px-5">
        <div className="grid gap-10 border-b border-dark-line pb-12 md:grid-cols-[1.6fr_1fr_1.4fr] max-[760px]:grid-cols-1">
          <div>
            <h5 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Address
            </h5>
            <p className="text-sm leading-[1.7] text-white/70">
              East hall, 206, World cup-ro, Yeongtong-gu, Suwon-si,
              Gyeonggi-do, Republic of Korea
            </p>
          </div>

          <div>
            <h5 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Tel
            </h5>
            <p className="font-mono text-sm tracking-[0.02em] text-white/85">
              031-219-2315
            </p>
          </div>

          <div>
            <h5 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Email
            </h5>
            <ul className="flex flex-col gap-3">
              {EMAILS.map((e) => (
                <li key={e.address} className="flex flex-col gap-1">
                  <span className="font-mono text-sm tracking-[0.02em] text-white/85">
                    {e.address}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.16em] text-white/40">
                    {e.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 pt-7 text-[12.5px] text-white/45">
          <span>© 2026 Advanced Thermal Management Lab · Ajou University</span>
          <span className="font-mono tracking-[0.05em]">
            ATM-LAB / v2026.04
          </span>
        </div>
      </div>
    </footer>
  );
}
