"use client";

import React from "react";
import { Chip } from "@heroui/react";
import { CheckCircle2, Clock } from "lucide-react";

interface ProcessingHeaderProps {
  status: "initialized" | "processing" | "completed" | "error";
  jobId: string;
}

export const ProcessingHeader: React.FC<ProcessingHeaderProps> = ({ status, jobId }) => {
  const isCompleted = status === "completed";
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">
          {isCompleted ? "Processing Complete" : "Processing Emails"}
        </h3>
        <Chip 
          color={isCompleted ? "success" : "primary"} 
          variant="flat"
          startContent={
            isCompleted ? 
              <CheckCircle2 size={16} /> : 
              <Clock size={16} />
          }
          size="sm"
        >
          {isCompleted ? "Complete" : "In Progress"}
        </Chip>
      </div>
      <Chip variant="flat" size="sm">Job ID: {jobId.slice(0, 8)}</Chip>
    </div>
  );
}; 