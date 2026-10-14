"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useSnackbar } from "notistack";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { RESUME_PROFILE_CONFIG } from "@/constants/resumeProfile";
import { resumeProfileService } from "@/services/resumeProfileService";
import { getApiErrorMessage } from "@/utils/apiError";

interface CreateResumeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (profileId: number) => Promise<void>;
}

export default function CreateResumeProfileModal({
  isOpen,
  onClose,
  onCreated,
}: CreateResumeProfileModalProps) {
  const { enqueueSnackbar } = useSnackbar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [fileError, setFileError] = useState("");

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName("");
    setFile(null);
    setNameError("");
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    setFile(null);
    setFileError("");

    if (!selectedFile) {
      return;
    }

    if (
      !RESUME_PROFILE_CONFIG.ACCEPTED_FILE_TYPES.includes(
        selectedFile.type as (typeof RESUME_PROFILE_CONFIG.ACCEPTED_FILE_TYPES)[number],
      )
    ) {
      setFileError("Please upload a PDF or DOCX file.");
      return;
    }

    if (selectedFile.size > RESUME_PROFILE_CONFIG.MAX_FILE_SIZE_BYTES) {
      setFileError("File size must not exceed 2 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    setNameError("");
    setFileError("");

    if (!trimmedName) {
      setNameError("Resume profile name is required.");
      return;
    }

    if (!file) {
      setFileError("Please select a PDF or DOCX file.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await resumeProfileService.create({
        name: trimmedName,
        file,
      });

      enqueueSnackbar(response.message, {
        variant: "success",
      });

      await onCreated(response.data.id);

      resetForm();
      onClose();
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to create resume profile. Please try again.",
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
      aria-labelledby="create-resume-profile-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="create-resume-profile-title"
              className="text-xl font-bold text-text-primary"
            >
              Create Resume Profile
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Upload a PDF or DOCX resume to create your profile.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <Input
            id="resume-profile-name"
            label="Resume profile name"
            type="text"
            placeholder="e.g. Backend Developer"
            value={name}
            onChange={(event) => {
              setName(event.target.value);

              if (nameError) {
                setNameError("");
              }
            }}
            disabled={isSubmitting}
            error={nameError}
          />

          <div>
            <label
              htmlFor="resume-profile-file"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Resume file
            </label>

            <input
              ref={fileInputRef}
              id="resume-profile-file"
              type="file"
              accept={RESUME_PROFILE_CONFIG.ACCEPTED_FILE_EXTENSIONS.join(",")}
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="block w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-primary-light file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-2 text-xs text-text-tertiary">
              PDF or DOCX, maximum 2 MB.
            </p>

            {file && !fileError && (
              <p
                className="mt-2 truncate text-sm text-text-secondary"
                title={file.name}
              >
                Selected: {file.name}
              </p>
            )}

            {fileError && (
              <p className="mt-2 text-sm text-error">{fileError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isSubmitting}>
              Create Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
