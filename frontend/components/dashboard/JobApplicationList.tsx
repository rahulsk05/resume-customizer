"use client";

import JobApplicationCard from "@/components/dashboard/JobApplicationCard";
import type { JobApplication } from "@/types/jobApplication";

interface JobApplicationListProps {
  applications: JobApplication[];
  onApplicationClick: (jobApplicationId: number) => void;
  onDeleteApplication: (application: JobApplication) => void;
}

export default function JobApplicationList({
  applications,
  onApplicationClick,
  onDeleteApplication,
}: JobApplicationListProps) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">
      {applications.map((application) => (
        <JobApplicationCard
          key={application.id}
          application={application}
          onClick={onApplicationClick}
          onDelete={onDeleteApplication}
        />
      ))}
    </div>
  );
}
