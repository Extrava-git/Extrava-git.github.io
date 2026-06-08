import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-12 md:p-20">
          <div className="absolute inset-0 bg-grad-radial opacity-90" />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-grad-heat opacity-25 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-grad-signal opacity-20 blur-3xl" />

          <div className="relative max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              help us put <span className="text-signal-cyan">extrava</span> on every iv that matters.
            </h2>
            <p className="mt-6 text-lg text-ink-200 leading-relaxed">
              we're working with oncology programs, infusion centers, and biomedical research partners to validate <span className="text-signal-cyan">extrava</span> and bring it through regulatory clearance. if that's you — let's talk.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
              <Link href="/contact" className="btn-primary">
                become a clinical partner
                <Arrow />
              </Link>
              <Link href="/technology" className="btn-secondary">
                read the whitepaper
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
