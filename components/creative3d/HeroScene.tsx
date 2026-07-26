"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sphere,
  Box,
  Torus,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

/* ---- Particles ---- */
function Particles({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 22;
      a[i * 3 + 1] = (Math.random() - 0.5) * 22;
      a[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return a;
  }, [count]);

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.015;
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.01) * 0.08;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#6366f1"
        transparent
        opacity={0.55}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ---- Floating Orb ---- */
function Orb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.3 * speed;
      ref.current.rotation.y = s.clock.elapsedTime * 0.2 * speed;
    }
  });
  return (
    <Float speed={1.5 * speed} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={ref} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

/* ---- Floating Box ---- */
function FBox({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.4;
      ref.current.rotation.z = s.clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Box ref={ref} args={[1, 1, 1]} scale={scale} position={position}>
        <MeshWobbleMaterial
          color={color}
          roughness={0.3}
          metalness={0.7}
          factor={0.2}
          speed={1}
        />
      </Box>
    </Float>
  );
}

/* ---- Floating Torus ---- */
function FTorus({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.5;
      ref.current.rotation.y = s.clock.elapsedTime * 0.3;
    }
  });
  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2}>
      <Torus ref={ref} args={[1, 0.3, 16, 32]} scale={scale} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </Torus>
    </Float>
  );
}

/* ---- Glow Ring ---- */
function GlowRing({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x =
        Math.PI / 2 + Math.sin(s.clock.elapsedTime * 0.5) * 0.2;
      ref.current.rotation.z = s.clock.elapsedTime * 0.1;
      const sc = 1 + Math.sin(s.clock.elapsedTime * 0.8) * 0.1;
      ref.current.scale.setScalar(sc);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshStandardMaterial
        color="#818cf8"
        emissive="#6366f1"
        emissiveIntensity={2}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}

/* ---- Scene ---- */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e0e7ff" />
      <pointLight position={[-3, 3, -3]} intensity={1} color="#6366f1" />
      <pointLight position={[3, -3, 2]} intensity={0.6} color="#a78bfa" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#818cf8"
      />

      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      <Particles count={300} />

      <Orb position={[-3.5, 1.5, -2]} color="#6366f1" scale={0.8} speed={0.8} />
      <Orb position={[4, -1, -3]} color="#a78bfa" scale={0.6} speed={1.2} />
      <Orb position={[0, 3, -4]} color="#818cf8" scale={0.5} speed={0.6} />

      <FBox position={[3, 2, -1]} color="#4f46e5" scale={0.7} />
      <FBox position={[-4, -1.5, -2]} color="#7c3aed" scale={0.5} />

      <FTorus position={[-2, -2, -1]} color="#6366f1" scale={0.8} />
      <FTorus position={[2.5, 0.5, -3]} color="#a78bfa" scale={0.5} />

      <GlowRing position={[0, 0, -2]} />
      <GlowRing position={[0, 0, -5]} />
    </>
  );
}

/* ---- Export ---- */
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
