import { useState } from "react";
import HookLibrary from "./HookLibrary";
import CaptionLibrary from "./CaptionLibrary";

type Section = "hooks" | "captions";

export default function LibraryView() {
  const [section, setSection] = useState<Section>("hooks");
  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto flex w-full max-w-5xl px-4 pt-5 md:px-6">
        <div className="flex gap-0.5 rounded-full border border-border bg-surface p-0.5 text-sm">
          {(["hooks", "captions"] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`rounded-full px-3.5 py-1 font-medium transition-colors ${
                section === s ? "bg-lime text-brown" : "text-cream-61 hover:text-cream"
              }`}
            >
              {s === "hooks" ? "Hook formats" : "Caption templates"}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1">{section === "hooks" ? <HookLibrary /> : <CaptionLibrary />}</div>
    </div>
  );
}
