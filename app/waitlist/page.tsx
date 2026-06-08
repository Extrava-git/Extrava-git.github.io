export const metadata = {
  title: "Join the Waitlist — Extrava",
  description: "Get early access to Extrava and join the next generation of infusion safety.",
};

export default function WaitlistPage() {
  return (
    <section className="relative pt-40 pb-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h1 className="mt-6 font-display text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
          Join the <span className="text-signal-cyan">extrava</span> waitlist
        </h1>
        <p className="mt-6 text-xl text-ink-200 leading-relaxed">
          Be the first to know when we launch and get priority access for clinical pilot programs.
        </p>

        <form className="mt-12 bg-ink-900/50 p-8 rounded-2xl space-y-5 text-left">
          <div>
            <label htmlFor="email" className="block text-sm text-ink-300 mb-2">Work email</label>
            <input id="email" name="email" type="email" placeholder="jane@hospital.org" className="w-full bg-ink-950 p-3 rounded-lg border border-white/10" required />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            Join waitlist
          </button>
        </form>
      </div>
    </section>
  );
}
