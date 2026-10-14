"use client";

interface MatchScoreCardProps {
  score: number;
}

function getScoreStyles(score: number) {
  if (score > 80) {
    return {
      stroke: "var(--rt-success)",
      track: "var(--rt-success-light)",
      text: "text-success",
      badge: "bg-success-light text-success",
      label: "Excellent Match",
    };
  }

  if (score >= 60) {
    return {
      stroke: "var(--rt-warning)",
      track: "var(--rt-warning-light)",
      text: "text-warning",
      badge: "bg-warning-light text-warning",
      label: "Good Match",
    };
  }

  return {
    stroke: "var(--rt-error)",
    track: "var(--rt-error-light)",
    text: "text-error",
    badge: "bg-error-light text-error",
    label: "Needs Improvement",
  };
}

export default function MatchScoreCard({ score }: MatchScoreCardProps) {
  const styles = getScoreStyles(score);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - progress);

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-lg font-bold text-text-primary">Match Score</h2>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg
            viewBox="0 0 110 110"
            className="-rotate-90 h-28 w-28"
            aria-hidden="true"
          >
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke={styles.track}
              strokeWidth="9"
            />

            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke={styles.stroke}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${styles.text}`}>{score}</span>
          </div>
        </div>

        <div className="min-w-0">
          <span
            className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold ${styles.badge}`}
          >
            {styles.label}
          </span>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Your resume has been evaluated against the job description based on
            skills, experience, and overall alignment.
          </p>
        </div>
      </div>
    </section>
  );
}
