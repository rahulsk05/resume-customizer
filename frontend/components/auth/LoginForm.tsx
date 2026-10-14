"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { authenticate } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await authService.login(data);

      authenticate(response.data);

      enqueueSnackbar(response.message, {
        variant: "success",
      });

      router.replace(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(error, "Unable to log in. Please try again."),
        {
          variant: "error",
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className="rounded-xl border border-border bg-surface px-6 py-7 shadow-card sm:px-8 sm:py-8">
        <div className="mb-7 text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-text-primary sm:text-[30px]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Sign in to your ResumeTailor account
          </p>
        </div>

        <div className="space-y-5">
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email?.message}
            leftElement={
              <Mail
                className="h-5 w-5 text-text-tertiary"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isSubmitting}
            error={errors.password?.message}
            leftElement={
              <LockKeyhole
                className="h-5 w-5 text-text-tertiary"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="rounded-md p-1 text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff
                    className="h-5 w-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    className="h-5 w-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                )}
              </button>
            }
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            Login
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.SIGNUP}
            className="font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
