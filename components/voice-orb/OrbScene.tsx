"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { OrbMesh } from "./OrbMesh";
import { ParticleField } from "./ParticleField";
import { OrbState, FrequencyData, OrbColorPalette } from "./types";

interface CameraRigProps {
  children: React.ReactNode;
}

function CameraRig({ children }: CameraRigProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle floating camera breathing parallax
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.06;
    groupRef.current.position.x = Math.cos(t * 0.6) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

export interface OrbSceneProps {
  state: OrbState;
  audioRef: React.MutableRefObject<FrequencyData>;
  colors?: Partial<OrbColorPalette>;
  onClick?: () => void;
}

export function OrbScene({ state, audioRef, colors, onClick }: OrbSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  return (
    <div className="relative size-full min-h-[380px] w-full items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Responsive pixel ratio for high/low end devices
        className="size-full"
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#7000ff" />
        <directionalLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />

        <CameraRig>
          <OrbMesh state={state} audioRef={audioRef} colors={colors} onClick={onClick} />
          {!reducedMotion && <ParticleField count={220} radius={3.2} audioRef={audioRef} />}
        </CameraRig>

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.85}
            height={300}
            intensity={1.25}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
