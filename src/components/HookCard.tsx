import { useState } from "react";
import type { GeneratedHook, ScriptOption } from "../lib/types";
import { familyColor } from "../lib/families";
import { generateScripts, type Edge } from "../lib/api";
import CopyButton from "./CopyButton";

function scriptToText(s: ScriptOption): string {
  const beats = s.beats
    .map(
      (b) =>
        `[${b.time}] ${b.vo}`.trim() +
        (b.on_screen ? `\n   On-screen: ${b.on_screen}` : "") +
        (b.visual ? `\n   Visual: ${b.visual}` : "")
    )
    .join("\n");
  return `${s.label} (~${s.est_seconds}s)\n${beats}\nCTA: ${s.cta}`;
}

function ScriptBlock({ script }: { script: ScriptOption }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-cream">{script.label}</span>
          <span className="rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-medium text-lime">
            ~{script.est_seconds}s
          </span>
        </div>
        <CopyButton text={scriptToText(script)} label="Copy script" />
      </div>
      <div className="space-y-2">
        {script.beats.map((b, i) => (
          <div key={i} className="flex gap-2 text-sm">
            <span className="mt-0.5 shrink-0 rounded-md bg-cream-10 px-1.5 py-0.5 font-mono text-[10px] text-cream-61">
              {b.time}
            </span>
            <div className="min-w-0">
              {b.vo && <p className="text-cream">{b.vo}</p>}
              {b.on_screen && (
                <p className="text-[12px] text-pink">
                  <span className="text-cream-31">On-screen: </span>
                  {b.on_screen}
                </p>
              )}
              {b.visual && (
                <p className="text-[12px] text-cream-61">
                  <span className="text-cream-31">Visual: </span>
                  {b.visual}
                </p>
              )}
            </div>
          </div>
        ))}
        <p className="pt-1 text-sm font-medium text-lime">→ {script.cta}</p>
      </div>
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
  const [scripts, setScripts] = useState<ScriptOption[] | null>(null);
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
            <ScriptBlock key={i} script={s} />
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
