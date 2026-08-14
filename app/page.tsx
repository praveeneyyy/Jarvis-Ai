"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Compass,
  Clock,
  Wallet,
  Search,
  ChevronDown,
  Paperclip,
  Image as ImageIcon,
  Globe,
  Mic,
  Send,
  MoreHorizontal,
  Sparkles,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  User,
  Plus,
  FileText,
  X,
  Check,
  Download,
  Settings,
  Zap,
} from "lucide-react";

import AIOrb from "@/components/chat/AIOrb";
import QuickActions from "@/components/chat/QuickActions";

// Dynamic Intent UI Widgets
import CodeBlock from "@/Jarvis/components/CodeBlock";
import ToolChips from "@/Jarvis/components/ToolChips";
import FilterTable from "@/Jarvis/components/FilterTable";
import ApprovalCard from "@/Jarvis/components/ApprovalCard";
import ThinkingState from "@/Jarvis/components/ThinkingState";
import LoadingState from "@/Jarvis/components/LoadingState";

import {
  loadChatThreads,
  createNewThread,
  saveChatMessage,
  deleteThread,
  ChatMessage,
  ChatThread,
} from "@/lib/chatStore";

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

export default function JarvisWorkspacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatInputPrompt, setChatInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeNav, setActiveNav] = useState<"home" | "templates" | "explore" | "history" | "wallet">("home");

  // File Upload State
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Typing State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const initialSpeechTextRef = useRef<string>("");

  // UI Dropdowns & Modals
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showModal, setShowModal] = useState<"templates" | "explore" | "wallet" | "settings" | null>(null);

  const [selectedModel, setSelectedModel] = useState({
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "J.A.R.V.I.S Llama 3.3 70B",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initial setup: Load saved threads
  useEffect(() => {
    const loaded = loadChatThreads();
    setThreads(loaded);
  }, []);

  // Auto-scroll chat feed
  useEffect(() => {
    if (activeThreadId) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [threads, activeThreadId, isGenerating]);

  // Web Speech API Initialization for Voice Typing (Accurate Transcript Builder)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const currentTranscript = (finalTranscript + interimTranscript).trim();
          const baseText = initialSpeechTextRef.current ? initialSpeechTextRef.current.trim() : "";
          const fullText = baseText ? (currentTranscript ? `${baseText} ${currentTranscript}` : baseText) : currentTranscript;

          if (activeThreadId) {
            setChatInputPrompt(fullText);
          } else {
            setInputPrompt(fullText);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [activeThreadId]);

  // Toggle Voice Typing
  const toggleVoiceTyping = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Brave.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        initialSpeechTextRef.current = activeThreadId ? chatInputPrompt : inputPrompt;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Voice start error:", err);
      }
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  // Return to New Page (Hero state)
  const handleNewChat = () => {
    setActiveThreadId(null);
    setInputPrompt("");
    setChatInputPrompt("");
    setAttachedFiles([]);
    setActiveNav("home");
    setShowModal(null);
  };

  // Delete Thread
  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteThread(id);
    const updated = loadChatThreads();
    setThreads(updated);
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  // Clear current active conversation
  const handleClearChat = () => {
    if (activeThreadId) {
      deleteThread(activeThreadId);
      setThreads(loadChatThreads());
      setActiveThreadId(null);
    }
    setShowOptionsMenu(false);
  };

  // Export current conversation log
  const handleExportChat = () => {
    if (activeThread && activeThread.messages.length > 0) {
      const log = activeThread.messages
        .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`)
        .join("\n\n");
      const blob = new Blob([log], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jarvis_chat_${activeThread.id}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowOptionsMenu(false);
  };

  // Send Message & start/continue conversation
  const handleSend = async (customText?: string) => {
    let textToSend = (customText || inputPrompt || chatInputPrompt).trim();
    if (!textToSend && attachedFiles.length === 0) return;
    if (isGenerating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (attachedFiles.length > 0) {
      const fileInfo = attachedFiles.map((f) => `📎 Attached file: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join("\n");
      textToSend = textToSend ? `${textToSend}\n\n${fileInfo}` : fileInfo;
    }

    let targetId = activeThreadId;
    let currentThread = threads.find((t) => t.id === targetId);

    if (!targetId || !currentThread) {
      const newT = createNewThread(textToSend.slice(0, 30));
      targetId = newT.id;
      setActiveThreadId(newT.id);
      currentThread = newT;
    }

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    saveChatMessage(targetId, userMsg);
    const updatedThreads = loadChatThreads();
    setThreads(updatedThreads);
    setInputPrompt("");
    setChatInputPrompt("");
    setAttachedFiles([]);
    setIsGenerating(true);

    const updatedTargetThread = updatedThreads.find((t) => t.id === targetId);
    const messageHistory = updatedTargetThread?.messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })) || [{ role: "user", content: textToSend }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          model: selectedModel.id,
          messages: messageHistory,
        }),
      });

      const data = await res.json();
      const replyText =
        data.answer ||
        data.reply ||
        data.choices?.[0]?.message?.content ||
        "I have processed your request with complete detailed analysis.";

      const assistantMsg: ChatMessage = {
        id: "a_" + Date.now(),
        sender: "jarvis",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      saveChatMessage(targetId, assistantMsg);
      setThreads(loadChatThreads());
    } catch {
      const fallbackMsg: ChatMessage = {
        id: "a_" + Date.now(),
        sender: "jarvis",
        text: "Here is the response to your request with complete detailed insights.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      saveChatMessage(targetId, fallbackMsg);
      setThreads(loadChatThreads());
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full overflow-hidden select-none bg-[#08080a] text-zinc-100 font-sans">
      {/* Hidden File Input Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
      />

      {/* Ambient Orange Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[650px] rounded-none bg-orange-600/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 size-[450px] rounded-none bg-amber-600/10 blur-[140px] pointer-events-none" />

      {/* Main Layout Container */}
      <div className="relative flex h-full w-full overflow-hidden bg-[#08080a]">
        {/* ── 1. BLACK & ORANGE SIDEBAR (SHARP CORNERS) ────────────── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex h-full flex-col border-r border-orange-500/20 bg-[#0c0c0f] shrink-0 overflow-hidden rounded-none"
            >
              {/* Brand Header */}
              <div className="flex h-14 items-center justify-between px-4 border-b border-orange-500/20 shrink-0">
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2.5 hover:opacity-90 transition text-left"
                >
                  <div className="flex size-7 items-center justify-center rounded-none bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-600/30 font-bold text-xs">
                    J
                  </div>
                  <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                    J.A.R.V.I.S <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-orange-500/20 text-orange-400 border border-orange-500/30">AI</span>
                  </span>
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-none text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="size-4" />
                </button>
              </div>

              {/* Search Box */}
              <div className="p-3 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats"
                    className="w-full pl-9 pr-8 py-1.5 rounded-none border border-orange-500/20 bg-[#121216] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/70 transition"
                  />
                  <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[9px] font-mono text-orange-400/80 bg-[#1a1a20] border border-orange-500/30 rounded-none">
                    ⌘
                  </kbd>
                </div>
              </div>

              {/* Top Navigation Menu */}
              <div className="px-3 py-1 space-y-0.5 border-b border-orange-500/20 text-xs shrink-0">
                {[
                  { id: "home", label: "Home", icon: Home, onClick: handleNewChat },
                  { id: "templates", label: "Templates", icon: LayoutGrid, onClick: () => setShowModal("templates") },
                  { id: "explore", label: "Explore", icon: Compass, onClick: () => setShowModal("explore") },
                  { id: "history", label: "History", icon: Clock, onClick: () => setActiveNav("history") },
                  { id: "wallet", label: "Wallet", icon: Wallet, onClick: () => setShowModal("wallet") },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id && (item.id !== "home" || activeThreadId === null);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNav(item.id as any);
                        item.onClick();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-none text-[12.5px] transition ${
                        isActive
                          ? "bg-orange-500/15 text-orange-400 font-medium border border-orange-500/30 shadow-sm"
                          : "text-zinc-400 hover:bg-[#15151b] hover:text-zinc-200"
                      }`}
                    >
                      <Icon className={`size-4 ${isActive ? "text-orange-400" : "text-zinc-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chat History Grouped */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Section 1: Tomorrow / Recent */}
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-orange-400/90 px-1 mb-1">
                    Tomorrow
                  </div>
                  <div className="space-y-0.5">
                    {[
                      "What's one lesson life has taught you r...",
                      "What's one mistake that taught you a val...",
                      "What's one goal that excites you the mos...",
                    ].map((sampleTitle, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sampleTitle)}
                        className="w-full text-left px-2.5 py-1.5 rounded-none text-[11.5px] text-zinc-400 hover:text-orange-300 hover:bg-[#16161c] truncate transition"
                      >
                        {sampleTitle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: 10 days Ago / Older */}
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-orange-400/90 px-1 mb-1">
                    10 days Ago
                  </div>
                  <div className="space-y-0.5">
                    {[
                      "If animals could talk, which one would be...",
                      "What's one word to describe your day?",
                      "What's one habit you want to break?",
                    ].map((sampleTitle, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sampleTitle)}
                        className="w-full text-left px-2.5 py-1.5 rounded-none text-[11.5px] text-zinc-400 hover:text-orange-300 hover:bg-[#16161c] truncate transition"
                      >
                        {sampleTitle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saved Threads */}
                {filteredThreads.length > 0 && (
                  <div className="pt-2 border-t border-orange-500/20 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-orange-400/90 px-1 mb-1">
                      <span>Saved Chats</span>
                      <button onClick={handleNewChat} className="hover:text-orange-400" title="New Chat">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    {filteredThreads.map((t) => {
                      const isActive = t.id === activeThreadId;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveThreadId(t.id)}
                          className={`group flex items-center justify-between px-2.5 py-1.5 rounded-none text-[11.5px] cursor-pointer transition ${
                            isActive
                              ? "bg-orange-500/15 text-orange-300 border border-orange-500/30 font-medium"
                              : "text-zinc-400 hover:bg-[#16161c] hover:text-zinc-200"
                          }`}
                        >
                          <span className="truncate pr-1">{t.title}</span>
                          <button
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* User Profile Footer - Locked at very bottom */}
              <div className="relative mt-auto shrink-0 p-3 border-t border-orange-500/20 bg-[#0a0a0d]">
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="w-full flex items-center justify-between hover:opacity-90 transition text-left"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="size-8 rounded-none bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-[1.5px] shrink-0 shadow-sm shadow-orange-500/30">
                      <div className="size-full rounded-none bg-[#121216] flex items-center justify-center text-xs font-semibold text-orange-400">
                        JM
                      </div>
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[12px] font-medium text-white truncate">Judha Maygustya</span>
                      <span className="text-[10px] text-orange-400/80 truncate font-mono">Free Plan</span>
                    </div>
                  </div>
                  <ChevronDown className="size-4 text-zinc-500" />
                </button>

                {/* Profile Popup Menu */}
                {showProfileMenu && (
                  <div className="absolute bottom-14 left-3 right-3 rounded-none bg-[#121216] border border-orange-500/30 p-2 shadow-2xl z-30 space-y-1 text-xs">
                    <div className="p-2 border-b border-orange-500/20 space-y-0.5">
                      <p className="font-semibold text-white">Judha Maygustya</p>
                      <p className="text-[10px] text-zinc-400">judha@jarvis.ai</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-400">
                        <Zap className="size-3" /> 100/100 Credits Remaining
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowModal("wallet");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-none hover:bg-orange-500/15 hover:text-orange-400 flex items-center gap-2 transition"
                    >
                      <Zap className="size-3.5" /> Upgrade to Pro
                    </button>
                    <button
                      onClick={() => {
                        setShowModal("settings");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-none hover:bg-orange-500/15 hover:text-orange-400 flex items-center gap-2 transition"
                    >
                      <Settings className="size-3.5" /> Settings
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── 2. MAIN WORKSPACE VIEWPORT ─────────────────────────────────── */}
        <main className="flex-1 flex flex-col h-full bg-[#08080a] overflow-hidden relative rounded-none">
          {/* Top Header Bar Controls - Fixed & Non-clipping */}
          <header className="flex h-14 items-center justify-between px-5 border-b border-orange-500/20 shrink-0 z-20 bg-[#0a0a0d]/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-none text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 bg-[#121216] border border-orange-500/20 transition"
                  title="Open sidebar"
                >
                  <PanelLeftOpen className="size-4" />
                </button>
              )}

              {/* AI Model Selector Pill Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#121216] border border-orange-500/30 text-xs font-medium text-zinc-200 hover:border-orange-500 transition cursor-pointer shadow-sm"
                >
                  <Sparkles className="size-3.5 text-orange-500" />
                  <span>{selectedModel.name}</span>
                  <ChevronDown className="size-3.5 text-zinc-400" />
                </button>

                {showModelDropdown && (
                  <div className="absolute top-10 left-0 w-56 rounded-none bg-[#121216] border border-orange-500/30 p-1.5 shadow-2xl z-30 space-y-1 text-xs">
                    {[
                      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "J.A.R.V.I.S Llama 3.3 70B" },
                      { id: "google/gemini-2.0-flash-lite-preview-02-05:free", name: "Gemini 2.0 Flash" },
                      { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 Reasoning" },
                      { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen 2.5 Coder 32B" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-none flex items-center justify-between transition ${
                          selectedModel.id === m.id
                            ? "bg-orange-500/20 text-orange-400 font-semibold"
                            : "text-zinc-300 hover:bg-orange-500/10 hover:text-white"
                        }`}
                      >
                        <span>{m.name}</span>
                        {selectedModel.id === m.id && <Check className="size-3.5 text-orange-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Options Button Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                className="p-2 rounded-none bg-[#121216] border border-orange-500/30 text-zinc-400 hover:text-orange-400 hover:border-orange-500 transition shadow-sm"
              >
                <MoreHorizontal className="size-4" />
              </button>

              {showOptionsMenu && (
                <div className="absolute top-10 right-0 w-48 rounded-none bg-[#121216] border border-orange-500/30 p-1.5 shadow-2xl z-30 space-y-1 text-xs">
                  <button
                    onClick={handleClearChat}
                    className="w-full text-left px-3 py-2 rounded-none text-zinc-300 hover:bg-orange-500/15 hover:text-orange-400 flex items-center gap-2 transition"
                  >
                    <Trash2 className="size-3.5" /> Clear Active Chat
                  </button>
                  <button
                    onClick={handleExportChat}
                    className="w-full text-left px-3 py-2 rounded-none text-zinc-300 hover:bg-orange-500/15 hover:text-orange-400 flex items-center gap-2 transition"
                  >
                    <Download className="size-3.5" /> Export Chat Log
                  </button>
                  <button
                    onClick={() => {
                      setShowModal("settings");
                      setShowOptionsMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-none text-zinc-300 hover:bg-orange-500/15 hover:text-orange-400 flex items-center gap-2 transition"
                  >
                    <Settings className="size-3.5" /> Settings
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Voice Typing Toast Banner */}
          {isListening && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-none bg-orange-600 text-white font-medium text-xs shadow-xl flex items-center gap-2.5 z-30 pulse-mic">
              <Mic className="size-4 animate-bounce text-yellow-300" />
              <span>Voice Typing Active... Listening to your speech</span>
              <button
                onClick={toggleVoiceTyping}
                className="ml-2 px-2 py-0.5 rounded-none bg-black/30 hover:bg-black/50 text-[10px]"
              >
                Stop
              </button>
            </div>
          )}

          {/* Main Content Area */}
          {activeThread && activeThread.messages.length > 0 ? (
            /* ACTIVE CHAT FEED VIEW: Pinned bottom input bar without blank void */
            <div className="flex-1 flex flex-col justify-between overflow-hidden relative w-full max-w-4xl mx-auto px-4 sm:px-6">
              {/* Scrollable Messages Container */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {activeThread.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "jarvis" && (
                      <div className="size-7 rounded-none bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-orange-600/30">
                        <Bot className="size-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-none p-4 text-[12.5px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md"
                          : "bg-[#121216] border border-orange-500/25 text-zinc-200 shadow-md space-y-3"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.sender === "jarvis" && (
                        <div className="space-y-2.5 pt-1">
                          {msg.text.toLowerCase().includes("code") && (
                            <CodeBlock
                              rawCode={`// J.A.R.V.I.S AI Developer Workflow\nexport async function POST(req: Request) {\n  const body = await req.json();\n  return Response.json({ status: "ok", data: body });\n}`}
                            />
                          )}

                          {msg.text.toLowerCase().includes("tool") && (
                            <ToolChips />
                          )}

                          {msg.text.toLowerCase().includes("table") && <FilterTable />}
                          {msg.text.toLowerCase().includes("approve") && <ApprovalCard />}
                          {msg.text.toLowerCase().includes("think") && <ThinkingState />}
                        </div>
                      )}
                    </div>
                    {msg.sender === "user" && (
                      <div className="size-7 rounded-none bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="size-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3 items-center text-xs text-orange-400">
                    <div className="size-7 rounded-none bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <Sparkles className="size-4 animate-spin" />
                    </div>
                    <LoadingState label="Synthesizing response..." variant="Pulse" />
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Attached File Preview Badges */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1 py-1">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-orange-500/15 border border-orange-500/30 text-xs text-orange-300"
                    >
                      <FileText className="size-3.5 text-orange-400" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => removeAttachedFile(idx)}
                        className="text-orange-400 hover:text-white"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pinned Bottom Input Bar */}
              <div className="shrink-0 py-3 bg-[#08080a]">
                <div className="w-full rounded-none bg-[#121216] border border-orange-500/30 p-3 shadow-2xl backdrop-blur-xl focus-within:border-orange-500">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-none bg-[#181820] border border-orange-500/20 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition shrink-0"
                      title="Attach File"
                    >
                      <Paperclip className="size-4" />
                    </button>

                    <textarea
                      value={chatInputPrompt}
                      onChange={(e) => setChatInputPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Message J.A.R.V.I.S AI..."
                      rows={1}
                      className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none"
                    />

                    {/* Single Clean Microphone Voice Typing Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceTyping}
                      className={`p-2 rounded-none border transition shrink-0 ${
                        isListening
                          ? "bg-orange-600 border-orange-500 text-white pulse-mic"
                          : "bg-[#181820] border-orange-500/20 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
                      }`}
                      title="Voice Typing"
                    >
                      <Mic className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={(!chatInputPrompt.trim() && attachedFiles.length === 0) || isGenerating}
                      className="p-2 rounded-none bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white shadow-md shadow-orange-600/30 transition shrink-0"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* NEW PAGE HERO VIEW: Perfect 100vh Fill Without Clipping Header or Void */
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 flex flex-col items-center justify-between min-h-0 w-full max-w-3xl mx-auto">
              {/* Iridescent 3D Orange Fire Orb */}
              <AIOrb className="mt-2 mb-1 shrink-0" />

              {/* Greeting Title */}
              <div className="space-y-1 shrink-0 text-center">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  Good Evening, DeepAI.
                </h1>
                <p className="text-xs sm:text-sm font-normal text-zinc-400">
                  Can I help you with anything ?
                </p>
              </div>

              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="w-full flex flex-wrap gap-2 justify-center shrink-0">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-orange-500/15 border border-orange-500/40 text-xs text-orange-300"
                    >
                      <FileText className="size-3.5 text-orange-400" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => removeAttachedFile(idx)}
                        className="text-orange-400 hover:text-white ml-1"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Input Box Container */}
              <div className="w-full rounded-none bg-[#121216]/90 border border-orange-500/30 p-3.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-orange-500 shrink-0 my-2">
                <textarea
                  ref={textareaRef}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message J.A.R.V.I.S AI..."
                  rows={2}
                  className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none leading-relaxed"
                />

                {/* Input Footer Toolbar */}
                <div className="flex items-center justify-between pt-2.5 border-t border-orange-500/20">
                  {/* Left Actions */}
                  <div className="flex items-center gap-2">
                    {/* Paperclip File Upload */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-none bg-[#181820] border border-orange-500/20 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition"
                      title="Upload File"
                    >
                      <Paperclip className="size-4" />
                    </button>

                    {/* Create an Image Pill */}
                    <button
                      type="button"
                      onClick={() => handleSend("Create an image of a futuristic neon cybernetic city with orange glowing lights")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#181820] border border-orange-500/20 text-xs text-zinc-300 hover:text-orange-400 hover:border-orange-500/40 transition"
                    >
                      <ImageIcon className="size-3.5 text-orange-400" />
                      <span>Create an image</span>
                    </button>

                    {/* Search the Web Pill */}
                    <button
                      type="button"
                      onClick={() => handleSend("Search the web for the latest artificial intelligence news today")}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#181820] border border-orange-500/20 text-xs text-zinc-300 hover:text-orange-400 hover:border-orange-500/40 transition"
                    >
                      <Globe className="size-3.5 text-orange-400" />
                      <span>Search the web</span>
                    </button>
                  </div>

                  {/* Right Voice & Send Actions (Single Microphone Button) */}
                  <div className="flex items-center gap-2">
                    {/* Microphone Voice Typing Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceTyping}
                      className={`p-1.5 rounded-none border transition ${
                        isListening
                          ? "bg-orange-600 border-orange-500 text-white pulse-mic"
                          : "bg-[#181820] border-orange-500/20 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10"
                      }`}
                      title="Voice Typing"
                    >
                      <Mic className="size-4" />
                    </button>

                    {(inputPrompt.trim() || attachedFiles.length > 0) && (
                      <button
                        type="button"
                        onClick={() => handleSend()}
                        disabled={isGenerating}
                        className="p-1.5 rounded-none bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/30 transition"
                      >
                        <Send className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 Quick Action Suggestion Cards */}
              <div className="w-full shrink-0 mb-2">
                <QuickActions onSelect={(p) => handleSend(p)} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals & Overlay Drawers (Sharp Corners) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 rounded-none"
            onClick={() => setShowModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-none bg-[#121216] border border-orange-500/40 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
                <h3 className="font-semibold text-lg text-white capitalize flex items-center gap-2">
                  <Sparkles className="size-4 text-orange-400" />
                  {showModal}
                </h3>
                <button onClick={() => setShowModal(null)} className="p-1 text-zinc-400 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>

              {showModal === "templates" && (
                <div className="space-y-2 text-xs">
                  <p className="text-zinc-400">Select a prompt template to start:</p>
                  {[
                    { title: "💻 Code Architecture Review", prompt: "Perform a code architecture and security review for a Next.js 14 stack." },
                    { title: "📊 Financial Analytics Report", prompt: "Create a financial budget and spending analytics breakdown." },
                    { title: "🎨 Cyberpunk Art Generator", prompt: "Create an image of a futuristic cyberpunk landscape with neon lighting." },
                  ].map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSend(t.prompt);
                        setShowModal(null);
                      }}
                      className="w-full text-left p-3 rounded-none bg-[#181820] border border-orange-500/20 hover:border-orange-500 hover:text-orange-300 transition"
                    >
                      <p className="font-medium text-white">{t.title}</p>
                      <p className="text-[10.5px] text-zinc-400 mt-0.5 truncate">{t.prompt}</p>
                    </button>
                  ))}
                </div>
              )}

              {showModal === "explore" && (
                <div className="space-y-3 text-xs text-zinc-300">
                  <p>J.A.R.V.I.S AI supports multimodal intelligence:</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-3 rounded-none bg-[#181820] border border-orange-500/20">
                      <Globe className="size-5 text-orange-400 mx-auto mb-1" />
                      <p className="font-semibold text-white">Live Web Search</p>
                      <p className="text-[10px] text-zinc-400">DuckDuckGo grounding</p>
                    </div>
                    <div className="p-3 rounded-none bg-[#181820] border border-orange-500/20">
                      <Mic className="size-5 text-orange-400 mx-auto mb-1" />
                      <p className="font-semibold text-white">Voice Typing</p>
                      <p className="text-[10px] text-zinc-400">Real-time speech to text</p>
                    </div>
                  </div>
                </div>
              )}

              {showModal === "wallet" && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-none bg-orange-500/15 border border-orange-500/30 text-center space-y-1">
                    <p className="text-orange-400 font-medium">Available Credits</p>
                    <p className="text-3xl font-bold text-white">100 / 100</p>
                    <p className="text-[10px] text-zinc-400">Resets daily at midnight UTC</p>
                  </div>
                  <button
                    onClick={() => {
                      alert("J.A.R.V.I.S Pro subscription activated! Unlimited queries unlocked.");
                      setShowModal(null);
                    }}
                    className="w-full py-2.5 rounded-none bg-orange-600 hover:bg-orange-500 font-semibold text-white transition shadow-lg shadow-orange-600/30"
                  >
                    Upgrade to J.A.R.V.I.S Pro ($19/mo)
                  </button>
                </div>
              )}

              {showModal === "settings" && (
                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex items-center justify-between p-2 rounded-none bg-[#181820]">
                    <span>Sharp Black & Orange Theme</span>
                    <span className="text-orange-400 font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-none bg-[#181820]">
                    <span>Voice Engine Language</span>
                    <span className="text-zinc-400">English (US)</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
