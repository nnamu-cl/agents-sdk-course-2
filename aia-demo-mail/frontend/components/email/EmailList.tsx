"use client";

import React from "react";
import Link from "next/link";
import { Card, CardBody, Avatar, Chip, Divider } from "@heroui/react";
import { Email } from "@/types/email";
import { formatDate } from "@/services/emailService";

// Helper function to get initials from email address
const getInitials = (email: string): string => {
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  return parts.map(part => part[0]?.toUpperCase() || '').join('').slice(0, 2);
};

// Helper function to generate a consistent color based on email
const getAvatarColor = (email: string): string => {
  const colors = [
    "primary", "secondary", "success", "warning", "danger"
  ];
  
  // Simple hash function to get a consistent index
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

interface EmailListProps {
  emails: Email[];
  folder: "inbox" | "sent";
}

export const EmailList: React.FC<EmailListProps> = ({ emails, folder }) => {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-content1 rounded-lg border border-divider">
        <p className="text-lg text-default-500">No emails in your {folder}.</p>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardBody className="p-0">
        <div className="flex flex-col">
          {emails.map((email, index) => {
            const person = folder === "inbox" ? email.sender : email.recipient;
            const initials = getInitials(person);
            const avatarColor = getAvatarColor(person);
            
            return (
              <React.Fragment key={email.id}>
                <Link href={`/email/${email.id}`} className="w-full">
                  <div 
                    className={`flex items-start p-4 hover:bg-default-100 cursor-pointer transition-colors ${
                      !email.is_read && folder === "inbox" ? "bg-primary-50 dark:bg-primary-900/20" : ""
                    }`}
                  >
                    <Avatar
                      name={initials}
                      color={avatarColor as any}
                      className="mr-4 flex-shrink-0"
                      size="sm"
                    />
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <span className={`font-semibold truncate ${!email.is_read && folder === "inbox" ? "text-foreground" : "text-default-700"}`}>
                            {person}
                          </span>
                          {!email.is_read && folder === "inbox" && (
                            <Chip size="sm" color="primary" variant="flat">New</Chip>
                          )}
                        </div>
                        <span className="text-xs text-default-400 whitespace-nowrap">
                          {formatDate(email.timestamp)}
                        </span>
                      </div>
                      
                      <h3 className={`text-sm mb-1 truncate ${!email.is_read && folder === "inbox" ? "font-semibold" : ""}`}>
                        {email.subject}
                      </h3>
                      
                      <p className="text-default-500 text-xs line-clamp-1">
                        {email.body}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < emails.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}; 