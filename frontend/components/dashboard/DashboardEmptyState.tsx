"use client";

import { FilePlus, Plus } from "lucide-react";

import Button from "@/components/common/Button";

interface DashboardEmptyStateProps {
  onCreateProfile: () => void;
}

export default function DashboardEmptyState({
  onCreateProfile,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center overflow-hidden px-6 py-8">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-3xl bg-surface-muted">
          <FilePlus
            className="h-28 w-28 text-primary"
            strokeWidth={1.1}
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-10 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          You don&apos;t have any resume profiles yet.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
          Create your first resume profile to get started with AI-powered resume
          tailoring.
        </p>

        <Button
          type="button"
          size="lg"
          className="mx-auto mt-9 min-w-90"
          onClick={onCreateProfile}
        >
          <Plus className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          Create Resume Profile
        </Button>
      </div>
    </div>
  );
}
