export type MatchScoreVariant = "success" | "warning" | "error";

export function getMatchScoreVariant(score: number): MatchScoreVariant {
  if (score > 80) {
    return "success";
  }

  if (score >= 60) {
    return "warning";
  }

  return "error";
}
