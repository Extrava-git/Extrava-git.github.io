import WaitlistForm from "@/components/WaitlistForm";

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

        <WaitlistForm />
      </div>
    </section>
  );
}
