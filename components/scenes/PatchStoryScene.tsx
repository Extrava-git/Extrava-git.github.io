"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import PremiumPostFX from "./Postfx";

type Props = { progress: number };
type PRef = MutableRefObject<number>;

/* ── easing ─────────────────────────────────────────────────────────────── */
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const stage = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));

/* ── Two signal ribbons — thermal + pressure ────────────────────────────── */
function SignalRibbon({
  progressRef,
  baseline,
  color,
  phase,
  divergenceDir,
  appearAt,
  divergeAt,
}: {
  progressRef: PRef;
  baseline: number;
  color: string;
  phase: number;
  divergenceDir: 1 | -1;
  appearAt: number;
  divergeAt: number;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const segments = 100;
  const length = 6.2;

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(length, 0.08, segments, 1),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const appear = easeOutCubic(stage(p, appearAt, appearAt + 0.14));
    const diverge = easeInOutCubic(stage(p, divergeAt, divergeAt + 0.20));
    const fadeOut = easeInOutCubic(stage(p, 0.90, 0.99));

    const amp = 0.10 * appear + 0.42 * diverge;

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const wave =
        Math.sin(u * 14 + t * 1.1 + phase) * 0.06 +
        Math.sin(u * 4 + t * 0.5 + phase) * 0.12;
      const y =
        baseline + wave * amp + divergenceDir * diverge * (0.45 + u * 0.45);
      pos.setY(i * 2, y + 0.02);
      pos.setY(i * 2 + 1, y - 0.02);
    }
    pos.needsUpdate = true;

    if (matRef.current) {
      matRef.current.opacity = appear * (1 - fadeOut) * 0.9;
    }
  });

  return (
    <mesh geometry={geometry}>
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

/* ── Patch device ───────────────────────────────────────────────────────── */
function PatchDevice({ progressRef }: { progressRef: PRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const ledRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const dropIn = easeOutCubic(stage(p, 0.14, 0.32));
    const settle = easeInOutCubic(stage(p, 0.28, 0.46));
    const calm = easeOutCubic(stage(p, 0.40, 0.58));
    const leak = easeInOutCubic(stage(p, 0.55, 0.78));
    const alertC = easeInOutCubic(stage(p, 0.70, 0.86));
    const phone = easeInOutCubic(stage(p, 0.84, 0.96));

    if (groupRef.current) {
      groupRef.current.position.y = lerp(2.6, 0.16, dropIn);
      groupRef.current.rotation.y = lerp(0.6, Math.sin(t * 0.12) * 0.06, settle);
      groupRef.current.rotation.x = lerp(-0.35, -0.18, settle);
      groupRef.current.scale.setScalar(lerp(0.92, 1, settle));
    }

    if (bodyMatRef.current) {
      const base = new THREE.Color("#0b0b0c");
      const calmE = new THREE.Color("#1d4ed8").multiplyScalar(0.12 * calm);
      const leakE = new THREE.Color("#9f1239").multiplyScalar(0.20 * leak);
      const alertE = new THREE.Color("#e11d48").multiplyScalar(
        0.7 * alertC + 0.4 * phone
      );
      bodyMatRef.current.emissive = base
        .clone()
        .add(calmE)
        .add(leakE)
        .add(alertE);
      bodyMatRef.current.emissiveIntensity = 0.9 + leak * 0.3 + alertC * 1.6;
    }

    ledRefs.current.forEach((m, i) => {
      if (!m) return;
      const blink = (Math.sin(t * 5 + i) + 1) / 2;
      const calmCol = new THREE.Color("#7dd3fc").multiplyScalar(0.5 + 0.5 * blink);
      const alertCol = new THREE.Color("#fda4af").multiplyScalar(0.6 + 0.4 * blink);
      m.emissive = calmCol.lerp(alertCol, alertC);
      m.emissiveIntensity = 1.2 + alertC * 1.2;
    });
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        args={[1.5, 0.22, 1.5]}
        radius={0.08}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          ref={bodyMatRef}
          color="#1c1c1f"
          roughness={0.40}
          metalness={0.30}
          clearcoat={0.6}
          clearcoatRoughness={0.30}
          emissive="#000"
        />
      </RoundedBox>
      <RoundedBox
        args={[1.4, 0.04, 1.4]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.12, 0]}
      >
        <meshPhysicalMaterial
          color="#2a2a2e"
          roughness={0.45}
          metalness={0.50}
          clearcoat={0.4}
        />
      </RoundedBox>
      {[-0.48, -0.16, 0.18, 0.50].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) ledRefs.current[i] = m;
            }}
            color="#0b0b0c"
            emissive="#7dd3fc"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Skin surface — minimal, with subtle swelling under leak ────────────── */
