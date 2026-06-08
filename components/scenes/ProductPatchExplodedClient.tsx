"use client";

import dynamic from "next/dynamic";

const ProductPatchExploded = dynamic(
  () => import("./ProductPatchExploded"),
  { ssr: false }
);

export default function ProductPatchExplodedClient({
  progress = 0,
}: {
  progress?: number;
}) {
  return <ProductPatchExploded progress={progress} />;
}
