import { GENERATOR_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { GeneratedHook, HookFormat } from "./types";

export async function fetchFormats(): Promise<HookFormat[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/kaimakki_hook_formats?select=*&order=family.asc,name.asc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Failed to load formats (${res.status})`);
  return res.json();
}

export interface GenerateResult {
  reply: string;
  hooks: GeneratedHook[];
}

export async function generateHooks(
  messages: { role: "user" | "assistant"; content: string }[],
  count: number
): Promise<GenerateResult> {
  const res = await fetch(GENERATOR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages, count, brief: messages[0]?.content || "" }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Generation failed (${res.status})`);
  }
  return { reply: data.reply || "", hooks: Array.isArray(data.hooks) ? data.hooks : [] };
}
