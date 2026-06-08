"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "/product", label: "Product" },
  { href: "/technology", label: "Technology" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-ink-950/70 border-b border-white/5"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-ink-200 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/waitlist" className="btn-secondary">
            Join waitlist
          </Link>
          <Link href="/contact" className="btn-primary">
            Request a demo
            <ArrowIcon />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md hover:bg-white/5"
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 space-y-1 border-b border-white/5 bg-ink-950/95 backdrop-blur-xl">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-ink-200 hover:text-white rounded-lg hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/waitlist" className="btn-secondary justify-center">
              Join waitlist
            </Link>
            <Link href="/contact" className="btn-primary justify-center">
              Request a demo
              <ArrowIcon />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Extrava Logo"
      width={185}
      height={52}
      className="h-[52px] w-auto object-contain"
      priority
    />
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
