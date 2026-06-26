// Seed kaimakki_hook_formats in Supabase (SeeHer) from data/hooks.json via PostgREST.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const URL = "https://knftyqkhampkqchoncel.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZnR5cWtoYW1wa3FjaG9uY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDg4MzYsImV4cCI6MjA2NzAyNDgzNn0.fugiTRvgoD3YqAZPQMV3R6Eu0Wx_9vgE6ZK8zjqFutg";

const rows = JSON.parse(readFileSync(join(__dir, "..", "data", "hooks.json"), "utf8"));
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
