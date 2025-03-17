"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Input,
  Modal,
  ModalContent,
  Progress,
  Radio,
  RadioGroup,
  Spinner,
  Tab,
  Tabs,
  Tooltip,
  Avatar
} from "@heroui/react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Mail,
  Settings,
  Sparkles,
  X
} from "lucide-react";
import { Email } from "@/types/email";
import { getEmails } from "@/services/emailService";
import { AutomationSettings } from "./AutomationSettings";
import { EmailSelectionList } from "./EmailSelectionList";
import { ProcessingStatusRefactored as ProcessingStatus } from "./ProcessingStatusRefactored";

interface AutomatePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProcessEmailsResponse {
  job_id: string;
  message: string;
  email_count: number;
}

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const AutomatePopup: React.FC<AutomatePopupProps> = ({ isOpen, onClose }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'process' | 'settings'>('process');
  
  // Email selection state
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'all' | 'select'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'pending' | 'processing' | 'completed' | 'error'>('pending');
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Action level state
  const [actionLevel, setActionLevel] = useState<'low' | 'medium' | 'high'>('medium');

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const popupVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // Fetch emails on component mount
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const fetchedEmails = await getEmails('inbox');
        // Filter for unread emails only
        const unreadEmails = fetchedEmails.filter(email => !email.is_read);
        
        // If no unread emails, use all emails for demo purposes
        if (unreadEmails.length === 0) {
          console.log("No unread emails found, using all emails for demo");
          setEmails(fetchedEmails.slice(0, 5)); // Use first 5 emails for demo
        } else {
          setEmails(unreadEmails);
        }
      } catch (error) {
        console.error("Failed to fetch emails:", error);
        // Add some mock emails for demo purposes if fetch fails
        setEmails([
          {
            id: "mock-1",
            sender: "John Doe",
            recipient: "you@example.com",
            subject: "Meeting Tomorrow",
            body: "Let's discuss the project tomorrow at 10 AM.",
            timestamp: new Date().toISOString(),
            is_read: false,
            folder: "inbox"
          },
          {
            id: "mock-2",
            sender: "Jane Smith",
            recipient: "you@example.com",
            subject: "Quarterly Report",
            body: "Please find attached the quarterly report.",
            timestamp: new Date().toISOString(),
            is_read: false,
            folder: "inbox"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Handle email selection
  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  // Select all emails
  const selectAllEmails = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
  };

  // Function to process emails
  const processEmails = async () => {
    setIsProcessing(true);
    setProcessingStatus('pending');
    
    // Determine which emails to process
    const emailsToProcess = selectionMode === 'all' 
      ? emails 
      : emails.filter(email => selectedEmails.includes(email.id));
    
    if (emailsToProcess.length === 0) {
      // No emails to process
      setIsProcessing(false);
      return;
    }
    
    try {
      // Call the real backend API
      const response = await fetch('http://localhost:4000/process-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emailsToProcess,
          action_level: actionLevel
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      setJobId(data.job_id);
      setProcessingStatus('processing');
    } catch (error) {
      console.error("Failed to process emails:", error);
      setProcessingStatus('error');
    }
  };

  // Reset processing state
  const resetProcessing = () => {
    setIsProcessing(false);
    setProcessingStatus('pending');
    setJobId(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
    >
      {/* Backdrop with blur effect */}
      <motion.div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Popup content */}
      <motion.div
        className="relative w-full max-w-md sm:max-w-lg md:max-w-xl z-50 px-4 sm:px-0 mb-6 sm:mb-0"
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="w-full shadow-xl border border-divider">
          <CardHeader className="flex justify-between items-center p-6">
            <div className="flex items-center gap-3">
              <Avatar
                icon={<Sparkles size={24} />}
                classNames={{
                  base: "bg-primary/10",
                  icon: "text-primary"
                }}
              />
              <div>
                <h3 className="text-xl font-bold">Email Automation</h3>
                <p className="text-default-500 text-sm mt-1">Configure and process your emails</p>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              radius="full"
              onPress={onClose}
              className="text-default-500"
            >
              <X size={20} />
            </Button>
          </CardHeader>
          
          <Divider />
          
          <Tabs 
            aria-label="Automation options" 
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as 'process' | 'settings')}
            classNames={{
              base: "w-full",
              tabList: "w-full relative rounded-none border-b border-divider grid grid-cols-2",
              tab: "flex justify-center items-center h-14 w-full data-[selected=true]:text-primary data-[selected=true]:font-medium hover:bg-default-100/50 transition-colors",
              tabContent: "text-sm",
              cursor: "h-[3px] bg-primary"
            }}
            variant="underlined"
            color="primary"
            size="md"
            disableAnimation={false}
          >
            <Tab
              key="process"
              title={
                <div className="flex items-center gap-2 justify-center w-full">
                  <Mail size={18} />
                  <span>Process</span>
                </div>
              }
            >
              <CardBody className="p-1 h-[500px] overflow-hidden">
                {!isProcessing ? (
                  <motion.div 
                    className="space-y-6 h-full overflow-y-auto pr-1 custom-scrollbar"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="space-y-3">
                      <p className="text-sm font-medium">Email Selection</p>
                      <Tabs 
                        aria-label="Email selection mode" 
                        selectedKey={selectionMode}
                        onSelectionChange={(key) => setSelectionMode(key as 'all' | 'select')}
                        size="sm"
                        variant="bordered"
                        color="primary"
                        classNames={{
                          base: "w-full",
                          tabList: "bg-default-100/50 rounded-lg p-1",
                          tab: "h-9 data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary rounded-md",
                          tabContent: "text-xs font-medium"
                        }}
                      >
                        <Tab key="all" title={`Process All (${emails.length})`} />
                        <Tab key="select" title="Select Emails" />
                      </Tabs>
                      
                      {selectionMode === 'all' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-default-100/30 p-3 rounded-lg border border-divider"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm">
                              <span className="font-medium">{emails.length}</span> emails will be processed
                            </p>
                            <Chip size="sm" color="primary" variant="flat">{emails.length} emails</Chip>
                          </div>
                        </motion.div>
                      )}
                      
                      {selectionMode === 'select' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-default-500">
                              <span className="font-medium text-foreground">{selectedEmails.length}</span> of {emails.length} selected
                            </p>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={selectAllEmails}
                              className="text-xs"
                            >
                              {selectedEmails.length === emails.length ? "Deselect All" : "Select All"}
                            </Button>
                          </div>
                          
                          <EmailSelectionList 
                            emails={emails}
                            selectedEmails={selectedEmails}
                            toggleEmailSelection={toggleEmailSelection}
                            isLoading={isLoading}
                          />
                          
                          {selectedEmails.length > 0 && (
                            <div className="mt-2 bg-primary/5 p-2 rounded-lg border border-primary/20">
                              <p className="text-xs text-primary-600 font-medium">
                                {selectedEmails.length} {selectedEmails.length === 1 ? 'email' : 'emails'} selected for processing
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="space-y-3">
                      <p className="text-sm font-medium">Action Permission Level</p>
                      <RadioGroup
                        orientation="horizontal"
                        value={actionLevel}
                        onValueChange={(value) => setActionLevel(value as 'low' | 'medium' | 'high')}
                        classNames={{
                          wrapper: "gap-4"
                        }}
                      >
                        <Radio value="low" description="Low risk actions">
                          Low Risk
                        </Radio>
                        <Radio value="medium" description="Medium risk actions">
                          Medium Risk
                        </Radio>
                        <Radio value="high" description="High risk actions">
                          High Risk
                        </Radio>
                      </RadioGroup>
                    </motion.div>
                  </motion.div>
                ) : (
                  <CardBody className="p-0">
                    {jobId ? (
                      <ProcessingStatus 
                        jobId={jobId}
                        emails={emails}
                        onClose={() => {
                          resetProcessing();
                          onClose();
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Spinner size="lg" color="primary" className="mb-4" />
                        <p className="text-default-500 mb-2">Initializing email processing...</p>
                        <p className="text-xs text-default-400">This may take a moment</p>
                      </div>
                    )}
                  </CardBody>
                )}
              </CardBody>
            </Tab>
            
            <Tab
              key="settings"
              title={
                <div className="flex items-center gap-2 justify-center w-full">
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
              }
            >
              <CardBody className=" h-[500px] overflow-hidden">
                <AutomationSettings />
              </CardBody>
            </Tab>
          </Tabs>
          
          <Divider />
          
          <CardFooter className="flex justify-between p-6">
            <Button
              variant="flat"
              color="default"
              onPress={isProcessing ? resetProcessing : onClose}
              className="font-medium"
            >
              {isProcessing ? "Back" : "Cancel"}
            </Button>
            
            {activeTab === 'process' && !isProcessing && (
              <Button
                color="primary"
                className="font-medium shadow-sm"
                startContent={<Sparkles size={18} />}
                isDisabled={selectionMode === 'select' && selectedEmails.length === 0}
                onPress={processEmails}
              >
                Process Emails
              </Button>
            )}
            
            {activeTab === 'settings' && !isProcessing && (
              <Button
                color="primary"
                className="font-medium shadow-sm"
              >
                Save Settings
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}; 