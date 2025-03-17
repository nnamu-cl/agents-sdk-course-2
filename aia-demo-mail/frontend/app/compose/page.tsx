"use client";
import { Suspense } from "react";
import { ComposeEmail, EmailLayout } from "@/components/email";
import { Spinner } from "@heroui/react";

export const dynamic = 'force-dynamic';

async function ComposeContent() {
  return (
    <EmailLayout>
      <div className="flex flex-col w-full px-4 md:px-6">
        <ComposeEmail />
      </div>
    </EmailLayout>
  );
}

export default function ComposePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" color="primary" className="mb-4" />
        <p className="text-default-500">Loading compose form...</p>
      </div>
    }>
      <ComposeContent />
    </Suspense>
  );
} 