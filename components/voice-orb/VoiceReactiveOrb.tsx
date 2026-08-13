"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioAnalyzer } from "./useAudioAnalyzer";
import { OrbScene } from "./OrbScene";
import { OrbState, VoiceReactiveOrbProps } from "./types";
import { Mic, MicOff, AlertTriangle, Sparkles, Activity } from "lucide-react";

export function VoiceReactiveOrbInternal({
  state: externalState,
  inputVolume = 0,
  outputVolume = 0,
  colors,
  onStateChange,
  className = "",
}: VoiceReactiveOrbProps) {
  const [internalState, setInternalState] = useState<OrbState>("idle");
  const currentState = externalState || internalState;

  const {
    audioRef,
    isListening,
    permissionDenied,
    isSupported,
    startListening,
    stopListening,
  } = useAudioAnalyzer(outputVolume);

  const setOrbState = useCallback(
    (newState: OrbState) => {
      setInternalState(newState);
      if (onStateChange) onStateChange(newState);
    },
    [onStateChange]
  );

  const toggleVoice = async () => {
    if (isListening) {
      stopListening();
      setOrbState("idle");
    } else {
      const success = await startListening();
      if (success) {
        setOrbState("listening");
      }
    }
  };

  // Sync state transitions if external state is provided
  useEffect(() => {
    if (externalState) {
      setInternalState(externalState);
    }
  }, [externalState]);

  const stateLabels: Record<OrbState, string> = {
    idle: "Click to speak",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 bg-[#121210] border border-[#33332d] text-[#eaeae2] font-sans selection:bg-[#da7756]/30 overflow-hidden ${className}`}>
      
      {/* Top Status Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-[#75756d] z-10">
        <div className="flex items-center gap-2 text-[#da7756]">
          <span className={`size-2 ${isListening ? "bg-[#da7756] animate-ping" : "bg-[#44443c]"}`} />
          <span className="font-bold tracking-wider">[JARVIS NEURAL CORE]</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px]">
          <Activity className="size-3 text-[#da7756]" />
          <span>{currentState.toUpperCase()}</span>
        </div>
      </div>

      {/* 3D Scene Wrapper */}
      <div className="relative h-[420px] w-full max-w-[600px] flex items-center justify-center">
        <OrbScene
          state={currentState}
          audioRef={audioRef}
          colors={colors}
          onClick={toggleVoice}
        />
      </div>

      {/* Futuristic Minimal Control Dashboard */}
      <div className="mt-2 flex flex-col items-center gap-3 z-10 font-mono">
        {/* Main Interactive Action Button */}
        <button
          type="button"
          onClick={toggleVoice}
          aria-label={stateLabels[currentState]}
          className={`flex items-center gap-2.5 px-5 py-2 text-[12px] font-bold tracking-wider transition-all duration-200 border shadow-lg ${
            isListening
              ? "bg-[#da7756] text-[#121210] border-[#da7756] hover:bg-[#e28464] animate-pulse"
              : "bg-[#1e1e1b] text-[#eaeae2] border-[#3a3a32] hover:bg-[#282824] hover:border-[#da7756]"
          }`}
        >
          {isListening ? (
            <>
              <Mic className="size-4 animate-bounce" />
              <span>{stateLabels[currentState].toUpperCase()}</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-[#da7756]" />
              <span>{stateLabels[currentState].toUpperCase()}</span>
            </>
          )}
        </button>

        {/* Microphone Active Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-[#88887f]">
          <span className={`size-1.5 rounded-full ${isListening ? "bg-emerald-400 animate-pulse" : "bg-[#44443c]"}`} />
          <span>{isListening ? "● microphone active" : "● click orb or button to activate voice core"}</span>
        </div>

        {/* Permission / Support Error Alerts */}
        <AnimatePresence>
          {permissionDenied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-2 flex items-center gap-2 border border-red-500/50 bg-red-950/30 px-3 py-1.5 text-[11px] text-red-300"
            >
              <AlertTriangle className="size-3.5 text-red-400" />
              <span>Microphone access denied. Please grant permission in your browser.</span>
            </motion.div>
          )}
          {!isSupported && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-2 flex items-center gap-2 border border-amber-500/50 bg-amber-950/30 px-3 py-1.5 text-[11px] text-amber-300"
            >
              <AlertTriangle className="size-3.5 text-amber-400" />
              <span>Web Audio API is not supported in this browser environment.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// Next.js Dynamic Client Export to prevent SSR hydration mismatches
export default function VoiceReactiveOrb(props: VoiceReactiveOrbProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[480px] w-full items-center justify-center bg-[#121210] border border-[#33332d] font-mono text-[12px] text-[#da7756]">
        [INITIALIZING 3D AI ORB CORE...]
      </div>
    );
  }

  return <VoiceReactiveOrbInternal {...props} />;
}
