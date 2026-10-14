import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

const hasLetter = /[A-Za-z]/;
const hasNumber = /\d/;
const hasSpecialCharacter = /[!@#$%^&*]/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .pipe(z.email("Please enter a valid email address.")),

  password: z.string().min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required."),

    last_name: z.string().trim().min(1, "Last name is required."),

    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .pipe(z.email("Please enter a valid email address.")),

    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      )
      .regex(hasLetter, "Password must contain at least one letter.")
      .regex(hasNumber, "Password must contain at least one number.")
      .regex(
        hasSpecialCharacter,
        "Password must contain at least one special character.",
      ),

    confirm_password: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export type SignupFormData = z.infer<typeof signupSchema>;
