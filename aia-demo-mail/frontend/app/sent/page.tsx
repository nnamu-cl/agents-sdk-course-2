"use client";

import { Suspense } from "react";
import { EmailLayout, EmailList } from "@/components/email";
import { getEmails } from "@/services/emailService";
import { Spinner } from "@heroui/react";
import { SentIcon } from "@/components/icons";

export const dynamic = 'force-dynamic';

async function SentContent() {
  const emails = await getEmails('sent');
  
  return (
    <EmailLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <SentIcon className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Sent Items</h2>
        </div>
        <p className="text-default-500 text-sm">
          You have sent {emails.length} {emails.length === 1 ? 'email' : 'emails'}
        </p>
      </div>
      
      <EmailList emails={emails} folder="sent" />
    </EmailLayout>
  );
}

export default function SentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner size="lg" color="primary" className="mb-4" />
        <p className="text-default-500">Loading your sent items...</p>
      </div>
    }>
      <SentContent />
    </Suspense>
  );
} 