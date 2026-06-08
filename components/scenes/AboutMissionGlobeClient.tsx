"use client";

import dynamic from "next/dynamic";

const AboutMissionGlobe = dynamic(
  () => import("./AboutMissionGlobe"),
  { ssr: false }
);

export default function AboutMissionGlobeClient({
  progress = 0,
}: {
  progress?: number;
}) {
  return <AboutMissionGlobe progress={progress} />;
}
