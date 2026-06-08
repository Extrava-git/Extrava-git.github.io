"use client";

import dynamic from "next/dynamic";

const TechSignalFusion = dynamic(
  () => import("./TechSignalFusion"),
  { ssr: false }
);

export default function TechSignalFusionClient({
  progress = 0,
}: {
  progress?: number;
}) {
  return <TechSignalFusion progress={progress} />;
}
