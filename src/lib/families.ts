// Accent color per hook family (used for chips/borders). Brand palette only.
export const FAMILY_COLORS: Record<string, string> = {
  "Curiosity Gap": "#eda4e8",
  "Contrarian/Myth-Bust": "#ddf073",
  "Negativity/Warning": "#ff8a7a",
  "Social Proof": "#9fe0d2",
  "Story/In-Medias-Res": "#f0c674",
  "Number/List": "#a8c7ff",
  Question: "#e0a8ff",
  "Bold Claim/Promise": "#ddf073",
  "Relatability/POV": "#eda4e8",
  "Authority/Credibility": "#9fe0d2",
  "FOMO/Urgency": "#ff8a7a",
  "Transformation/Before-After": "#f0c674",
  "Callout/Targeting": "#a8c7ff",
  "Pattern Interrupt": "#ddf073",
  "How-To/Mechanism": "#9fe0d2",
  "Secret/Reveal": "#e0a8ff",
  Comparison: "#a8c7ff",
  Confession: "#eda4e8",
};

export const familyColor = (family: string): string => FAMILY_COLORS[family] || "#fff8e6";
