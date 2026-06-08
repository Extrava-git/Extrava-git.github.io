"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Hero() {
  return (
    <HeroContainer>
      <div className="flex flex-col items-center text-center">
        <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl lg:text-8xl max-w-5xl leading-[1.1]">
          The future of IV therapy <br /> is leak-proof.
        </h1>

        <p className="mt-8 text-lg md:text-xl text-ink-300 max-w-2xl leading-relaxed">
          <span className="text-signal-cyan font-medium">extrava</span> is a wearable sensor that watches every infusion, aims to flag drug leakage early, and gives nurses the critical minutes they need to intervene. Currently in development.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/contact" className="btn-primary">
            request a pilot
            <Arrow />
          </Link>
          <Link href="/technology" className="btn-secondary">
            see how it works
          </Link>
        </div>
      </div>
    </HeroContainer>
  );
}

export const HeroContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink-950 px-5 pt-24 pb-12",
        className
      )}
    >
      <div className="absolute inset-x-0 top-24 h-px bg-white/10" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />

      <div className="relative z-20 flex w-full max-w-6xl flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
