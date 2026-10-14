import type { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <AppHeader />

        <main className="min-h-0 flex-1">{children}</main>

        <AppFooter />
      </div>
    </ProtectedRoute>
  );
}
