import Link from "next/link";

export default function FeatureSection() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="chip">
              <span className="dot" style={{ background: "#ff5a6a", boxShadow: "0 0 12px #ff5a6a" }} />
              the problem
            </span>
            <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
              a leak no one sees.{" "}
              <span className="text-gradient">a patient who pays for it.</span>
            </h2>
            <p className="mt-6 text-lg text-ink-200 leading-relaxed">
              extravasation — the unintended leakage of iv medication into surrounding tissue — happens in up to <span className="text-white">11% of chemotherapy infusions</span>. by the time it's visible, the damage is done: tissue necrosis, surgery, and weeks of paused treatment.
            </p>
            <p className="mt-4 text-lg text-ink-200 leading-relaxed">
              today's standard is a nurse glancing at the iv site every 15 minutes. patients deserve better than line of sight.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link href="/technology" className="btn-secondary">
                read the clinical case
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            <StatCard
              value="11%"
              label="of chemo infusions experience extravasation"
              tone="coral"
            />
            <StatCard
              value="45 min"
              label="typical delay between leak onset and clinical recognition"
              tone="amber"
            />
            <StatCard
              value="$11k+"
              label="average cost per severe extravasation event"
              tone="magenta"
            />
            <StatCard
              value="6–8 wk"
              label="paused treatment after a grade 3+ extravasation"
              tone="cyan"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "coral" | "amber" | "magenta" | "cyan";
}) {
  const colorMap: Record<string, string> = {
    coral: "#ff5a6a",
    amber: "#ffb547",
    magenta: "#ff3d8a",
    cyan: "#00d4ff",
  };
  return (
    <div className="card p-7">
      <div
        className="font-display text-5xl font-semibold tracking-tight"
        style={{ color: colorMap[tone] }}
      >
        {value}
      </div>
      <p className="mt-3 text-sm text-ink-200 leading-relaxed">{label}</p>
    </div>
  );
}
