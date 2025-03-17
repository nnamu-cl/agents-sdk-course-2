"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Mail, CheckCircle2, Eye } from "lucide-react";

interface OperationSummaryProps {
  processedEmails: number;
  totalEmails: number;
  automationCount: number;
  humanReviewCount: number;
}

export const OperationSummary: React.FC<OperationSummaryProps> = ({
  processedEmails,
  totalEmails,
  automationCount,
  humanReviewCount
}) => (
  <Card shadow="sm" className="w-full">
    <CardHeader className="pb-0 pt-2 px-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Operation Summary</h4>
      </div>
    </CardHeader>
    <CardBody className="py-2 px-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
          <Mail size={18} className="text-primary mb-1" />
          <p className="text-xs font-medium">{processedEmails} / {totalEmails}</p>
          <p className="text-xs text-default-500">Emails Processed</p>
        </div>
        <div className="flex flex-col items-center p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
          <CheckCircle2 size={18} className="text-success mb-1" />
          <p className="text-xs font-medium">{automationCount}</p>
          <p className="text-xs text-default-500">Automated Actions</p>
        </div>
        <div className="flex flex-col items-center p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
          <Eye size={18} className="text-warning mb-1" />
          <p className="text-xs font-medium">{humanReviewCount}</p>
          <p className="text-xs text-default-500">Need Review</p>
        </div>
      </div>
    </CardBody>
  </Card>
); 