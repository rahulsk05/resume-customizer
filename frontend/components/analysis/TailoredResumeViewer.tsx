"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { useSnackbar } from "notistack";

import { jobApplicationService } from "@/services/jobApplicationService";
import { getApiErrorMessage } from "@/utils/apiError";

interface TailoredResumeViewerProps {
  jobApplicationId: number;
}

export default function TailoredResumeViewer({
  jobApplicationId,
}: TailoredResumeViewerProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    const loadResumePdf = async () => {
      try {
        setIsLoading(true);

        const pdfBlob =
          await jobApplicationService.getResumePdf(jobApplicationId);

        objectUrl = URL.createObjectURL(pdfBlob);

        if (isMounted) {
          setPdfUrl(objectUrl);
        }
      } catch (error: unknown) {
        if (isMounted) {
          enqueueSnackbar(
            getApiErrorMessage(error, "Unable to load the tailored resume."),
            {
              variant: "error",
            },
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadResumePdf();

    return () => {
      isMounted = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [enqueueSnackbar, jobApplicationId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary"
            aria-label="Loading tailored resume"
          />

          <p className="text-sm text-text-secondary">
            Loading tailored resume...
          </p>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center bg-surface">
        <div className="max-w-sm px-6 text-center">
          <FileText
            className="mx-auto h-9 w-9 text-text-tertiary"
            strokeWidth={1.5}
            aria-hidden="true"
          />

          <h3 className="mt-3 text-sm font-semibold text-text-primary">
            Unable to load resume
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            The tailored resume could not be displayed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={pdfUrl}
      title="Tailored Resume"
      className="h-full w-full border-0"
    />
  );
}
