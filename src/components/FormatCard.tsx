import { useState } from "react";
import type { HookFormat } from "../lib/types";
import { familyColor } from "../lib/families";
import CopyButton from "./CopyButton";

export default function FormatCard({ format }: { format: HookFormat }) {
  const [open, setOpen] = useState(false);
  const color = familyColor(format.family);
  return (
    <div className="rounded-brand border border-border bg-surface p-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-cream">{format.name}</h3>
            <span
              className="mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {format.family}
            </span>
          </div>
          <span className="mt-1 text-cream-31">{open ? "–" : "+"}</span>
        </div>
        {format.template && (
          <p className="mt-3 font-mono text-[13px] leading-relaxed text-pink">{format.template}</p>
        )}
        {format.trigger && (
          <p className="mt-2 text-sm text-cream-61">
            <span className="text-cream-31">Why it hooks: </span>
            {format.trigger}
          </p>
        )}
      </button>

      {open && (
        <div className="mt-4 space-y-4 border-t border-border pt-4 animate-fade-up">
          {format.why_it_works && (
            <p className="text-sm leading-relaxed text-cream-78">{format.why_it_works}</p>
          )}

          {format.examples.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream-31">
                Examples
              </p>
              <ul className="space-y-1.5">
                {format.examples.map((ex, i) => (
                  <li
                    key={i}
                    className="group flex items-start justify-between gap-2 rounded-xl bg-cream-10 px-3 py-2 text-sm text-cream-78"
                  >
                    <span>{ex}</span>
                    <CopyButton text={ex} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {format.applied_examples.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream-31">
                Applied to a niche
              </p>
              <ul className="space-y-1.5">
                {format.applied_examples.map((a, i) => (
                  <li key={i} className="rounded-xl bg-cream-10 px-3 py-2 text-sm text-cream-78">
                    <span className="mr-2 rounded-full bg-lime/20 px-2 py-0.5 text-[11px] font-medium text-lime">
                      {a.vertical}
                    </span>
                    {a.hook}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
