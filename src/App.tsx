import { useState } from "react";
import ChatView from "./components/ChatView";
import LibraryView from "./components/LibraryView";

type Tab = "studio" | "library";

export default function App() {
  const [tab, setTab] = useState<Tab>("studio");

  return (
    <div className="flex h-screen flex-col bg-background text-cream">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold tracking-tight text-cream">
            kaimakki
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-pink">
            hook studio
          </span>
        </div>
        <nav className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
          <button
            onClick={() => setTab("studio")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "studio" ? "bg-pink text-brown" : "text-cream-61 hover:text-cream"
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setTab("library")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "library" ? "bg-pink text-brown" : "text-cream-61 hover:text-cream"
            }`}
          >
            Library
          </button>
        </nav>
      </header>

      <main className="min-h-0 flex-1">
        {tab === "studio" ? <ChatView /> : <LibraryView />}
      </main>
    </div>
  );
}
