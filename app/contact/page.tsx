export const metadata = {
  title: "Contact Extrava",
  description: "Get in touch about clinical pilots, partnerships, or careers.",
};

export default function ContactPage() {
  return (
    <section className="pt-40 pb-32 mx-auto max-w-2xl px-6">
      <h1 className="font-display text-5xl font-semibold tracking-tight leading-tight">
        Let's talk.
      </h1>
      <p className="mt-8 text-xl text-ink-300 leading-relaxed">
        Clinical pilot, research collaboration, investor question, or a request for the press kit — drop us a note and a human gets back to you.
      </p>

      <div className="mt-20 space-y-12">
        <div className="space-y-6">
          <ContactRow label="General" value="hello@extrava.health" href="mailto:hello@extrava.health" />
          <ContactRow label="Partnerships" value="clinical@extrava.health" href="mailto:clinical@extrava.health" />
          <ContactRow label="Press" value="press@extrava.health" href="mailto:press@extrava.health" />
          <ContactRow label="Office" value="Boston, MA" />
        </div>
      </div>

      <form className="mt-20 bg-ink-900/50 p-8 rounded-2xl space-y-6" action="mailto:hello@extrava.health" method="post" encType="text/plain">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-ink-300 mb-2">Full name</label>
            <input name="name" type="text" placeholder="Jane Doe" className="w-full bg-ink-950 p-3 rounded-lg border border-white/10" required />
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Work email</label>
            <input name="email" type="email" placeholder="jane@hospital.org" className="w-full bg-ink-950 p-3 rounded-lg border border-white/10" required />
          </div>
        </div>
        <div>
          <label className="block text-sm text-ink-300 mb-2">Organization</label>
          <input name="org" type="text" placeholder="Memorial Health" className="w-full bg-ink-950 p-3 rounded-lg border border-white/10" />
        </div>
        <div>
          <label className="block text-sm text-ink-300 mb-2">Inquiry type</label>
          <select name="topic" defaultValue="pilot" className="w-full bg-ink-950 p-3 rounded-lg border border-white/10">
            <option value="pilot">Clinical pilot</option>
            <option value="research">Research collaboration</option>
            <option value="press">Press / media</option>
            <option value="careers">Careers</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-300 mb-2">Message</label>
          <textarea name="message" rows={5} placeholder="What are you working on?" className="w-full bg-ink-950 p-3 rounded-lg border border-white/10" />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">
          Send message
        </button>
      </form>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
      <span className="text-xs uppercase tracking-widest text-ink-300">{label}</span>
      {href ? (
        <a
          href={href}
          className="text-white hover:text-signal-cyan transition-colors font-mono text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="text-white font-mono text-sm">{value}</span>
      )}
    </div>
  );
}