function SkinSurface({ progressRef }: { progressRef: PRef }) {
  const segments = 80;

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(9, 5, segments, segments);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  useFrame(() => {
    const p = progressRef.current;
    const swell = easeInOutCubic(stage(p, 0.55, 0.82));
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const cx = -1.4;
    const cz = 0.4;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const d = Math.hypot(x - cx, z - cz);
      const bump = Math.exp(-d * d * 0.85) * 0.35 * swell;
      pos.setY(i, bump);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh geometry={geometry} position={[0, -0.55, 0]} receiveShadow>
      <meshPhysicalMaterial
        color="#efd9c8"
        roughness={0.92}
        metalness={0}
        clearcoat={0.03}
      />
    </mesh>
  );
}

/* ── IV line ────────────────────────────────────────────────────────────── */
function IVLine() {
  const tubeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.5, 2.2, -1.4),
      new THREE.Vector3(-2.6, 1.4, -0.9),
      new THREE.Vector3(-2.0, 0.6, -0.3),
      new THREE.Vector3(-1.5, -0.2, 0.2),
      new THREE.Vector3(-1.35, -0.5, 0.35),
    ]);
    return new THREE.TubeGeometry(curve, 80, 0.045, 12, false);
  }, []);

  return (
    <group>
      <mesh geometry={tubeGeo} castShadow>
        <meshPhysicalMaterial
          color="#0b0b0c"
          roughness={0.45}
          metalness={0.4}
          clearcoat={0.3}
        />
      </mesh>
      <mesh position={[-1.35, -0.45, 0.35]}>
        <cylinderGeometry args={[0.085, 0.085, 0.10, 16]} />
        <meshPhysicalMaterial
          color="#1f1f23"
          roughness={0.45}
          metalness={0.30}
          clearcoat={0.3}
        />
      </mesh>
    </group>
  );
}

