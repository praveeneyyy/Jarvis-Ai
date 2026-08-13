export interface ChatMessage {
  id: string;
  sender: "user" | "jarvis";
  text: string;
  timestamp: string;
  model?: string;
  sources?: { name: string; domain: string; snippet?: string; href?: string }[];
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = "jarvis_chat_threads_v1";

export function getSavedThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load threads:", e);
    return [];
  }
}

export function loadChatThreads(): ChatThread[] {
  return getSavedThreads();
}

export function saveThread(thread: ChatThread): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedThreads();
    const index = existing.findIndex((t) => t.id === thread.id);
    if (index >= 0) {
      existing[index] = thread;
    } else {
      existing.unshift(thread);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return existing;
  } catch (e) {
    console.error("Failed to save thread:", e);
    return [];
  }
}

export function createNewThread(initialTitle?: string): ChatThread {
  const newThread: ChatThread = {
    id: "thread_" + Date.now(),
    title: initialTitle || "New Conversation",
    updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    messages: [],
  };
  saveThread(newThread);
  return newThread;
}

export function saveChatMessage(threadId: string, message: ChatMessage): ChatThread[] {
  const threads = getSavedThreads();
  let target = threads.find((t) => t.id === threadId);
  if (!target) {
    target = {
      id: threadId,
      title: message.text.slice(0, 30) || "New Conversation",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: [message],
    };
  } else {
    target.messages.push(message);
    if (target.messages.length === 1 && message.sender === "user") {
      target.title = message.text.slice(0, 35) + (message.text.length > 35 ? "..." : "");
    }
    target.updatedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return saveThread(target);
}

export function deleteThread(threadId: string): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSavedThreads().filter((t) => t.id !== threadId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return existing;
  } catch (e) {
    console.error("Failed to delete thread:", e);
    return [];
  }
}
