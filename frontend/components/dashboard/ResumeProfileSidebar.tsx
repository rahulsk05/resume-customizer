"use client";

import { Plus } from "lucide-react";

import Button from "@/components/common/Button";
import ResumeProfileListItem from "@/components/dashboard/ResumeProfileListItem";
import type { ResumeProfile } from "@/types/resumeProfile";

interface ResumeProfileSidebarProps {
  profiles: ResumeProfile[];
  selectedProfileId: number | null;
  onSelectProfile: (profileId: number) => void;
  onCreateProfile: () => void;
  onDeleteProfile: (profile: ResumeProfile) => void;
}

export default function ResumeProfileSidebar({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
}: ResumeProfileSidebarProps) {
  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-b border-border bg-surface px-6 py-7 lg:w-[24%] lg:border-b-0 lg:border-r lg:px-10 lg:py-8">
      <h2 className="shrink-0 text-xl font-bold text-text-primary sm:text-2xl">
        My Resume Profiles
      </h2>

      <Button
        type="button"
        size="lg"
        className="mt-7 w-full shrink-0"
        onClick={onCreateProfile}
      >
        <Plus
          className="h-5 w-5 shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className="truncate">Create Resume Profile</span>
      </Button>

      {profiles.length > 0 && (
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-1">
            {profiles.map((profile) => (
              <ResumeProfileListItem
                key={profile.id}
                profile={profile}
                isSelected={profile.id === selectedProfileId}
                onSelect={onSelectProfile}
                onDelete={onDeleteProfile}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
