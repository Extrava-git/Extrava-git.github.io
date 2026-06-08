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

/* ── Wireframe + glass globe ────────────────────────────────────────────── */
function Globe({ progressRef }: { progressRef: PRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const equatorMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    if (groupRef.current) {
      // Slow constant spin, slight progress-driven yaw
      groupRef.current.rotation.y = t * 0.08 + p * 0.6;
    }
    // Equatorial ring fades in around stage 2
    const equator = easeOutCubic(stage(p, 0.20, 0.40));
    if (equatorMatRef.current) equatorMatRef.current.opacity = equator * 0.55;
    // Accent ring fades in around stage 3
    const accent = easeOutCubic(stage(p, 0.42, 0.62));
    if (ringMatRef.current) ringMatRef.current.opacity = accent * 0.45;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.4, 36, 24]} />
        <meshBasicMaterial
          color="#9a9994"
          wireframe
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.38, 64, 48]} />
        <meshPhysicalMaterial
          color="#0b0b0c"
          transparent
          opacity={0.55}
          roughness={0.4}
          metalness={0.5}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
        />
      </mesh>
      {/* Glass refraction shell */}
      <mesh>
        <sphereGeometry args={[1.46, 64, 48]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.4}
          roughness={0.1}
          ior={1.35}
          chromaticAberration={0.04}
          anisotropy={0.15}
          distortion={0.04}
          distortionScale={0.18}
          temporalDistortion={0.04}
          color="#ffffff"
          attenuationDistance={3}
          attenuationColor="#cfdcff"
        />
      </mesh>
      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.50, 1.52, 96]} />
        <meshBasicMaterial
          ref={equatorMatRef}
          color="#1d4ed8"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Latitudinal accent */}
      <mesh rotation={[Math.PI / 2 + 0.4, 0, 0]}>
        <ringGeometry args={[1.34, 1.355, 96]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color="#7dd3fc"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ── Care nodes — light up in waves across the surface ──────────────────── */
function CareNodes({ progressRef }: { progressRef: PRef }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const arr: { pos: THREE.Vector3; phase: number; size: number; activateAt: number }[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.42;
      arr.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        phase: Math.random() * Math.PI * 2,
        size: 0.035 + Math.random() * 0.025,
        // Nodes activate gradually as scroll progresses 0.15 → 0.75
        activateAt: 0.15 + (i / count) * 0.60,
      });
    }
    return arr;
  }, []);

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08 + p * 0.6;
    }
    refs.current.forEach((m, i) => {
      if (!m) return;
      const n = nodes[i];
      const activation = easeOutCubic(stage(p, n.activateAt, n.activateAt + 0.05));
      const blink = (Math.sin(t * 1.6 + n.phase) + 1) / 2;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = activation * (0.55 + blink * 0.45);
      m.scale.setScalar(0.2 + activation * 0.8);
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          position={n.pos.toArray() as [number, number, number]}
          ref={(m) => {
            refs.current[i] = m;
          }}
        >
          <sphereGeometry args={[n.size, 14, 14]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#fda4af" : "#7dd3fc"}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Orbit probes — appear in stage 4 ───────────────────────────────────── */
function OrbitProbes({ progressRef }: { progressRef: PRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const probeRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const appear = easeOutCubic(stage(p, 0.70, 0.92));

    if (groupRef.current) {
      groupRef.current.rotation.y = -t * 0.16;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.12;
      groupRef.current.visible = appear > 0.01;
    }
    if (ringMatRef.current) ringMatRef.current.opacity = appear * 0.35;
    probeRefs.current.forEach((m) => {
      if (!m) return;
      m.scale.setScalar(appear);
    });
  });

  return (
    <group ref={groupRef}>
      {[0, Math.PI * 0.55, Math.PI * 1.2, Math.PI * 1.7].map((a, i) => (
        <mesh
          key={i}
          ref={(m) => {
            probeRefs.current[i] = m;
          }}
          position={[Math.cos(a) * 2.1, Math.sin(a * 0.6) * 0.3, Math.sin(a) * 2.1]}
        >
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#0b0b0c"
            emissive="#7dd3fc"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.08, 2.10, 96]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color="#bdbcb6"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ── Camera rig — slow dolly + gentle pan as you scroll ─────────────────── */
function CameraRig({ progressRef }: { progressRef: PRef }) {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 0.6, 5.4));

  useFrame(() => {
    const p = progressRef.current;
    const dolly = easeInOutCubic(p);
    const x = lerp(0, 0.4, dolly);
    const y = lerp(0.4, 1.0, dolly);
    const z = lerp(5.6, 4.4, dolly);
    posRef.current.lerp(new THREE.Vector3(x, y, z), 0.08);
    camera.position.copy(posRef.current);
    camera.lookAt(0, 0, 0);
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
        <Lightformer intensity={1.7} position={[3, 4, 4]} scale={[4, 4, 1]} color="#ffffff" />
        <Lightformer
          intensity={1.2}
          position={[-3, 2, 2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 4, 1]}
          color="#bcd4ff"
        />
      </Environment>

      <ambientLight intensity={0.30} />
      <directionalLight position={[3, 5, 4]} intensity={0.65} />

      <CameraRig progressRef={progressRef} />

      <Globe progressRef={progressRef} />
      <CareNodes progressRef={progressRef} />
      <OrbitProbes progressRef={progressRef} />

      <PremiumPostFX
        bloomIntensity={0.70}
        bloomThreshold={0.35}
        vignette={0.45}
        chromaticOffset={0}
        noise={0}
      />
    </>
  );
}

export default function AboutMissionGlobe({ progress = 0 }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
      camera={{ position: [0, 0.6, 5.4], fov: 34 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} />
    </Canvas>
  );
}
