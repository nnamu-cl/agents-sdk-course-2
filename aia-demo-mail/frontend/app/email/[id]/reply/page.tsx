"use client";

import { Suspense } from "react";
import { getEmailById } from "@/services/emailService";
import { EmailLayout, ReplyEmail } from "@/components/email";
import { notFound } from "next/navigation";
import { Spinner } from "@heroui/react";

export const dynamic = 'force-dynamic';

interface ReplyPageProps {
  params: Promise<{ id: string }>;
}

async function ReplyContent({ id }: { id: string }) {
  try {
    const originalEmail = await getEmailById(id);
    
    return (
      <EmailLayout>
        <div className="flex flex-col w-full px-4 md:px-6">
          <ReplyEmail 
            emailId={id}
            recipient={originalEmail.sender}
            subject={originalEmail.subject}
            onCancel={() => {
              // This will be handled by the client component
            }}
          />
        </div>
      </EmailLayout>
    );
  } catch (error) {
    console.error("Failed to fetch email for reply:", error);
    notFound();
  }
}

export default async function ReplyPage({ params }: ReplyPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" color="primary" className="mb-4" />
        <p className="text-default-500">Loading reply form...</p>
      </div>
    }>
      <ReplyContent id={id} />
    </Suspense>
  );
} 