"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Clock3, FileSearch, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
import { jobApplicationService } from "@/services/jobApplicationService";
import type { JobApplicationStatus } from "@/types/jobApplication";
import { getApiErrorMessage } from "@/utils/apiError";

const POLLING_INTERVAL_MS = 3000;

interface AnalysisProcessingProps {
  jobApplicationId: number;
}

export default function AnalysisProcessing({
  jobApplicationId,
}: AnalysisProcessingProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState<JobApplicationStatus>("PROCESSING");

  const [isRetrying, setIsRetrying] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const response = await jobApplicationService.getStatus(jobApplicationId);

      setStatus(response.data.status);

      if (response.data.status === "COMPLETED") {
        router.replace(ROUTES.JOB_APPLICATION_ANALYSIS(jobApplicationId));
      }
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to check analysis status. Please try again.",
        ),
        {
          variant: "error",
        },
      );
    }
  }, [enqueueSnackbar, jobApplicationId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkStatus();

    const intervalId = window.setInterval(() => {
      void checkStatus();
    }, POLLING_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkStatus]);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);

      await jobApplicationService.startAnalysis(jobApplicationId);

      setStatus("PROCESSING");

      enqueueSnackbar("Analysis restarted successfully.", {
        variant: "success",
      });
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to restart analysis. Please try again.",
        ),
        {
          variant: "error",
        },
      );
    } finally {
      setIsRetrying(false);
    }
  };

  const isFailed = status === "FAILED";

  if (isFailed) {
    return (
      <div className="flex h-full items-center justify-center bg-background px-6">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error-light text-error">
            <AlertCircle
              className="h-10 w-10"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-7 text-3xl font-bold text-text-primary">
            Analysis failed
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-text-secondary">
            We were unable to complete the analysis for this job application.
            You can retry the analysis and we will try again.
          </p>

          <Button
            type="button"
            size="lg"
            loading={isRetrying}
            className="mt-7"
            onClick={handleRetry}
          >
            {!isRetrying && (
              <RotateCcw
                className="h-5 w-5 shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
            Retry Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-40 w-40 items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-primary-light">
            <FileSearch
              className="h-16 w-16 text-primary"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span className="absolute -right-2 -top-2 h-5 w-5 animate-pulse rounded-full bg-primary" />
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-bold text-text-primary">
          Analyzing your application
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-text-secondary">
          We are comparing your resume with the job description using AI to
          generate a tailored resume, detailed feedback, and suggestions.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-4 rounded-xl border border-primary-light bg-primary-light/40 px-6 py-5 text-left">
          <Clock3
            className="h-9 w-9 shrink-0 text-primary"
            strokeWidth={1.7}
            aria-hidden="true"
          />

          <div>
            <p className="font-semibold text-text-primary">
              This usually takes 40–60 seconds.
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              You can stay on this page while we analyze your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
