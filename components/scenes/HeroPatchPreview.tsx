"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  Float,
  MeshTransmissionMaterial,
  ContactShadows,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import PremiumPostFX from "./Postfx";

/* ── Compact patch + glass dome preview for the hero card ───────────────── */
function PatchPreview() {
  const ledRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ledRefs.current.forEach((m, i) => {
      if (!m) return;
      const blink = (Math.sin(t * 2 + i * 0.7) + 1) / 2;
      m.emissiveIntensity = 1.2 + blink * 0.8;
    });
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* patch body */}
      <RoundedBox args={[1.4, 0.20, 1.4]} radius={0.08} smoothness={6} castShadow>
        <meshPhysicalMaterial
          color="#1c1c1f"
          roughness={0.4}
          metalness={0.4}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>
      {/* top plate */}
      <RoundedBox args={[1.3, 0.04, 1.3]} radius={0.04} smoothness={4} position={[0, 0.11, 0]}>
        <meshPhysicalMaterial color="#2f2f33" roughness={0.4} metalness={0.6} clearcoat={0.4} />
      </RoundedBox>
      {/* LEDs */}
      {[-0.42, -0.14, 0.16, 0.44].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0]}>
          <sphereGeometry args={[0.06, 18, 18]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) ledRefs.current[i] = m;
            }}
            color="#0b0b0c"
            emissive={i % 2 === 0 ? "#7dd3fc" : "#fda4af"}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* glass dome */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.95, 40, 28, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.3}
          roughness={0.08}
          ior={1.4}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.05}
          distortionScale={0.22}
          temporalDistortion={0.04}
          color="#ffffff"
          attenuationDistance={1.4}
          attenuationColor="#dde6ff"
        />
      </mesh>
      {/* dome rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.181, 0]}>
        <ringGeometry args={[0.94, 0.96, 64]} />
        <meshBasicMaterial color="#cfd8e6" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

function SceneContents() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.25 + 0.4;
      groupRef.current.rotation.x = -0.35 + Math.sin(t * 0.4) * 0.04;
    }
  });

  return (
    <>
      <Environment frames={1} resolution={256}>
        <Lightformer intensity={2.2} position={[3, 4, 4]} scale={[4, 4, 1]} color="#ffffff" />
        <Lightformer
          intensity={1.0}
          position={[-3, 1, 2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 4, 1]}
          color="#cfdcff"
        />
        <Lightformer intensity={0.6} position={[0, -2, -3]} scale={[4, 3, 1]} color="#ffd6c4" />
      </Environment>

      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={0.7} castShadow />

      <Float speed={1.0} rotationIntensity={0.0} floatIntensity={0.35}>
        <group ref={groupRef}>
          <PatchPreview />
        </group>
      </Float>

      <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={4} blur={2.4} far={2} />

      <fog attach="fog" args={["#efeee9", 5, 12]} />

      <PremiumPostFX
        bloomIntensity={0.7}
        bloomThreshold={0.30}
        vignette={0.5}
        chromaticOffset={0.0005}
        noise={0.018}
      />
    </>
  );
}

export default function HeroPatchPreview() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [2.4, 1.6, 3.4], fov: 32 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents />
    </Canvas>
  );
}
