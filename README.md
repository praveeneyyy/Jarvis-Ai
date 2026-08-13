# ✦ JARVIS AI — Native Standalone Desktop GUI & 3D Voice-Reactive AI Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.161-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8.15-black.svg?style=for-the-badge)](https://docs.pmnd.rs/react-three-fiber)
[![Electron](https://img.shields.io/badge/Electron-29.1-47848f.svg?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-violet.svg?style=for-the-badge)](https://www.framer.com/motion/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter_API-Multi--Model-orange.svg?style=for-the-badge)](https://openrouter.ai/)

**JARVIS AI** is an autonomous engineering workspace packaged as a **native standalone desktop application** powered by **Next.js 14 (App Router)**, **Electron 29**, **Three.js / React Three Fiber**, **custom GLSL Shaders**, **Web Audio API**, and **OpenRouter AI**.

---

## 🔮 Core Architecture & Key Modules

```
                              JARVIS AI PLATFORM ARCHITECTURE
 ┌────────────────────────────────────────────────────────────────────────────────┐
 │                      ELECTRON 29 NATIVE DESKTOP WINDOW                         │
 │ ┌────────────────────────────────────────────────────────────────────────────┐ │
 │ │                   NEXT.JS 14 APP ROUTER FRONTEND ENGINE                    │ │
 │ │                                                                            │ │
 │ │ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │ │
 │ │ │  3D VOICE-REACTIVE   │ │  OPENROUTER CASCADE  │ │  LIVE WEB SEARCH &   │ │ │
 │ │ │    AI ORB CORE       │ │      AI MODELS       │ │  GROUNDED CITATIONS  │ │ │
 │ │ │ Three.js + R3F GLSL  │ │ Llama 3.3, Gemini 2  │ │ Real-time web search │ │ │
 │ │ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │ │
 │ │ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │ │
 │ │ │ PERSISTENT CHAT RAG  │ │ LIVE CODE EXECUTION  │ │  NEURAL VOICE MODE   │ │ │
 │ │ │ IndexedDB Thread Map │ │   Browser Sandbox    │ │ STT + Web Speech TTS │ │ │
 │ │ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │ │
 │ └────────────────────────────────────────────────────────────────────────────┘ │
 └────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Major Highlights

### 1. 🔮 3D Voice-Reactive AI Orb Core
* **Multi-Band Frequency Decomposition**:
  * **Bass (0–250 Hz)** $\rightarrow$ Volumetric scale expansion & macro organic deformation.
  * **Mid (250–2000 Hz)** $\rightarrow$ Fluid surface noise displacement and wave ripples.
  * **High (2000–8000 Hz)** $\rightarrow$ Micro-surface details and particle field velocity.
  * **Overall RMS** $\rightarrow$ Emissive GLSL glow and postprocessing bloom intensity.
* **Procedural GLSL Shading**: Custom vertex noise displacement and Fresnel rim lighting (electric blue `#0044ff`, cyan `#00f0ff`, deep violet `#6a00ff`).
* **Zero-Latency Performance**: Audio metrics stored in `useRef` and updated directly in GLSL uniforms without frame-by-frame React state re-renders.

### 2. 🤖 Multi-Model OpenRouter AI Cascade
* **Intelligent Failover Pipeline**: Queries auto-failover across 5 AI models (`Llama 3.3 70B`, `Gemini 2.0 Flash`, `DeepSeek R1`, `Mistral 7B`, `Qwen 2.5 Coder`) to guarantee an answer for any question on any topic.

### 3. 🌐 Real-Time Web Search & Grounding
* **Live Knowledge Search**: Automatically searches the live web for current events, news, weather, and documentation, returning clickable domain source chips.

### 4. 🧠 Persistent Chat History & Session Manager
* **Multi-Thread Storage**: Saves all conversations, code snippets, and settings in local storage with `+ New Conversation` creation and thread search/deletion.

### 5. 💻 Interactive Code Execution Sandbox
* **In-Browser Code Runner**: Click **`▶ Run`** directly on streaming code blocks to execute JavaScript / Python logic in a sandbox and inspect live terminal outputs.

### 6. 🎙️ Bidirectional Voice Mode
* **Speech-to-Text & Speech Synthesis**: Real-time voice dictation in `PromptBar` combined with natural voice playback via Web Speech Synthesis.

### 7. 🧩 9 Connected UI Component Suite
* Includes `ThinkingState`, `ToolChips`, `StreamingText`, `CodeBlock`, `ApprovalCard`, `FilterTable`, `PromptBar`, `ChatComposer`, and `LoadingState`.

---

## 📁 Repository Directory Structure

```
c:\Projects\Jarvis\
├── electron/
│   ├── main.js                          # Native Electron BrowserWindow process
│   └── preload.js                       # Secure IPC context bridge
├── components/voice-orb/
│   ├── types.ts                         # OrbState, FrequencyData, and Palette interfaces
│   ├── OrbShader.ts                     # GLSL Simplex Noise, Fresnel Rim Lighting, Volumetric Shaders
│   ├── useAudioAnalyzer.ts              # Web Audio API AnalyserNode Hook (Bass, Mid, High frequency extraction)
│   ├── ParticleField.tsx                # 3D Orbital particle shell surrounding the AI core
│   ├── OrbMesh.tsx                      # High-resolution procedural sphere & GLSL material drive
│   ├── OrbScene.tsx                     # R3F Canvas, Camera breathing rig, Point lights & Bloom
│   └── VoiceReactiveOrb.tsx             # Master client component with minimal sci-fi UI controls
├── app/
│   ├── layout.tsx                       # Next.js RootLayout with Next font optimization
│   ├── globals.css                      # Design tokens, keyframes, 0px sharp corner rules
│   ├── page.tsx                         # Master Workspace Page with Framer Motion animations
│   └── api/chat/route.ts                # OpenRouter API multi-model cascade route
├── lib/
│   └── chatStore.ts                     # Persistent local chat thread history manager
├── .env.local                           # Local environment secrets (OpenRouter API key)
├── .gitignore                           # Git ignore rules protecting API keys and builds
├── start-jarvis-gui.bat                 # 1-Click native GUI desktop app launcher
├── package.json                         # Dependencies & Electron desktop launcher scripts
├── next.config.mjs                      # Next.js build configuration
├── tsconfig.json                        # TypeScript App Router path configuration
├── tailwind.config.js                   # Tailwind CSS configuration for app/ and Jarvis/components/
└── Jarvis/components/                   # The 9 React TSX Component Modules
```

---

## 🚀 Setup & Launch Guide

### 1. Clone the Repository
```bash
git clone https://github.com/praveeneyyy/Jarvis-Ai.git
cd Jarvis-Ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key
Create `.env.local` in the root folder:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
> *Note: Get a free API key at [openrouter.ai](https://openrouter.ai/). `.env.local` is listed in `.gitignore` and is never pushed to public repositories.*

### 4. Launch Standalone Desktop App
```bash
.\start-jarvis-gui.bat
# OR
npm run app
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
