import { useEffect, useState } from "react";
import { generateCaptions, type Caption } from "../lib/api";
import { useEdge } from "../lib/useEdge";
import EdgeDial from "./EdgeDial";

const STORAGE_KEY = "kaimakki-captions";

interface Saved {
  brief: string;
  captions: Caption[];
}

export default function CaptionsView() {
  const [brief, setBrief] = useState("");
  const [count, setCount] = useState(16);
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
                Captions
              </h1>
              <p className="mx-auto mt-3 max-w-md text-cream-61">
                The text that sits on top of the video. One short block, does its job in the
                three seconds it takes to read. Built on 446 caption templates from real reels.
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
              <div className="grid gap-3 sm:grid-cols-2">
                {result.captions.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-brand border border-border bg-surface p-3 animate-fade-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* mimics the on-screen text box */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl bg-cream px-4 py-6 text-center">
                      <p className="font-display text-[17px] font-bold leading-snug text-brown">
                        {c.text}
                      </p>
                      {c.sub && (
                        <p className="text-[13px] font-medium leading-snug text-brown/70">{c.sub}</p>
                      )}
                    </div>
                    {c.template &&
                      (c.reel ? (
                        <a
                          href={c.reel}
                          target="_blank"
                          rel="noreferrer"
                          title="Open the reel this template came from"
                          className="mt-2 text-[11px] leading-snug text-cream-31 hover:text-cream-78 hover:underline hover:underline-offset-2"
                        >
                          from: <span className="text-cream-61">{c.template}</span> ↗
                        </a>
                      ) : (
                        <span className="mt-2 text-[11px] leading-snug text-cream-31">
                          from: <span className="text-cream-61">{c.template}</span>
                        </span>
                      ))}
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
                Captions
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="rounded-lg border border-border bg-surface px-2 py-1 text-cream outline-none"
                >
                  {[8, 12, 16, 20].map((n) => (
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
