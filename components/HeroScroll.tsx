"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PatchStoryScene = dynamic(
  () => import("./scenes/PatchStoryScene"),
  { ssr: false }
);

type Stage = {
  eyebrow: string;
  title: string;
  body: string;
  metric: { value: string; label: string };
};

const stages: Stage[] = [
  {
    eyebrow: "01 · The infusion",
    title: "Every infusion is a sealed system — until it isn't.",
    body:
      "An IV cannula sits a few millimeters under the skin. When a vesicant drug leaks into surrounding tissue, the damage is silent and immediate.",
    metric: { value: "1 in 20", label: "Incidence" },
  },
  {
    eyebrow: "02 · extrava attaches",
    title: "Adheres 1–2 cm from the cannula.",
    body:
      "A flexible adhesive sensor that doesn't interfere with the dressing or the line. The first 10–15 minutes establish a per-patient baseline.",
    metric: { value: "72 hr", label: "Wear time" },
  },
  {
    eyebrow: "03 · Two signals listen",
    title: "Thermal and pressure, fused on-device.",
    body:
      "Skin temperature and tissue pressure stream off the sensor in parallel. extrava learns what calm looks like for this patient.",
    metric: { value: "240 Hz", label: "Sampling rate" },
  },
  {
    eyebrow: "04 · A leak begins",
    title: "The signals diverge — long before the eye can see swelling.",
    body:
      "Pressure climbs, skin temperature drifts. The two trajectories pull apart in a pattern that motion and ambient noise can't produce.",
    metric: { value: "−0.8 °C", label: "Δ Skin temp" },
  },
  {
    eyebrow: "05 · Alert",
    title: "An unambiguous alert in seconds.",
    body:
      "When both signals confirm the pattern, extrava fires a single, unambiguous alert. The infusion is stopped before tissue is damaged.",
    metric: { value: "< 8 s", label: "Time-to-alert" },
  },
  {
    eyebrow: "06 · On every device",
    title: "Delivered to the nurse already on the floor.",
    body:
      "extrava streams over BLE to a nurse-facing app — one tap to stop the infusion, a full event log for the chart.",
    metric: { value: "96.4%", label: "Specificity" },
  },
];

export default function HeroScroll() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? traveled / total : 0);
    };
    compute();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const stageIndex = Math.min(
    stages.length - 1,
    Math.floor(progress * stages.length)
  );
  const segLen = 1 / stages.length;
  const segProgress = Math.min(
    1,
    Math.max(0, (progress - stageIndex * segLen) / segLen)
  );

  const stageHeightVh = 130;

  return (
    <section
      ref={wrapRef}
      className="relative border-y border-line bg-bg-subtle"
      style={{ height: `${stages.length * stageHeightVh}vh` }}
      aria-label="How extrava works, illustrated"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D scene fills the section */}
        <div className="absolute inset-0">
          <PatchStoryScene progress={progress} />
        </div>

        {/* Soft legibility fades */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-bg-subtle/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-bg-subtle to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-bg-subtle to-transparent" />

        {/* Top label rail */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="mx-auto max-w-site px-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle font-mono">
                How extrava works
              </p>
              <p className="text-[11px] font-mono text-ink-subtle">
                <span className="text-ink">
                  {String(stageIndex + 1).padStart(2, "0")}
                </span>
                <span className="opacity-50">
                  {" / "}
                  {String(stages.length).padStart(2, "0")}
                </span>
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 max-w-md">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className="relative h-[1.5px] flex-1 bg-line overflow-hidden rounded-full"
                >
                  <div
                    className="absolute inset-0 bg-ink origin-left"
                    style={{
                      transform: `scaleX(${
                        i < stageIndex ? 1 : i === stageIndex ? segProgress : 0
                      })`,
                      transition:
                        "transform 320ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage copy — anchored bottom-left */}
        <div className="absolute bottom-20 left-0 right-0 z-10">
          <div className="mx-auto max-w-site px-6">
            <div className="relative max-w-xl min-h-[260px]">
              {stages.map((s, i) => {
                const isActive = i === stageIndex;
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${
                        isActive ? 0 : i < stageIndex ? -22 : 22
                      }px)`,
                      transition:
                        "opacity 620ms cubic-bezier(0.16, 1, 0.3, 1), transform 720ms cubic-bezier(0.16, 1, 0.3, 1)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <p className="text-[11px] font-mono text-ink-subtle uppercase tracking-[0.14em]">
                      {s.eyebrow}
                    </p>
                    <h3 className="mt-5 text-[1.75rem] md:text-4xl lg:text-[2.75rem] font-semibold tracking-tighter text-ink leading-[1.04]">
                      {s.title}
                    </h3>
                    <p className="mt-5 text-base md:text-lg text-ink-muted leading-relaxed max-w-md">
                      {s.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Single metric, bottom-right, monospace, switches per stage */}
        <div className="absolute bottom-20 right-6 z-10 hidden md:block">
          <div className="relative w-[260px] h-[120px]">
            {stages.map((s, i) => {
              const isActive = i === stageIndex;
              return (
                <div
                  key={i}
                  className="absolute inset-0 text-right"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${
                      isActive ? 0 : i < stageIndex ? -12 : 12
                    }px)`,
                    transition:
                      "opacity 620ms cubic-bezier(0.16, 1, 0.3, 1), transform 720ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink-subtle font-mono">
                    {s.metric.label}
                  </p>
                  <p className="mt-2 text-5xl lg:text-6xl font-semibold tracking-tighter text-ink font-mono">
                    {s.metric.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.16em] text-ink-subtle flex flex-col items-center gap-2 transition-opacity font-mono"
          style={{ opacity: 1 - Math.min(1, progress * 4) }}
        >
          <span>Scroll</span>
          <span className="block h-6 w-px bg-line-strong" />
        </div>
      </div>
    </section>
  );
}
