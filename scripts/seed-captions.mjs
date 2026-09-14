// Seed kaimakki_caption_templates (SeeHer) from data/captions-ksltos.json.
// Source: 446 caption templates scraped from @ksltos reels (197 reels read).
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const URL = "https://knftyqkhampkqchoncel.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZnR5cWtoYW1wa3FjaG9uY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDg4MzYsImV4cCI6MjA2NzAyNDgzNn0.fugiTRvgoD3YqAZPQMV3R6Eu0Wx_9vgE6ZK8zjqFutg";

const rows = JSON.parse(readFileSync(join(__dir, "..", "data", "captions-ksltos.json"), "utf8"));
for (let i = 0; i < rows.length; i += 100) {
  const res = await fetch(`${URL}/rest/v1/kaimakki_caption_templates`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows.slice(i, i + 100)),
  });
  if (!res.ok) { console.error("FAIL", res.status, await res.text()); process.exit(1); }
}
console.log(`upserted ${rows.length}`);
