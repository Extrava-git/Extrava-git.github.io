import Link from "next/link";
import Reveal from "./Reveal";

const industries = [
  {
    title: "Oncology",
    body: "Vesicant chemotherapy is where extravasation does the most damage and is hardest to catch in time. extrava is being validated here first.",
    tag: "First pilot",
  },
  {
    title: "Pediatrics",
    body: "Smaller veins, fragile skin, and patients who can't reliably report pain make pediatric infusion uniquely high-risk. extrava is built for low-profile placement.",
    tag: "Next",
  },
  {
    title: "Contrast media",
    body: "Iodinated contrast extravasation is one of the most common imaging complications. extrava extends to CT and MRI infusion workflows.",
    tag: "Roadmap",
  },
  {
    title: "Vasopressors",
    body: "Norepinephrine and other vasopressors can cause severe tissue injury in minutes. extrava brings continuous monitoring to ICU peripheral lines.",
    tag: "Roadmap",
  },
];

export default function Industries() {
  return (
    <section className="py-24 md:py-32 border-b border-line bg-bg-subtle">
      <div className="mx-auto max-w-site px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Where extrava matters</p>
            <h2 className="mt-5 text-display-xl font-semibold text-ink">
              Built for high-risk infusion settings.
            </h2>
          </Reveal>
          <Reveal delay={120} as="p" className="lg:col-span-5 text-ink-muted leading-relaxed">
            We started where the consequences are worst. The same sensing approach extends to every IV drug whose leakage isn't visible until it's too late.
          </Reveal>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((it, i) => (
            <Reveal
              key={it.title}
              delay={i * 80}
              as="article"
              className="bg-ink-900/70 border border-line rounded-2xl p-7 flex flex-col h-full card-lift"
            >
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
                {it.tag}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink tracking-tightish">
                {it.title}
              </h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed flex-1">
                {it.body}
              </p>
              <Link
                href="/technology"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink hover:text-accent transition-colors"
              >
                Learn more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
