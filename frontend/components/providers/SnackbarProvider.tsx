"use client";

import { SnackbarProvider as NotistackProvider } from "notistack";
import type { ReactNode } from "react";

interface SnackbarProviderProps {
  children: ReactNode;
}

export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  return (
    <NotistackProvider
      maxSnack={1}
      autoHideDuration={4000}
      preventDuplicate
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {children}
    </NotistackProvider>
  );
}
