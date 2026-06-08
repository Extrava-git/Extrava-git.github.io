"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Vector2 } from "three";

type Props = {
  bloomIntensity?: number;
  bloomThreshold?: number;
  vignette?: number;
  chromaticOffset?: number;
  noise?: number;
};

export default function PremiumPostFX({
  bloomIntensity = 0.55,
  bloomThreshold = 0.45,
  vignette = 0.35,
  chromaticOffset = 0,
  noise = 0,
}: Props) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <SMAA />
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.4}
        mipmapBlur
        kernelSize={KernelSize.LARGE}
      />
      {chromaticOffset > 0 ? (
        <ChromaticAberration
          offset={new Vector2(chromaticOffset, chromaticOffset)}
          radialModulation={false}
          modulationOffset={0}
          blendFunction={BlendFunction.NORMAL}
        />
      ) : (
        <></>
      )}
      <Vignette eskil={false} offset={0.20} darkness={vignette} />
      {noise > 0 ? (
        <Noise opacity={noise} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
