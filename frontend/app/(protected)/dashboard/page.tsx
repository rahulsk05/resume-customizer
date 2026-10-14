"use client";

import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateJobApplicationModal from "@/components/dashboard/CreateJobApplicationModal";
import CreateResumeProfileModal from "@/components/dashboard/CreateResumeProfileModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import ResumeProfileDetails from "@/components/dashboard/ResumeProfileDetails";
import ResumeProfileSidebar from "@/components/dashboard/ResumeProfileSidebar";
import { resumeProfileService } from "@/services/resumeProfileService";
import type { ResumeProfile } from "@/types/resumeProfile";
import { getApiErrorMessage } from "@/utils/apiError";

export default function DashboardPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [profiles, setProfiles] = useState<ResumeProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] =
    useState(false);

  const [isCreateJobApplicationModalOpen, setIsCreateJobApplicationModalOpen] =
    useState(false);

  const [profileToDelete, setProfileToDelete] = useState<ResumeProfile | null>(
    null,
  );

  const [isDeletingProfile, setIsDeletingProfile] = useState(false);

  const loadProfiles = useCallback(
    async (preferredProfileId?: number) => {
      try {
        setIsLoading(true);

        const response = await resumeProfileService.getAll();
        const loadedProfiles = response.data;

        setProfiles(loadedProfiles);

        setSelectedProfileId((currentSelectedId) => {
          if (
            preferredProfileId !== undefined &&
            loadedProfiles.some((profile) => profile.id === preferredProfileId)
          ) {
            return preferredProfileId;
          }

          if (
            currentSelectedId !== null &&
            loadedProfiles.some((profile) => profile.id === currentSelectedId)
          ) {
            return currentSelectedId;
          }

          return loadedProfiles[0]?.id ?? null;
        });
      } catch (error: unknown) {
        enqueueSnackbar(
          getApiErrorMessage(error, "Unable to load your resume profiles."),
          {
            variant: "error",
          },
        );
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProfiles();
  }, [loadProfiles]);

  const handleProfileCreated = async (profileId: number) => {
    await loadProfiles(profileId);
  };

  const handleDeleteProfile = (profile: ResumeProfile) => {
    setProfileToDelete(profile);
  };

  const handleConfirmDeleteProfile = async () => {
    if (!profileToDelete) {
      return;
    }

    try {
      setIsDeletingProfile(true);

      const response = await resumeProfileService.delete(profileToDelete.id);

      enqueueSnackbar(response.message, {
        variant: "success",
      });

      const deletedProfileId = profileToDelete.id;

      setProfileToDelete(null);

      await loadProfiles(
        selectedProfileId === deletedProfileId
          ? undefined
          : (selectedProfileId ?? undefined),
      );
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to delete the resume profile. Please try again.",
        ),
        {
          variant: "error",
        },
      );
    } finally {
      setIsDeletingProfile(false);
    }
  };

  const selectedProfile =
    profiles.find((profile) => profile.id === selectedProfileId) ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden lg:flex-row">
      <ResumeProfileSidebar
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onSelectProfile={setSelectedProfileId}
        onCreateProfile={() => setIsCreateProfileModalOpen(true)}
        onDeleteProfile={handleDeleteProfile}
      />

      <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
              aria-label="Loading resume profiles"
            />
          </div>
        ) : selectedProfile ? (
          <ResumeProfileDetails
            profile={selectedProfile}
            onCreateJobApplication={() =>
              setIsCreateJobApplicationModalOpen(true)
            }
          />
        ) : (
          <DashboardEmptyState
            onCreateProfile={() => setIsCreateProfileModalOpen(true)}
          />
        )}
      </section>

      <CreateResumeProfileModal
        isOpen={isCreateProfileModalOpen}
        onClose={() => setIsCreateProfileModalOpen(false)}
        onCreated={handleProfileCreated}
      />

      {selectedProfile && (
        <CreateJobApplicationModal
          isOpen={isCreateJobApplicationModalOpen}
          resumeProfileId={selectedProfile.id}
          onClose={() => setIsCreateJobApplicationModalOpen(false)}
        />
      )}

      <ConfirmDialog
        isOpen={profileToDelete !== null}
        title="Delete Resume Profile?"
        message={
          profileToDelete
            ? `Are you sure you want to delete "${profileToDelete.name}"? This will also remove its associated job applications. This action cannot be undone.`
            : ""
        }
        isConfirming={isDeletingProfile}
        onClose={() => {
          if (!isDeletingProfile) {
            setProfileToDelete(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmDeleteProfile();
        }}
      />
    </div>
  );
}
