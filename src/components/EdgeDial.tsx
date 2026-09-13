import type { Edge } from "../lib/api";

const EDGES: { value: Edge; label: string; title: string }[] = [
  { value: "mild", label: "Mild", title: "Safe and likeable — for conservative clients" },
  { value: "bold", label: "Bold", title: "Opinionated, contrarian, scroll-stopping (default)" },
  { value: "unhinged", label: "Unhinged", title: "Provocative, counterculture, says the quiet part" },
];

export default function EdgeDial({ edge, onChange }: { edge: Edge; onChange: (e: Edge) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs text-cream-61">
      Edge
      <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5">
        {EDGES.map((e) => (
          <button
            key={e.value}
            onClick={() => onChange(e.value)}
            title={e.title}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              edge === e.value ? "bg-lime font-semibold text-brown" : "text-cream-61 hover:text-cream"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}
