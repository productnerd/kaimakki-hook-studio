import { useState } from "react";
import type { GeneratedHook } from "../lib/types";
import { familyColor } from "../lib/families";
import { generateScripts, type Edge } from "../lib/api";
import CopyButton from "./CopyButton";

function ScriptBlock({ script, n }: { script: string; n: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-cream-31">
          Script {n}
        </span>
        <CopyButton text={script} label="Copy" />
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-cream">{script}</p>
    </div>
  );
}

export default function HookCard({
  hook,
  index,
  brief,
  edge,
}: {
  hook: GeneratedHook;
  index: number;
  brief: string;
  edge: Edge;
}) {
  const color = familyColor(hook.family);
  const [scripts, setScripts] = useState<string[] | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadScripts() {
    if (loading) return;
    setLoading(true);
    setError(null);
    setOpen(true);
    try {
      const s = await generateScripts(hook.text, brief, edge);
      setScripts(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not write scripts.");
    } finally {
      setLoading(false);
    }
  }

  const started = loading || scripts !== null || error !== null;

  return (
    <div
      className="group rounded-brand border border-border bg-surface p-4 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-[17px] font-semibold leading-snug text-cream">
          {hook.text}
        </p>
        <CopyButton text={hook.text} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span
          className="rounded-full px-2 py-0.5 font-medium"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {hook.family}
        </span>
        {hook.format_name && (
          <span className="rounded-full bg-cream-10 px-2 py-0.5 text-cream-61">
            {hook.format_name}
          </span>
        )}
        {hook.angle && <span className="text-cream-31">{hook.angle}</span>}

        {/* hover-reveal scripts action */}
        <button
          onClick={() => (scripts ? setOpen((o) => !o) : loadScripts())}
          disabled={loading}
          className={`ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
            started ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
          } ${
            loading
              ? "bg-cream-10 text-cream-61"
              : "bg-pink text-brown hover:opacity-90"
          }`}
        >
          {loading ? (
            <>
              <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-pink" />
              Writing scripts…
            </>
          ) : scripts ? (
            open ? "Hide scripts" : "Show scripts"
          ) : (
            "Scripts ↓"
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-2 border-t border-border pt-3 animate-fade-up">
          {error && (
            <div className="flex items-center justify-between gap-2 text-sm text-[#ff8a7a]">
              <span>{error}</span>
              <button onClick={loadScripts} className="underline hover:text-cream">
                Retry
              </button>
            </div>
          )}
          {scripts?.map((s, i) => (
            <ScriptBlock key={i} script={s} n={i + 1} />
          ))}
          {scripts && (
            <button
              onClick={loadScripts}
              className="text-[11px] text-cream-31 hover:text-cream-61"
            >
              Regenerate scripts
            </button>
          )}
        </div>
      )}
    </div>
  );
}
