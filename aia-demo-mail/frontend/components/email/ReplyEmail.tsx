"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import { EmailCreateRequest } from "@/types/email";
import { replyToEmail } from "@/services/emailService";

interface ReplyEmailProps {
  emailId: string;
  recipient: string;
  subject: string;
  onCancel: () => void;
}

export const ReplyEmail: React.FC<ReplyEmailProps> = ({
  emailId,
  recipient,
  subject,
  onCancel,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmailCreateRequest>({
    sender: "user@example.com", // Default sender
    recipient: recipient,
    subject: subject.startsWith("RE: ") ? subject : `RE: ${subject}`,
    body: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await replyToEmail(emailId, formData);
      router.push("/sent");
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Card className="w-full shadow-sm min-h-[calc(100vh-200px)] flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <CardHeader className="flex flex-col gap-2 p-6">
          <h2 className="text-2xl font-bold">Reply to Email</h2>
        </CardHeader>
        <CardBody className="p-6 flex flex-col gap-5 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="From"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              disabled
              variant="bordered"
              classNames={{
                inputWrapper: "bg-default-100/50"
              }}
            />
            <Input
              label="To"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              disabled
              variant="bordered"
              classNames={{
                inputWrapper: "bg-default-100/50"
              }}
            />
          </div>
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled
            variant="bordered"
            classNames={{
              inputWrapper: "bg-default-100/50"
            }}
          />
          <Textarea
            label="Message"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your reply here..."
            variant="bordered"
            minRows={15}
            className="flex-grow"
            isRequired
          />
        </CardBody>
        <CardFooter className="flex justify-between p-6 mt-auto">
          <Button
            color="default"
            variant="flat"
            onClick={handleCancel}
            type="button"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isLoading}
            size="lg"
          >
            Send Reply
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}; 