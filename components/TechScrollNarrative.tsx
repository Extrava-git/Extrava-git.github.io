"use client";

import ScrollNarrative, { NarrativeStage } from "./ScrollNarrative";
import TechSignalFusionClient from "./scenes/TechSignalFusionClient";

const stages: NarrativeStage[] = [
  {
    eyebrow: "01 · Thermal",
    title: "Skin temperature, sampled 240 times per second.",
    body:
      "Vesicant infiltration pulls heat from the surrounding tissue as cool drug accumulates extravascularly. extrava reads it directly through the skin.",
    metric: { value: "±0.1 °C", label: "Resolution" },
  },
  {
    eyebrow: "02 · Pressure",
    title: "Tissue pressure, picked up by a flexible array.",
    body:
      "Drug volume escaping the vein expands the surrounding tissue. A printed pressure array senses the mechanical change before swelling is visible.",
    metric: { value: "0–10 kPa", label: "Range" },
  },
  {
    eyebrow: "03 · Fusion",
    title: "Two signals into one decision.",
    body:
      "Either signal alone produces false positives — patient movement, ambient cooling, normal infusion dynamics. Together, the correlated pattern is unambiguous.",
    metric: { value: "On-device", label: "Compute" },
  },
  {
    eyebrow: "04 · Confirmation",
    title: "A held decision, then a confident alert.",
    body:
      "extrava waits for both signals to confirm. When the joint pattern crosses the trained threshold, a single, clear alert fires to the bedside.",
    metric: { value: "96.4%", label: "Specificity" },
  },
];

export default function TechScrollNarrative() {
  return (
    <ScrollNarrative
      stages={stages}
      stageHeightVh={130}
      sectionLabel="Two signals, one decision"
      rightVisual
      scene={(progress) => <TechSignalFusionClient progress={progress} />}
    />
  );
}
