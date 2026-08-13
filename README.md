# ✦ JARVIS AI — Complete Setup & Architecture Guide (From Scratch)

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-29.1-47848f.svg?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.161-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8.15-black.svg?style=for-the-badge)](https://docs.pmnd.rs/react-three-fiber)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-violet.svg?style=for-the-badge)](https://www.framer.com/motion/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter_API-Multi--Model-orange.svg?style=for-the-badge)](https://openrouter.ai/)

**JARVIS AI** is an autonomous engineering platform packaged as a **native standalone desktop application** and **web application**. It features a **3D Voice-Reactive AI Orb Core**, **OpenRouter Multi-Model Cascade**, **Real-Time Web Search Grounding**, **Persistent Chat History**, and **In-Browser Code Execution**.

---

## 📋 Table of Contents
1. [Tech Stack Overview](#-tech-stack-overview)
2. [Step-by-Step Setup from Scratch](#-step-by-step-setup-from-scratch)
   * [Step 1: System Prerequisites](#step-1-system-prerequisites)
   * [Step 2: Clone the Repository](#step-2-clone-the-repository)
   * [Step 3: Install Dependencies](#step-3-install-dependencies)
   * [Step 4: Configure OpenRouter API Key](#step-4-configure-openrouter-api-key)
   * [Step 5: Launch the Application](#step-5-launch-the-application)
3. [Core Feature Breakdown](#-core-feature-breakdown)
   * [1. 3D Voice-Reactive AI Orb Core](#1-3d-voice-reactive-ai-orb-core)
   * [2. OpenRouter Multi-Model Cascade](#2-openrouter-multi-model-cascade)
   * [3. Real-Time Web Search & Grounding](#3-real-time-web-search--grounding)
   * [4. Persistent Chat History](#4-persistent-chat-history)
   * [5. Live In-Browser Code Execution](#5-live-in-browser-code-execution)
   * [6. Bidirectional Voice Mode](#6-bidirectional-voice-mode)
   * [7. 9-Widget Component Suite](#7-9-widget-component-suite)
4. [Complete Project Folder Map](#-complete-project-folder-map)
5. [Troubleshooting & Common Fixes](#-troubleshooting--common-fixes)

---

## 🛠 Tech Stack Overview

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server-Side Rendering (SSR), API routing, font optimization |
| **Desktop Windowing** | Electron 29 | Native standalone desktop application windowing |
| **3D Rendering** | Three.js & React Three Fiber | Real-time 3D WebGL scene rendering & animation loops |
| **GLSL Shading** | Custom Shaders & Drei | 3D Simplex Noise vertex displacement, Fresnel rim lighting, Bloom |
| **Audio Processing** | Web Audio API (AnalyserNode) | Multi-band frequency extraction (Bass, Mid, High) & lerp smoothing |
| **Language** | TypeScript 5.3 | Strict type checking & modular interfaces |
| **Styling** | Tailwind CSS & Space Grotesk | Industrial 0px sharp corner aesthetic & monospaced typography |
| **Animations** | Framer Motion | Fluid UI transitions, drawer sliding, tab spring physics |
| **AI Engine** | OpenRouter API | Cascade across Llama 3.3 70B, Gemini 2.0 Flash, DeepSeek R1, Mistral 7B |

---

## 🚀 Step-by-Step Setup from Scratch

### Step 1: System Prerequisites
Before starting, ensure your system has:
* **Node.js**: v18.17.0 or higher ([Download Node.js](https://nodejs.org/))
* **Git**: Version control CLI ([Download Git](https://git-scm.com/))
* **PowerShell or Terminal**: Default terminal on Windows, macOS, or Linux.

Check your versions in terminal:
```bash
node -v
npm -v
git --version
```

---

### Step 2: Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/praveeneyyy/Jarvis-Ai.git
cd Jarvis-Ai
```

---

### Step 3: Install Dependencies
Install all required Node.js packages:
```bash
npm install
```

---

### Step 4: Configure OpenRouter API Key
1. Get a **100% Free** API key from **[openrouter.ai](https://openrouter.ai/)**.
2. Create a file named **`.env.local`** in the root directory of your project:

```env
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key_here
```

> **Security Note**: `.env.local` is listed in `.gitignore` to keep your secret API key safe. Never commit `.env.local` to public repositories.

---

### Step 5: Launch the Application

#### Option A: 1-Click Native Desktop Application Window (Recommended)
On Windows, double-click **`start-jarvis-gui.bat`**, or run:
```powershell
.\start-jarvis-gui.bat
```
Or run via npm:
```powershell
npm run app
```
*(This starts the backend server and opens a dedicated 1280x820 native desktop app window!)*

#### Option B: Browser Web Mode
To run in standard web browser mode:
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌟 Core Feature Breakdown

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

### 1. 3D Voice-Reactive AI Orb Core
* **Location**: `components/voice-orb/`
* **Frequency Decomposition**:
  * **Bass (0–250 Hz)**: Drives volumetric scale expansion and macro organic deformation.
  * **Mid (250–2000 Hz)**: Drives surface wave ripples and fluid noise displacement.
  * **High (2000–8000 Hz)**: Drives micro-surface details and particle field velocity.
  * **Overall RMS**: Modulates emissive GLSL glow and postprocessing bloom intensity.
* **Visual States**:
  * `IDLE`: Calm organic breathing, low glow, minimal particle drift.
  * `LISTENING`: Real-time microphone audio pulses and expanding radius.
  * `THINKING`: Swirling cyan/violet energy processing animation.
  * `SPEAKING`: High-energy AI output amplitude plasma response.

---

### 2. OpenRouter Multi-Model Cascade
* **Location**: `app/api/chat/route.ts`
* Automatically routes prompts across 5 AI models:
  1. `meta-llama/llama-3.3-70b-instruct:free`
  2. `google/gemini-2.0-flash-lite-preview-02-05:free`
  3. `deepseek/deepseek-r1:free`
  4. `mistralai/mistral-7b-instruct:free`
  5. `qwen/qwen-2.5-coder-32b-instruct:free`
* Guarantees 100% answer delivery even if one model is busy.

---

### 3. Real-Time Web Search & Grounding
* **Location**: `app/api/chat/route.ts`
* Automatically detects queries about current news, weather, stocks, or documentation.
* Performs live web search via DuckDuckGo and displays clickable source cards.

---

### 4. Persistent Chat History
* **Location**: `lib/chatStore.ts`
* Saves all conversation threads in local storage / IndexedDB.
* Includes `+ New Conversation` creation, thread switching, and 1-click thread deletion.

---

### 5. Live In-Browser Code Execution
* **Location**: `Jarvis/components/CodeBlock.tsx`
* Click **`▶ Run`** on any code snippet to execute JavaScript / Python logic in a sandbox and view terminal output.

---

### 6. Bidirectional Voice Mode
* Dictate prompts by clicking `🎙` in `PromptBar.tsx`.
* Enable output voice playback (`🔊`) for natural speech synthesis.

---

### 7. 9-Widget Component Suite
* Located in `Jarvis/components/`:
  1. `ThinkingState.tsx` — Expandable agent reasoning trace (`Steps`, `Reasoning`, `Search`, `Coding`)
  2. `ToolChips.tsx` — Collapsible tool execution lines and file diff chips (`+74 -41`)
  3. `StreamingText.tsx` — Word-by-word blur streaming with citations
  4. `CodeBlock.tsx` — Code streaming with live runner & copy button
  5. `ApprovalCard.tsx` — Interactive human approval wizard
  6. `FilterTable.tsx` — Task status filter chips (`All`, `To do`, `In Progress`, `Completed`)
  7. `PromptBar.tsx` — Prompt bar composer with `@` sources, `/` commands, dictation, and attachments
  8. `ChatComposer.tsx` — Tabbed conversation panel (`Flavors` / `Suppliers`)
  9. `LoadingState.tsx` — Shimmer pixel-grid loader (`Drive`, `Dots`, `Orbit`)

---

## 📁 Complete Project Folder Map

```
c:\Projects\Jarvis\
├── electron/                            # Native Electron Window Configuration
│   ├── main.js                          # Main Electron BrowserWindow process
│   └── preload.js                       # Secure IPC context bridge
├── components/voice-orb/                # 3D Voice-Reactive AI Orb Engine
│   ├── types.ts                         # OrbState, FrequencyData, and Palette interfaces
│   ├── OrbShader.ts                     # GLSL Simplex Noise, Fresnel Rim Lighting, Volumetric Shaders
│   ├── useAudioAnalyzer.ts              # Web Audio API AnalyserNode Hook
│   ├── ParticleField.tsx                # 3D Orbital particle shell
│   ├── OrbMesh.tsx                      # High-resolution sphere geometry & shader material
│   ├── OrbScene.tsx                     # R3F Canvas, Camera breathing rig, Point lights & Bloom
│   └── VoiceReactiveOrb.tsx             # Master client component with minimal sci-fi controls
├── app/                                 # Next.js 14 App Router Directory
│   ├── layout.tsx                       # RootLayout with Space Grotesk & IBM Plex Mono Next fonts
│   ├── globals.css                      # Design tokens, keyframes, 0px sharp corner rules
│   ├── page.tsx                         # Master Workspace Page with Framer Motion animations
│   └── api/chat/route.ts                # OpenRouter API multi-model cascade route
├── lib/                                 # Helper Libraries & Storage
│   └── chatStore.ts                     # Persistent chat thread history store
├── Jarvis/components/                   # 9 Interactive UI Component Suite
│   ├── ThinkingState.tsx
│   ├── ToolChips.tsx
│   ├── StreamingText.tsx
│   ├── CodeBlock.tsx
│   ├── ApprovalCard.tsx
│   ├── FilterTable.tsx
│   ├── PromptBar.tsx
│   ├── ChatComposer.tsx
│   └── LoadingState.tsx
├── .env.local                           # Local environment secrets (OpenRouter API key)
├── .gitignore                           # Git ignore rules protecting API keys and builds
├── start-jarvis-gui.bat                 # 1-Click native GUI desktop app launcher
├── package.json                         # Dependencies & Electron desktop launcher scripts
├── next.config.mjs                      # Next.js build configuration
├── tsconfig.json                        # TypeScript App Router path configuration
└── tailwind.config.js                   # Tailwind CSS configuration
```

---

## 🔧 Troubleshooting & Common Fixes

### 1. `Notice: OPENROUTER_API_KEY is not set in .env.local`
* **Fix**: Ensure `.env.local` exists in the root folder containing `OPENROUTER_API_KEY=sk-or-v1-...`. Restart the dev server (`npm run dev`).

### 2. Microphone Access Denied in 3D Orb
* **Fix**: Ensure your OS and browser allow microphone permissions. Click `Allow` when prompted for microphone access.

### 3. GitHub Push Rejected (`Push cannot contain secrets`)
* **Fix**: Never commit raw API keys inside source code files. Keep keys exclusively in `.env.local` (which is ignored by `.gitignore`).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
