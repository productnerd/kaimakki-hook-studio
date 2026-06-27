import { GENERATOR_URL, SCRIPT_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { GeneratedHook, HookFormat } from "./types";

export async function fetchFormats(): Promise<HookFormat[]> {
  // PostgREST caps responses at 1000 rows, so page through with limit/offset.
  const pageSize = 1000;
  const all: HookFormat[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/kaimakki_hook_formats?select=*&order=family.asc,name.asc&limit=${pageSize}&offset=${offset}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error(`Failed to load formats (${res.status})`);
    const batch: HookFormat[] = await res.json();
    all.push(...batch);
    if (batch.length < pageSize) break;
  }
  return all;
}

export interface GenerateResult {
  reply: string;
  hooks: GeneratedHook[];
}

export type Edge = "mild" | "bold" | "unhinged";

export async function generateHooks(
  messages: { role: "user" | "assistant"; content: string }[],
  count: number,
  edge: Edge
): Promise<GenerateResult> {
  const res = await fetch(GENERATOR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages, count, edge, brief: messages[0]?.content || "" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Generation failed (${res.status})`);
  }
  return { reply: data.reply || "", hooks: Array.isArray(data.hooks) ? data.hooks : [] };
}

export async function generateScripts(
  hook: string,
  brief: string,
  edge: Edge
): Promise<string[]> {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ hook, brief, edge }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Script generation failed (${res.status})`);
  return Array.isArray(data.scripts)
    ? data.scripts.filter((s: unknown): s is string => typeof s === "string")
    : [];
}
