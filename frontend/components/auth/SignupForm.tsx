"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { ROUTES } from "@/constants/routes";
import {
  PASSWORD_MIN_LENGTH,
  signupSchema,
  type SignupFormData,
} from "@/schemas/authSchema";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAuth } from "@/hooks/useAuth";

const SPECIAL_CHARACTER_PATTERN = /[!@#$%^&*]/;

interface PasswordRequirementProps {
  fulfilled: boolean;
  children: string;
}

function PasswordRequirement({
  fulfilled,
  children,
}: PasswordRequirementProps) {
  return (
    <li className="flex items-center gap-2 text-sm text-text-secondary">
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          fulfilled
            ? "border-success bg-success-light text-success"
            : "border-text-tertiary text-text-tertiary",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {fulfilled ? (
          <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
        ) : (
          <span className="h-2 w-2 rounded-full border border-current" />
        )}
      </span>

      <span>{children}</span>
    </li>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { authenticate } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const passwordRequirements = {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialCharacter: SPECIAL_CHARACTER_PATTERN.test(password),
  };

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const response = await authService.signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });

      authenticate(response.data);

      enqueueSnackbar(response.message, {
        variant: "success",
      });

      router.replace(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      enqueueSnackbar(
        getApiErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Get started with AI-powered resume tailoring
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="first_name"
              label="First Name"
              type="text"
              placeholder="First Name"
              autoComplete="given-name"
              disabled={isSubmitting}
              error={errors.first_name?.message}
              leftElement={
                <User
                  className="h-5 w-5 text-text-tertiary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
              {...register("first_name")}
            />

            <Input
              id="last_name"
              label="Last Name"
              type="text"
              placeholder="Last Name"
              autoComplete="family-name"
              disabled={isSubmitting}
              error={errors.last_name?.message}
              leftElement={
                <User
                  className="h-5 w-5 text-text-tertiary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
              {...register("last_name")}
            />
          </div>

          <Input
            id="email"
            label="Email"
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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              autoComplete="new-password"
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

            <Input
              id="confirm_password"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={errors.confirm_password?.message}
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
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  disabled={isSubmitting}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="rounded-md p-1 text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showConfirmPassword ? (
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
              {...register("confirm_password")}
            />
          </div>

          <ul className="space-y-2">
            <PasswordRequirement fulfilled={passwordRequirements.minLength}>
              Minimum 8 characters
            </PasswordRequirement>

            <PasswordRequirement fulfilled={passwordRequirements.hasLetter}>
              Contains a letter
            </PasswordRequirement>

            <PasswordRequirement fulfilled={passwordRequirements.hasNumber}>
              Contains a number
            </PasswordRequirement>

            <PasswordRequirement
              fulfilled={passwordRequirements.hasSpecialCharacter}
            >
              Contains a special character (!@#$%^&*)
            </PasswordRequirement>
          </ul>

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            Create account
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
