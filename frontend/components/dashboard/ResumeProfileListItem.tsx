"use client";

import { FileText, Trash2 } from "lucide-react";

import type { ResumeProfile } from "@/types/resumeProfile";

interface ResumeProfileListItemProps {
  profile: ResumeProfile;
  isSelected: boolean;
  onSelect: (profileId: number) => void;
  onDelete: (profile: ResumeProfile) => void;
}

export default function ResumeProfileListItem({
  profile,
  isSelected,
  onSelect,
  onDelete,
}: ResumeProfileListItemProps) {
  return (
    <div
      className={[
        "group flex w-full min-w-0 items-center rounded-lg",
        isSelected
          ? "bg-primary-light text-text-primary"
          : "text-text-secondary hover:bg-surface-muted",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onSelect(profile.id)}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
      >
        <FileText
          className="h-5 w-5 shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <span
          title={profile.name}
          className="min-w-0 flex-1 truncate text-sm font-medium"
        >
          {profile.name}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onDelete(profile)}
        aria-label={`Delete ${profile.name}`}
        title="Delete resume profile"
        className="mr-2 shrink-0 rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-error-light hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}