/* ── Canvas-painted phone screen ────────────────────────────────────────── */
function PhoneScreen({ progressRef }: { progressRef: PRef }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastDrawnRef = useRef(-1);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 540;
    canvas.height = 1100;
    canvasRef.current = canvas;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textureRef.current = tex;
    if (matRef.current) {
      matRef.current.map = tex;
      matRef.current.needsUpdate = true;
    }
    drawPhoneScreen(canvas, 0);
    tex.needsUpdate = true;
  }, []);

  useFrame(() => {
    const p = progressRef.current;
    const alertReveal = clamp((p - 0.62) / 0.30);
    const q = Math.round(alertReveal * 80) / 80;
    if (Math.abs(q - lastDrawnRef.current) > 0.0001) {
      lastDrawnRef.current = q;
      if (canvasRef.current && textureRef.current) {
        drawPhoneScreen(canvasRef.current, q);
        textureRef.current.needsUpdate = true;
      }
    }
  });

  return (
    <mesh position={[0, 0, 0.083]}>
      <planeGeometry args={[1.32, 2.7]} />
      <meshBasicMaterial ref={matRef} color="#0b0b0c" toneMapped={false} />
    </mesh>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPhoneScreen(canvas: HTMLCanvasElement, alertReveal: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0b0b0c";
  ctx.fillRect(0, 0, W, H);

  // status bar
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = '600 22px "Inter", sans-serif';
  ctx.fillText("9:41", 36, 64);

  // patient header (always visible)
  ctx.fillStyle = "#ffffff";
  ctx.font = '600 24px "Inter", sans-serif';
  ctx.fillText("extrava", 36, 122);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = '500 18px "Inter", sans-serif';
  ctx.textAlign = "right";
  ctx.fillText("Bay 4", W - 36, 122);
  ctx.textAlign = "left";

  ctx.fillStyle = "#ffffff";
  ctx.font = '600 38px "Inter", sans-serif';
  ctx.fillText("J. Park", 36, 200);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = '500 22px "Inter", sans-serif';
  ctx.fillText("Doxorubicin · 60 mg/m²", 36, 234);

  // alert banner
  const banner = clamp((alertReveal - 0.10) / 0.30);
  if (banner > 0) {
    ctx.save();
    ctx.globalAlpha = banner;
    const ay = 286 + (1 - banner) * 14;
    const ah = 200;

    ctx.fillStyle = "rgba(225, 29, 72, 0.18)";
    roundRect(ctx, 28, ay, W - 56, ah, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(225, 29, 72, 0.50)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, 28, ay, W - 56, ah, 18);
    ctx.stroke();

    ctx.fillStyle = "#e11d48";
    ctx.beginPath();
    ctx.arc(60, ay + 40, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fda4af";
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillText("ALERT · JUST NOW", 80, ay + 46);

    ctx.fillStyle = "#fff1f2";
    ctx.font = '600 28px "Inter", sans-serif';
    ctx.fillText("Possible extravasation", 36, ay + 100);

    ctx.fillStyle = "rgba(253, 164, 175, 0.85)";
    ctx.font = '500 20px "Inter", sans-serif';
    ctx.fillText("Two sensors confirm.", 36, ay + 138);
    ctx.fillText("Stop infusion immediately.", 36, ay + 168);
    ctx.restore();
  }

  // primary action
  const actions = clamp((alertReveal - 0.50) / 0.30);
  if (actions > 0) {
    ctx.save();
    ctx.globalAlpha = actions;
    const by = 920 + (1 - actions) * 16;
    ctx.fillStyle = "#e11d48";
    roundRect(ctx, 28, by, W - 56, 64, 32);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("Stop infusion", W / 2, by + 42);
    ctx.textAlign = "left";
    ctx.restore();
  }
}

/* ── Phone device ───────────────────────────────────────────────────────── */
function PhoneDevice({ progressRef }: { progressRef: PRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const appear = easeInOutCubic(stage(p, 0.62, 0.84));
    const closeUp = easeInOutCubic(stage(p, 0.84, 0.96));
    const hover = Math.sin(t * 0.7) * 0.04;

    if (groupRef.current) {
      groupRef.current.position.x = lerp(4.2, lerp(2.6, 2.2, closeUp), appear);
      groupRef.current.position.y = lerp(-1.8, lerp(0.6, 0.8, closeUp) + hover, appear);
      groupRef.current.position.z = lerp(2.6, lerp(1.4, 1.7, closeUp), appear);
      groupRef.current.scale.setScalar(lerp(0.5, lerp(0.95, 1.05, closeUp), appear));
      groupRef.current.rotation.y = lerp(0.9, 0.28 - closeUp * 0.08, appear);
      groupRef.current.rotation.x = lerp(0.2, -0.06, appear);
    }
  });

  return (
    <group ref={groupRef} position={[4.2, -1.8, 2.6]} rotation={[0.2, 0.9, 0]}>
      <RoundedBox args={[1.5, 3.0, 0.16]} radius={0.18} smoothness={6} castShadow>
        <meshPhysicalMaterial
          color="#15151a"
          roughness={0.32}
          metalness={0.7}
          clearcoat={0.9}
          clearcoatRoughness={0.16}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.082]}>
        <planeGeometry args={[1.35, 2.82]} />
        <meshPhysicalMaterial
          color="#0b0b0c"
          roughness={0.10}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      <PhoneScreen progressRef={progressRef} />
    </group>
  );
}

