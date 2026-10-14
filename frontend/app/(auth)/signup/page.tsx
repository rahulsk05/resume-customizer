import type { Metadata } from "next";

import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | ResumeTailor",
  description: "Create your ResumeTailor account",
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-182.5">
      <SignupForm />
    </div>
  );
}
