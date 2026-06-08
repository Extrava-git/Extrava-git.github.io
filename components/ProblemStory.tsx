"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const storyContent = [
  {
    title: "A leak no one sees.",
    description:
      "Extravasation the unintended leakage of IV medication into surrounding tissue happens in up to 11% of chemotherapy infusions.",
    visual: (
      <div className="relative h-[350px] w-full flex flex-col items-center">
        <img
          src="https://www.britishjournalofnursing.com/media/2gol0m4c/bjon2024337s18_f01.jpg"
          alt="Extravasation"
          className="rounded-xl object-contain h-full w-full"
        />
        <p className="mt-4 text-xs text-ink-500 text-center">Source: British Journal of Nursing</p>
      </div>
    ),
  },
  {
    title: "1 in 10 patients.",
    description:
      "Statistically, every clinical day, patients face this risk. By the time it is visible to the human eye, the damage is already done.",
    visual: (
      <img
        src="https://www.sicdsystem.com/content/dam/bostonscientific/Rhythm%20Management/patient/S-ICD/homepage/People_Icons%402x.png"
        alt="Patient Risk"
        className="rounded-xl object-contain h-full w-full"
      />
    ),
  },
  {
    title: "45 minutes of silence.",
    description:
      "The typical delay between a leak starting and clinical recognition. Nurses can't be everywhere at once.",
    visual: <TimeGapVisual />,
  },
  {
    title: "A patient who pays for it.",
    description:
      "Tissue necrosis, surgery, and $11,000+ in extra costs per event. Worst of all, critical treatment is paused for 6–8 weeks.",
    visual: <HumanCostVisual />,
  },
];

export default function ProblemStory() {
  return (
    <section className="relative bg-ink-950">
      {storyContent.map((item, index) => (
        <StoryBeat key={index} item={item} index={index} />
      ))}
    </section>
  );
}
function StoryBeat({ item, index }: { item: (typeof storyContent)[0]; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);

  return (
    <div ref={ref} className="h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ opacity, scale, y }}
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="z-10">
          <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-white leading-tight">
            {item.title}
          </h2>
          <div className="mt-6 text-lg md:text-xl text-ink-300 leading-relaxed max-w-xl">
            {item.description}
          </div>
        </div>
        <div className="relative h-[400px] w-full flex items-center justify-center">
          {item.visual}
        </div>
      </motion.div>
    </div>
  );
}

function TimeGapVisual() {
  return (
    <div className="relative h-64 w-64 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1d26" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#ff5a6a"
          strokeWidth="6"
          strokeDasharray="283"
          strokeDashoffset={283 * (1 - 0.75)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        {/* Minute hand */}
        <line
          x1="50" y1="50" x2="50" y2="20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(270 50 50)"
        />
      </svg>
    </div>
  );
}

function HumanCostVisual() {
  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
      <motion.div
        animate={{ x: [-1, 1, -1, 0], y: [1, -1, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="bg-ink-900/50 p-10 rounded-2xl"
      >
        <div className="text-4xl font-bold text-signal-coral">$11k+</div>
        <div className="text-sm text-ink-300 mt-2 uppercase">Extra Cost</div>
      </motion.div>
      <motion.div
        animate={{ x: [1, -1, 1, 0], y: [-1, 1, -1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="bg-ink-900/50 p-10 rounded-2xl"
      >
        <div className="text-4xl font-bold text-signal-coral">6-8 wk</div>
        <div className="text-sm text-ink-300 mt-2 uppercase">Paused Care</div>
      </motion.div>
    </div>
  );
}
