"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export type NarrativeStage = {
  eyebrow: string;
  title: string;
  body: string;
  /** Optional metric shown bottom-right (single big number, monospace) */
  metric?: { value: string; label: string };
};

type Props = {
  /** Stages — narrative beats. Section is sized to stages.length × stageHeightVh */
  stages: NarrativeStage[];
  /** Scroll height per stage in vh. Higher = slower, more cinematic. Default 130. */
  stageHeightVh?: number;
  /** Render-prop for the 3D scene. Receives smoothed 0–1 progress. */
  scene: (progress: number) => ReactNode;
  /** Top-of-section eyebrow shown above the progress rail. */
  sectionLabel: string;
  /** When true, the scene sits as a right-column visual (60vw) with copy left.
   *  When false, the scene is full-bg and copy is anchored bottom-left. */
  rightVisual?: boolean;
  /** Optional accent label for the metric (overrides default). */
  className?: string;
};

export default function ScrollNarrative({
  stages,
  stageHeightVh = 130,
  scene,
  sectionLabel,
  rightVisual = true,
  className,
}: Props) {
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

  return (
    <section
      ref={wrapRef}
      className={`relative bg-bg ${className ?? ""}`}
      style={{ height: `${stages.length * stageHeightVh}vh` }}
      aria-label={sectionLabel}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Scene — fills the visual region */}
        {rightVisual ? (
          <div className="absolute top-0 bottom-0 right-0 left-0 md:left-[42%] pointer-events-none">
            {scene(progress)}
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none">{scene(progress)}</div>
        )}

        {/* Soft fade gradients top/bottom for legibility */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-bg to-transparent z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-bg to-transparent z-[1]" />

        {/* Top label rail */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="mx-auto max-w-site px-6">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-subtle font-mono">
                {sectionLabel}
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
                        i < stageIndex
                          ? 1
                          : i === stageIndex
                          ? segProgress
                          : 0
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

        {/* Stage copy — left column on desktop, bottom on mobile */}
        <div
          className={`absolute z-10 ${
            rightVisual
              ? "top-1/2 -translate-y-1/2 left-0 right-0 md:right-auto md:w-[42%]"
              : "bottom-20 left-0 right-0"
          }`}
        >
          <div
            className={`mx-auto ${
              rightVisual ? "max-w-site" : "max-w-site"
            } px-6`}
          >
            <div
              className={`relative ${
                rightVisual ? "min-h-[360px] max-w-md" : "min-h-[280px] max-w-xl"
              }`}
            >
              {stages.map((s, i) => {
                const isActive = i === stageIndex;
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${
                        isActive ? 0 : i < stageIndex ? -20 : 20
                      }px)`,
                      transition:
                        "opacity 620ms cubic-bezier(0.16, 1, 0.3, 1), transform 720ms cubic-bezier(0.16, 1, 0.3, 1)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <p className="text-[11px] font-mono text-ink-subtle uppercase tracking-[0.14em]">
                      {s.eyebrow}
                    </p>
                    <h3 className="mt-5 text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-semibold tracking-tighter text-ink leading-[1.04]">
                      {s.title}
                    </h3>
                    <p className="mt-6 text-base md:text-lg text-ink-muted leading-relaxed max-w-md">
                      {s.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metric — bottom-right, big, monospace, switches with stage */}
        <div className="absolute bottom-16 right-6 z-10 hidden md:block">
          <div className="relative w-[260px] h-[120px]">
            {stages.map((s, i) => {
              if (!s.metric) return null;
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
      </div>
    </section>
  );
}
