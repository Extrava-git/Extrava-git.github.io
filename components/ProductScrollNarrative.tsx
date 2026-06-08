"use client";

import ScrollNarrative, { NarrativeStage } from "./ScrollNarrative";
import ProductPatchExplodedClient from "./scenes/ProductPatchExplodedClient";

const stages: NarrativeStage[] = [
  {
    eyebrow: "01 · The system",
    title: "A purpose-built sensor, fewer than a hundred grams.",
    body:
      "extrava is a flexible, adhesive device engineered to live on the skin during an infusion. Five layers, each doing one job.",
    metric: { value: "44×44 mm", label: "Form factor" },
  },
  {
    eyebrow: "02 · Adhesive backing",
    title: "Skin-safe adhesive, breathable film.",
    body:
      "Medical-grade acrylate on a Tegaderm-class carrier. Goes on without prep, comes off without residue. Doesn't disturb the dressing.",
    metric: { value: "72 hr", label: "Wear time" },
  },
  {
    eyebrow: "03 · Skin-contact array",
    title: "Thermal and pressure, in direct contact.",
    body:
      "A printed sensor array sits flush against the skin 1–2 cm from the cannula. Reads tissue temperature and pressure 240 times a second.",
    metric: { value: "240 Hz", label: "Sampling" },
  },
  {
    eyebrow: "04 · Compute layer",
    title: "Signal fusion on-device.",
    body:
      "A small MCU runs the dual-modality fusion model. Decisions happen on the patient, not in the cloud — robust to network outages.",
    metric: { value: "< 8 s", label: "Time-to-alert" },
  },
  {
    eyebrow: "05 · Wireless + power",
    title: "BLE radio and a full-shift battery.",
    body:
      "Bluetooth Low Energy 5.0 streams events to the nurse-facing app. A 600 mAh LiPo with USB-C charging powers a full infusion session.",
    metric: { value: "BLE 5.0", label: "Radio" },
  },
];

export default function ProductScrollNarrative() {
  return (
    <ScrollNarrative
      stages={stages}
      stageHeightVh={130}
      sectionLabel="Inside extrava"
      rightVisual
      scene={(progress) => <ProductPatchExplodedClient progress={progress} />}
    />
  );
}
