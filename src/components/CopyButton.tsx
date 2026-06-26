import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        });
      }}
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        copied
          ? "bg-lime text-brown"
          : "bg-cream-10 text-cream-78 hover:bg-cream-20 hover:text-cream"
      }`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
