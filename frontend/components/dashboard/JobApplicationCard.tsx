"use client";

import { ArrowRight, Trash2 } from "lucide-react";

import type { JobApplication } from "@/types/jobApplication";

interface JobApplicationCardProps {
  application: JobApplication;
  onClick: (jobApplicationId: number) => void;
  onDelete: (application: JobApplication) => void;
}

function getScoreColor(score: number): {
  stroke: string;
  track: string;
  text: string;
} {
  if (score > 80) {
    return {
      stroke: "var(--rt-success)",
      track: "var(--rt-success-light)",
      text: "text-success",
    };
  }

  if (score >= 60) {
    return {
      stroke: "var(--rt-warning)",
      track: "var(--rt-warning-light)",
      text: "text-warning",
    };
  }

  return {
    stroke: "var(--rt-error)",
    track: "var(--rt-error-light)",
    text: "text-error",
  };
}

function formatCreatedDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function MatchScore({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[5px] border-border bg-surface-muted">
        <span className="text-sm font-bold text-text-tertiary">—</span>
      </div>
    );
  }

  const colors = getScoreColor(score);

  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg
        viewBox="0 0 56 56"
        className="-rotate-90 h-14 w-14"
        aria-hidden="true"
      >
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth="5"
        />

        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-base font-bold ${colors.text}`}>{score}%</span>
      </div>
    </div>
  );
}

export default function JobApplicationCard({
  application,
  onClick,
  onDelete,
}: JobApplicationCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(application.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(application.id)}
      onKeyDown={handleKeyDown}
      className={[
        "group relative flex h-full min-h-0 w-full cursor-pointer flex-col",
        "overflow-hidden rounded-xl border border-border bg-surface",
        "p-4 text-left shadow-card transition-colors",
        "hover:border-primary/30 hover:bg-surface-muted",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary/30",
      ].join(" ")}
    >
      {/* Match score */}
      <div className="flex shrink-0 items-start justify-between">
        <MatchScore score={application.match_score} />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(application);
          }}
          aria-label={`Delete application for ${application.company_name}`}
          title="Delete job application"
          className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-error-light hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
        >
          <Trash2
            className="h-4.25 w-4.25"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Application information */}
      <div className="mt-auto min-w-0 pt-3">
        <h3
          className="truncate text-base font-bold leading-5 text-text-primary"
          title={application.company_name}
        >
          {application.company_name}
        </h3>

        <p
          className="mt-1 truncate text-sm leading-5 text-text-secondary"
          title={application.job_role}
        >
          {application.job_role}
        </p>

        <div className="mt-2 flex min-w-0 items-center justify-between gap-3">
          <p className="truncate text-xs leading-4 text-text-secondary">
            {formatCreatedDate(application.created_at)}
          </p>

          <ArrowRight
            className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
