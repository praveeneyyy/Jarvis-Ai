"use client";

import { motion } from "framer-motion";

export default function AIOrb({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ambient orange glow halo - Sharp Square */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute size-40 rounded-none bg-gradient-to-r from-orange-600/40 via-amber-500/35 to-orange-500/40 blur-3xl pointer-events-none"
      />

      {/* Outer glowing specular aura - Sharp Square */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute size-32 rounded-none bg-gradient-to-tr from-orange-500/30 via-yellow-400/25 to-amber-600/30 blur-md pointer-events-none"
      />

      {/* Core Glossy 3D Iridescent Fire Cube with Sharp Corners */}
      <motion.div
        animate={{
          y: [-4, 4, -4],
          rotate: [0, 6, -6, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative size-20 rounded-none shadow-2xl shadow-orange-950/80 overflow-hidden flex items-center justify-center border border-orange-400/40"
        style={{
          background: `
            radial-gradient(circle at 35% 25%, 
              rgba(255, 245, 230, 0.95) 0%, 
              rgba(255, 180, 100, 0.9) 18%, 
              rgba(255, 107, 0, 0.95) 45%, 
              rgba(217, 70, 239, 0.6) 65%, 
              rgba(180, 40, 0, 0.95) 85%, 
              rgba(15, 10, 5, 1) 100%
            )
          `,
          boxShadow: `
            inset -5px -7px 14px rgba(10, 5, 0, 0.95),
            inset 4px 6px 14px rgba(255, 220, 180, 0.9),
            0 12px 35px rgba(255, 107, 0, 0.5)
          `,
        }}
      >
        {/* Specular Highlight Arc */}
        <div className="absolute top-1.5 left-2 size-8 rounded-none bg-gradient-to-br from-white/95 to-transparent blur-[1px] transform -rotate-45 pointer-events-none" />

        {/* Internal Refraction Core */}
        <div className="absolute bottom-2 right-2 size-7 rounded-none bg-yellow-300/60 blur-sm pointer-events-none" />
      </motion.div>
    </div>
  );
}
