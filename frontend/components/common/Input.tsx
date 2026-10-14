"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export default function Input({
  id,
  label,
  error,
  helperText,
  leftElement,
  rightElement,
  className = "",
  ...props
}: InputProps) {
  const describedBy = error
    ? `${id}-error`
    : helperText
      ? `${id}-helper`
      : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold text-text-primary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftElement && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leftElement}
          </div>
        )}

        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={[
            "h-11 w-full rounded-lg border bg-surface px-3",
            "text-sm text-text-primary placeholder:text-text-tertiary",
            "outline-none transition-colors",
            "border-border",
            "focus:border-primary focus:ring-2 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:bg-surface-muted",
            error ? "border-error focus:border-error focus:ring-error/15" : "",
            leftElement ? "pl-10" : "",
            rightElement ? "pr-10" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${id}-helper`} className="mt-1.5 text-xs text-text-tertiary">
          {helperText}
        </p>
      )}
    </div>
  );
}
