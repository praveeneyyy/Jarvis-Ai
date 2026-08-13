"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingState from "@/Jarvis/components/LoadingState";
import ThinkingState from "@/Jarvis/components/ThinkingState";
import StreamingText from "@/Jarvis/components/StreamingText";
import ApprovalCard from "@/Jarvis/components/ApprovalCard";
import CodeBlock from "@/Jarvis/components/CodeBlock";
import FilterTable from "@/Jarvis/components/FilterTable";
import PromptBar from "@/Jarvis/components/PromptBar";
import ChatComposer from "@/Jarvis/components/ChatComposer";
import ToolChips from "@/Jarvis/components/ToolChips";
import { 
  getSavedThreads, 
  saveThread, 
  deleteThread, 
  type ChatThread, 
  type ChatMessage 
} from "@/lib/chatStore";
import { 
  ChevronDown, 
  Layers, 
  Cpu, 
  Check, 
  FileText, 
  PanelRightClose, 
  PanelRightOpen, 
  Zap, 
import VoiceReactiveOrb from "@/components/voice-orb/VoiceReactiveOrb";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Globe,
  CircleDot
} from "lucide-react";

export default function NextJsJarvisApp() {
  const [activeTab, setActiveTab] = useState<"chat" | "orb" | "studio" | "diagnostics">("chat");
  const [activeModel, setActiveModel] = useState("Next.js 14 Engine (App Router)");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [thinkingVariant, setThinkingVariant] = useState<"Steps" | "Reasoning" | "Search" | "Coding">("Search");
  const [isLoading, setIsLoading] = useState(false);
  const [showApproval, setShowApproval] = useState(true);
  const [artifactOpen, setArtifactOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Step 2 & 3: Chat History & Voice TTS states
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Load saved threads on client mount
  useEffect(() => {
    const saved = getSavedThreads();
    setThreads(saved);
    if (saved.length > 0) {
      setCurrentThread(saved[0]);
    } else {
      startNewChat();
    }
  }, []);

  const models = [
    { name: "Next.js 14 Engine (App Router)", desc: "Framer Motion animated streaming engine", tag: "Fast" },
    { name: "Sprinkles 5 (Flagship)", desc: "Deep architectural synthesis & multi-tool orchestration", tag: "Heavy" },
    { name: "Vanilla 1 (Light)", desc: "Ultra-low latency streaming for rapid query processing", tag: "Light" },
  ];

  const startNewChat = () => {
    const newT: ChatThread = {
      id: "thread_" + Date.now(),
      title: "New Conversation",
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    };
    setCurrentThread(newT);
  };

  const handlePromptSubmit = async (text: string, modelName: string, attachments: string[] = []) => {
    if (!text.trim() && attachments.length === 0) return;

    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: text + (attachments.length > 0 ? ` [Attachments: ${attachments.join(", ")}]` : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let activeT = currentThread || {
      id: "thread_" + Date.now(),
      title: text.slice(0, 30) || "Conversation",
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    };

    if (activeT.messages.length === 0) {
      activeT.title = text.slice(0, 28) || "Query Thread";
    }

    activeT.messages.push(userMsg);
    setCurrentThread({ ...activeT });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, model: modelName })
      });
      const data = await res.json();
      const botAnswer = data.answer || "JARVIS AI: Answer synthesized successfully.";

      const botMsg: ChatMessage = {
        id: "msg_" + (Date.now() + 1),
        sender: "jarvis",
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || modelName,
        sources: data.sources || []
      };

      activeT.messages.push(botMsg);
      const updatedList = saveThread(activeT);
      setThreads(updatedList);
      setCurrentThread({ ...activeT });

      // Step 3 Voice Output Synthesis
      if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(botAnswer.slice(0, 250));
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteThread(id);
    setThreads(updated);
    if (currentThread?.id === id) {
      if (updated.length > 0) setCurrentThread(updated[0]);
      else startNewChat();
    }
  };

  const triggerProcessingDemo = () => {
    handlePromptSubmit("What are the key features of quantum computing?", activeModel);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#121210] text-[#eaeae2] font-sans">
      {/* ── Next.js Header Navigation ─────────────────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#33332d] bg-[#1a1a17] px-4 font-mono text-[12px] z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle Sidebar History"
            className="flex size-7 items-center justify-center bg-[#242420] text-[#a8a89f] border border-[#3a3a32] hover:text-white"
          >
            <MessageSquare className="size-3.5" />
          </button>
          <div className="flex size-7 items-center justify-center bg-[#da7756] text-[#121210] font-bold">
            NEXT
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setModelDropdownOpen((v) => !v)}
              className="flex items-center gap-2 bg-[#242420] px-3 py-1 text-[12px] font-medium text-[#eaeae2] border border-[#3a3a32] hover:bg-[#2c2c28] transition-colors"
            >
              <span>{activeModel}</span>
              <ChevronDown className="size-3.5 text-[#a8a89f]" />
            </button>

            <AnimatePresence>
              {modelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-1 w-80 bg-[#1e1e1b] p-1 border border-[#3a3a32] shadow-2xl"
                >
                  {models.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setActiveModel(m.name);
                        setModelDropdownOpen(false);
                      }}
                      className={`flex w-full flex-col gap-0.5 p-2 text-left transition-colors ${
                        activeModel === m.name ? "bg-[#da7756]/20 text-[#fff] border-l-2 border-[#da7756]" : "hover:bg-[#282824] text-[#a8a89f]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#eaeae2]">{m.name}</span>
                        {activeModel === m.name && <Check className="size-3.5 text-[#da7756]" />}
                      </div>
                      <span className="text-[11px] text-[#75756d] font-sans">{m.desc}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border border-[#33332d] bg-[#141412]">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1 text-[11.5px] font-medium transition-colors ${
              activeTab === "chat" ? "bg-[#da7756] text-[#121210] font-semibold" : "text-[#88887f] hover:text-[#eaeae2]"
            }`}
          >
            NEXT SYSTEM FEED
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orb")}
            className={`px-3 py-1 text-[11.5px] font-medium transition-colors border-l border-[#33332d] flex items-center gap-1.5 ${
              activeTab === "orb" ? "bg-[#da7756] text-[#121210] font-semibold" : "text-[#88887f] hover:text-[#eaeae2]"
            }`}
          >
            <CircleDot className="size-3 text-cyan-400" />
            3D AI ORB CORE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("studio")}
            className={`px-3 py-1 text-[11.5px] font-medium transition-colors border-l border-[#33332d] ${
              activeTab === "studio" ? "bg-[#da7756] text-[#121210] font-semibold" : "text-[#88887f] hover:text-[#eaeae2]"
            }`}
          >
            STUDIO (9 WIDGETS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("diagnostics")}
            className={`px-3 py-1 text-[11.5px] font-medium transition-colors border-l border-[#33332d] ${
              activeTab === "diagnostics" ? "bg-[#da7756] text-[#121210] font-semibold" : "text-[#88887f] hover:text-[#eaeae2]"
            }`}
          >
            DIAGNOSTICS
          </button>
        </div>

        {/* Right Actions & Voice Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVoiceEnabled((v) => !v)}
            title={voiceEnabled ? "Voice Output Active" : "Enable Voice Output"}
            className={`flex size-7 items-center justify-center border transition-colors ${
              voiceEnabled ? "bg-[#da7756] text-[#121210] border-[#da7756]" : "bg-[#242420] text-[#88887f] border-[#3a3a32] hover:text-white"
            }`}
          >
            {voiceEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
          </button>

          {isLoading && <LoadingState label="PROCESSING" variant="Drive" />}
          <button
            type="button"
            onClick={triggerProcessingDemo}
            className="flex items-center gap-1.5 bg-[#da7756] px-3 py-1 text-[11.5px] font-bold text-[#121210] hover:bg-[#e28464] active:translate-y-0.5 transition-all"
          >
            <Zap className="size-3 fill-current" />
            LIVE DEMO
          </button>
          <button
            type="button"
            onClick={() => setArtifactOpen((v) => !v)}
            title="Toggle Side Panel"
            className="flex size-7 items-center justify-center bg-[#242420] text-[#a8a89f] border border-[#3a3a32] hover:text-white"
          >
            {artifactOpen ? <PanelRightClose className="size-3.5" /> : <PanelRightOpen className="size-3.5" />}
          </button>
        </div>
      </header>

      {/* ── Main Split Technical Workspace ───────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Step 2: Left Persistent History Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-[#33332d] bg-[#161614] p-3 flex flex-col gap-3 font-mono text-[11px] shrink-0"
            >
              <button
                onClick={startNewChat}
                className="flex w-full items-center justify-center gap-2 bg-[#da7756] p-2 font-bold text-[#121210] hover:bg-[#e28464] transition-colors"
              >
                <Plus className="size-3.5" />
                NEW CONVERSATION
              </button>

              <span className="text-[10px] font-bold text-[#75756d] uppercase tracking-wider">
                [SAVED THREADS]
              </span>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setCurrentThread(t)}
                    className={`group flex items-center justify-between p-2 cursor-pointer border transition-colors ${
                      currentThread?.id === t.id
                        ? "bg-[#262622] border-[#da7756] text-white"
                        : "bg-[#1a1a17] border-[#2a2a24] text-[#88887f] hover:text-white hover:border-[#383830]"
                    }`}
                  >
                    <div className="min-w-0 flex-1 truncate pr-1">
                      <div className="truncate font-medium">{t.title}</div>
                      <div className="text-[9.5px] text-[#66665c]">{t.updatedAt}</div>
                    </div>
                    <button
                      onClick={(e) => removeThread(t.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-[#75756d] hover:text-red-400 p-1"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Feed Column */}
        <main className="flex flex-1 flex-col overflow-y-auto px-4 py-5 md:px-8">
          {activeTab === "chat" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32"
            >
              {/* Header Status Bar */}
              <div className="flex items-center justify-between border-b border-[#33332d] pb-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-[#da7756]">
                  <span className="size-2 bg-[#da7756] animate-pulse" />
                  <span>THREAD // {currentThread?.title || "SYSTEM FEED"}</span>
                </div>
                <div className="text-[#75756d]">
                  LIVE OPENROUTER GROUNDING ACTIVE
                </div>
              </div>

              {/* Dynamic Conversation Messages */}
              {currentThread?.messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border p-4 font-mono text-[12px] ${
                    m.sender === "user"
                      ? "border-[#da7756]/50 bg-[#1e1a17] text-[#fff]"
                      : "border-[#33332d] bg-[#1a1a17] text-[#eaeae2]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#2d2d27] pb-2 mb-2">
                    <span className="font-bold text-[#da7756]">
                      [{m.sender.toUpperCase()}] {m.timestamp}
                    </span>
                    {m.model && <span className="text-[10.5px] text-[#75756d]">{m.model}</span>}
                  </div>
                  <p className="font-sans text-[13.5px] leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>

                  {/* Step 1: Real-time Web Search Grounded Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 border-t border-[#2d2d27] pt-2 font-mono text-[11px]">
                      <span className="text-[#da7756] flex items-center gap-1 mb-1 font-bold">
                        <Globe className="size-3" /> Grounded Search Sources:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {m.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.href || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#242420] border border-[#383830] px-2 py-1 text-[10.5px] text-[#a8a89f] hover:text-white hover:border-[#da7756] transition-colors"
                          >
                            <span>{src.name}</span>
                            <span className="text-[#66665c]">({src.domain})</span>
                            <ExternalLink className="size-2.5 text-[#da7756]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* 1. Agent Trace (ThinkingState) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="border border-[#33332d] bg-[#1a1a17] p-4">
                <div className="mb-3 flex items-center justify-between border-b border-[#2d2d27] pb-2 font-mono text-[11px]">
                  <span className="font-bold text-[#da7756]">
                    [01] THINKINGSTATE // AGENT TRACE
                  </span>
                  <div className="flex gap-1">
                    {(["Steps", "Reasoning", "Search", "Coding"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setThinkingVariant(v)}
                        className={`px-2 py-0.5 font-mono text-[10.5px] uppercase transition-colors ${
                          thinkingVariant === v
                            ? "bg-[#da7756] text-[#121210] font-bold"
                            : "bg-[#242420] text-[#88887f] hover:text-white"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <ThinkingState key={thinkingVariant} variant={thinkingVariant} />
              </motion.div>

              {/* 2. Tool Execution (ToolChips) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="border border-[#33332d] bg-[#1a1a17] p-4">
                <span className="mb-3 block font-mono text-[11px] font-bold text-[#da7756]">
                  [02] TOOLCHIPS // TOOL EXECUTION & FILE DIFFS
                </span>
                <ToolChips />
              </motion.div>

              {/* 3. Response Stream (StreamingText) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="border border-[#33332d] bg-[#1a1a17] p-4">
                <span className="mb-3 block font-mono text-[11px] font-bold text-[#da7756]">
                  [03] STREAMINGTEXT // BLUR STREAM & CITATIONS
                </span>
                <StreamingText />
              </motion.div>

              {/* 4. Code Block */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-[#33332d] bg-[#1a1a17] p-4">
                <span className="mb-3 block font-mono text-[11px] font-bold text-[#da7756]">
                  [04] CODEBLOCK // SYNTAX CODE STREAMING WITH LIVE RUNNER
                </span>
                <CodeBlock />
              </motion.div>

              {/* 5. Chat Composer Panel */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="border border-[#33332d] bg-[#1a1a17] p-4">
                <span className="mb-3 block font-mono text-[11px] font-bold text-[#da7756]">
                  [05] CHATCOMPOSER // TABBED REPLY PANEL
                </span>
                <ChatComposer />
              </motion.div>
            </motion.div>
          )}

          {activeTab === "orb" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32">
              <div className="border border-[#33332d] bg-[#1a1a17] p-2">
                <VoiceReactiveOrb className="w-full min-h-[500px]" />
              </div>
            </motion.div>
          )}

          {activeTab === "studio" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-32 font-mono">
              <div className="border-b border-[#33332d] pb-2">
                <h2 className="text-[16px] font-bold text-white uppercase tracking-wider">[NEXT.JS COMPONENT STUDIO]</h2>
                <p className="text-[12px] text-[#75756d] font-sans">Inspect all 9 standalone components inside Next.js 14 App Router</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                  <span className="mb-2 block text-[11px] text-[#da7756] uppercase">[PromptBar]</span>
                  <PromptBar />
                </div>
                <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                  <span className="mb-2 block text-[11px] text-[#da7756] uppercase">[FilterTable]</span>
                  <FilterTable />
                </div>
                <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                  <span className="mb-2 block text-[11px] text-[#da7756] uppercase">[ChatComposer]</span>
                  <ChatComposer />
                </div>
                <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                  <span className="mb-2 block text-[11px] text-[#da7756] uppercase">[ToolChips]</span>
                  <ToolChips />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "diagnostics" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-32 font-mono">
              <div className="border border-[#33332d] bg-[#1a1a17] p-5">
                <h2 className="text-[14px] font-bold text-white border-b border-[#33332d] pb-2 mb-4">
                  [NEXT.JS 14 ENGINE DIAGNOSTICS & ANIMATION STATUS]
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
                  <div className="bg-[#121210] p-3 border border-[#2a2a24]">
                    <span className="text-[#75756d] block text-[10px]">FRAMEWORK</span>
                    <span className="text-[#da7756] font-bold">Next.js 14 App Router</span>
                  </div>
                  <div className="bg-[#121210] p-3 border border-[#2a2a24]">
                    <span className="text-[#75756d] block text-[10px]">ANIMATION</span>
                    <span className="text-white font-bold">Framer Motion</span>
                  </div>
                  <div className="bg-[#121210] p-3 border border-[#2a2a24]">
                    <span className="text-[#75756d] block text-[10px]">CORNERS</span>
                    <span className="text-[#da7756] font-bold">0px Sharp</span>
                  </div>
                  <div className="bg-[#121210] p-3 border border-[#2a2a24]">
                    <span className="text-[#75756d] block text-[10px]">STATUS</span>
                    <span className="text-emerald-400 font-bold">100% OK</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>

        {/* Right Side Panel: Next.js Artifact Drawer */}
        <AnimatePresence>
          {artifactOpen && activeTab === "chat" && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-l border-[#33332d] bg-[#161614] p-4 overflow-y-auto flex flex-col gap-4 font-mono text-[11px] shrink-0"
            >
              <div className="flex items-center justify-between border-b border-[#33332d] pb-2">
                <span className="font-bold text-[#eaeae2] flex items-center gap-1.5">
                  <FileText className="size-3.5 text-[#da7756]" />
                  [NEXT.JS ARTIFACTS]
                </span>
                <span className="bg-[#da7756] text-[#121210] px-1.5 py-0.5 font-bold text-[10px]">
                  LIVE
                </span>
              </div>

              {/* Artifact 1: FilterTable */}
              <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                <span className="mb-2 block font-bold text-[#da7756] uppercase">
                  [ARTIFACT] FILTERTABLE
                </span>
                <FilterTable />
              </div>

              {/* Artifact 2: ApprovalCard */}
              <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-[#da7756] uppercase">
                    [ARTIFACT] APPROVALCARD
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowApproval((v) => !v)}
                    className="text-[11px] text-[#da7756] hover:underline"
                  >
                    {showApproval ? "[RESET]" : "[SHOW]"}
                  </button>
                </div>
                {showApproval ? <ApprovalCard /> : <div className="p-2 text-[11px] text-[#75756d]">ACTION CONFIRMED.</div>}
              </div>

              {/* Artifact 3: LoadingState */}
              <div className="border border-[#33332d] bg-[#1a1a17] p-3">
                <span className="mb-2 block font-bold text-[#da7756] uppercase">
                  [ARTIFACT] LOADINGSTATE
                </span>
                <LoadingState label="NEXT.JS STREAMING" variant="Drive" />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom Prompt Bar Composer ───────────────────────────── */}
      <footer className="fixed inset-x-0 bottom-0 z-50 flex justify-center bg-[#121210] border-t border-[#33332d] pb-3 pt-3 px-4">
        <PromptBar onSend={handlePromptSubmit} />
      </footer>
    </div>
  );
}
