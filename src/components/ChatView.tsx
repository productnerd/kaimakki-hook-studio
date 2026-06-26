import { useEffect, useRef, useState } from "react";
import { generateHooks } from "../lib/api";
import type { ChatMessage } from "../lib/types";
import HookCard from "./HookCard";

const STORAGE_KEY = "kaimakki-hook-chat";
const SUGGESTIONS = [
  "New gym in Limassol, want sign-ups for a free trial week. Audience: people who keep quitting gyms.",
  "DTC skincare brand launching a vitamin-C serum. Reels. Audience: women 25-40 skeptical of 'miracle' products.",
  "B2B SaaS for restaurant inventory. Goal: book demos with owners drowning in food waste.",
];

let idc = 0;
const uid = () => `${Date.now()}-${idc++}`;

export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) return JSON.parse(s);
    } catch {
      /* ignore */
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const brief = text.trim();
    if (!brief || loading) return;
    setError(null);
    const userMsg: ChatMessage = { id: uid(), role: "user", content: brief };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const payload = next.map((m) => ({ role: m.role, content: m.content }));
      const res = await generateHooks(payload, count);
      setMessages((cur) => [
        ...cur,
        { id: uid(), role: "assistant", content: res.reply, hooks: res.hooks },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="mx-auto max-w-2xl py-6">
          {empty ? (
            <div className="animate-fade-up pt-6 text-center">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-cream md:text-4xl">
                What are we hooking today?
              </h1>
              <p className="mx-auto mt-3 max-w-md text-cream-61">
                Drop your brief. The client, the audience, the platform, the goal.
                I'll pull from {""}
                <span className="text-pink">262 proven hook formats</span> and tailor a set to your case.
              </p>
              <div className="mt-7 grid gap-2 text-left">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-cream-78 transition-colors hover:border-cream-31 hover:bg-cream-10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-brand rounded-br-md bg-pink px-4 py-3 text-[15px] font-medium text-brown">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="space-y-3">
                    {m.content && (
                      <p className="text-[15px] leading-relaxed text-cream-78">{m.content}</p>
                    )}
                    {m.hooks && m.hooks.length > 0 && (
                      <div className="grid gap-3">
                        {m.hooks.map((h, i) => (
                          <HookCard key={i} hook={h} index={i} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
              {loading && (
                <div className="flex items-center gap-2 text-cream-61">
                  <span className="h-2 w-2 animate-breathe rounded-full bg-pink" />
                  <span className="text-sm">Writing hooks…</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-[#ff8a7a]/40 bg-[#ff8a7a]/10 px-4 py-3 text-sm text-[#ff8a7a]">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* composer */}
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
              placeholder={empty ? "Describe your brief…" : "Refine, ask for more, or start a new brief…"}
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
          <div className="mt-2 flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-xs text-cream-61">
              Hooks per brief
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-cream outline-none"
              >
                {[5, 8, 10, 12, 15].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  localStorage.removeItem(STORAGE_KEY);
                }}
                className="text-xs text-cream-31 hover:text-cream-61"
              >
                Clear chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
