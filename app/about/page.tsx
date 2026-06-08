import Link from "next/link";
import CTASection from "@/components/CTASection";
import AboutScrollNarrative from "@/components/AboutScrollNarrative";

export const metadata = {
  title: "Extrava",
  description:
    "Extrava is a wearable infusion safety device designed to catch leaks before they cause harm. We believe no patient should be harmed by a leak nobody saw.",
};

const values = [
  {
    title: "Patients first, always.",
    body:
      "Every design decision passes through one filter: does this make an infusion safer for the person receiving it?",
  },
  {
    title: "Earn the alert.",
    body:
      "A false alarm is a betrayal of clinician trust. We would rather ship slower than ship a sensor that gets silenced.",
  },
  {
    title: "Cheap to deploy. Hard to ignore.",
    body:
      "We measure success in how easy extrava is for a nurse to put on, and how impossible it is for a leak to slip past.",
  },
];

const roles = [
  { role: "Embedded firmware engineer", loc: "Remote · North America" },
  { role: "Biomedical sensor lead", loc: "Hybrid · Boston" },
  { role: "Clinical study coordinator", loc: "On-site · Pilot center" },
  { role: "Industrial designer, wearables", loc: "Hybrid · Boston" },
];

export default function AboutPage() {
  return (
    <>
      <div className="quantum-page">
      <section id="mission" className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-line">
        <div className="mx-auto max-w-site px-6">
          <div className="max-w-4xl">
            <p className="eyebrow">Mission</p>
            <h1 className="mt-5 text-display-2xl font-semibold leading-[1.0]">
              <span className="text-ink">No patient should be harmed by</span>
              <span className="text-ink-muted"> a leak nobody saw.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl">
              Extrava is built for the most vulnerable moment in modern medicine: the moment a drug enters a vein.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-start gap-3">
              <Link href="/contact" className="btn-primary">
                Get in touch
              </Link>
              <Link href="#careers" className="btn-secondary">
                Open roles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AboutScrollNarrative />

      <section className="py-24 md:py-32 border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-site px-6">
          <div className="max-w-3xl">
            <p className="eyebrow">Principles</p>
            <h2 className="mt-5 text-display-xl font-semibold text-ink">
              How we work.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="bg-ink-900/70 border border-line rounded-2xl p-7 h-full"
              >
                <div className="text-xs font-mono text-ink-subtle">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink tracking-tightish">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-b border-line">
        <div className="mx-auto max-w-site px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <p className="eyebrow">Origin</p>
              <h2 className="mt-5 text-display-lg font-semibold text-ink">
                Where this started.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-5 text-ink-muted leading-relaxed text-lg max-w-prose">
                <p>
                  Extrava started with a problem that was somehow both well-known and unsolved.
                </p>
                <p>
                  Extravasation is documented in every infusion-safety guideline. It is discussed at every oncology nursing conference. And it still happens to thousands of patients a year because the standard of care is a clinician's eyes, and eyes cannot be everywhere.
                </p>
                <p>We built extrava so they don't have to be.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="careers" className="py-24 md:py-32 border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-site px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow">Careers</p>
              <h2 className="mt-5 text-display-xl font-semibold text-ink">
                Open roles.
              </h2>
            </div>
            <p className="text-ink-muted text-sm max-w-sm">
              We hire engineers and clinicians who would rather build the right thing than the next thing.
            </p>
          </div>
          <div className="mt-12 border-t border-line">
            {roles.map((r) => (
              <Link
                key={r.role}
                href="/contact"
                className="grid grid-cols-12 gap-4 items-center py-6 border-b border-line group transition-colors hover:bg-ink-900/70/5 px-2 -mx-2 rounded-md"
              >
                <div className="col-span-12 md:col-span-7 text-lg text-ink font-medium tracking-tightish group-hover:text-accent transition-colors">
                  {r.role}
                </div>
                <div className="col-span-8 md:col-span-4 text-sm text-ink-muted">
                  {r.loc}
                </div>
                <div className="col-span-4 md:col-span-1 text-sm text-ink-subtle text-right group-hover:text-ink transition-colors">
                  Apply →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="press" className="py-24 md:py-32 border-b border-line">
        <div className="mx-auto max-w-site px-6">
          <p className="eyebrow">Press</p>
          <h2 className="mt-5 text-display-lg font-semibold text-ink">
            Press & inquiries.
          </h2>
          <p className="mt-6 text-ink-muted max-w-prose">
            For press, partnerships, or clinical collaboration:{" "}
            <a href="mailto:hello@extrava.health" className="link-arrow">
              hello@extrava.health
            </a>
          </p>
        </div>
      </section>
      </div>

      <CTASection />
    </>
  );
}
