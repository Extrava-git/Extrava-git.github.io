"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import PremiumPostFX from "./Postfx";

type Props = { progress?: number };
type PRef = MutableRefObject<number>;

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const stage = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));

/* ── Flowing waveform — appears, then funnels into the node ─────────────── */
function WaveTube({
  baseline,
  color,
  phase,
  freq,
  appearAt,
  funnelAt,
  progressRef,
  fireRef,
}: {
  baseline: number;
  color: string;
  phase: number;
  freq: number;
  appearAt: number;
  funnelAt: number;
  progressRef: PRef;
  fireRef: PRef;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const segments = 140;

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(6, 0.08, segments, 1),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const appear = easeOutCubic(stage(p, appearAt, appearAt + 0.18));
    const funnel = easeInOutCubic(stage(p, funnelAt, funnelAt + 0.18));
    const fire = fireRef.current;

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const wave =
        Math.sin(u * freq + t * 1.7 + phase) * 0.08 +
        Math.sin(u * (freq * 0.4) + t * 0.6 + phase) * 0.12;
      // collapse the right end of the ribbon toward y=0 as funnel grows
      const taper = Math.pow(u, 1.4) * funnel;
      const y = baseline * (1 - taper * 0.96) + wave * (1 - taper * 0.6) * appear;
      pos.setY(i * 2, y + 0.02);
      pos.setY(i * 2 + 1, y - 0.02);
    }
    pos.needsUpdate = true;

    if (matRef.current) {
      const base = new THREE.Color(color);
      const fireCol = new THREE.Color("#e11d48");
      matRef.current.color = base.lerp(fireCol, fire * 0.35);
      matRef.current.opacity = appear * 0.9;
    }
  });

  return (
    <mesh geometry={geometry} position={[-1, 0, 0]}>
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── Fusion node — glass octahedron with emissive core ──────────────────── */
function FusionNode({
  progressRef,
  fireRef,
}: {
  progressRef: PRef;
  fireRef: PRef;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    // node appears when both waves are present
    const appear = easeOutCubic(stage(p, 0.42, 0.62));
    // fire when fully funneled
    const fire = easeInOutCubic(stage(p, 0.78, 0.95));
    fireRef.current = fire;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(lerp(0.01, 1, appear));
      groupRef.current.visible = appear > 0.01;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.35;
      meshRef.current.rotation.x = t * 0.22;
      meshRef.current.scale.setScalar(1 + fire * 0.15);
    }
    if (matRef.current) {
      const calm = new THREE.Color("#1d4ed8").multiplyScalar(0.45);
      const burn = new THREE.Color("#e11d48").multiplyScalar(1.4 * fire);
      matRef.current.emissive = calm.clone().add(burn);
      matRef.current.emissiveIntensity = 0.6 + fire * 1.6;
    }
  });

  return (
    <group ref={groupRef} position={[1.8, 0, 0]}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[0.36, 0]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#15151a"
          roughness={0.18}
          metalness={0.6}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#1d4ed8"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
      {/* glass shell — refracts the emissive core */}
      <mesh>
        <octahedronGeometry args={[0.58, 0]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.45}
          roughness={0.05}
          ior={1.45}
          chromaticAberration={0.04}
          anisotropy={0.2}
          distortion={0.04}
          distortionScale={0.2}
          temporalDistortion={0.04}
          color="#ffffff"
          attenuationDistance={2.5}
          attenuationColor="#dde6ff"
        />
      </mesh>
    </group>
  );
}

/* ── Output beam — fires after node confirmation ────────────────────────── */
function OutputBeam({ fireRef }: { fireRef: PRef }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const segments = 100;

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(2.4, 0.08, segments, 1),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const fire = fireRef.current;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const wave = Math.sin(u * 18 - t * 4) * 0.04 * fire;
      pos.setY(i * 2, wave + 0.025);
      pos.setY(i * 2 + 1, wave - 0.025);
    }
    pos.needsUpdate = true;
    if (matRef.current) {
      matRef.current.opacity = fire * 0.95;
    }
  });

  return (
    <mesh geometry={geometry} position={[3.4, 0, 0]}>
      <meshBasicMaterial
        ref={matRef}
        color="#e11d48"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── Camera rig — slow dolly toward the node ────────────────────────────── */
function CameraRig({ progressRef }: { progressRef: PRef }) {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 1.4, 5.6));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const p = progressRef.current;
    const dolly = easeInOutCubic(p);
    const x = lerp(-0.6, 0.4, dolly);
    const y = lerp(1.5, 0.6, dolly);
    const z = lerp(6.4, 4.6, dolly);
    posRef.current.lerp(new THREE.Vector3(x, y, z), 0.08);
    camera.position.copy(posRef.current);

    const lookX = lerp(0.6, 1.8, dolly);
    lookRef.current.lerp(new THREE.Vector3(lookX, 0, 0), 0.08);
    camera.lookAt(lookRef.current);
  });

  return null;
}

function SceneContents({ progress = 0 }: Props) {
  const progressRef = useRef(progress);
  const fireRef = useRef(0);

  useFrame(() => {
    progressRef.current = lerp(progressRef.current, progress, 0.18);
  });

  return (
    <>
      <Environment frames={1} resolution={256}>
        <Lightformer intensity={2.0} position={[3, 4, 4]} scale={[4, 4, 1]} color="#ffffff" />
        <Lightformer
          intensity={1.1}
          position={[-3, 2, 2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 4, 1]}
          color="#bcd4ff"
        />
      </Environment>

      <ambientLight intensity={0.30} />
      <directionalLight position={[3, 5, 4]} intensity={0.55} />

      <CameraRig progressRef={progressRef} />

      <WaveTube
        baseline={0.5}
        color="#1d4ed8"
        phase={0}
        freq={9}
        appearAt={0.05}
        funnelAt={0.50}
        progressRef={progressRef}
        fireRef={fireRef}
      />
      <WaveTube
        baseline={-0.5}
        color="#be123c"
        phase={1.4}
        freq={11}
        appearAt={0.25}
        funnelAt={0.50}
        progressRef={progressRef}
        fireRef={fireRef}
      />

      <FusionNode progressRef={progressRef} fireRef={fireRef} />
      <OutputBeam fireRef={fireRef} />

      <PremiumPostFX
        bloomIntensity={0.85}
        bloomThreshold={0.30}
        vignette={0.45}
        chromaticOffset={0}
        noise={0}
      />
    </>
  );
}

export default function TechSignalFusion({ progress = 0 }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
      camera={{ position: [0, 1.4, 5.6], fov: 38 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} />
    </Canvas>
  );
}
