export type OrbState = "idle" | "listening" | "thinking" | "speaking";

export interface FrequencyData {
  bass: number;       // 0.0 - 1.0 (Scale & macro displacement)
  mid: number;        // 0.0 - 1.0 (Surface waves)
  high: number;       // 0.0 - 1.0 (Fine details & particles)
  overall: number;    // 0.0 - 1.0 (Glow & bloom intensity)
}

export interface OrbColorPalette {
  colorA: string;     // Deep core / primary energy (e.g. electric blue #0044ff)
  colorB: string;     // Surface cyan / highlight (e.g. cyan #00f0ff)
  colorCore: string;  // Deep inner violet (#7000ff)
  colorRim: string;   // Fresnel rim highlight (#ffffff)
}

export interface VoiceReactiveOrbProps {
  state?: OrbState;
  inputVolume?: number;
  outputVolume?: number;
  colors?: Partial<OrbColorPalette>;
  onStateChange?: (newState: OrbState) => void;
  className?: string;
}