/* ── Camera rig — confident, simple path ────────────────────────────────── */
function CameraRig({ progressRef }: { progressRef: PRef }) {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(5.5, 2.4, 4.2));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = progressRef.current;
    const dolly = easeInOutCubic(stage(p, 0, 0.80));
    const focus = easeInOutCubic(stage(p, 0.55, 0.78));
    const phoneShift = easeInOutCubic(stage(p, 0.82, 0.98));

    // simple orbit — no per-frame rotation, just progress-driven
    const angle = -0.35 + p * 0.55;
    const radius = lerp(6.4, 4.8, dolly);
    const height = lerp(2.4, 1.4, dolly);
    const orbitX = Math.cos(angle) * radius;
    const orbitZ = Math.sin(angle) * radius;

    const phoneX = 3.0;
    const phoneY = 1.4;
    const phoneZ = 5.2;

    const targetX = lerp(orbitX, phoneX, phoneShift);
    const targetY = lerp(height, phoneY, phoneShift);
    const targetZ = lerp(orbitZ, phoneZ, phoneShift);

    posRef.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.075);
    // subtle breathing only
    const breathY = Math.cos(t * 0.27) * 0.008;
    camera.position.set(posRef.current.x, posRef.current.y + breathY, posRef.current.z);

    const patchLookX = lerp(0, -0.8, focus);
    const patchLookY = lerp(0, -0.1, focus);
    const lookX = lerp(patchLookX, 2.2, phoneShift);
    const lookY = lerp(patchLookY, 0.7, phoneShift);
    const lookZ = lerp(0, 1.6, phoneShift);

    lookRef.current.lerp(new THREE.Vector3(lookX, lookY, lookZ), 0.075);
    camera.lookAt(lookRef.current);
  });

  return null;
}

/* ── Scene contents ─────────────────────────────────────────────────────── */
function SceneContents({ progress }: Props) {
  const progressRef = useRef(progress);

  useFrame(() => {
    progressRef.current = lerp(progressRef.current, progress, 0.16);
  });

  return (
    <>
      <Environment frames={1} resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.0}
          position={[3, 4, 4]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[4, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.0}
          position={[-3, 1, 2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 5, 1]}
          color="#cfdcff"
        />
      </Environment>

      <CameraRig progressRef={progressRef} />

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={0.85}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />

      <SkinSurface progressRef={progressRef} />
      <ContactShadows
        position={[0, -0.545, 0]}
        opacity={0.35}
        scale={9}
        blur={2.5}
        far={3}
      />

      <IVLine />
      <PatchDevice progressRef={progressRef} />

      <group position={[2.4, 0.6, 0]}>
        <SignalRibbon
          progressRef={progressRef}
          baseline={0.30}
          color="#1d4ed8"
          phase={0}
          divergenceDir={1}
          appearAt={0.36}
          divergeAt={0.55}
        />
        <SignalRibbon
          progressRef={progressRef}
          baseline={-0.30}
          color="#be123c"
          phase={1.3}
          divergenceDir={-1}
          appearAt={0.38}
          divergeAt={0.55}
        />
      </group>

      <PhoneDevice progressRef={progressRef} />

      <PremiumPostFX
        bloomIntensity={0.55}
        bloomThreshold={0.50}
        vignette={0.35}
        chromaticOffset={0}
        noise={0}
      />
    </>
  );
}

export default function PatchStoryScene({ progress }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
      camera={{ position: [5.5, 2.4, 4.2], fov: 32, near: 0.1, far: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} />
    </Canvas>
  );
}
