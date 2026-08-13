"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  radius?: number;
  audioRef: React.MutableRefObject<{ overall: number; high: number }>;
}

export function ParticleField({ count = 240, radius = 3.2, audioRef }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute particles in a spherical orbital shell around the orb
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 1.6;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;

      sc[i] = Math.random() * 0.035 + 0.015;
    }

    return [pos, sc, initPos];
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const audio = audioRef.current;
    const overall = audio.overall || 0;
    const high = audio.high || 0;

    // Slow orbital rotation
    pointsRef.current.rotation.y += delta * (0.05 + overall * 0.15);
    pointsRef.current.rotation.x += delta * (0.02 + high * 0.1);

    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ix = initialPositions[idx];
      const iy = initialPositions[idx + 1];
      const iz = initialPositions[idx + 2];

      // Subtle organic breathing oscillation + audio displacement
      const pulse = Math.sin(time * 1.5 + i * 0.2) * 0.08 + overall * 0.35;
      array[idx] = ix + ix * pulse * 0.15;
      array[idx + 1] = iy + iy * pulse * 0.15;
      array[idx + 2] = iz + iz * pulse * 0.15;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#00f0ff"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
