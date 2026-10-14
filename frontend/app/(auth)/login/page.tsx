import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | ResumeTailor",
  description: "Sign in to your ResumeTailor account",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-150">
      <LoginForm />
    </div>
  );
}
