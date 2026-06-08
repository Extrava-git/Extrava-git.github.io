"use client";

import dynamic from "next/dynamic";

const HeroPatchPreview = dynamic(() => import("./HeroPatchPreview"), {
  ssr: false,
});

export default HeroPatchPreview;
