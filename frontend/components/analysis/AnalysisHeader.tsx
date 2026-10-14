"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";

interface AnalysisHeaderProps {
  resumeProfileName: string;
  companyName: string;
  jobRole: string;
}

export default function AnalysisHeader({
  resumeProfileName,
  companyName,
  jobRole,
}: AnalysisHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border bg-background px-5 py-3 lg:px-8">
      <button
        type="button"
        onClick={() => router.push(ROUTES.DASHBOARD)}
        className="flex shrink-0 items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft
          className="h-4 w-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span>Back to Resume Profile</span>
      </button>

      <span className="text-text-tertiary">/</span>

      <span
        className="max-w-55 truncate text-sm text-text-secondary"
        title={resumeProfileName}
      >
        {resumeProfileName}
      </span>

      <span className="text-text-tertiary">/</span>

      <span
        className="min-w-0 truncate text-sm font-semibold text-text-primary"
        title={`${companyName} - ${jobRole}`}
      >
        {companyName} - {jobRole}
      </span>
    </div>
  );
}