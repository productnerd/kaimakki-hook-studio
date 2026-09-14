import { useState } from "react";
import ChatView from "./components/ChatView";
import CaptionsView from "./components/CaptionsView";
import LibraryView from "./components/LibraryView";

type Tab = "hooks" | "captions" | "ideas" | "library";

const TABS: { id: Tab; label: string; soon?: boolean }[] = [
  { id: "hooks", label: "Hooks" },
  { id: "captions", label: "Captions" },
  { id: "ideas", label: "Ideas", soon: true },
  { id: "library", label: "Library" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("hooks");

  return (
    <div className="flex h-screen flex-col bg-background text-cream">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight text-cream">kaimakki</span>
          <span className="font-display text-lg font-extrabold tracking-tight text-pink">hook studio</span>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1">
          {TABS.map((t) =>
            t.soon ? (
              <span
                key={t.id}
                title="Coming soon"
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-cream-31"
              >
                {t.label}
                <span className="rounded-full bg-cream-10 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-cream-61">
                  Soon
                </span>
              </span>
            ) : (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-pink text-brown" : "text-cream-61 hover:text-cream"
                }`}
              >
                {t.label}
              </button>
            )
          )}
        </nav>
      </header>

      <main className="min-h-0 flex-1">
        {tab === "hooks" && <ChatView />}
        {tab === "captions" && <CaptionsView />}
        {tab === "library" && <LibraryView />}
      </main>
    </div>
  );
}
