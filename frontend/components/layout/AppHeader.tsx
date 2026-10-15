"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";

import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";

export default function AppHeader() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, clearAuth } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const response = await authService.logout();

      clearAuth();

      enqueueSnackbar(response.message, {
        variant: "success",
      });

      router.replace(ROUTES.LOGIN);
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(error, "Unable to log out. Please try again."),
        {
          variant: "error",
        },
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="shrink-0 bg-primary-dark">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Brand */}
        <div className="flex min-w-0 items-center">
          <div className="flex shrink-0 items-center gap-3">
            {/* ResumeTailor mark */}
            <svg
              viewBox="0 0 48 48"
              className="h-9 w-9 text-brand"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M37.5 7.5C23.2 8.3 12.7 14.8 9 26.5c-1.6 5-1.3 9.9.1 14C18.5 37.6 26 31.4 30.6 23c3.1-5.7 4.9-11.5 6.9-15.5Z"
                fill="currentColor"
              />
              <path
                d="M10 40c6.2-9.4 12.7-16 24.8-22.4"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>

            <span className="text-2xl font-bold tracking-tight text-white">
              Resume<span className="text-brand">Tailor</span>
            </span>
          </div>

          <div className="mx-5 hidden h-9 w-px bg-white/30 lg:block" />

          <p className="hidden text-base text-white/90 lg:block">
            Tailor your resume for every opportunity
          </p>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-3 sm:flex">
            <UserCircle
              className="h-8 w-8 text-white"
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span className="max-w-45 truncate text-sm font-semibold text-white lg:text-base">
              {user ? `${user.first_name} ${user.last_name}` : ""}
            </span>

            <span className="text-white/80" aria-hidden="true">
              ▾
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            loading={isLoggingOut}
            onClick={handleLogout}
            className="border-white/80 bg-transparent text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
