# ✦ JARVIS AI — Next.js 14 Engineering Workspace & Component Suite

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-violet.svg?style=for-the-badge)](https://www.framer.com/motion/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter_API-Multi--Model-orange.svg?style=for-the-badge)](https://openrouter.ai/)

**JARVIS AI** is an autonomous product engineering intelligence workspace built on **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. It features an industrial 0px sharp technical aesthetic, real-time AI prompt completions powered by OpenRouter, and a suite of 9 connected UI widgets.

---

## 🌟 Key Features

* **Next.js 14 App Router Architecture**: Server-Side Rendering (SSR), API routes, and optimized font loading using `Space Grotesk` & `IBM Plex Mono`.
* **Multi-Model OpenRouter Cascade**: Intelligent failover system routing queries across `Llama 3.3 70B`, `Gemini 2.0 Flash`, `DeepSeek R1`, `Mistral 7B`, and `Qwen 2.5 Coder` to guarantee answers for any question.
* **9 Interactive UI Components**: Full component suite with `"use client"` directives for real-time trace inspection, streaming, code viewing, and human approvals.
* **Framer Motion Layout Animations**: Smooth spring animations for artifact drawers, model selectors, and workspace tab transitions.
* **Industrial Precision Design**: Minimalist monochrome styling with zero border-radius (`0px` sharp corners), high-contrast tabular monospaced typography, and terracotta accents (`#da7756`).

---

## 🧩 9-Component Architecture Overview

| # | Component | Location | Description |
|---|---|---|---|
| 1 | **`ThinkingState`** | `Jarvis/components/ThinkingState.tsx` | Expandable step-by-step reasoning trace (`Steps`, `Reasoning`, `Search`, `Coding`). |
| 2 | **`ToolChips`** | `Jarvis/components/ToolChips.tsx` | Compact tool execution trace with collapsible sub-lines and file diff chips (`+74 -41`). |
| 3 | **`StreamingText`** | `Jarvis/components/StreamingText.tsx` | Blur text streaming with inline citations, sources drawer, and follow-up prompt chips. |
| 4 | **`CodeBlock`** | `Jarvis/components/CodeBlock.tsx` | Syntax-highlighted streaming code viewer with a live clipboard copy button. |
| 5 | **`ApprovalCard`** | `Jarvis/components/ApprovalCard.tsx` | Human-in-the-loop multi-step approval questionnaire wizard for system actions. |
| 6 | **`FilterTable`** | `Jarvis/components/FilterTable.tsx` | Status filter chips (`All`, `To do`, `In Progress`, `Completed`) with dynamic table filter. |
| 7 | **`PromptBar`** | `Jarvis/components/PromptBar.tsx` | Composer bar with `@` data sources popup, `/` slash commands menu, model selector, voice dictation, and attachments. |
| 8 | **`ChatComposer`** | `Jarvis/components/ChatComposer.tsx` | Interactive tabbed panel (`Flavors` / `Suppliers`) with sectioned replies. |
| 9 | **`LoadingState`** | `Jarvis/components/LoadingState.tsx` | Shimmer pixel-grid loader (`Drive`, `Dots`, `Orbit`) with live tabular timer. |

---

## 📁 Repository Structure

```
c:\Projects\Jarvis\
├── app/
│   ├── layout.tsx                       # Next.js RootLayout with Next font optimization
│   ├── globals.css                      # Design tokens, keyframes, 0px sharp corner rules
│   ├── page.tsx                         # Master Workspace Page with Framer Motion animations
│   └── api/chat/route.ts                # OpenRouter API multi-model cascade route
├── .env.local                           # Local environment secrets (OpenRouter API key)
├── .gitignore                           # Git ignore rules protecting API keys and builds
├── package.json                         # Dependencies & Next.js scripts
├── next.config.mjs                      # Next.js build configuration
├── tsconfig.json                        # TypeScript App Router path configuration (@/, @components/)
├── tailwind.config.js                   # Tailwind CSS configuration for app/ and Jarvis/components/
└── Jarvis/components/                   # The 9 React TSX Component Modules
```

---

## ⚙️ Step-by-Step Setup & Installation Guide

### Prerequisites
* **Node.js**: v18.17.0 or higher installed.
* **Git**: Installed on your operating system.

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
Create a `.env.local` file in the root directory of the project:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
> *Note: You can get a 100% free OpenRouter API key at [openrouter.ai](https://openrouter.ai/). `.env.local` is listed in `.gitignore` and will never be pushed to public repositories.*

### 4. Start the Next.js Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your web browser to interact with the application.

---

## 💻 Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
