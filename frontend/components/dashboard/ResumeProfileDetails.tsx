"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { useSnackbar } from "notistack";

import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import JobApplicationList from "@/components/dashboard/JobApplicationList";
import Pagination from "@/components/dashboard/Pagination";
import { ROUTES } from "@/constants/routes";
import { jobApplicationService } from "@/services/jobApplicationService";
import type { JobApplication } from "@/types/jobApplication";
import type { ResumeProfile } from "@/types/resumeProfile";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatFileSizeInMb } from "@/utils/file";

const JOB_APPLICATIONS_PAGE_SIZE = 6;

interface ResumeProfileDetailsProps {
  profile: ResumeProfile;
  onCreateJobApplication: () => void;
}

export default function ResumeProfileDetails({
  profile,
  onCreateJobApplication,
}: ResumeProfileDetailsProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

  const [applicationToDelete, setApplicationToDelete] =
    useState<JobApplication | null>(null);
  const [isDeletingApplication, setIsDeletingApplication] = useState(false);

  const loadApplications = useCallback(
    async (page: number) => {
      try {
        setIsLoadingApplications(true);

        const response = await jobApplicationService.getByResumeProfile(
          profile.id,
          page,
          JOB_APPLICATIONS_PAGE_SIZE,
        );

        setApplications(response.data.items);
        setCurrentPage(response.data.page);
        setTotalPages(Math.max(response.data.total_pages, 1));
        setTotalApplications(response.data.total);
      } catch (error: unknown) {
        enqueueSnackbar(
          getApiErrorMessage(
            error,
            "Unable to load job applications. Please try again.",
          ),
          {
            variant: "error",
          },
        );
      } finally {
        setIsLoadingApplications(false);
      }
    },
    [enqueueSnackbar, profile.id],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplications([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalApplications(0);

    void loadApplications(1);
  }, [loadApplications]);

  const handleApplicationClick = (jobApplicationId: number) => {
    router.push(ROUTES.JOB_APPLICATION_ANALYSIS(jobApplicationId));
  };

  const handleDeleteApplication = (application: JobApplication) => {
    setApplicationToDelete(application);
  };

  const handleConfirmDeleteApplication = async () => {
    if (!applicationToDelete) {
      return;
    }

    try {
      setIsDeletingApplication(true);

      const response = await jobApplicationService.delete(
        applicationToDelete.id,
      );

      enqueueSnackbar(response.message, {
        variant: "success",
      });

      const shouldLoadPreviousPage =
        applications.length === 1 && currentPage > 1;

      setApplicationToDelete(null);

      await loadApplications(
        shouldLoadPreviousPage ? currentPage - 1 : currentPage,
      );
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to delete the job application. Please try again.",
        ),
        {
          variant: "error",
        },
      );
    } finally {
      setIsDeletingApplication(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background px-5 py-4 lg:px-8 lg:py-5 xl:px-10">
      {/* Resume profile name */}
      <div className="shrink-0">
        <h1
          className="truncate text-xl font-bold leading-7 text-text-primary lg:text-2xl lg:leading-8"
          title={profile.name}
        >
          {profile.name}
        </h1>
      </div>

      {/* Resume file + Create Job Application */}
      <div className="mt-4 flex shrink-0 items-center gap-4 lg:mt-5 lg:gap-5">
        <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 shadow-card lg:px-5 lg:py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary lg:h-11 lg:w-11">
              <FileText
                className="h-5 w-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold text-text-primary lg:text-base"
                title={profile.original_file_name}
              >
                {profile.original_file_name}
              </p>

              <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-text-secondary lg:text-sm">
                <span className="shrink-0">
                  {formatFileSizeInMb(profile.file_size)}
                </span>

                <span aria-hidden="true">|</span>

                <span className="shrink-0 uppercase">{profile.file_type}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          size="md"
          className="shrink-0"
          onClick={onCreateJobApplication}
        >
          <Plus
            className="h-4 w-4 shrink-0"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">Create Job Application</span>
        </Button>
      </div>

      {/* Job applications */}
      <section className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden lg:mt-5">
        {/* Section heading */}
        <div className="shrink-0">
          <h2 className="text-lg font-bold leading-6 text-text-primary lg:text-xl lg:leading-7">
            Job Applications ({totalApplications})
          </h2>
        </div>

        {/* Application grid */}
        <div className="mt-3 min-h-0 flex-1 overflow-hidden">
          {isLoadingApplications ? (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary"
                aria-label="Loading job applications"
              />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-surface">
              <div className="max-w-sm px-6 text-center">
                <FileText
                  className="mx-auto h-8 w-8 text-text-tertiary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <h3 className="mt-3 text-sm font-semibold text-text-primary">
                  No job applications yet
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                  Create a job application to start tailoring this resume.
                </p>
              </div>
            </div>
          ) : (
            <JobApplicationList
              applications={applications}
              onApplicationClick={handleApplicationClick}
              onDeleteApplication={handleDeleteApplication}
            />
          )}
        </div>

        {/* Pagination is always visible */}
        {!isLoadingApplications && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              void loadApplications(page);
            }}
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={applicationToDelete !== null}
        title="Delete Job Application?"
        message={
          applicationToDelete
            ? `Are you sure you want to delete the job application for "${applicationToDelete.company_name}"? This action cannot be undone.`
            : ""
        }
        isConfirming={isDeletingApplication}
        onClose={() => {
          if (!isDeletingApplication) {
            setApplicationToDelete(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmDeleteApplication();
        }}
      />
    </div>
  );
}
