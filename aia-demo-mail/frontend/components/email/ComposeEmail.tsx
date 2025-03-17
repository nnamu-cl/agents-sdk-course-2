"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import { EmailCreateRequest } from "@/types/email";
import { createEmail } from "@/services/emailService";

interface ComposeEmailProps {
  initialValues?: {
    recipient?: string;
    subject?: string;
    body?: string;
  };
  isReply?: boolean;
}

export const ComposeEmail: React.FC<ComposeEmailProps> = ({
  initialValues = {},
  isReply = false,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmailCreateRequest>({
    sender: "user@example.com", // Default sender
    recipient: initialValues.recipient || "",
    subject: initialValues.subject || "",
    body: initialValues.body || "",
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
      await createEmail(formData);
      router.push("/sent");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-sm min-h-[calc(100vh-200px)] flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <CardHeader className="flex flex-col gap-2 p-6">
          <h2 className="text-2xl font-bold">
            {isReply ? "Reply to Email" : "Compose New Email"}
          </h2>
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
              placeholder="recipient@example.com"
              variant="bordered"
              isRequired
            />
          </div>
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            variant="bordered"
            isRequired
          />
          <Textarea
            label="Message"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your message here..."
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
            onClick={() => router.back()}
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
            Send
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}; 