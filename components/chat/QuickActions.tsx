"use client";

import { motion } from "framer-motion";
import { Sparkles, Lightbulb, CheckCircle2 } from "lucide-react";

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickActions({ onSelect }: QuickActionsProps) {
  const cards = [
    {
      icon: Sparkles,
      title: "Synthesize Data",
      description: "Summarize metrics, logs, or codebase diffs",
      prompt: "Synthesize data and provide key insights on performance logs",
    },
    {
      icon: Lightbulb,
      title: "Creative Brainstorm",
      description: "Explore new features or system architecture",
      prompt: "Brainstorm high-impact features for modern AI developer toolkits",
    },
    {
      icon: CheckCircle2,
      title: "Check Facts",
      description: "Verify technical specs or API compatibility",
      prompt: "Check facts and validate TypeScript interface compatibility",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 w-full max-w-2xl">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.button
            key={card.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.2 }}
            whileHover={{ y: -1.5 }}
            onClick={() => onSelect(card.prompt)}
            className="group flex flex-col items-start p-3 text-left rounded-lg border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md hover:border-violet-500/40 hover:bg-zinc-800/50 shadow-sm transition-all duration-200"
          >
            <div className="mb-2 flex size-6 items-center justify-center rounded-md bg-zinc-800/80 text-zinc-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
              <Icon className="size-3.5" />
            </div>
            <span className="text-[12px] font-medium text-zinc-200 group-hover:text-violet-300 transition-colors">
              {card.title}
            </span>
            <span className="mt-0.5 text-[10.5px] text-zinc-500 line-clamp-2 leading-snug">
              {card.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
