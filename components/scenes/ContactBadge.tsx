"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  Float,
  ContactShadows,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import PremiumPostFX from "./Postfx";

/* ── 3D badge with the patch wordmark — rendered to a canvas texture ────── */
function Badge() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // background gradient
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, "#101015");
    g.addColorStop(1, "#1c1c22");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // top label
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillText("EXTRAVA · HQ", 56, 70);

    // wordmark
    ctx.fillStyle = "#ffffff";
    ctx.font = '600 110px "Inter", sans-serif';
    ctx.fillText("extrava", 56, 220);

    // sub
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = '500 26px "Inter", sans-serif';
    ctx.fillText("Continuous infusion safety", 56, 270);

    // bottom row — contact info-ish
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = '500 22px "JetBrains Mono", monospace';
    ctx.fillText("hello@extrava.health", 56, 380);
    ctx.fillText("Boston, MA", 56, 414);

    // accent stripe on right
    const stripe = ctx.createLinearGradient(640, 0, 720, 0);
    stripe.addColorStop(0, "rgba(225,29,72,0)");
    stripe.addColorStop(1, "rgba(225,29,72,0.7)");
    ctx.fillStyle = stripe;
    ctx.fillRect(640, 0, 80, canvas.height);

    // glowing dot
    ctx.fillStyle = "#e11d48";
    ctx.beginPath();
    ctx.arc(680, 70, 8, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    if (matRef.current) {
      matRef.current.map = tex;
      matRef.current.needsUpdate = true;
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.35 - 0.3;
      groupRef.current.rotation.x = Math.cos(t * 0.4) * 0.10 - 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[3.0, 2.0, 0.10]} radius={0.10} smoothness={6} castShadow>
        <meshPhysicalMaterial
          color="#15151a"
          roughness={0.30}
          metalness={0.55}
          clearcoat={0.7}
          clearcoatRoughness={0.18}
        />
      </RoundedBox>
      {/* front face with badge artwork */}
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[2.96, 1.96]} />
        <meshBasicMaterial ref={matRef} color="#ffffff" toneMapped={false} />
      </mesh>
      {/* back face — subtle */}
      <mesh position={[0, 0, -0.052]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.96, 1.96]} />
        <meshStandardMaterial color="#0b0b0c" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Pulse rings emanating from the badge ───────────────────────────────── */
function PingWaves() {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const rings = [0, 1, 2];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ringRefs.current.forEach((m, i) => {
      if (!m) return;
      const phase = (t * 0.4 + i * 0.33) % 1;
      const sc = 0.6 + phase * 3.6;
      m.scale.set(sc, sc, sc);
      const mat = matRefs.current[i];
      if (mat) mat.opacity = (1 - phase) * 0.45;
    });
  });

  return (
    <group position={[0, 0, -0.2]}>
      {rings.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            ringRefs.current[i] = m;
          }}
          rotation={[0, 0, 0]}
        >
          <ringGeometry args={[1.0, 1.04, 96]} />
          <meshBasicMaterial
            ref={(m) => {
              matRefs.current[i] = m;
            }}
            color="#1d4ed8"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContents() {
  return (
    <>
      <Environment frames={1} resolution={256}>
        <Lightformer intensity={2.0} position={[3, 4, 4]} scale={[4, 4, 1]} color="#ffffff" />
        <Lightformer
          intensity={1.0}
          position={[-3, 2, 2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 4, 1]}
          color="#cfdcff"
        />
        <Lightformer
          intensity={0.6}
          position={[0, -2, -3]}
          rotation={[0, Math.PI, 0]}
          scale={[4, 3, 1]}
          color="#ffd6c4"
        />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.7} castShadow />

      <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.3}>
        <Badge />
      </Float>

      <PingWaves />

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.4}
        scale={6}
        blur={2.5}
        far={3}
      />

      <fog attach="fog" args={["#efeee9", 6, 14]} />

      <PremiumPostFX
        bloomIntensity={0.7}
        bloomThreshold={0.30}
        vignette={0.50}
        chromaticOffset={0.0006}
        noise={0.022}
      />
    </>
  );
}

export default function ContactBadge() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.5, 4.6], fov: 36 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents />
    </Canvas>
  );
}
