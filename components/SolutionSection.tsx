export default function SolutionSection() {
  return (
    <section className="py-32 bg-ink-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
              A continuous pair of eyes for every infusion.
            </h2>
            <p className="mt-8 text-lg text-ink-300 leading-relaxed">
              <span className="text-signal-cyan font-medium">extrava</span> integrates advanced skin thermometry with precision pressure sensing. By monitoring physiological signatures at the site of insertion, it detects the earliest signs of leakage long before they become visible to the human eye.
            </p>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed">
              Designed for clinical workflows, it provides real time alerts that allow nursing staff to intervene in seconds, preventing tissue damage and improving patient outcomes across oncology, pediatrics, and outpatient care.
            </p>
          </div>
          <div className="relative">
            <img
              src="/OrdLA.jpg"
              alt="Solution"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
