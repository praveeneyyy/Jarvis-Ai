"use client";

import { motion } from "framer-motion";

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickActions({ onSelect }: QuickActionsProps) {
  const cards = [
    {
      title: "Smart Budget",
      description: "A budget that fits your lifestyle, not the other way around",
      prompt: "Help me set up a smart budget tailored to my monthly lifestyle and goals.",
    },
    {
      title: "Analytics",
      description: "Analytics empowers individuals and businesses to make smarter",
      prompt: "Generate an analytics overview to help make smarter decisions.",
    },
    {
      title: "Spending",
      description: "Spending is the way individuals and businesses use their financial",
      prompt: "Break down spending habits and offer financial optimization advice.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full max-w-3xl">
      {cards.map((card, i) => (
        <motion.button
          key={card.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * i, duration: 0.2 }}
          whileHover={{ y: -2 }}
          onClick={() => onSelect(card.prompt)}
          className="group flex flex-col items-start p-4 text-left rounded-none border border-orange-500/20 bg-[#121216]/80 backdrop-blur-md hover:border-orange-500/60 hover:bg-[#181820] shadow-lg transition-all duration-200"
        >
          <span className="text-[13px] font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors">
            {card.title}
          </span>
          <span className="mt-1.5 text-[11px] text-zinc-400 leading-snug font-normal group-hover:text-zinc-300 transition-colors">
            {card.description}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
