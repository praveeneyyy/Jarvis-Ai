"use client";

import { motion } from "framer-motion";

export default function AIOrb({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ambient blur aura */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute size-24 rounded-full bg-violet-600/25 blur-2xl pointer-events-none"
      />

      {/* Middle sleek gradient ring */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute size-16 rounded-full bg-gradient-to-tr from-violet-600/30 via-purple-500/20 to-indigo-600/30 blur-sm"
      />

      {/* Core sleek glossy orb */}
      <motion.div
        animate={{
          y: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative size-11 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-zinc-900 border border-violet-400/30 shadow-lg shadow-violet-500/20 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute -top-1 -left-1 size-5 rounded-full bg-white/30 blur-[2px]" />
        <div className="size-2 rounded-full bg-violet-200/90 shadow-sm shadow-violet-300" />
      </motion.div>
    </div>
  );
}
