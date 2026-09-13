import { useEffect, useState } from "react";
import type { Edge } from "./api";

const EDGE_KEY = "kaimakki-hook-edge";

// Edge is a house-wide setting shared by every generator tab, persisted locally.
export function useEdge(): [Edge, (e: Edge) => void] {
  const [edge, setEdge] = useState<Edge>(
    () => (localStorage.getItem(EDGE_KEY) as Edge) || "bold"
  );
  useEffect(() => {
    localStorage.setItem(EDGE_KEY, edge);
  }, [edge]);
  return [edge, setEdge];
}
