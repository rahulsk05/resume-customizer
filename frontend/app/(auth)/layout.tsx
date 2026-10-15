import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="h-16 shrink-0 bg-primary-dark">
        <div className="mx-auto flex h-full max-w-384 items-center px-6 sm:px-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-brand" aria-hidden="true">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M37.5 5.5C26.4 6.2 17.9 9.7 12.6 15C7.3 20.3 6.3 27.8 7.1 36.8C15.9 37.7 23.4 36.6 28.7 31.3C34 26 37.3 17.9 37.5 5.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.5 36.5C13.3 28.6 20.3 21.9 30.2 14.1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="text-[26px] font-bold tracking-tight text-white">
                Resume<span className="text-brand">Tailor</span>
              </span>
            </div>

            <span
              className="hidden h-9 w-px bg-white/30 sm:block"
              aria-hidden="true"
            />

            <p className="hidden text-sm text-white/90 lg:block">
              Tailor your resume for every opportunity
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-0 flex-1 items-center justify-center px-4 py-6 sm:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="flex h-12 shrink-0 items-center justify-center bg-primary-dark px-6">
        <p className="text-xs text-white/80">
          © 2026 ResumeTailor. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
