import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { Suspense } from "react";
import { EmailLayout, EmailList } from "@/components/email";
import { getEmails } from "@/services/emailService";
import { InboxIcon } from "@/components/icons";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export const dynamic = 'force-dynamic';

async function InboxContent() {
  const emails = await getEmails('inbox');
  const unreadCount = emails.filter(email => !email.is_read).length;
  
  return (
    <EmailLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <InboxIcon className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Inbox</h2>
          {unreadCount > 0 && (
            <span className="text-sm text-default-500 ml-2">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-default-500 text-sm">
          You have {emails.length} {emails.length === 1 ? 'email' : 'emails'} in your inbox
        </p>
      </div>
      
      <EmailList emails={emails} folder="inbox" />
    </EmailLayout>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-default-500">Loading your inbox...</p>
      </div>
    }>
      <InboxContent />
    </Suspense>
  );
}
