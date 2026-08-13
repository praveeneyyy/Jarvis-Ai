"use client";

import { useCallback, useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * CODE BLOCK
 * Agent-written code streams line by line with live Copy & Run Sandbox.
 * ───────────────────────────────────────────────────────── */

const LINE_MS = 240;
const HOLD_MS = 3200;

type Tok = { t: string; c?: "kw" | "str" | "num" | "fn" | "dim" };

const LINES: Tok[][] = [
  [{ t: "export async function ", c: "kw" }, { t: "churnBatch", c: "fn" }, { t: "() {", c: "dim" }],
  [{ t: "  const ", c: "kw" }, { t: "flavor = " }, { t: "await ", c: "kw" }, { t: "getFlavor", c: "fn" }, { t: "(", c: "dim" }, { t: "\"pistachio\"", c: "str" }, { t: ");", c: "dim" }],
  [{ t: "  const ", c: "kw" }, { t: "base = " }, { t: "await ", c: "kw" }, { t: "dairy." }, { t: "fetch", c: "fn" }, { t: "({ flavor });", c: "dim" }],
  [{ t: "  await ", c: "kw" }, { t: "freezer." }, { t: "store", c: "fn" }, { t: "(base, { temp: ", c: "dim" }, { t: "\"-14C\"", c: "str" }, { t: " });", c: "dim" }],
  [{ t: "  return ", c: "kw" }, { t: "base.gallons;" }],
  [{ t: "}", c: "dim" }],
];

const COLORS: Record<string, string> = {
  kw: "var(--accent-ink, #da7756)",
  str: "#2ecc71",
  num: "#f39c12",
  fn: "#00ffff",
  dim: "#75756d",
};

const RAW = `export async function churnBatch() {
  const flavor = "pistachio";
  const gallons = 42;
  console.log("Churning batch:", flavor, "Yield:", gallons, "gallons");
  return { flavor, gallons, temp: "-14C" };
}`;

export interface CodeBlockProps {
  filename?: string;
  language?: string;
  lines?: Tok[][];
  rawCode?: string;
}

export default function CodeBlock({
  filename = "churn.ts",
  language = "TypeScript",
  lines = LINES,
  rawCode = RAW,
}: CodeBlockProps) {
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const done = count >= lines.length;

  useEffect(() => {
    const t = setTimeout(
      () => setCount((c) => (c >= lines.length ? 0 : c + 1)),
      count === 0 ? 400 : done ? HOLD_MS : LINE_MS,
    );
    return () => clearTimeout(t);
  }, [count, done, lines.length]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [rawCode]);

  const executeCode = useCallback(() => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ")),
          error: (...args: any[]) => logs.push("ERROR: " + args.join(" ")),
        };

        const fn = new Function("console", `
          ${rawCode}
          if (typeof churnBatch === 'function') { return churnBatch(); }
        `);

        const result = fn(customConsole);
        let resStr = logs.join("\n");
        if (result !== undefined) {
          resStr += (resStr ? "\nReturn: " : "") + JSON.stringify(result);
        }
        setOutput(resStr || "✓ Executed successfully (no output).");
      } catch (err: any) {
        setOutput("Execution Error: " + err.message);
      } finally {
        setRunning(false);
      }
    }, 400);
  }, [rawCode]);

  return (
    <div className="w-full max-w-[24rem] overflow-hidden bg-surface border border-line">
      {/* header */}
      <div className="flex items-center justify-between border-b border-line px-3 py-2 bg-[#1a1a17]">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] font-medium text-ink">{filename}</span>
          <span className="font-mono text-[11px] text-[#da7756]">{language}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Run code"
            onClick={executeCode}
            disabled={running}
            className="flex h-5.5 items-center gap-1 bg-[#da7756] px-2 text-[10.5px] font-mono font-bold text-[#121210] hover:bg-[#e28464] transition-colors"
          >
            {running ? "Executing…" : "▶ Run"}
          </button>
          <button
            type="button"
            aria-label="Copy code"
            onClick={copy}
            className={`flex h-5.5 items-center gap-1 border border-[#383830] bg-[#242420] px-2 text-[10.5px] font-mono font-medium transition-colors hover:bg-[#2c2c28] ${
              copied ? "text-emerald-400 border-emerald-500/40" : "text-ink-3 hover:text-ink"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* code */}
      <pre className="min-h-[130px] bg-[#121210] px-3 py-2.5 font-mono text-[11px] leading-[1.7] overflow-x-auto">
        {lines.slice(0, count).map((line, i) => (
          <div key={i} className="flex">
            <span className="w-6 shrink-0 select-none text-right pr-3 text-[10px] text-[#55554d]">{i + 1}</span>
            <div>
              {line.map((tok, j) => (
                <span key={j} style={{ color: tok.c ? COLORS[tok.c] : "inherit" }}>
                  {tok.t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </pre>

      {/* Output Console Sandbox */}
      {output && (
        <div className="border-t border-[#da7756]/40 bg-[#171714] p-2.5 font-mono text-[11px] text-emerald-400">
          <div className="flex items-center justify-between text-[10px] text-[#da7756] mb-1">
            <span>[TERMINAL OUTPUT]</span>
            <button onClick={() => setOutput(null)} className="text-[#88887f] hover:text-white">✕ Clear</button>
          </div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
