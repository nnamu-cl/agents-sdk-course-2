"use client";

import { Suspense } from "react";
import { getEmailById } from "@/services/emailService";
import { EmailDetail, EmailLayout } from "@/components/email";
import { notFound } from "next/navigation";
import { Spinner } from "@heroui/react";

export const dynamic = 'force-dynamic';

interface EmailDetailPageProps {
  params: Promise<{ id: string }>;
}

async function EmailDetailContent({ id }: { id: string }) {
  try {
    const email = await getEmailById(id);
    
    return (
      <EmailLayout>
        <div className="flex flex-col gap-4 w-full px-4 md:px-6">
          <EmailDetail 
            email={email} 
            onReply={() => {
              // The router.push will be handled in the client component
            }} 
          />
        </div>
      </EmailLayout>
    );
  } catch (error) {
    console.error("Failed to fetch email:", error);
    notFound();
  }
}

export default async function EmailDetailPage({ params }: EmailDetailPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" color="primary" className="mb-4" />
        <p className="text-default-500">Loading email...</p>
      </div>
    }>
      <EmailDetailContent id={id} />
    </Suspense>
  );
} 