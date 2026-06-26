export interface AppliedExample {
  vertical: string;
  hook: string;
}

export interface HookFormat {
  id: string;
  name: string;
  family: string;
  trigger: string;
  template: string;
  why_it_works: string;
  examples: string[];
  applied_examples: AppliedExample[];
  sources: string[];
}

export interface GeneratedHook {
  text: string;
  format_id: string;
  format_name: string;
  family: string;
  angle: string;
  rationale: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string; // the reply text (or the user's brief)
  hooks?: GeneratedHook[];
}
