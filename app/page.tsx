"use client";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import ProblemStory from "@/components/ProblemStory";
import SolutionSection from "@/components/SolutionSection";
import CTASection from "@/components/CTASection";
import { GoogleGeminiEffect } from "@/components/GoogleGeminiEffect";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const ref = React.useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLength1 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLength2 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLength3 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLength4 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLength5 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink-950"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="Extrava"
                width={340}
                height={96}
                priority
                className="h-auto w-[220px] md:w-[320px]"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <Hero />
      <div
        className="h-[400vh] bg-ink-950 w-full relative overflow-clip"
        ref={ref}
      >
        <GoogleGeminiEffect
          pathLengths={[
            pathLength1,
            pathLength2,
            pathLength3,
            pathLength4,
            pathLength5,
          ]}
          title="intelligent monitoring for every infusion."
          description="extrava continuously monitors for drug leakage, providing sub-millimeter precision in detection that outperforms manual nursing observation."
        />
      </div>
      <LogoStrip />
      <ProblemStory />
      <SolutionSection />
      <CTASection />
    </>
  );
}
