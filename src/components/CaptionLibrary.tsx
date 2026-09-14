import { useEffect, useMemo, useState } from "react";
import { fetchCaptionTemplates, type CaptionTemplate } from "../lib/api";
import CopyButton from "./CopyButton";

const FORMAT_LABEL: Record<string, string> = {
  fill_in_the_blank: "Fill in the blank",
  pov: "POV",
  versus: "Versus",
  me_punchline: "Me: punchline",
};

export default function CaptionLibrary() {
  const [items, setItems] = useState<CaptionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<string | null>(null);

  useEffect(() => {
    fetchCaptionTemplates()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const formats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of items) for (const f of t.formats) counts.set(f, (counts.get(f) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((t) => {
      if (format && !t.formats.includes(format)) return false;
      if (!q) return true;
      return t.template.toLowerCase().includes(q) || (t.example || "").toLowerCase().includes(q);
    });
  }, [items, query, format]);

  return (
    <div className="mx-auto h-full max-w-5xl overflow-y-auto px-4 py-6 md:px-6">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-extrabold text-cream md:text-3xl">Caption Templates</h1>
        <p className="mt-1 text-cream-61">
          {items.length} on-screen caption templates from real reels, most-repeated first. The Captions tab builds from these.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search templates and examples…"
        className="mb-4 w-full rounded-brand border border-border bg-surface px-4 py-3 text-[15px] text-cream outline-none placeholder:text-cream-31 focus:border-cream-31"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFormat(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            format === null ? "bg-cream text-brown" : "bg-cream-10 text-cream-61 hover:bg-cream-20"
          }`}
        >
          All ({items.length})
        </button>
        {formats.map(([f, n]) => (
          <button
            key={f}
            onClick={() => setFormat(format === f ? null : f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              format === f ? "bg-lime text-brown" : "bg-lime/10 text-lime hover:bg-lime/20"
            }`}
          >
            {FORMAT_LABEL[f] || f} ({n})
          </button>
        ))}
      </div>

      {loading && <p className="text-cream-61">Loading templates…</p>}
      {error && <p className="text-[#ff8a7a]">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-3 text-xs text-cream-31">{filtered.length} templates</p>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((t) => (
              <div key={t.id} className="flex flex-col gap-3 rounded-brand border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-[16px] font-bold leading-snug text-cream">{t.template}</p>
                  <CopyButton text={t.template} />
                </div>
                {t.example && t.example !== t.template && (
                  <div className="rounded-xl bg-cream px-3 py-2 text-center font-display text-sm font-bold text-brown">
                    {t.example}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {t.formats.map((f) => (
                    <span key={f} className="rounded-full bg-lime/10 px-2 py-0.5 font-medium text-lime">
                      {FORMAT_LABEL[f] || f}
                    </span>
                  ))}
                  {t.times_seen > 1 && <span className="text-cream-61">seen in {t.times_seen} reels</span>}
                  {t.source_reels[0] && (
                    <a
                      href={t.source_reels[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-cream-31 underline underline-offset-2 hover:text-cream-61"
                    >
                      View reel
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
