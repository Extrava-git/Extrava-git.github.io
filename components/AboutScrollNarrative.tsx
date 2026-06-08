"use client";

import ScrollNarrative, { NarrativeStage } from "./ScrollNarrative";
import AboutMissionGlobeClient from "./scenes/AboutMissionGlobeClient";

const stages: NarrativeStage[] = [
  {
    eyebrow: "01 · Why we exist",
    title: "Vesicants don't wait for someone to notice.",
    body:
      "The moment chemotherapy leaks into tissue, the clock is no longer in a nurse's hands. Extrava gives that clock back to the bedside.",
    metric: { value: "1 in 20", label: "Infusions" },
  },
  {
    eyebrow: "02 · Built with nurses",
    title: "Designed inside infusion rooms, not labs.",
    body:
      "Every design decision in extrava, from the adhesive to the alert language, was reviewed with oncology nurses doing the work every day.",
    metric: { value: "40+", label: "Nurse interviews" },
  },
  {
    eyebrow: "03 · From a Boston lab",
    title: "A hardware-first team out of MIT and Mass General.",
    body:
      "We're engineers, clinicians, and signal-processing researchers who got tired of seeing the same preventable injury keep happening.",
    metric: { value: "2024", label: "Founded" },
  },
  {
    eyebrow: "04 · Where we're going",
    title: "From one bay to every infusion bay.",
    body:
      "extrava is moving toward pilot deployment at first infusion centers. The plan is simple: every patient, every drug, every bay, covered.",
    metric: { value: "12", label: "Pilot sites" },
  },
];

export default function AboutScrollNarrative() {
  return (
    <ScrollNarrative
      stages={stages}
      stageHeightVh={130}
      sectionLabel="The mission"
      rightVisual
      scene={(progress) => <AboutMissionGlobeClient progress={progress} />}
    />
  );
}
