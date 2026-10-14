"use client";

import { AlertCircle, CheckCircle2, FileText } from "lucide-react";

import type { AnalysisFeedback } from "@/types/analysis";

interface ResumeFeedbackProps {
  feedback: AnalysisFeedback;
}

export default function ResumeFeedback({ feedback }: ResumeFeedbackProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
          <FileText className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </div>

        <h2 className="text-lg font-bold text-text-primary">Resume Feedback</h2>
      </div>

      <p className="mt-4 text-sm leading-6 text-text-secondary">
        {feedback.overall}
      </p>

      {feedback.strengths.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-text-primary">Strengths</h3>

          <ul className="mt-3 space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li
                key={`strength-${index}`}
                className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.gaps.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-text-primary">
            Areas to Improve
          </h3>

          <ul className="mt-3 space-y-2">
            {feedback.gaps.map((gap, index) => (
              <li
                key={`gap-${index}`}
                className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-warning"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
