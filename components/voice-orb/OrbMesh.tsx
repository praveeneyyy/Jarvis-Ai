"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbVertexShader, OrbFragmentShader } from "./OrbShader";
import { OrbState, FrequencyData, OrbColorPalette } from "./types";

interface OrbMeshProps {
  state: OrbState;
  audioRef: React.MutableRefObject<FrequencyData>;
  colors?: Partial<OrbColorPalette>;
  onClick?: () => void;
}

const DEFAULT_COLORS: OrbColorPalette = {
  colorA: "#0044ff",     // Electric Blue
  colorB: "#00f0ff",     // Cyan Highlight
  colorCore: "#6a00ff",  // Deep Violet Core
  colorRim: "#ffffff",   // White Fresnel Rim
};

export function OrbMesh({ state, audioRef, colors, onClick }: OrbMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const mergedColors = useMemo(() => ({ ...DEFAULT_COLORS, ...colors }), [colors]);

  // Shader uniforms initialization
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioLevel: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uHigh: { value: 0 },
      uDisplacement: { value: 0.18 },
      uNoiseSpeed: { value: 0.5 },
      uIntensity: { value: 1.0 },
      uState: { value: 0 }, // 0: idle, 1: listening, 2: thinking, 3: speaking
      uColorA: { value: new THREE.Color(mergedColors.colorA) },
      uColorB: { value: new THREE.Color(mergedColors.colorB) },
      uColorCore: { value: new THREE.Color(mergedColors.colorCore) },
      uColorRim: { value: new THREE.Color(mergedColors.colorRim) },
    }),
    [mergedColors]
  );

  // Smooth lerp state tracking variables
  const currentScale = useRef(1.0);
  const currentDisplacement = useRef(0.18);
  const currentNoiseSpeed = useRef(0.5);
  const currentIntensity = useRef(1.0);
  const currentNumericState = useRef(0);

  useFrame((sceneState, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const audio = audioRef.current;
    const { bass, mid, high, overall } = audio;

    // Update uTime
    materialRef.current.uniforms.uTime.value = sceneState.clock.getElapsedTime();

    // Numeric state target: 0: idle, 1: listening, 2: thinking, 3: speaking
    let targetNumericState = 0;
    let targetBaseScale = 1.0;
    let targetDisplacement = 0.18;
    let targetNoiseSpeed = 0.5;
    let targetIntensity = 1.0;

    switch (state) {
      case "idle":
        targetNumericState = 0;
        targetBaseScale = 1.0;
        targetDisplacement = 0.18;
        targetNoiseSpeed = 0.4;
        targetIntensity = 0.95;
        break;
      case "listening":
        targetNumericState = 1;
        targetBaseScale = 1.1 + bass * 0.25;
        targetDisplacement = 0.25 + mid * 0.4;
        targetNoiseSpeed = 0.7 + overall * 0.5;
        targetIntensity = 1.2 + overall * 0.5;
        break;
      case "thinking":
        targetNumericState = 2;
        targetBaseScale = 1.05 + Math.sin(sceneState.clock.getElapsedTime() * 3.0) * 0.04;
        targetDisplacement = 0.32;
        targetNoiseSpeed = 1.2;
        targetIntensity = 1.35;
        break;
      case "speaking":
        targetNumericState = 3;
        targetBaseScale = 1.18 + bass * 0.4;
        targetDisplacement = 0.35 + mid * 0.55;
        targetNoiseSpeed = 1.0 + overall * 0.8;
        targetIntensity = 1.5 + overall * 0.7;
        break;
    }

    if (hovered) {
      targetBaseScale *= 1.05;
      targetIntensity *= 1.15;
    }

    // Lerp transition parameters smoothly
    const lerpRate = 0.1;
    currentScale.current += (targetBaseScale - currentScale.current) * lerpRate;
    currentDisplacement.current += (targetDisplacement - currentDisplacement.current) * lerpRate;
    currentNoiseSpeed.current += (targetNoiseSpeed - currentNoiseSpeed.current) * lerpRate;
    currentIntensity.current += (targetIntensity - currentIntensity.current) * lerpRate;
    currentNumericState.current += (targetNumericState - currentNumericState.current) * lerpRate;

    // Apply scale to mesh
    meshRef.current.scale.setScalar(currentScale.current);

    // Continuous slow organic rotation
    meshRef.current.rotation.y += delta * (0.15 + overall * 0.3);
    meshRef.current.rotation.x += delta * (0.08 + mid * 0.2);

    // Update shader uniforms directly without React re-renders
    const u = materialRef.current.uniforms;
    u.uAudioLevel.value = overall;
    u.uBass.value = bass;
    u.uMid.value = mid;
    u.uHigh.value = high;
    u.uDisplacement.value = currentDisplacement.current;
    u.uNoiseSpeed.value = currentNoiseSpeed.current;
    u.uIntensity.value = currentIntensity.current;
    u.uState.value = currentNumericState.current;
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      cursor="pointer"
    >
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={OrbVertexShader}
        fragmentShader={OrbFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite
      />
    </mesh>
  );
}
