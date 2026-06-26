// Consolidate raw hook-format research from 5 agents into a single deduped library.
// Run: node scripts/consolidate.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dir, "..", "data", "raw");
const OUT = join(__dir, "..", "data", "hooks.json");

const FAMILIES = new Set([
  "Curiosity Gap", "Contrarian/Myth-Bust", "Negativity/Warning", "Social Proof",
  "Story/In-Medias-Res", "Number/List", "Question", "Bold Claim/Promise",
  "Relatability/POV", "Authority/Credibility", "FOMO/Urgency",
  "Transformation/Before-After", "Callout/Targeting", "Pattern Interrupt",
  "How-To/Mechanism", "Secret/Reveal", "Comparison", "Confession",
]);

// Extract a JSON array from arbitrary text (handles ```json fences and prose).
function extractArray(text) {
  let t = text.replace(/```json/gi, "```").replace(/```/g, "");
  const start = t.indexOf("[");
  const end = t.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("no array found");
  return JSON.parse(t.slice(start, end + 1));
}

function loadFile(path) {
  const rawText = readFileSync(path, "utf8");
  let parsed;
  try { parsed = JSON.parse(rawText); } catch { return extractArray(rawText); }
  // Persisted tool-result wrapper: [{type:"text", text:"...json..."}]
  if (Array.isArray(parsed) && parsed.length && parsed[0] && typeof parsed[0].text === "string" && parsed[0].type) {
    const joined = parsed.map((p) => p.text || "").join("\n");
    return extractArray(joined);
  }
  return parsed;
}

const slug = (s) =>
  s.toLowerCase().replace(/['’"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const norm = (s) => (s || "").trim();
const dedupeStrings = (arr) => {
  const seen = new Set(); const out = [];
  for (const x of arr || []) {
    const v = norm(x); const k = v.toLowerCase();
    if (v && !seen.has(k)) { seen.add(k); out.push(v); }
  }
  return out;
};

const byId = new Map();
const skipped = [];
let totalRaw = 0;

for (const file of readdirSync(RAW_DIR).filter((f) => f.endsWith(".json")).sort()) {
  const items = loadFile(join(RAW_DIR, file));
  for (const it of items) {
    totalRaw++;
    const name = norm(it.name);
    const family = norm(it.family);
    if (!name || !FAMILIES.has(family)) { skipped.push({ file, name, family }); continue; }
    const id = slug(name);
    if (!byId.has(id)) {
      byId.set(id, {
        id, name, family,
        trigger: norm(it.trigger),
        template: norm(it.template),
        why_it_works: norm(it.why_it_works),
        examples: dedupeStrings(it.examples),
        applied_examples: [],
        sources: [],
      });
    }
    const rec = byId.get(id);
    // merge examples
    rec.examples = dedupeStrings([...rec.examples, ...(it.examples || [])]);
    // prefer the longest why_it_works / trigger / template
    if (norm(it.why_it_works).length > rec.why_it_works.length) rec.why_it_works = norm(it.why_it_works);
    if (norm(it.trigger).length > rec.trigger.length) rec.trigger = norm(it.trigger);
    if (norm(it.template).length > rec.template.length) rec.template = norm(it.template);
    // merge applied_examples (dedupe by hook text)
    const haveHooks = new Set(rec.applied_examples.map((a) => (a.hook || "").toLowerCase()));
    for (const a of it.applied_examples || []) {
      const hook = norm(a.hook); const vertical = norm(a.vertical);
      if (hook && !haveHooks.has(hook.toLowerCase())) {
        haveHooks.add(hook.toLowerCase());
        rec.applied_examples.push({ vertical, hook });
      }
    }
    // merge source
    if (it.source) rec.sources = dedupeStrings([...rec.sources, it.source]);
  }
}

// cap examples at 10 to keep records tight
const library = [...byId.values()]
  .map((r) => ({ ...r, examples: r.examples.slice(0, 10) }))
  .sort((a, b) => a.family.localeCompare(b.family) || a.name.localeCompare(b.name));

writeFileSync(OUT, JSON.stringify(library, null, 2));

// summary
const byFamily = {};
for (const r of library) byFamily[r.family] = (byFamily[r.family] || 0) + 1;
const totalExamples = library.reduce((n, r) => n + r.examples.length, 0);
const totalApplied = library.reduce((n, r) => n + r.applied_examples.length, 0);
console.log(`raw records:        ${totalRaw}`);
console.log(`unique formats:     ${library.length}`);
console.log(`skipped (bad fam):  ${skipped.length}`);
console.log(`example lines:      ${totalExamples}`);
console.log(`applied examples:   ${totalApplied}`);
console.log(`\nby family:`);
for (const [f, n] of Object.entries(byFamily).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${f}`);
if (skipped.length) console.log(`\nskipped:`, skipped);
console.log(`\nwrote ${OUT}`);
