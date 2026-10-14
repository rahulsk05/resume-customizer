import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AuthProvider from "@/components/providers/AuthProvider";
import SnackbarProvider from "@/components/providers/SnackbarProvider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeTailor",
  description: "Tailor your resume for every opportunity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
