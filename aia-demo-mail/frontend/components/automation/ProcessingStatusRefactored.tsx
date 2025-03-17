"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { CheckCircle2, Mail, MessageSquare, Eye, Info } from "lucide-react";
import { ProcessingActions } from "./ProcessingActions";
import {
  ProcessingHeader,
  OperationSummary,
  ActivityFeed,
  ProcessingReport,
  LoadingState,
  ErrorState
} from "./processing";

// Custom Unsubscribe icon component
const UnsubscribeIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18.5 10L21 12.5L18.5 15" />
    <path d="M3 12.5H21" />
    <path d="M3 4.5L12 9L21 4.5" />
    <path d="M12 9V21" />
    <path d="M3 19.5L12 14.5" />
    <path d="M21 19.5L12 14.5" />
    <path d="M3 4.5V19.5" />
    <path d="M21 4.5V19.5" />
    <line x1="4" y1="4" x2="20" y2="20" />
  </svg>
);

// Types for job status response
interface Operation {
  type: string;
  timestamp: string;
  email_id?: string;
  email_ids?: string[];
  action?: string;
  result?: string;
  content?: string;
  sender?: string;
  [key: string]: any;
}

interface JobStatusResponse {
  job_id: string;
  status: "initialized" | "processing" | "completed" | "error";
  total_emails: number;
  processed_emails: number;
  human_review_count: number;
  automation_count: number;
  review_report?: string;
  operations: Operation[];
  error?: string;
}

interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  is_read: boolean;
  folder: string;
}

interface ProcessingStatusProps {
  jobId: string;
  emails: Email[];
  onClose: () => void;
}

export const ProcessingStatusRefactored: React.FC<ProcessingStatusProps> = ({
  jobId,
  emails,
  onClose
}) => {
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const jobCompletedRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to mark emails as read
  const markEmailsAsRead = async (operations: Operation[]) => {
    try {
      // Extract email IDs from operations
      const emailIds = operations
        .filter(op => op.email_id || op.email_ids)
        .flatMap(op => op.email_id ? [op.email_id] : op.email_ids || []);
      
      if (emailIds.length === 0) return;
      
      // Call API to mark emails as read
      await fetch(`http://localhost:4000/mark-as-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_ids: emailIds })
      });
      
      console.log(`Marked ${emailIds.length} emails as read`);
    } catch (error) {
      console.error("Error marking emails as read:", error);
    }
  };

  // Function to fetch job status
  const fetchJobStatus = async () => {
    // Skip if job is already completed
    if (jobCompletedRef.current) return;
    
    try {
      const response = await fetch(`http://localhost:4000/job-status/${jobId}`);
      const data = await response.json();
      
      setJobStatus(data);
      setIsLoading(false);
      
      // Check if job is completed or has error
      if (data.status === "completed" || data.status === "error") {
        jobCompletedRef.current = true;
        
        // Clear polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        
        // Mark emails as read if job is completed
        if (data.status === "completed") {
          await markEmailsAsRead(data.operations);
        }
      }
      
      // Set error if job has error
      if (data.status === "error" && data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error fetching job status:", error);
      setError("Failed to fetch job status. Please try again.");
      setIsLoading(false);
    }
  };

  // Set up polling for job status
  useEffect(() => {
    // Initial fetch
    fetchJobStatus();
    
    // Set up polling interval (every 3 seconds)
    pollingIntervalRef.current = setInterval(fetchJobStatus, 3000);
    
    // Clean up on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [jobId]);

  // Function to get operation description
  const getOperationDescription = (operation: Operation): string => {
    switch (operation.type) {
      case "email_processed":
        return `Processed email from ${operation.sender || "unknown sender"}`;
      case "email_action_performed":
        if (operation.action === "reply") {
          return `Generated reply to ${operation.sender || "sender"}`;
        } else if (operation.action === "unsubscribe") {
          return `Unsubscribed from ${operation.sender || "sender"}`;
        } else {
          return `Performed ${operation.action || "action"} on email`;
        }
      case "human_review_required":
        return `Flagged email from ${operation.sender || "sender"} for review`;
      default:
        return `${operation.type.replace(/_/g, " ")}`;
    }
  };

  // Function to get operation icon
  const getOperationIcon = (operation: Operation) => {
    switch (operation.type) {
      case "email_processed":
        return <Mail size={16} className="text-primary" />;
      case "email_action_performed":
        if (operation.action === "reply") {
          return <MessageSquare size={16} className="text-primary" />;
        } else if (operation.action === "unsubscribe") {
          return <UnsubscribeIcon size={16} className="text-warning" />;
        } else {
          return <Mail size={16} className="text-success" />;
        }
      case "human_review_required":
        return <Eye size={16} className="text-warning" />;
      default:
        return <Info size={16} className="text-default-500" />;
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If loading, show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // If error, show error state
  if (error) {
    return <ErrorState title="Processing Error" message={error} onClose={onClose} />;
  }

  // If job status is not available, show error
  if (!jobStatus) {
    return (
      <ErrorState 
        title="Job Not Found" 
        message="The requested job could not be found. Please try again." 
        onClose={onClose} 
      />
    );
  }

  // If job is completed and has actions, show actions UI
  if (jobStatus.status === "completed" && showActions) {
    return (
      <ProcessingActions 
        jobStatus={jobStatus} 
        emails={emails} 
        onClose={onClose} 
      />
    );
  }

  // Render processing status
  return (
    <motion.div
      className="space-y-4 p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ProcessingHeader status={jobStatus.status} jobId={jobStatus.job_id} />
      
      <OperationSummary 
        processedEmails={jobStatus.processed_emails}
        totalEmails={jobStatus.total_emails}
        automationCount={jobStatus.automation_count}
        humanReviewCount={jobStatus.human_review_count}
      />
      
      <ActivityFeed 
        operations={jobStatus.operations}
        getOperationIcon={getOperationIcon}
        getOperationDescription={getOperationDescription}
        formatTimestamp={formatTimestamp}
      />
      
      {jobStatus.review_report && (
        <ProcessingReport report={jobStatus.review_report} />
      )}
      
      <div className="flex justify-between mt-4">
        
        
        {jobStatus.status === "completed" && (
          <Button
            color="primary"
            className="font-medium shadow-sm"
            onPress={() => setShowActions(true)}
            startContent={<CheckCircle2 size={16} />}
          >
            View Actions
          </Button>
        )}
      </div>
    </motion.div>
  );
}; 