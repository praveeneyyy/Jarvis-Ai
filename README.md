# JARVIS AI — Clean Next.js 14 Engineering Workspace

![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-violet.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)

**JARVIS AI** is an autonomous engineering workspace built on **Next.js 14 (App Router)** with **Framer Motion** for smooth layout transitions, sharp 0px industrial design, and real-time component streaming.

---

## 📁 Streamlined Next.js Project Structure

```
c:\Projects\Jarvis\
├── app/
│   ├── layout.tsx                       (RootLayout with Space Grotesk & IBM Plex Mono Next fonts)
│   ├── globals.css                      (Design tokens, keyframes, 0px sharp corner rules)
│   └── page.tsx                         (Next.js App Router Page with Framer Motion animations)
├── package.json                         (Next.js 14, Framer Motion, Lucide React dependencies)
├── next.config.mjs                      (Next.js SWC build configuration)
├── tsconfig.json                        (TypeScript App Router paths setup)
├── tailwind.config.js                   (Tailwind theme for Next.js app directory)
└── Jarvis/components/                   (Complete 9-Component Suite with "use client")
    ├── LoadingState.tsx
    ├── ThinkingState.tsx
    ├── StreamingText.tsx
    ├── ApprovalCard.tsx
    ├── CodeBlock.tsx
    ├── FilterTable.tsx
    ├── PromptBar.tsx
    ├── ChatComposer.tsx
    └── ToolChips.tsx
```

---

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Next.js App**:
   ```bash
   npm run dev
   ```

Open **`http://localhost:3000`** in your browser!
