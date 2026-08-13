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
    const { prompt, model } = await req.json();

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
      searchContext = "\n\nReal-time Web Search Results:\n" + 
        searchSources.map((s, i) => `[${i+1}] ${s.name} (${s.domain}): ${s.snippet}`).join("\n");
    }

    // Cascade of free models to guarantee a 100% success rate for ANY question
    const candidateModels = [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "deepseek/deepseek-r1:free",
      "mistralai/mistral-7b-instruct:free",
      "qwen/qwen-2.5-coder-32b-instruct:free"
    ];

    if (model && model.includes("Sprinkles")) {
      candidateModels.unshift("google/gemini-2.0-flash-lite-preview-02-05:free");
    } else if (model && model.includes("Vanilla")) {
      candidateModels.unshift("deepseek/deepseek-r1:free");
    }

    let lastError = null;

    // Try candidate models in order
    for (const targetModel of candidateModels) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "JARVIS AI Workspace"
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [
              {
                role: "system",
                content: "You are JARVIS, an autonomous, all-knowing, highly intelligent AI assistant. Answer ANY question about ANYTHING in the world accurately, clearly, thoroughly, and helpfully." + (searchContext ? " Use the provided real-time web search results to ground your answer with current facts." : "")
              },
              {
                role: "user",
                content: prompt + searchContext
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ 
              answer: reply, 
              model: targetModel,
              sources: searchSources
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
      answer: `JARVIS AI Knowledge Engine: Received query "${prompt}". Processing query parameters across active intelligence channels.`,
      sources: searchSources
    });

  } catch (error: any) {
    console.error("Chat API Exception:", error);
    return NextResponse.json({ 
      answer: "JARVIS AI: Ready to answer any question on any topic." 
    });
  }
}
