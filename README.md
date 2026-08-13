# ✦ JARVIS AI — Native Standalone Desktop GUI & Engineering Workspace

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-29.1-47848f.svg?style=for-the-badge&logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-violet.svg?style=for-the-badge)](https://www.framer.com/motion/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter_API-Multi--Model-orange.svg?style=for-the-badge)](https://openrouter.ai/)

**JARVIS AI** is packaged as a **native standalone desktop GUI application window** powered by **Electron 29**, **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. It launches as a dedicated desktop app window on Windows, macOS, and Linux without requiring a separate web browser.

---

## 🖥️ How to Launch the Standalone Desktop GUI Application

### Method 1: 1-Click Batch Launcher (Windows)
Double-click **`start-jarvis-gui.bat`** in the project folder, or run:
```powershell
.\start-jarvis-gui.bat
```

### Method 2: NPM Terminal Command
Run any of the following commands in your PowerShell terminal:
```powershell
npm run app
# OR
npm run gui
# OR
npm run desktop
```
> *This automatically initializes the background server and pops up the native desktop app window!*

---

## 🌟 Desktop App Features

* **Dedicated Standalone GUI Window**: Native desktop application window (1280x820) with custom window controls and background color `#121210`.
* **Multi-Model OpenRouter Cascade**: Answers any question on any topic using real-time AI API completions (`Llama 3.3 70B`, `Gemini 2.0 Flash`, `DeepSeek R1`, `Mistral 7B`).
* **9 Connected UI Modules**:
  1. `ThinkingState` — Expandable agent reasoning trace (`Steps`, `Reasoning`, `Search`, `Coding`)
  2. `ToolChips` — Collapsible tool execution lines and file diff chips (`+74 -41`)
  3. `StreamingText` — Word-by-word blur streaming with citations and sources drawer
  4. `CodeBlock` — Syntax code streaming with live Copy button
  5. `ApprovalCard` — Interactive human approval wizard for system operations
  6. `FilterTable` — Task status filter chips (`All`, `To do`, `In Progress`, `Completed`) with dynamic table filter
  7. `PromptBar` — Interactive prompt bar composer with `@` data sources, `/` commands, dictation, and attachments
  8. `ChatComposer` — Tabbed conversation panel (`Flavors` / `Suppliers`) with sectioned replies
  9. `LoadingState` — Shimmer pixel-grid loader (`Drive`, `Dots`, `Orbit`) with live timer
* **Framer Motion Layout Animations**: Smooth spring animations for artifact drawers, model selectors, and workspace tabs.
* **Industrial 0px Sharp Aesthetics**: Space Grotesk + IBM Plex Mono fonts with zero border-radius.

---

## 📁 Repository Structure

```
c:\Projects\Jarvis\
├── electron/
│   ├── main.js                          # Native Electron BrowserWindow process
│   └── preload.js                       # Secure IPC context bridge
├── app/
│   ├── layout.tsx                       # Next.js RootLayout with Next font optimization
│   ├── globals.css                      # Design tokens, keyframes, 0px sharp corner rules
│   ├── page.tsx                         # Master Workspace Page with Framer Motion animations
│   └── api/chat/route.ts                # OpenRouter API multi-model cascade route
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

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
Create or verify `.env.local`:
```env
OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Launch Standalone GUI App
```bash
npm run app
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
