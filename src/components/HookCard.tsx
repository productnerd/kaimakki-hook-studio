import type { GeneratedHook } from "../lib/types";
import { familyColor } from "../lib/families";
import CopyButton from "./CopyButton";

export default function HookCard({ hook, index }: { hook: GeneratedHook; index: number }) {
  const color = familyColor(hook.family);
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

      {hook.rationale && (
        <p className="mt-2 text-sm leading-relaxed text-cream-61">{hook.rationale}</p>
      )}

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
      </div>
    </div>
  );
}
