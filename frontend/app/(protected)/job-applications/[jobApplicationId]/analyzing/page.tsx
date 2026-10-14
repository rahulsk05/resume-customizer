"use client";

import { use } from "react";

import AnalysisProcessing from "@/components/analysis_processing/AnalysisProcessing";

interface AnalyzingPageProps {
  params: Promise<{
    jobApplicationId: string;
  }>;
}

export default function AnalyzingPage({ params }: AnalyzingPageProps) {
  const { jobApplicationId } = use(params);

  return <AnalysisProcessing jobApplicationId={Number(jobApplicationId)} />;
}
