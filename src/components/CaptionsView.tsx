import { useEffect, useRef, useState } from "react";
import { generateCaptions, type Caption } from "../lib/api";
import { useEdge } from "../lib/useEdge";
import EdgeDial from "./EdgeDial";
import { keepBrief } from "../lib/keepBrief";

const STORAGE_KEY = "kaimakki-caption-thread";
const LEGACY_KEY = "kaimakki-captions"; // single-result format used before threads

type Turn =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; captions: Caption[] };

let idc = 0;
const uid = () => `${Date.now()}-${idc++}`;

function loadThread(): Turn[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const { brief, captions } = JSON.parse(legacy);
      if (brief && Array.isArray(captions)) {
        return [
          { id: uid(), role: "user", text: brief },
          { id: uid(), role: "assistant", captions },
        ];
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

export default function CaptionsView() {
  const [thread, setThread] = useState<Turn[]>(loadThread);
  const [input, setInput] = useState("");
  const [count, setCount] = useState(16);
  const [edge, setEdge] = useEdge();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keepBrief(thread, 40)));
    localStorage.removeItem(LEGACY_KEY);
  }, [thread]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread, loading]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;
    setError(null);
    const next: Turn[] = [...thread, { id: uid(), role: "user", text: msg }];
    setThread(next);
    setInput("");
    setLoading(true);
    try {
      const payload = next.map((t) =>
        t.role === "user"
          ? { role: "user" as const, content: t.text }
          : {
              role: "assistant" as const,
              content: JSON.stringify({
                captions: t.captions.map((c) => ({ caption: c.text, sub: c.sub || "", template: c.template || "" })),
              }),
            }
      );
      const captions = await generateCaptions(payload, count, edge);
      setThread((cur) => [...cur, { id: uid(), role: "assistant", captions }]);
    } catch (e) {
      // Keep the thread as it was and hand the message back for a retry.
      setThread((cur) => cur.slice(0, -1));
      setInput(msg);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const empty = thread.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="mx-auto max-w-2xl py-6">
          {empty && !loading && (
            <div className="animate-fade-up pt-6 text-center">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-cream md:text-4xl">
                Captions
              </h1>
              <p className="mx-auto mt-3 max-w-md text-cream-61">
                The text that sits on top of the video. One short block, does its job in the
                three seconds it takes to read. Built on 446 caption templates from real reels.
                Start with the brief, then ask for more in the same thread.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {thread.map((t, ti) =>
              t.role === "user" ? (
                <div key={t.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-brand rounded-br-md bg-pink px-4 py-3 text-[15px] font-medium text-brown">
                    {ti > 0 && (
                      <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-brown/60">
                        Follow-up
                      </span>
                    )}
                    {t.text}
                  </div>
                </div>
              ) : (
                <div key={t.id} className="grid gap-3 sm:grid-cols-2">
                  {t.captions.map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-brand border border-border bg-surface p-3 animate-fade-up"
                      style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
                    >
                      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl bg-cream px-4 py-6 text-center">
                        <p className="font-display text-[17px] font-bold leading-snug text-brown">{c.text}</p>
                        {c.sub && <p className="text-[13px] font-medium leading-snug text-brown/70">{c.sub}</p>}
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
              )
            )}

            {loading && (
              <div className="flex items-center gap-2 text-cream-61">
                <span className="h-2 w-2 animate-breathe rounded-full bg-pink" />
                <span className="text-sm">Writing captions…</span>
              </div>
            )}
          </div>

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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={empty ? "Describe the brief…" : "Ask for more, change the angle, or refine…"}
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] text-cream outline-none placeholder:text-cream-31"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
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
            {!empty && (
              <button
                onClick={() => {
                  setThread([]);
                  setError(null);
                }}
                className="text-xs text-cream-31 hover:text-cream-61"
              >
                New brief
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
