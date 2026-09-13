import { useEffect, useState } from "react";
import { generateCaptions } from "../lib/api";
import { useEdge } from "../lib/useEdge";
import EdgeDial from "./EdgeDial";
import CopyButton from "./CopyButton";

const STORAGE_KEY = "kaimakki-captions";

interface Saved {
  brief: string;
  captions: string[][];
}

export default function CaptionsView() {
  const [brief, setBrief] = useState("");
  const [count, setCount] = useState(4);
  const [edge, setEdge] = useEdge();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Saved | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (result) localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    else localStorage.removeItem(STORAGE_KEY);
  }, [result]);

  async function run() {
    const b = brief.trim();
    if (!b || loading) return;
    setLoading(true);
    setError(null);
    try {
      const captions = await generateCaptions(b, count, edge);
      setResult({ brief: b, captions });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="mx-auto max-w-2xl py-6">
          {!result && !loading && (
            <div className="animate-fade-up pt-6 text-center">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-cream md:text-4xl">
                Captions for a text-led edit
              </h1>
              <p className="mx-auto mt-3 max-w-md text-cream-61">
                Footage plays in the background, the words on screen do the talking. Drop the
                brief and get {count} caption sequences, one line per beat.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-brand rounded-br-md bg-pink px-4 py-3 text-[15px] font-medium text-brown">
                  {result.brief}
                </div>
              </div>
              <div className="grid gap-3">
                {result.captions.map((lines, i) => (
                  <div
                    key={i}
                    className="rounded-brand border border-border bg-surface p-4 animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-cream-31">
                        Option {i + 1} · {lines.length} beats
                      </span>
                      <CopyButton text={lines.join("\n")} />
                    </div>
                    <ol className="space-y-1.5">
                      {lines.map((line, j) => (
                        <li
                          key={j}
                          className={`rounded-xl px-3 py-2 font-display leading-snug ${
                            j === 0
                              ? "bg-cream text-[17px] font-bold text-brown"
                              : j === lines.length - 1
                              ? "bg-lime/15 text-[15px] font-semibold text-lime"
                              : "bg-cream-10 text-[15px] font-semibold text-cream"
                          }`}
                        >
                          {line}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex items-center gap-2 text-cream-61">
              <span className="h-2 w-2 animate-breathe rounded-full bg-pink" />
              <span className="text-sm">Writing captions…</span>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-[#ff8a7a]/40 bg-[#ff8a7a]/10 px-4 py-3 text-sm text-[#ff8a7a]">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur md:px-0">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-brand border border-border bg-surface p-2 focus-within:border-cream-31">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  run();
                }
              }}
              rows={1}
              placeholder="Describe the brief…"
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] text-cream outline-none placeholder:text-cream-31"
            />
            <button
              onClick={run}
              disabled={loading || !brief.trim()}
              className="shrink-0 rounded-full bg-pink px-4 py-2 text-sm font-semibold text-brown transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Generate
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2 px-1">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-cream-61">
                Options
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="rounded-lg border border-border bg-surface px-2 py-1 text-cream outline-none"
                >
                  {[3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <EdgeDial edge={edge} onChange={setEdge} />
            </div>
            {result && (
              <button onClick={() => setResult(null)} className="text-xs text-cream-31 hover:text-cream-61">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
