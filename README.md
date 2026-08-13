# ✦ JARVIS AI — Native Standalone Desktop GUI & 3D Voice-Reactive AI Orb

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.161-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8.15-black.svg?style=for-the-badge)](https://docs.pmnd.rs/react-three-fiber)
[![Electron](https://img.shields.io/badge/Electron-29.1-47848f.svg?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-violet.svg?style=for-the-badge)](https://www.framer.com/motion/)

**JARVIS AI** is an autonomous engineering platform featuring a **premium 3D Voice-Reactive AI Orb Core** built with **Three.js**, **React Three Fiber**, **custom GLSL Shaders**, **Web Audio API AnalyserNode**, and **Postprocessing Bloom**, running inside a **Next.js 14 App Router** standalone desktop application window.

---

## 🔮 Premium 3D Voice-Reactive AI Orb Core

```
components/voice-orb/
├── types.ts                     # OrbState ("idle" | "listening" | "thinking" | "speaking"), FrequencyData & Palette types
├── OrbShader.ts                 # GLSL Vertex & Fragment Shaders (Simplex Noise, Fresnel Rim Light, Volumetric Energy)
├── useAudioAnalyzer.ts          # Web Audio API AnalyserNode Hook (Bass, Mid, High frequency extraction + Lerp smoothing)
├── ParticleField.tsx            # 3D Orbital particle system surrounding the AI core
├── OrbMesh.tsx                  # High-detail procedural sphere geometry & shader material drive
├── OrbScene.tsx                 # R3F Canvas, Camera breathing rig, Point lights & Bloom postprocessing
└── VoiceReactiveOrb.tsx         # Master client component with minimal sci-fi UI controls
```

### Key Orb Capabilities:
1. **Multi-Band Frequency Reactivity**:
   * **Bass (0–250 Hz)**: Drives volumetric scale expansion & macro organic deformation.
   * **Mid (250–2000 Hz)**: Drives surface wave ripples and fluid noise displacement.
   * **High (2000–8000 Hz)**: Drives micro-surface details and particle field velocity.
   * **RMS Overall**: Modulates emissive shader glow and bloom intensity.
2. **Smooth Visual State Machine**:
   * `IDLE`: Slow organic breathing, low glow, minimal particle drift.
   * `LISTENING`: Microphone-driven audio pulses and expanding radius.
   * `THINKING`: Swirling cyan/violet plasma processing animation.
   * `SPEAKING`: High-energy output amplitude plasma response.
3. **Cinematic Shading & Lighting**:
   * Custom GLSL vertex noise displacement and Fresnel rim lighting (electric blue core `#0044ff`, cyan highlights `#00f0ff`, deep violet `#6a00ff`).
   * Postprocessing Bloom (`@react-three/postprocessing`).
4. **Performance & Accessibility**:
   * Zero frame-by-frame React state re-renders (real-time audio metrics stored in `useRef` and updated directly in GLSL uniforms).
   * Respects `prefers-reduced-motion` settings.

---

## 🖥️ How to Launch the Standalone Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key in `.env.local`
```env
OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Launch Desktop GUI Window
```bash
.\start-jarvis-gui.bat
# OR
npm run app
```

Navigate to the **`3D AI ORB CORE`** tab in the top header bar to interact with the voice-reactive 3D AI Orb!

---

## 📄 License

This project is licensed under the MIT License.
