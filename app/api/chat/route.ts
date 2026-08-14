import { NextResponse } from "next/server";

// Real-time DuckDuckGo Web Search helper function
async function searchWeb(query: string) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodedQuery}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) return [];
    const html = await res.text();

    const results: { name: string; domain: string; snippet: string; href: string }[] = [];
    const resultRegex = /<a class="result__url" href="([^"]+)".*?>\s*(.*?)\s*<\/a>[\s\S]*?<a class="result__snippet".*?>\s*([\s\S]*?)\s*<\/a>/g;

    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 4) {
      let rawUrl = match[1];
      let domain = "web";
      try {
        if (rawUrl.includes("uddg=")) {
          const parsed = new URL("https://duckduckgo.com" + rawUrl);
          const actualUrl = parsed.searchParams.get("uddg");
          if (actualUrl) {
            rawUrl = actualUrl;
            domain = new URL(actualUrl).hostname.replace("www.", "");
          }
        }
      } catch (e) {}

      const name = match[2].replace(/<[^>]+>/g, "").trim();
      const snippet = match[3].replace(/<[^>]+>/g, "").trim();

      if (name && snippet) {
        results.push({ name, domain, snippet, href: rawUrl });
      }
    }

    return results;
  } catch (err) {
    console.error("Web Search error:", err);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let prompt = body.prompt;
    const model = body.model;
    const inputMessages = body.messages;

    // Handle string or array of messages
    if (!prompt && Array.isArray(inputMessages) && inputMessages.length > 0) {
      const lastMsg = inputMessages[inputMessages.length - 1];
      prompt = lastMsg.content || lastMsg.text;
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        answer: "Notice: OPENROUTER_API_KEY is not set in .env.local. Please configure your key in .env.local to enable live AI responses." 
      });
    }

    // Determine if query needs web search grounding
    const needsSearch = /search|news|weather|price|stock|today|latest|who is|what is the status|current/i.test(prompt);
    let searchSources: { name: string; domain: string; snippet: string; href: string }[] = [];

    if (needsSearch) {
      searchSources = await searchWeb(prompt);
    }

    // Build context with search results if available
    let searchContext = "";
    if (searchSources.length > 0) {
      searchContext = "\n\nBackground Information:\n" + 
        searchSources.map((s, i) => `[${i+1}] ${s.name}: ${s.snippet}`).join("\n");
    }

    const candidateModels = [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "deepseek/deepseek-r1:free",
      "qwen/qwen-2.5-coder-32b-instruct:free",
      "mistralai/mistral-7b-instruct:free"
    ];

    const apiMessages: { role: string; content: string }[] = [
      {
        role: "system",
        content: "You are J.A.R.V.I.S AI, an elite, all-knowing, highly intelligent AI assistant. Provide the EXACT, COMPLETE, FULL, and DIRECT answer to ANY question directly in your response text. DO NOT redirect the user to external links, do not tell them to click links, and do not withhold information. Write out all explanations, steps, facts, and code snippets completely, clearly, and thoroughly directly inside the message."
      }
    ];

    if (Array.isArray(inputMessages) && inputMessages.length > 1) {
      for (const m of inputMessages.slice(-6)) {
        apiMessages.push({
          role: m.role || (m.sender === "user" ? "user" : "assistant"),
          content: m.content || m.text
        });
      }
    } else {
      apiMessages.push({
        role: "user",
        content: prompt + (searchContext ? searchContext : "")
      });
    }

    let lastError = null;

    for (const targetModel of candidateModels) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "J.A.R.V.I.S AI Workspace"
          },
          body: JSON.stringify({
            model: targetModel,
            messages: apiMessages
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ 
              answer: reply, 
              model: targetModel
            });
          }
        } else {
          lastError = await response.text();
          console.warn(`Model ${targetModel} notice:`, lastError);
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${targetModel} exception:`, err);
      }
    }

    return NextResponse.json({ 
      answer: `J.A.R.V.I.S AI: Query received for "${prompt}". Processing request across active intelligence channels.`
    });

  } catch (error: any) {
    console.error("Chat API Exception:", error);
    return NextResponse.json({ 
      answer: "J.A.R.V.I.S AI: Ready to provide complete exact answers on any topic." 
    });
  }
}
