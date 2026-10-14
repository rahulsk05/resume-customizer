"use client";

import { useState } from "react";
import { Building2, X } from "lucide-react";
import { useSnackbar } from "notistack";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { ROUTES } from "@/constants/routes";
import { jobApplicationService } from "@/services/jobApplicationService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { CreateJobApplicationRequest } from "@/types/jobApplication";
import { useRouter } from "next/navigation";

interface CreateJobApplicationModalProps {
  isOpen: boolean;
  resumeProfileId: number;
  onClose: () => void;
}

export default function CreateJobApplicationModal({
  isOpen,
  resumeProfileId,
  onClose,
}: CreateJobApplicationModalProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [jobDescriptionError, setJobDescriptionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setCompanyName("");
    setJobDescription("");
    setCompanyNameError("");
    setJobDescriptionError("");
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCompanyName = companyName.trim();
    const trimmedJobDescription = jobDescription.trim();

    setCompanyNameError("");
    setJobDescriptionError("");

    if (!trimmedCompanyName) {
      setCompanyNameError("Company name is required.");
      return;
    }

    if (!trimmedJobDescription) {
      setJobDescriptionError("Job description is required.");
      return;
    }

    const payload: CreateJobApplicationRequest = {
      resume_profile_id: resumeProfileId,
      company_name: trimmedCompanyName,
      job_description: trimmedJobDescription,
    };

    try {
      setIsSubmitting(true);

      const createResponse = await jobApplicationService.create(payload);

      await jobApplicationService.startAnalysis(createResponse.data.id);

      resetForm();
      onClose();

      router.push(ROUTES.JOB_APPLICATION_ANALYZING(createResponse.data.id));
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to create job application. Please try again.",
        ),
        {
          variant: "error",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-job-application-title"
    >
      <div className="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-job-application-title"
              className="text-xl font-bold text-text-primary sm:text-2xl"
            >
              Create Job Application
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-6">
          <div>
            <label
              htmlFor="company-name"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Company Name
            </label>

            <div className="relative">
              <Building2
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <Input
                id="company-name"
                type="text"
                placeholder="e.g. Amazon"
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value);

                  if (companyNameError) {
                    setCompanyNameError("");
                  }
                }}
                disabled={isSubmitting}
                error={companyNameError}
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Job Description
            </label>

            <textarea
              id="job-description"
              rows={9}
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);

                if (jobDescriptionError) {
                  setJobDescriptionError("");
                }
              }}
              disabled={isSubmitting}
              className={[
                "w-full resize-y rounded-lg border bg-surface px-4 py-3",
                "text-sm text-text-primary placeholder:text-text-tertiary",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                "disabled:cursor-not-allowed disabled:opacity-50",
                jobDescriptionError ? "border-error" : "border-border",
              ].join(" ")}
            />

            {jobDescriptionError && (
              <p className="mt-2 text-sm text-error">{jobDescriptionError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isSubmitting}>
              Create Job Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
