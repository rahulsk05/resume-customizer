"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageCount = Math.max(totalPages, 1);

  return (
    <div className="flex shrink-0 items-center justify-end gap-2 pt-3">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </button>

      {Array.from({ length: pageCount }, (_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "border text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text-primary hover:bg-surface-muted",
            ].join(" ")}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        aria-label="Next page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight
          className="h-4 w-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
