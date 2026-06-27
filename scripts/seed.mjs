// Seed kaimakki_hook_formats in Supabase (SeeHer) via PostgREST.
// Sources: the consolidated rich library (data/hooks.json) + the expert
// template banks (data/templates/*.json, e.g. the 1000 Viral Hooks pack).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const URL = "https://knftyqkhampkqchoncel.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZnR5cWtoYW1wa3FjaG9uY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDg4MzYsImV4cCI6MjA2NzAyNDgzNn0.fugiTRvgoD3YqAZPQMV3R6Eu0Wx_9vgE6ZK8zjqFutg";

const COLS = ["id", "name", "family", "trigger", "template", "why_it_works", "examples", "applied_examples", "sources"];
const pick = (r) => Object.fromEntries(COLS.filter((c) => c in r).map((c) => [c, r[c]]));

let rows = JSON.parse(readFileSync(join(__dir, "..", "data", "hooks.json"), "utf8"));
const tplDir = join(__dir, "..", "data", "templates");
if (existsSync(tplDir)) {
  for (const f of readdirSync(tplDir).filter((f) => f.endsWith(".json"))) {
    rows = rows.concat(JSON.parse(readFileSync(join(tplDir, f), "utf8")));
  }
}
rows = rows.map(pick);
const chunk = (a, n) => a.reduce((acc, x, i) => (i % n ? acc[acc.length - 1].push(x) : acc.push([x]), acc), []);

let inserted = 0;
for (const batch of chunk(rows, 80)) {
  const res = await fetch(`${URL}/rest/v1/kaimakki_hook_formats`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) { console.error("FAIL", res.status, await res.text()); process.exit(1); }
  inserted += batch.length;
  console.log(`upserted ${inserted}/${rows.length}`);
}
console.log("done");
