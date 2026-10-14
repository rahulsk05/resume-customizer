"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { AnalysisChange } from "@/types/analysis";

interface ChangesListProps {
  changes: AnalysisChange[];
}

export default function ChangesList({ changes }: ChangesListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    changes.length > 0 ? 0 : null,
  );

  if (changes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-base font-semibold text-text-primary">
            No changes
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            No modifications were required for this resume.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {changes.map((change, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <section
            key={`${change.section}-${index}`}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <button
              type="button"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary">
                  {index + 1}.{" "}
                  {change.section.charAt(0).toUpperCase() +
                    change.section.slice(1)}
                </p>

                <p className="mt-0.5 text-xs text-text-tertiary">
                  {change.change_type}
                </p>
              </div>

              {isExpanded ? (
                <ChevronUp
                  className="h-5 w-5 shrink-0 text-text-secondary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-text-secondary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-border px-4 py-4">
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <div className="rounded-lg bg-surface-muted p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                      Original
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                      {change.original}
                    </p>
                  </div>

                  <div className="rounded-lg bg-success-light p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-success">
                      Tailored
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                      {change.tailored}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-border-light bg-background p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                    Reason
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {change.reason}
                  </p>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
