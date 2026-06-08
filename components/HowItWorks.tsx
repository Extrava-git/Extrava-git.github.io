const steps = [
  {
    n: "01",
    title: "Apply",
    body: (
      <>
        <span className="text-signal-cyan">extrava</span> adheres to the skin 1 2 cm from the IV insertion site. A breathable, hypoallergenic medical film keeps it secure for the full infusion.
      </>
    ),
    accent: "from-signal-cyan to-signal-teal",
  },
  {
    n: "02",
    title: "Calibrate",
    body: (
      <>
        Over the first 10 15 minutes, <span className="text-signal-cyan">extrava</span> learns the patient's baseline skin temperature and tissue pressure because every patient is different.
      </>
    ),
    accent: "from-signal-teal to-signal-cyan",
  },
  {
    n: "03",
    title: "Monitor",
    body:
      "An ESP32-class microcontroller streams thermal and pressure data over Bluetooth to a clinician app at the bedside or down the hall.",
    accent: "from-signal-cyan to-signal-magenta",
  },
  {
    n: "04",
    title: "Alert",
    body:
      "Onset signatures rising pressure, abnormal cooling, asymmetric swelling trigger an alert in seconds. The infusion can be stopped before tissue is damaged.",
    accent: "from-signal-magenta to-signal-coral",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32 bg-ink-900/30 border-y border-white/5">
      <div className="absolute inset-0 bg-dot opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <span className="chip"><span className="dot" /> The solution</span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            A continuous second pair of eyes,{" "}
            <span className="text-gradient">on every IV.</span>
          </h2>
          <p className="mt-6 text-lg text-ink-200 leading-relaxed">
            <span className="text-signal-cyan">extrava</span> combines high-resolution skin thermometry with force-sensitive pressure sensing to detect the earliest physiological signatures of extravasation long before a human eye would catch them.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="card p-7 group">
              <div
                className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${s.accent} text-ink-950 font-display font-bold text-sm`}
              >
                {s.n}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-200 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
