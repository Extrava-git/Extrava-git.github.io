"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import { MutableRefObject, useRef } from "react";
import * as THREE from "three";
import PremiumPostFX from "./Postfx";

type Props = { progress?: number };
type PRef = MutableRefObject<number>;

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const stage = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));

/* ── Layers — collapsed at p=0, separate one-at-a-time as p increases ────── */
type LayerDef = {
  color: string;
  thickness: number;
  radius: number;
  finalY: number;
  appearAt: number; // 0..1 progress where this layer starts separating
  hasChips?: boolean;
  chipColor?: string;
};

const layers: LayerDef[] = [
  { color: "#fafaf7", thickness: 0.05, radius: 0.06, finalY: -0.70, appearAt: 0.10 }, // adhesive
  { color: "#1e293b", thickness: 0.08, radius: 0.07, finalY: -0.35, appearAt: 0.28 }, // skin contact
  { color: "#1c1c1f", thickness: 0.10, radius: 0.08, finalY:  0.00, appearAt: 0.46, hasChips: true, chipColor: "#fda4af" }, // PCB
  { color: "#2a2a2e", thickness: 0.06, radius: 0.07, finalY:  0.45, appearAt: 0.62 }, // MCU plate
  { color: "#15151a", thickness: 0.18, radius: 0.10, finalY:  0.85, appearAt: 0.78 }, // battery / top shell
];

function Layer({
  def,
  progressRef,
  index,
}: {
  def: LayerDef;
  progressRef: PRef;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const sep = easeInOutCubic(stage(p, def.appearAt, def.appearAt + 0.18));
    if (groupRef.current) {
      const y = lerp(0, def.finalY, sep);
      const breath = Math.sin(t * 0.6 + index) * 0.012 * sep;
      groupRef.current.position.y = y + breath;
    }
    if (matRef.current) {
      // subtle emissive bump on the layer being introduced
      const focus = clamp((p - def.appearAt + 0.06) / 0.10) *
        (1 - clamp((p - def.appearAt - 0.20) / 0.10));
      matRef.current.emissive = new THREE.Color("#1d4ed8").multiplyScalar(0.18 * focus);
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        args={[1.5, def.thickness, 1.5]}
        radius={def.radius}
        smoothness={5}
        castShadow
      >
        <meshPhysicalMaterial
          ref={matRef}
          color={def.color}
          roughness={0.45}
          metalness={0.30}
          clearcoat={0.55}
          clearcoatRoughness={0.30}
        />
      </RoundedBox>
      {def.hasChips && (
        <group position={[0, def.thickness / 2 + 0.001, 0]}>
          {[
            [-0.45, 0, -0.3],
            [-0.15, 0, 0.25],
            [0.25, 0, -0.2],
            [0.5, 0, 0.3],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <boxGeometry args={[0.18, 0.025, 0.14]} />
              <meshStandardMaterial color="#0b0b0c" roughness={0.6} metalness={0.5} />
            </mesh>
          ))}
          <mesh position={[-0.05, 0, -0.02]}>
            <boxGeometry args={[0.34, 0.03, 0.18]} />
            <meshStandardMaterial
              color="#0b0b0c"
              emissive={def.chipColor ?? "#7dd3fc"}
              emissiveIntensity={0.7}
              roughness={0.45}
              metalness={0.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ── Connector posts — appear once the stack starts separating ──────────── */
function ConnectorPosts({ progressRef }: { progressRef: PRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = progressRef.current;
    const appear = easeInOutCubic(stage(p, 0.10, 0.36));
    if (groupRef.current) {
      groupRef.current.scale.y = lerp(0.01, 1, appear);
      const v = appear;
      groupRef.current.visible = v > 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {[
        [-0.55, 0, -0.55],
        [0.55, 0, -0.55],
        [-0.55, 0, 0.55],
        [0.55, 0, 0.55],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 8]} />
          <meshStandardMaterial color="#3a3a44" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Camera rig — orbit + climb as you scroll ───────────────────────────── */
function CameraRig({ progressRef }: { progressRef: PRef }) {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 0, 4.6));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const p = progressRef.current;
    // soft orbit, climbing slightly as we ascend the stack
    const angle = -0.25 + p * 0.6;
    const radius = lerp(3.6, 4.6, easeInOutCubic(stage(p, 0, 1)));
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = lerp(0, 0.8, p);

    posRef.current.lerp(new THREE.Vector3(x, y, z), 0.08);
    camera.position.copy(posRef.current);

    // look at the currently-active layer
    const focusLayer = layers.findIndex((l) => p < l.appearAt + 0.18);
    const targetLayer = focusLayer === -1 ? layers.length - 1 : focusLayer;
    const lookY = lerp(0, layers[targetLayer]?.finalY ?? 0, easeInOutCubic(stage(p, 0.10, 0.95)));
    lookRef.current.lerp(new THREE.Vector3(0, lookY, 0), 0.08);
    camera.lookAt(lookRef.current);
  });

  return null;
}

function SceneContents({ progress = 0 }: Props) {
  const progressRef = useRef(progress);

  useFrame(() => {
    progressRef.current = lerp(progressRef.current, progress, 0.18);
  });

  return (
    <>
      <Environment frames={1} resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[3, 4, 4]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[4, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-3, 1, 2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 5, 1]}
          color="#cfdcff"
        />
      </Environment>

      <ambientLight intensity={0.30} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={0.75}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <CameraRig progressRef={progressRef} />

      <ConnectorPosts progressRef={progressRef} />
      {layers.map((l, i) => (
        <Layer key={i} def={l} progressRef={progressRef} index={i} />
      ))}

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.30}
        scale={5}
        blur={2.6}
        far={2.5}
      />

      <PremiumPostFX
        bloomIntensity={0.50}
        bloomThreshold={0.55}
        vignette={0.40}
        chromaticOffset={0}
        noise={0}
      />
    </>
  );
}

export default function ProductPatchExploded({ progress = 0 }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
      camera={{ position: [3.6, 0, 3.0], fov: 32 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} />
    </Canvas>
  );
}
