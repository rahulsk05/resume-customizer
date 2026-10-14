"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileText } from "lucide-react";
import { useSnackbar } from "notistack";

import Button from "@/components/common/Button";
import { jobApplicationService } from "@/services/jobApplicationService";
import { getApiErrorMessage } from "@/utils/apiError";

type ResumeFormat = "pdf" | "docx";

interface DownloadResumeButtonProps {
  jobApplicationId: number;
}

function getFileName(jobApplicationId: number, format: ResumeFormat): string {
  return `tailored-resume-${jobApplicationId}.${format}`;
}

export default function DownloadResumeButton({
  jobApplicationId,
}: DownloadResumeButtonProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [isOpen, setIsOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] =
    useState<ResumeFormat | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = async (format: ResumeFormat) => {
    try {
      setDownloadingFormat(format);
      setIsOpen(false);

      const blob =
        format === "pdf"
          ? await jobApplicationService.getResumePdf(jobApplicationId)
          : await jobApplicationService.getResumeDocx(jobApplicationId);

      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = getFileName(jobApplicationId, format);

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          `Unable to download the ${format.toUpperCase()} resume.`,
        ),
        {
          variant: "error",
        },
      );
    } finally {
      setDownloadingFormat(null);
    }
  };

  const isDownloading = downloadingFormat !== null;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setIsOpen((current) => !current);
          }}
          disabled={isDownloading}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="rounded-r-none"
        >
          <Download
            className="h-4 w-4 shrink-0"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          {isDownloading
            ? `Downloading ${downloadingFormat?.toUpperCase()}...`
            : "Download Resume"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
          }}
          disabled={isDownloading}
          aria-label="Choose resume download format"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="flex h-9 items-center justify-center rounded-r-lg border-l border-white/20 bg-primary px-2 text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-card"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              void handleDownload("pdf");
            }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-surface-muted"
          >
            <FileText
              className="h-4 w-4 shrink-0 text-error"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Download as PDF
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              void handleDownload("docx");
            }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-surface-muted"
          >
            <FileText
              className="h-4 w-4 shrink-0 text-info"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Download as DOCX
          </button>
        </div>
      )}
    </div>
  );
}
