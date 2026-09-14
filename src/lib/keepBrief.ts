// Trim a conversation to n turns without ever dropping turn 0, the brief.
export function keepBrief<T>(turns: T[], n: number): T[] {
  return turns.length > n ? [turns[0], ...turns.slice(-(n - 1))] : turns;
}
