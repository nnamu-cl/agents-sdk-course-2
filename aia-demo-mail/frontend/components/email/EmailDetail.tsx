"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader, Avatar, Chip } from "@heroui/react";
import { Divider } from "@heroui/react";
import { useRouter } from "next/navigation";
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

interface EmailDetailProps {
  email: Email;
  onReply: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onReply }) => {
  const router = useRouter();

  const handleReply = () => {
    router.push(`/email/${email.id}/reply`);
  };

  const senderInitials = getInitials(email.sender);
  const senderColor = getAvatarColor(email.sender);

  return (
    <Card className="w-full shadow-sm min-h-[calc(100vh-200px)]">
      <CardHeader className="flex flex-col gap-4 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h2 className="text-2xl font-bold">{email.subject}</h2>
          <Chip 
            variant="flat" 
            color={email.folder === "inbox" ? "primary" : "secondary"}
            className="self-start md:self-auto"
          >
            {email.folder === "inbox" ? "Received" : "Sent"}
          </Chip>
        </div>
        
        <div className="flex items-start mt-2">
          <Avatar
            name={senderInitials}
            color={senderColor as any}
            className="mr-4"
            size="md"
          />
          
          <div className="flex-1">
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                <span className="font-semibold text-lg">{email.sender}</span>
                <span className="text-sm text-default-500">
                  {formatDate(email.timestamp)}
                </span>
              </div>
              
              <span className="text-default-500 text-sm">
                To: {email.recipient}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="p-6 flex-grow">
        <div className="whitespace-pre-line text-default-700 leading-relaxed min-h-[200px]">
          {email.body}
        </div>
        
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Attachments ({email.attachments.length})</h3>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((attachment, index) => (
                <Chip key={index} variant="flat" color="default">
                  {attachment}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </CardBody>
      
      <Divider />
      
      <CardFooter className="flex justify-between p-6">
        <Button
          color="default"
          variant="flat"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          color="primary"
          onClick={handleReply}
        >
          Reply
        </Button>
      </CardFooter>
    </Card>
  );
}; 