"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
  Accordion,
  AccordionItem,
  Spinner,
  Tooltip
} from "@heroui/react";
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  Eye,
  AlertCircle,
  Info,
  ArrowRight
} from "lucide-react";

// Custom Unsubscribe icon component
const UnsubscribeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
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

// Types
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

interface ProcessingActionsProps {
  jobStatus: JobStatusResponse;
  emails: Email[];
  onClose: () => void;
}

export const ProcessingActions: React.FC<ProcessingActionsProps> = ({
  jobStatus,
  emails,
  onClose
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Extract actions from operations
  const replyActions = jobStatus.operations.filter(
    op => op.type === "email_action_performed" && op.action === "reply"
  );
  
  const unsubscribeActions = jobStatus.operations.filter(
    op => op.type === "email_action_performed" && op.action === "unsubscribe"
  );
  
  const otherActions = jobStatus.operations.filter(
    op => op.type === "email_action_performed" && 
    op.action !== "reply" && 
    op.action !== "unsubscribe"
  );

  // Find email details by ID
  const getEmailById = (emailId: string): Email | undefined => {
    return emails.find(email => email.id === emailId);
  };

  // Apply a single action
  const applyAction = async (operation: Operation) => {
    if (!operation.email_id) return;
    
    try {
      setAppliedActions(prev => ({ ...prev, [operation.email_id!]: true }));
      
      if (operation.action === "reply" && operation.content) {
        // Send reply
        await fetch(`http://localhost:4000/send-reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email_id: operation.email_id,
            content: operation.content
          })
        });
      } else if (operation.action === "unsubscribe") {
        // Mark as read (unsubscribe is handled by the backend)
        await fetch(`http://localhost:4000/mark-as-read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email_ids: [operation.email_id]
          })
        });
      }
    } catch (error) {
      console.error(`Error applying action to email ${operation.email_id}:`, error);
      setError(`Failed to apply action to email ${operation.email_id}`);
    }
  };

  // Apply all actions
  const applyAllActions = async () => {
    setIsApplying(true);
    setError(null);
    
    try {
      // Apply reply actions
      for (const action of replyActions) {
        await applyAction(action);
      }
      
      // Apply unsubscribe actions
      for (const action of unsubscribeActions) {
        await applyAction(action);
      }
      
      // Apply other actions
      for (const action of otherActions) {
        await applyAction(action);
      }
      
      // Wait a moment before closing
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error applying actions:", error);
      setError("Failed to apply some actions. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Processing Complete</h3>
          <Chip 
            color="success" 
            variant="flat"
            startContent={<CheckCircle2 size={16} />}
            size="sm"
          >
            Success
          </Chip>
        </div>
        <Chip variant="flat" size="sm">Job ID: {jobStatus.job_id.slice(0, 8)}</Chip>
      </div>
      
      <Card shadow="sm" className="w-full">
        <CardHeader className="pb-0 pt-2 px-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Actions Summary</h4>
          </div>
        </CardHeader>
        <CardBody className="py-2 px-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
              <MessageSquare size={18} className="text-primary mb-1" />
              <p className="text-xs font-medium">{replyActions.length}</p>
              <p className="text-xs text-default-500">Replies</p>
            </div>
            <div className="flex flex-col items-center p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
              <UnsubscribeIcon size={18} className="text-warning mb-1" />
              <p className="text-xs font-medium">{unsubscribeActions.length}</p>
              <p className="text-xs text-default-500">Unsubscribes</p>
            </div>
            <div className="flex flex-col items-center p-2 bg-default-50 dark:bg-default-100/10 rounded-lg">
              <Mail size={18} className="text-success mb-1" />
              <p className="text-xs font-medium">{otherActions.length}</p>
              <p className="text-xs text-default-500">Other Actions</p>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {/* Reply Actions */}
        {replyActions.length > 0 && (
          <Accordion variant="splitted" className="mb-2">
            <AccordionItem
              key="replies"
              aria-label="Reply Actions"
              title={
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  <span className="text-sm font-medium">Replies ({replyActions.length})</span>
                </div>
              }
              subtitle="Automated replies to be sent"
              className="py-1"
            >
              <div className="space-y-2 py-1">
                {replyActions.map((action, index) => {
                  const email = getEmailById(action.email_id || "");
                  return (
                    <Card key={index} shadow="sm" className="w-full">
                      <CardBody className="p-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium">{email?.subject || "Unknown Subject"}</p>
                            <p className="text-xs text-default-500">{email?.sender || "Unknown Sender"}</p>
                          </div>
                          {appliedActions[action.email_id || ""] ? (
                            <Chip size="sm" color="success" variant="flat">Applied</Chip>
                          ) : null}
                        </div>
                        <Divider className="my-1" />
                        <div className="bg-default-50 dark:bg-default-100/10 p-2 rounded-lg mt-1">
                          <p className="text-xs">{action.content}</p>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </AccordionItem>
          </Accordion>
        )}
        
        {/* Unsubscribe Actions */}
        {unsubscribeActions.length > 0 && (
          <Accordion variant="splitted" className="mb-2">
            <AccordionItem
              key="unsubscribes"
              aria-label="Unsubscribe Actions"
              title={
                <div className="flex items-center gap-2">
                  <UnsubscribeIcon size={16} className="text-warning" />
                  <span className="text-sm font-medium">Unsubscribes ({unsubscribeActions.length})</span>
                </div>
              }
              subtitle="Emails to unsubscribe from"
              className="py-1"
            >
              <div className="space-y-2 py-1">
                {unsubscribeActions.map((action, index) => {
                  const email = getEmailById(action.email_id || "");
                  return (
                    <Card key={index} shadow="sm" className="w-full">
                      <CardBody className="p-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium">{email?.subject || "Unknown Subject"}</p>
                            <p className="text-xs text-default-500">{email?.sender || "Unknown Sender"}</p>
                          </div>
                          {appliedActions[action.email_id || ""] ? (
                            <Chip size="sm" color="success" variant="flat">Applied</Chip>
                          ) : null}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </AccordionItem>
          </Accordion>
        )}
        
        {/* Other Actions */}
        {otherActions.length > 0 && (
          <Accordion variant="splitted" className="mb-2">
            <AccordionItem
              key="other"
              aria-label="Other Actions"
              title={
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-success" />
                  <span className="text-sm font-medium">Other Actions ({otherActions.length})</span>
                </div>
              }
              subtitle="Additional email actions"
              className="py-1"
            >
              <div className="space-y-2 py-1">
                {otherActions.map((action, index) => {
                  const email = getEmailById(action.email_id || "");
                  return (
                    <Card key={index} shadow="sm" className="w-full">
                      <CardBody className="p-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium">{email?.subject || "Unknown Subject"}</p>
                            <p className="text-xs text-default-500">{email?.sender || "Unknown Sender"}</p>
                            <p className="text-xs text-default-400 mt-1">Action: {action.action}</p>
                          </div>
                          {appliedActions[action.email_id || ""] ? (
                            <Chip size="sm" color="success" variant="flat">Applied</Chip>
                          ) : null}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </AccordionItem>
          </Accordion>
        )}
      </div>
      
      {error && (
        <div className="bg-danger-50 dark:bg-danger-900/20 p-2 rounded-lg border border-danger-200 dark:border-danger-800">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-danger mt-0.5" />
            <p className="text-xs text-danger-600 dark:text-danger-400">{error}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button
          variant="flat"
          color="default"
          onPress={onClose}
          className="font-medium"
          isDisabled={isApplying}
        >
          Close
        </Button>
        
        <Button
          color="primary"
          className="font-medium shadow-sm"
          onPress={applyAllActions}
          isLoading={isApplying}
          isDisabled={isApplying || Object.keys(appliedActions).length === (replyActions.length + unsubscribeActions.length + otherActions.length)}
          startContent={!isApplying && <ArrowRight size={16} />}
        >
          Apply All Actions
        </Button>
      </div>
    </motion.div>
  );
}; 