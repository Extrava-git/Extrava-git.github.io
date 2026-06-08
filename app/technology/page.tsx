import Link from "next/link";
import CTASection from "@/components/CTASection";
import TechScrollNarrative from "@/components/TechScrollNarrative";

export const metadata = {
  title: "Extrava",
  description:
    "How extrava detects IV extravasation: dual-signal thermal and pressure sensing, per-patient baselines, and on-device fusion.",
};

const pillars = [
  {
    title: "Skin thermometry",
    body:
      "Inflammation runs hot. Fluid leaks run cold. A digital thermal probe placed 1–2 cm from the cannula picks up either signature within minutes — well before visible swelling.",
  },
  {
    title: "Pressure & swelling",
    body:
      "A force-sensitive resistor under the adhesive captures subdermal pressure trajectories. Swelling shows up as a steady, rising trend — distinguishable from movement artifacts.",
  },
  {
    title: "On-device fusion",
    body:
      "Neither signal alone is enough. extrava fuses thermal and pressure trajectories against the patient's own baseline, and only alerts when both diverge in a leak-consistent pattern.",
  },
];

const pipeline = [
  {
    phase: "Bench",
    status: "Complete",
    body:
      "Sensor characterization in a saline phantom rig that simulates infiltration under controlled flow rates.",
  },
  {
    phase: "Pre-clinical",
    status: "In progress",
    body:
      "Ex vivo tissue model and animal study at a partner institution. Targeting 2026 readout.",
  },
  {
    phase: "Clinical pilot",
    status: "Recruiting",
    body:
      "Single-site observational study at an oncology infusion center. ~150 patients planned.",
  },
  {
    phase: "Regulatory",
    status: "Planned",
    body:
      "510(k) submission pathway. Pre-submission Q-Sub meeting in development with FDA.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <div className="quantum-page">
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-line">
        <div className="mx-auto max-w-site px-6">
          <div className="max-w-4xl">
            <p className="eyebrow">Technology</p>
            <h1 className="mt-5 text-display-2xl font-semibold leading-[1.0]">
              <span className="text-ink">Two signals.</span>
              <span className="text-ink-muted"> One unambiguous alert.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl">
              Extravasation has a physical signature long before it has a visible one. extrava listens for it.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-start gap-3">
              <Link href="/contact" className="btn-primary">
                Talk to engineering
              </Link>
              <Link href="#research" className="btn-secondary">
                See the fusion model
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TechScrollNarrative />

      <section className="py-24 md:py-32 border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-site px-6">
          <div className="max-w-3xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-5 text-display-xl font-semibold text-ink">
              Three layers of signal, fused on-device.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="bg-ink-900/70 border border-line rounded-2xl p-7 h-full"
              >
                <div className="text-xs font-mono text-ink-subtle">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink tracking-tightish">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="py-24 md:py-32 border-b border-line">
        <div className="mx-auto max-w-site px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="eyebrow">Why fusion</p>
              <h2 className="mt-5 text-display-lg font-semibold text-ink">
                One signal is noise. Two signals are a diagnosis.
              </h2>
              <div className="mt-7 space-y-4 text-ink-muted leading-relaxed max-w-prose">
                <p>
                  A standalone thermal sensor will fire false positives every time a patient pulls a blanket up or moves into a draft. A standalone pressure sensor will fire on every shift of the arm.
                </p>
                <p>
                  Real extravasation produces a coherent change in both signals — a steady pressure rise plus a thermal divergence relative to baseline — over a time window inconsistent with movement.
                </p>
                <p>
                  That fusion is what makes extrava a sensor a nurse will trust, not silence.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="surface overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-line bg-bg-subtle">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-3 text-xs font-mono text-ink-subtle">
                    fusion.py
                  </span>
                </div>
                <pre className="p-6 font-mono text-[12.5px] text-ink-soft leading-relaxed overflow-x-auto bg-ink-900/70">
                  <code>{`# fusion rule (pseudocode)
baseline = learn(first_15min)

every 1s:
    dT = temp_now     - baseline.temp
    dP = pressure_now - baseline.pressure
    vT = slope(temp,     window=120s)
    vP = slope(pressure, window=120s)

    thermal_event  = abs(dT) > 0.6 and vT.sustained
    pressure_event = dP > 4 and vP > 0 and vP.sustained

    if thermal_event and pressure_event:
        alert("possible extravasation")`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pipeline" className="py-24 md:py-32 border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-site px-6">
          <div className="max-w-3xl">
            <p className="eyebrow">Roadmap</p>
            <h2 className="mt-5 text-display-xl font-semibold text-ink">
              Clinical pipeline.
            </h2>
          </div>
          <div className="mt-14 border-t border-line">
            {pipeline.map((p) => (
              <div
                key={p.phase}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 border-b border-line py-7"
              >
                <div className="md:col-span-3 text-xs uppercase tracking-wider text-ink-subtle">
                  {p.phase}
                </div>
                <div className="md:col-span-3 text-lg font-medium text-ink tracking-tightish">
                  {p.status}
                </div>
                <p className="md:col-span-6 text-sm text-ink-muted leading-relaxed max-w-prose">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-ink-muted">
            Interested in joining a pilot site or a research collaboration?{" "}
            <Link href="/contact" className="link-arrow">
              Get in touch
            </Link>
          </p>
        </div>
      </section>
      </div>

      <CTASection />
    </>
  );
}
