import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "product",
    items: [
      { label: <span className="text-signal-cyan">extrava</span>, href: "/product" },
      { label: "technology", href: "/technology" },
      { label: "clinical pipeline", href: "/technology#pipeline" },
      { label: "pricing", href: "/contact" },
    ],
  },
  {
    title: "about",
    items: [
      { label: "about", href: "/about" },
      { label: "mission", href: "/about#mission" },
      { label: "careers", href: "/about#careers" },
      { label: "press", href: "/about#press" },
    ],
  },
  {
    title: "resources",
    items: [
      { label: "research", href: "/technology#research" },
      { label: "faq", href: "/product#faq" },
      { label: "contact", href: "/contact" },
      { label: "support", href: "/contact" },
    ],
  },
  {
    title: "legal",
    items: [
      { label: "privacy", href: "/contact" },
      { label: "terms", href: "/contact" },
      { label: "hipaa", href: "/contact" },
      { label: "disclosures", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="extrava logo"
                width={142}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-sm text-ink-300 max-w-xs leading-relaxed">
              building the next generation of wearable safety devices for
              infusion therapy. so no patient is harmed by a leak nobody saw.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="https://github.com" label="github">
                <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.79 2.75 1.27 3.42.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.08 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.6.23 2.78.11 3.08.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.43.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com" label="linkedin">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.4v1.56h.05a3.73 3.73 0 0 1 3.36-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
              </SocialIcon>
              <SocialIcon href="https://x.com" label="x">
                <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.84l-5.36-7-6.12 7H1.42l8.02-9.16L1 2h7l4.85 6.42L18.244 2Zm-1.2 18h1.9L7.04 4H5.04l12 16Z" />
              </SocialIcon>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-widest text-ink-300 font-semibold">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.items.map((it) => (
                  <li key={it.label as string}>
                    <Link
                      href={it.href}
                      className="text-sm text-ink-200 hover:text-white transition-colors"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} extrava. all rights reserved. <span className="text-signal-cyan">extrava</span>
            is an investigational device. not yet cleared by the fda.
          </p>
          <p className="text-xs text-ink-400">
            made for patients, by people who refuse to accept preventable harm.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}
