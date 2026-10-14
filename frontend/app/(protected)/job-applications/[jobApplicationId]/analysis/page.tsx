"use client";

import { use } from "react";

import AnalysisPage from "@/components/analysis/AnalysisPage";

interface AnalysisRouteProps {
  params: Promise<{
    jobApplicationId: string;
  }>;
}

export default function AnalysisRoute({ params }: AnalysisRouteProps) {
  const { jobApplicationId } = use(params);

  return <AnalysisPage jobApplicationId={Number(jobApplicationId)} />;
}
