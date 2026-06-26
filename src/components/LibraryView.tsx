import { useEffect, useMemo, useState } from "react";
import { fetchFormats } from "../lib/api";
import type { HookFormat } from "../lib/types";
import { familyColor } from "../lib/families";
import FormatCard from "./FormatCard";

export default function LibraryView() {
  const [formats, setFormats] = useState<HookFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string | null>(null);

  useEffect(() => {
    fetchFormats()
      .then(setFormats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const families = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of formats) counts.set(f.family, (counts.get(f.family) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [formats]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return formats.filter((f) => {
      if (family && f.family !== family) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.template?.toLowerCase().includes(q) ||
        f.trigger?.toLowerCase().includes(q) ||
        f.examples.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [formats, query, family]);

  return (
    <div className="mx-auto h-full max-w-5xl overflow-y-auto px-4 py-6 md:px-6">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-extrabold text-cream md:text-3xl">
          The Hook Library
        </h1>
        <p className="mt-1 text-cream-61">
          {formats.length} universal, proven hook formats. Search, filter, steal.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search formats, templates, examples…"
        className="mb-4 w-full rounded-brand border border-border bg-surface px-4 py-3 text-[15px] text-cream outline-none placeholder:text-cream-31 focus:border-cream-31"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFamily(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            family === null ? "bg-cream text-brown" : "bg-cream-10 text-cream-61 hover:bg-cream-20"
          }`}
        >
          All ({formats.length})
        </button>
        {families.map(([fam, n]) => {
          const active = family === fam;
          const color = familyColor(fam);
          return (
            <button
              key={fam}
              onClick={() => setFamily(active ? null : fam)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: color, color: "#211305" }
                  : { backgroundColor: `${color}1f`, color }
              }
            >
              {fam} ({n})
            </button>
          );
        })}
      </div>

      {loading && <p className="text-cream-61">Loading the library…</p>}
      {error && <p className="text-[#ff8a7a]">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-3 text-xs text-cream-31">{filtered.length} formats</p>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((f) => (
              <FormatCard key={f.id} format={f} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
