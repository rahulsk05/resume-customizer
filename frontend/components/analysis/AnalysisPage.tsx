"use client";

import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import AnalysisHeader from "@/components/analysis/AnalysisHeader";
import AnalysisTabs from "@/components/analysis/AnalysisTabs";
import DownloadResumeButton from "@/components/analysis/DownloadResumeButton";
import TailoredResumeViewer from "@/components/analysis/TailoredResumeViewer";
import { jobApplicationService } from "@/services/jobApplicationService";
import { resumeProfileService } from "@/services/resumeProfileService";
import type { AnalysisResult } from "@/types/analysis";
import type { JobApplication } from "@/types/jobApplication";
import type { ResumeProfile } from "@/types/resumeProfile";
import { getApiErrorMessage } from "@/utils/apiError";

interface AnalysisPageProps {
  jobApplicationId: number;
}

export default function AnalysisPage({ jobApplicationId }: AnalysisPageProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [jobApplication, setJobApplication] = useState<JobApplication | null>(
    null,
  );
  const [resumeProfile, setResumeProfile] = useState<ResumeProfile | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalysisPage = useCallback(async () => {
    try {
      setIsLoading(true);

      const [analysisResponse, jobApplicationResponse, profilesResponse] =
        await Promise.all([
          jobApplicationService.getAnalysis(jobApplicationId),
          jobApplicationService.getById(jobApplicationId),
          resumeProfileService.getAll(),
        ]);

      const currentJobApplication = jobApplicationResponse.data;

      setAnalysis(analysisResponse.data);
      setJobApplication(currentJobApplication);

      const profile = profilesResponse.data.find(
        (item) => item.id === currentJobApplication.resume_profile_id,
      );

      setResumeProfile(profile ?? null);
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to load the analysis. Please try again.",
        ),
        {
          variant: "error",
        },
      );
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, jobApplicationId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAnalysisPage();
  }, [loadAnalysisPage]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-label="Loading analysis"
        />
      </div>
    );
  }

  if (!analysis || !jobApplication) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-5 py-3 lg:px-8">
        <div className="min-w-0 flex-1">
          <AnalysisHeader
            resumeProfileName={resumeProfile?.name ?? "Resume Profile"}
            companyName={jobApplication.company_name}
            jobRole={jobApplication.job_role}
          />
        </div>

        <DownloadResumeButton jobApplicationId={jobApplicationId} />
      </div>

      {/* Main content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col gap-4 px-5 py-4 lg:flex-row lg:px-8 lg:py-5">
          {/* Left: Tailored Resume */}
          <section className="min-h-0 min-w-0 flex-1 overflow-hidden lg:w-[60%] lg:flex-none">
            <TailoredResumeViewer jobApplicationId={jobApplicationId} />
          </section>

          {/* Right: Analysis */}
          <section className="min-h-0 min-w-0 flex-1 overflow-hidden lg:w-[40%] lg:flex-none">
            <AnalysisTabs analysis={analysis} />
          </section>
        </div>
      </div>
    </div>
  );
}
