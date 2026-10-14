"use client";

import { useState } from "react";

import ChangesList from "@/components/analysis/ChangesList";
import MatchScoreCard from "@/components/analysis/MatchScoreCard";
import ResumeFeedback from "@/components/analysis/ResumeFeedback";
import SuggestionsList from "@/components/analysis/SuggestionsList";
import type { AnalysisResult } from "@/types/analysis";

type AnalysisTab = "feedback" | "changes";

interface AnalysisTabsProps {
  analysis: AnalysisResult;
}

export default function AnalysisTabs({ analysis }: AnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("feedback");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
      <div className="grid shrink-0 grid-cols-2 border-b border-border bg-surface">
        <button
          type="button"
          onClick={() => setActiveTab("feedback")}
          className={[
            "relative px-4 py-4 text-sm font-semibold transition-colors",
            activeTab === "feedback"
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary",
          ].join(" ")}
        >
          Feedback & Suggestions
          {activeTab === "feedback" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("changes")}
          className={[
            "relative px-4 py-4 text-sm font-semibold transition-colors",
            activeTab === "changes"
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary",
          ].join(" ")}
        >
          Changes
          {activeTab === "changes" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === "feedback" ? (
          <div className="space-y-4 p-4">
            <MatchScoreCard score={analysis.match_score} />

            <ResumeFeedback feedback={analysis.feedback} />

            <SuggestionsList suggestions={analysis.suggestions} />
          </div>
        ) : (
          <ChangesList changes={analysis.changes} />
        )}
      </div>
    </div>
  );
}
