"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
  Divider,
  Spinner,
  Button,
  Tooltip,
  ScrollShadow
} from "@heroui/react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Info,
  Loader2,
  Mail,
  MailCheck,
  MessageSquare,
  RefreshCw,
  Bot,
  Sparkles,
  XCircle,
  ChevronDown,
  X
} from "lucide-react";
import { ProcessingActions } from "./ProcessingActions";

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

// Component for the loading state
interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading job status..." }) => (
  <motion.div
    className="flex flex-col items-center justify-center h-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Spinner size="lg" color="primary" />
    <p className="mt-4 text-sm text-default-500">{message}</p>
  </motion.div>
);

// Component for the error state
interface ErrorStateProps {
  title: string;
  message: string;
  onClose: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onClose }) => (
  <motion.div
    className="flex flex-col items-center justify-center h-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="bg-danger-50 dark:bg-danger-900/20 p-4 rounded-lg border border-danger-200 dark:border-danger-800 max-w-md">
      <div className="flex items-start gap-3">
        <AlertCircle size={24} className="text-danger mt-0.5" />
        <div>
          <h3 className="text-danger-600 dark:text-danger-400 font-medium">{title}</h3>
          <p className="text-sm text-danger-600 dark:text-danger-400 mt-1">{message}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Component for the operation summary
interface OperationSummaryProps {
  processedEmails: number;
  totalEmails: number;
  automationCount: number;
  humanReviewCount: number;
}

const OperationSummary: React.FC<OperationSummaryProps> = ({
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

// Component for the activity feed
interface ActivityFeedProps {
  operations: Operation[];
  getOperationIcon: (operation: Operation) => React.ReactNode;
  getOperationDescription: (operation: Operation) => string;
  formatTimestamp: (timestamp: string) => string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  operations,
  getOperationIcon,
  getOperationDescription,
  formatTimestamp
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium">Latest Activity</h4>
      <Chip size="sm" variant="flat" color="default">
        {operations.length} operations
      </Chip>
    </div>
    
    <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
      {operations.slice().reverse().map((operation, index) => (
        <div key={index} className="flex items-start gap-2 py-2">
          <div className="mt-0.5">{getOperationIcon(operation)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs">{getOperationDescription(operation)}</p>
            <p className="text-xs text-default-400">{formatTimestamp(operation.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Component for the processing report
interface ProcessingReportProps {
  report: string;
}

const ProcessingReport: React.FC<ProcessingReportProps> = ({ report }) => (
  <Card shadow="sm" className="w-full">
    <CardHeader className="pb-0 pt-2 px-3">
      <h4 className="text-sm font-medium">Processing Report</h4>
    </CardHeader>
    <CardBody className="py-2 px-3">
      <div className="bg-default-50 dark:bg-default-100/10 p-2 rounded-lg max-h-[150px] overflow-y-auto custom-scrollbar">
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="text-xs mb-2" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-sm font-bold mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xs font-bold mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xs font-bold mb-1" {...props} />,
            ul: ({ node, ...props }) => <ul className="text-xs list-disc pl-4 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="text-xs list-decimal pl-4 mb-2" {...props} />,
            li: ({ node, ...props }) => <li className="text-xs mb-1" {...props} />
          }}
        >
          {report}
        </ReactMarkdown>
      </div>
    </CardBody>
  </Card>
);

// Main component props
interface ProcessingStatusProps {
  jobId: string;
  emails: Email[];
  onClose: () => void;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            {jobStatus.status === "completed" ? "Processing Complete" : "Processing Emails"}
          </h3>
          <Chip 
            color={jobStatus.status === "completed" ? "success" : "primary"} 
            variant="flat"
            startContent={
              jobStatus.status === "completed" ? 
                <CheckCircle2 size={16} /> : 
                <Clock size={16} />
            }
            size="sm"
          >
            {jobStatus.status === "completed" ? "Complete" : "In Progress"}
          </Chip>
        </div>
        <Chip variant="flat" size="sm">Job ID: {jobId.slice(0, 8)}</Chip>
      </div>
      
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
      
      <div className="flex justify-between">
        <Button
          variant="flat"
          color="default"
          onPress={onClose}
          className="font-medium"
        >
          Close
        </Button>
        
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

// Helper function to generate mock job status for demo purposes
function generateMockJobStatus(jobId: string): JobStatusResponse {
  // Get current timestamp
  const now = new Date();
  
  // Generate timestamps for operations (going back in time)
  const timestamps = [];
  for (let i = 0; i < 10; i++) {
    const timestamp = new Date(now.getTime() - (i * 30000)); // 30 seconds apart
    timestamps.push(timestamp.toISOString());
  }
  
  // Reverse so they're in chronological order
  timestamps.reverse();
  
  // Generate a random status based on how many times this function has been called
  const callCount = Math.floor(Math.random() * 10); // Simulate progress
  let status: "initialized" | "processing" | "completed" | "error";
  
  if (callCount < 2) {
    status = "initialized";
  } else if (callCount < 8) {
    status = "processing";
  } else if (callCount < 10) {
    status = "completed";
  } else {
    status = Math.random() > 0.8 ? "error" : "completed"; // 20% chance of error
  }
  
  // Total number of emails
  const totalEmails = 10;
  
  // Number of processed emails based on status
  let processedEmails = 0;
  if (status === "initialized") {
    processedEmails = 0;
  } else if (status === "processing") {
    processedEmails = Math.min(Math.floor(callCount * (totalEmails / 8)), totalEmails);
  } else {
    processedEmails = totalEmails;
  }
  
  // Generate operations based on processed emails
  const operations: Operation[] = [];
  
  // First operation is always emails added to review/automation
  operations.push({
    type: "emails_added_to_review",
    timestamp: timestamps[0],
    email_ids: ["email1", "email2", "email3"]
  });
  
  operations.push({
    type: "emails_added_to_automation",
    timestamp: timestamps[1],
    email_ids: ["email4", "email5", "email6", "email7", "email8", "email9", "email10"]
  });
  
  // Add action operations based on processed emails
  for (let i = 0; i < Math.min(processedEmails, 7); i++) {
    if (i < timestamps.length - 2) {
      operations.push({
        type: "email_action_performed",
        timestamp: timestamps[i + 2],
        email_id: `email${i + 4}`,
        action: ["reply", "archive", "categorize", "forward"][Math.floor(Math.random() * 4)],
        result: "Success"
      });
    }
  }
  
  // Add review operations
  if (processedEmails >= 3 && timestamps.length > 5) {
    operations.push({
      type: "email_review_added",
      timestamp: timestamps[5],
      email_id: "email1"
    });
  }
  
  if (processedEmails >= 5 && timestamps.length > 6) {
    operations.push({
      type: "email_review_added",
      timestamp: timestamps[6],
      email_id: "email2"
    });
  }
  
  // Add review report if completed
  let reviewReport = undefined;
  if (status === "completed" || processedEmails >= 9) {
    operations.push({
      type: "review_report_added",
      timestamp: timestamps[timestamps.length - 1]
    });
    
    reviewReport = `
Email Processing Summary Report
------------------------------
Total emails processed: ${totalEmails}
Automated actions: ${processedEmails - 3}
Human review required: 3

Key Findings:
- 2 emails contained sensitive information requiring human attention
- 1 email had an unusual request that couldn't be automatically processed
- ${processedEmails - 3} emails were successfully handled through automation

Recommendations:
- Review the flagged emails for potential security concerns
- Consider updating automation rules for better handling of similar cases in the future
- The system successfully identified priority vs. routine communications
    `;
  }
  
  // Generate error message if status is error
  const errorMessage = status === "error" 
    ? "An unexpected error occurred during processing. Please try again or contact support."
    : undefined;
  
  return {
    job_id: jobId,
    status,
    total_emails: totalEmails,
    processed_emails: processedEmails,
    human_review_count: 3,
    automation_count: totalEmails - 3,
    review_report: reviewReport,
    operations,
    error: errorMessage
  };
} 