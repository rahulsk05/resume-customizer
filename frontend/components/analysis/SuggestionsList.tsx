"use client";

import { Lightbulb } from "lucide-react";

import type { AnalysisSuggestion } from "@/types/analysis";

interface SuggestionsListProps {
  suggestions: AnalysisSuggestion[];
}

function getPriorityClass(priority: AnalysisSuggestion["priority"]) {
  if (priority === "High") {
    return "bg-warning-light text-warning";
  }

  if (priority === "Medium") {
    return "bg-primary-light text-primary";
  }

  return "bg-surface-muted text-text-secondary";
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-light text-warning">
          <Lightbulb className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </div>

        <h2 className="text-lg font-bold text-text-primary">Suggestions</h2>
      </div>

      <div className="mt-4 space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.type}-${index}`}
            className="flex items-start gap-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning-light text-xs font-bold text-warning">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  {suggestion.type}
                </span>

                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${getPriorityClass(
                    suggestion.priority,
                  )}`}
                >
                  {suggestion.priority}
                </span>
              </div>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {suggestion.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
