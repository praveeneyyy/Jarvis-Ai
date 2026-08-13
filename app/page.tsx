"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Search,
  Compass,
  Bookmark,
  Folder,
  Clock,
  Share2,
  Download,
  Zap,
  MoreHorizontal,
  ChevronDown,
  Paperclip,
  Brain,
  Sliders,
  Send,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Bot,
  User,
  Globe,
  HelpCircle,
  MessageSquare,
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

export default function SleekWorkspacePage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeNav, setActiveNav] = useState<"explore" | "library" | "files" | "history">("history");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize theme & load threads
  useEffect(() => {
    const savedTheme = (localStorage.getItem("cortex_theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const loaded = loadChatThreads();
    setThreads(loaded);
    if (loaded.length > 0) {
      setActiveThreadId(loaded[0].id);
    }
  }, []);

  // Auto-scroll chat feed
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, activeThreadId, isGenerating]);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("cortex_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  // Create New Thread
  const handleNewChat = () => {
    const newT = createNewThread();
    setThreads(loadChatThreads());
    setActiveThreadId(newT.id);
  };

  // Delete Thread
  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteThread(id);
    const updated = loadChatThreads();
    setThreads(updated);
    if (activeThreadId === id) {
      setActiveThreadId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Send Message
  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isGenerating) return;

    let targetId = activeThreadId;
    if (!targetId) {
      const newT = createNewThread();
      targetId = newT.id;
      setActiveThreadId(newT.id);
    }

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    saveChatMessage(targetId, userMsg);
    setThreads(loadChatThreads());
    setInputPrompt("");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: textToSend }],
          model: "google/gemini-2.0-flash-lite-preview-02-05:free",
        }),
      });

      const data = await res.json();
      const replyText = data.choices?.[0]?.message?.content || data.reply || "I have analyzed your request and compiled the engineering workflow.";

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
        text: "I have processed your query and synthesized the response details below.",
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
    <div className="flex h-screen w-screen items-center justify-center p-2.5 sm:p-5 overflow-hidden select-none bg-zinc-950 text-zinc-100">
      {/* Subtle ambient violet backlights */}
      <div className="absolute top-1/4 left-1/3 size-[450px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 size-[350px] rounded-full bg-indigo-600/10 blur-[110px] pointer-events-none" />

      {/* Floating Application Shell Container */}
      <div className="shell-container relative flex h-full w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/60 bg-zinc-950/80 backdrop-blur-2xl">
        {/* ── 1. SLEEK SIDEBAR PANEL ─────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex h-full flex-col border-r border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl shrink-0 overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="flex h-12 items-center justify-between px-3.5 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-md bg-violet-600 text-white shadow-sm">
                    <Sparkles className="size-3.5" />
                  </div>
                  <span className="font-medium text-xs tracking-tight text-zinc-100">
                    Cortex <span className="text-[10px] text-zinc-500 font-mono">v2.4</span>
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="size-3.5" />
                </button>
              </div>

              {/* Sidebar Actions: New Chat & Search */}
              <div className="p-2.5 space-y-1.5">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md bg-zinc-100 dark:bg-zinc-100 text-zinc-900 text-xs font-medium shadow-sm hover:bg-zinc-200 active:scale-[0.98] transition-all"
                >
                  <Plus className="size-3.5" />
                  <span>New chat</span>
                </button>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2 size-3 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-7 pr-7 py-1 rounded border border-zinc-800/80 bg-zinc-900/60 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500/80"
                  />
                  <kbd className="absolute right-1.5 top-1.5 px-1 py-0.5 text-[8.5px] font-mono text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Navigation List */}
              <div className="px-2.5 py-1 space-y-0.5 border-b border-zinc-800/60 text-xs">
                {[
                  { id: "explore", label: "Explore", icon: Compass },
                  { id: "library", label: "Library", icon: Bookmark },
                  { id: "files", label: "Files", icon: Folder },
                  { id: "history", label: "History", icon: Clock },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id as any)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition ${
                        isActive
                          ? "bg-violet-500/10 text-violet-300 font-medium"
                          : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chat Thread History */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                <div className="text-[9.5px] font-medium uppercase tracking-wider text-zinc-500 px-1.5">
                  Recent
                </div>

                {filteredThreads.length === 0 ? (
                  <div className="px-1.5 text-[11px] text-zinc-500 py-1">No conversations</div>
                ) : (
                  <div className="space-y-0.5">
                    {filteredThreads.map((t) => {
                      const isActive = t.id === activeThreadId;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveThreadId(t.id)}
                          className={`group flex items-center justify-between px-2 py-1.5 rounded text-[11.5px] cursor-pointer transition ${
                            isActive
                              ? "bg-zinc-800/80 text-zinc-100 font-medium"
                              : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MessageSquare className="size-3 shrink-0 text-zinc-500 group-hover:text-violet-400" />
                            <span className="truncate">{t.title}</span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-red-400 transition"
                            title="Delete thread"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="p-2.5 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="size-7 rounded-full bg-violet-600/30 border border-violet-400/40 text-violet-200 font-semibold text-xs flex items-center justify-center shrink-0">
                    J
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-[11.5px] font-medium text-zinc-200 truncate">Jackson</span>
                    <span className="text-[9.5px] text-zinc-500 truncate">jackson@cortex.ai</span>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className="p-1 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                  title="Toggle Theme"
                >
                  {theme === "light" ? <Moon className="size-3.5 text-violet-400" /> : <Sun className="size-3.5 text-amber-400" />}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── 2. SLEEK MAIN WORKSPACE ───────────────────────────────────── */}
        <main className="flex-1 flex flex-col h-full bg-zinc-950/60 backdrop-blur-md overflow-hidden relative">
          {/* Header Bar */}
          <header className="flex h-12 items-center justify-between px-4 border-b border-zinc-800/60 shrink-0 z-10">
            <div className="flex items-center gap-2.5">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1 rounded text-zinc-400 hover:bg-zinc-900 transition"
                  title="Open sidebar"
                >
                  <PanelLeftOpen className="size-3.5" />
                </button>
              )}
              <div className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-zinc-200 hover:text-violet-400 transition">
                <Sparkles className="size-3.5 text-violet-500" />
                <span>Cortex Workspace</span>
                <ChevronDown className="size-3 text-zinc-500" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button className="flex items-center gap-1 px-2 py-1 rounded border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition text-[11px]">
                <Share2 className="size-3" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-1 px-2 py-1 rounded border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition text-[11px]">
                <Download className="size-3" />
                <span>Export</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm transition text-[11px]">
                <Zap className="size-3" />
                <span>Upgrade</span>
              </button>
              <button className="p-1 text-zinc-500 hover:text-zinc-300">
                <MoreHorizontal className="size-3.5" />
              </button>
            </div>
          </header>

          {/* Main Content Viewport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-between">
            {activeThread && activeThread.messages.length > 0 ? (
              <div className="w-full max-w-3xl space-y-5 pb-16">
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
                      <div className="size-6 rounded bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="size-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-lg p-3.5 text-[12px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-violet-600 text-white rounded-br-none shadow-sm"
                          : "bg-zinc-900 border border-zinc-800/80 text-zinc-200 rounded-bl-none shadow-sm space-y-2.5"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.sender === "jarvis" && (
                        <div className="space-y-2.5 pt-1.5">
                          {msg.text.toLowerCase().includes("code") && (
                            <CodeBlock
                              code={`// Sleek Next.js 14 Developer Workflow\nexport async function POST(req: Request) {\n  const body = await req.json();\n  return Response.json({ status: "ok", data: body });\n}`}
                            />
                          )}

                          {msg.text.toLowerCase().includes("tool") && (
                            <ToolChips
                              tools={[
                                { name: "OpenRouter Cascade", status: "active" },
                                { name: "Web Speech Engine", status: "idle" },
                                { name: "Tailwind v3 Tokens", status: "active" },
                              ]}
                            />
                          )}

                          {msg.text.toLowerCase().includes("table") && <FilterTable />}
                          {msg.text.toLowerCase().includes("approve") && <ApprovalCard />}
                          {msg.text.toLowerCase().includes("think") && <ThinkingState />}
                        </div>
                      )}
                    </div>
                    {msg.sender === "user" && (
                      <div className="size-6 rounded bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="size-3.5" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isGenerating && (
                  <div className="flex gap-2.5 items-center text-xs text-violet-400">
                    <div className="size-6 rounded bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                      <Sparkles className="size-3.5 animate-spin" />
                    </div>
                    <LoadingState label="Synthesizing response..." variant="Pulse" />
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
            ) : (
              /* Sleek Empty State Hero */
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl my-auto space-y-5">
                <AIOrb />

                <div className="space-y-1">
                  <h2 className="text-xs font-medium text-violet-400 tracking-tight">
                    Hello, Jackson
                  </h2>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
                    How can I assist you today?
                  </h1>
                </div>

                {/* Sleek Command Input */}
                <div className="w-full glass-input rounded-xl p-2.5 shadow-lg border border-zinc-800/80 transition-all focus-within:border-violet-500/80">
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
                    placeholder="Ask me anything..."
                    rows={2}
                    className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <div className="flex items-center gap-1 text-[11px]">
                      <button className="flex items-center gap-1 px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition">
                        <Brain className="size-3" />
                        <span>Reasoning</span>
                      </button>
                      <button className="flex items-center gap-1 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition">
                        <Sliders className="size-3" />
                        <span>Deep Research</span>
                      </button>
                      <button className="p-1 text-zinc-500 hover:text-zinc-300 rounded">
                        <Paperclip className="size-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleSend()}
                      disabled={!inputPrompt.trim() || isGenerating}
                      className="size-7 rounded-md bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white flex items-center justify-center shadow-sm transition"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Action Suggestion Cards */}
                <QuickActions onSelect={(p) => handleSend(p)} />
              </div>
            )}

            {/* Footer Links */}
            <div className="w-full flex items-center justify-between text-[10px] text-zinc-500 pt-3 border-t border-zinc-800/40">
              <div className="flex items-center gap-3">
                <a href="#" className="hover:text-violet-400 transition flex items-center gap-1">
                  <Globe className="size-3" /> Community
                </a>
                <a href="#" className="hover:text-violet-400 transition">
                  Docs
                </a>
              </div>
              <button className="hover:text-zinc-300 flex items-center gap-1">
                <HelpCircle className="size-3" /> Support
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
