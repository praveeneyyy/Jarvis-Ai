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
