"use client";

import { AlertTriangle, X } from "lucide-react";

import Button from "@/components/common/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isConfirming = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-light text-error">
            <AlertTriangle
              className="h-5 w-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-bold text-text-primary"
              >
                {title}
              </h2>

              <button
                type="button"
                onClick={onClose}
                disabled={isConfirming}
                aria-label="Close"
                className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>

            <p className="mt-2 text-sm leading-5 text-text-secondary">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            loading={isConfirming}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
