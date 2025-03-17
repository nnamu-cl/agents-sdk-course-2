"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  Slider,
  Switch,
  Textarea,
  Tooltip,
  Avatar
} from "@heroui/react";
import { 
  AlertCircle, 
  BellRing, 
  Brain, 
  Clock, 
  FileText, 
  Filter, 
  Lock, 
  Mail, 
  MessageSquare, 
  Palette, 
  Shield, 
  Sparkles, 
  Tag, 
  Trash, 
  UserCog,
  Info
} from "lucide-react";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
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

export const AutomationSettings: React.FC = () => {
  // AI Behavior settings
  const [responseStyle, setResponseStyle] = useState("professional");
  const [automationLevel, setAutomationLevel] = useState(50);
  const [learningMode, setLearningMode] = useState(true);
  const [aiPersonality, setAiPersonality] = useState("helpful");
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);

  // Email handling settings
  const [autoArchive, setAutoArchive] = useState(true);
  const [autoReply, setAutoReply] = useState(false);
  const [autoForward, setAutoForward] = useState(false);
  const [autoLabel, setAutoLabel] = useState(true);
  const [priorityInbox, setPriorityInbox] = useState(true);
  const [forwardAddress, setForwardAddress] = useState("");
  const [autoReplyTemplate, setAutoReplyTemplate] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [processingReports, setProcessingReports] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(true);
  const [summaryReports, setSummaryReports] = useState("daily");
  const [notificationSound, setNotificationSound] = useState(true);

  // Privacy settings
  const [dataRetention, setDataRetention] = useState("30");
  const [privacyMode, setPrivacyMode] = useState("enhanced");
  const [anonymizeData, setAnonymizeData] = useState(false);
  const [encryptEmails, setEncryptEmails] = useState(true);

  // Appearance settings
  const [compactView, setCompactView] = useState(false);
  const [colorTheme, setColorTheme] = useState("system");

  return (
    <motion.div
      className="space-y-6 py-2 h-[500px] overflow-y-auto pr-2 custom-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Accordion 
        variant="splitted" 
        className="px-0"
        selectionMode="multiple"
        defaultExpandedKeys={["ai-behavior"]}
      >
        {/* AI Behavior Section */}
        <AccordionItem
          key="ai-behavior"
          aria-label="AI Behavior Settings"
          startContent={<Brain className="text-primary" size={20} />}
          title={
            <div className="flex items-center gap-2">
              <span className="font-medium">AI Behavior</span>
              <Chip size="sm" variant="flat" color="primary">Active</Chip>
            </div>
          }
          subtitle="Configure how the AI assistant behaves when processing emails"
          classNames={{
            content: "px-2"
          }}
        >
          <motion.div 
            className="space-y-5 py-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Response Style</p>
                  <Tooltip content="How the AI should sound when generating responses">
                    <span><Info size={14} className="text-default-400" /></span>
                  </Tooltip>
                </div>
                <Select
                  aria-label="Response Style"
                  selectedKeys={[responseStyle]}
                  onChange={(e) => setResponseStyle(e.target.value)}
                  size="sm"
                  className="max-w-[180px]"
                >
                  <SelectItem key="professional">Professional</SelectItem>
                  <SelectItem key="casual">Casual</SelectItem>
                  <SelectItem key="formal">Formal</SelectItem>
                  <SelectItem key="friendly">Friendly</SelectItem>
                  <SelectItem key="concise">Concise</SelectItem>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Automation Level</p>
                    <Tooltip content="How much autonomy the AI has when processing emails">
                      <span><Info size={14} className="text-default-400" /></span>
                    </Tooltip>
                  </div>
                  <span className="text-xs font-medium">{automationLevel}%</span>
                </div>
                <Slider 
                  aria-label="Automation Level" 
                  step={10}
                  maxValue={100} 
                  minValue={0} 
                  value={automationLevel}
                  onChange={(value) => setAutomationLevel(value as number)}
                  className="max-w-full"
                  marks={[
                    { value: 0, label: "Low" },
                    { value: 50, label: "Medium" },
                    { value: 100, label: "High" }
                  ]}
                  color="primary"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Learning Mode</p>
                  <Tooltip content="Allow the AI to learn from your preferences over time">
                    <span><Info size={14} className="text-default-400" /></span>
                  </Tooltip>
                </div>
                <Switch 
                  isSelected={learningMode}
                  onValueChange={setLearningMode}
                  size="sm"
                  color="success"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">AI Personality</p>
                </div>
                <Select
                  aria-label="AI Personality"
                  selectedKeys={[aiPersonality]}
                  onChange={(e) => setAiPersonality(e.target.value)}
                  size="sm"
                  className="max-w-[180px]"
                >
                  <SelectItem key="helpful">Helpful</SelectItem>
                  <SelectItem key="analytical">Analytical</SelectItem>
                  <SelectItem key="creative">Creative</SelectItem>
                  <SelectItem key="efficient">Efficient</SelectItem>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Confidence Threshold</p>
                    <Tooltip content="Minimum confidence level required for AI to take action">
                      <span><Info size={14} className="text-default-400" /></span>
                    </Tooltip>
                  </div>
                  <span className="text-xs font-medium">{confidenceThreshold}%</span>
                </div>
                <Slider 
                  aria-label="Confidence Threshold" 
                  step={5}
                  maxValue={100} 
                  minValue={0} 
                  value={confidenceThreshold}
                  onChange={(value) => setConfidenceThreshold(value as number)}
                  className="max-w-full"
                  color="primary"
                />
              </div>
            </motion.div>
          </motion.div>
        </AccordionItem>
        
        {/* Email Handling Section */}
        <AccordionItem
          key="email-handling"
          aria-label="Email Handling Settings"
          startContent={<Mail className="text-primary" size={20} />}
          title={
            <div className="flex items-center gap-2">
              <span className="font-medium">Email Handling</span>
            </div>
          }
          subtitle="Configure how emails are processed and organized"
          classNames={{
            content: "px-2"
          }}
        >
          <motion.div 
            className="space-y-5 py-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Auto-Archive Processed Emails</p>
                </div>
                <Switch 
                  isSelected={autoArchive}
                  onValueChange={setAutoArchive}
                  size="sm"
                  color="primary"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Auto-Reply to Emails</p>
                </div>
                <Switch 
                  isSelected={autoReply}
                  onValueChange={setAutoReply}
                  size="sm"
                  color="primary"
                />
              </div>
              
              {autoReply && (
                <motion.div 
                  variants={itemVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 border-l-2 border-default-100"
                >
                  <Textarea
                    label="Auto-Reply Template"
                    placeholder="Thank you for your email. I'll get back to you as soon as possible."
                    value={autoReplyTemplate}
                    onChange={(e) => setAutoReplyTemplate(e.target.value)}
                    minRows={3}
                    variant="bordered"
                    size="sm"
                  />
                </motion.div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Auto-Forward Important Emails</p>
                </div>
                <Switch 
                  isSelected={autoForward}
                  onValueChange={setAutoForward}
                  size="sm"
                  color="primary"
                />
              </div>
              
              {autoForward && (
                <motion.div 
                  variants={itemVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 border-l-2 border-default-100"
                >
                  <Input
                    label="Forward Address"
                    placeholder="forward@example.com"
                    value={forwardAddress}
                    onChange={(e) => setForwardAddress(e.target.value)}
                    variant="bordered"
                    size="sm"
                  />
                </motion.div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Auto-Label Emails</p>
                </div>
                <Switch 
                  isSelected={autoLabel}
                  onValueChange={setAutoLabel}
                  size="sm"
                  color="primary"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Priority Inbox</p>
                  <Tooltip content="Automatically prioritize important emails">
                    <span><Info size={14} className="text-default-400" /></span>
                  </Tooltip>
                </div>
                <Switch 
                  isSelected={priorityInbox}
                  onValueChange={setPriorityInbox}
                  size="sm"
                  color="primary"
                />
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Email Categories</p>
                <div className="flex flex-wrap gap-2">
                  <Chip color="primary" variant="flat" className="cursor-pointer">Important</Chip>
                  <Chip color="success" variant="flat" className="cursor-pointer">Work</Chip>
                  <Chip color="warning" variant="flat" className="cursor-pointer">Personal</Chip>
                  <Chip color="danger" variant="flat" className="cursor-pointer">Urgent</Chip>
                  <Chip color="default" variant="flat" className="cursor-pointer">
                    <div className="flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Add New</span>
                    </div>
                  </Chip>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AccordionItem>
        
        {/* Notification Settings */}
        <AccordionItem
          key="notifications"
          aria-label="Notification Settings"
          startContent={<BellRing className="text-primary" size={20} />}
          title={
            <div className="flex items-center gap-2">
              <span className="font-medium">Notifications</span>
            </div>
          }
          subtitle="Configure how you receive notifications about email processing"
          classNames={{
            content: "px-2"
          }}
        >
          <motion.div 
            className="space-y-5 py-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Email Notifications</p>
                </div>
                <Switch 
                  isSelected={emailNotifications}
                  onValueChange={setEmailNotifications}
                  size="sm"
                  color="success"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Processing Reports</p>
                </div>
                <Switch 
                  isSelected={processingReports}
                  onValueChange={setProcessingReports}
                  size="sm"
                  color="success"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Error Alerts</p>
                </div>
                <Switch 
                  isSelected={errorAlerts}
                  onValueChange={setErrorAlerts}
                  size="sm"
                  color="success"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Summary Reports</p>
                </div>
                <Select
                  aria-label="Summary Reports"
                  selectedKeys={[summaryReports]}
                  onChange={(e) => setSummaryReports(e.target.value)}
                  size="sm"
                  className="max-w-[180px]"
                >
                  <SelectItem key="daily">Daily</SelectItem>
                  <SelectItem key="weekly">Weekly</SelectItem>
                  <SelectItem key="monthly">Monthly</SelectItem>
                  <SelectItem key="never">Never</SelectItem>
                </Select>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Notification Sound</p>
                </div>
                <Switch 
                  isSelected={notificationSound}
                  onValueChange={setNotificationSound}
                  size="sm"
                  color="success"
                />
              </div>
            </motion.div>
          </motion.div>
        </AccordionItem>
        
        {/* Privacy & Data */}
        <AccordionItem
          key="privacy"
          aria-label="Privacy Settings"
          startContent={<Shield className="text-primary" size={20} />}
          title={
            <div className="flex items-center gap-2">
              <span className="font-medium">Privacy & Data</span>
            </div>
          }
          subtitle="Configure how your data is handled and stored"
          classNames={{
            content: "px-2"
          }}
        >
          <motion.div 
            className="space-y-5 py-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Data Retention</p>
                </div>
                <Select
                  aria-label="Data Retention"
                  selectedKeys={[dataRetention]}
                  onChange={(e) => setDataRetention(e.target.value)}
                  size="sm"
                  className="max-w-[180px]"
                >
                  <SelectItem key="7">7 days</SelectItem>
                  <SelectItem key="30">30 days</SelectItem>
                  <SelectItem key="90">90 days</SelectItem>
                  <SelectItem key="365">1 year</SelectItem>
                  <SelectItem key="forever">Forever</SelectItem>
                </Select>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Privacy Mode</p>
                  <Tooltip content="Enhanced privacy restricts data collection and processing">
                    <span><Info size={14} className="text-default-400" /></span>
                  </Tooltip>
                </div>
                <Select
                  aria-label="Privacy Mode"
                  selectedKeys={[privacyMode]}
                  onChange={(e) => setPrivacyMode(e.target.value)}
                  size="sm"
                  className="max-w-[180px]"
                >
                  <SelectItem key="standard">Standard</SelectItem>
                  <SelectItem key="enhanced">Enhanced</SelectItem>
                  <SelectItem key="maximum">Maximum</SelectItem>
                </Select>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Anonymize Data</p>
                  <Tooltip content="Remove personally identifiable information from logs">
                    <span><Info size={14} className="text-default-400" /></span>
                  </Tooltip>
                </div>
                <Switch 
                  isSelected={anonymizeData}
                  onValueChange={setAnonymizeData}
                  size="sm"
                  color="success"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Encrypt Emails</p>
                </div>
                <Switch 
                  isSelected={encryptEmails}
                  onValueChange={setEncryptEmails}
                  size="sm"
                  color="success"
                />
              </div>
              
              <div className="pt-2">
                <div className="bg-danger-50 dark:bg-danger-900/20 p-3 rounded-lg border border-danger-200 dark:border-danger-800">
                  <div className="flex items-start gap-2">
                    <Trash className="text-danger mt-0.5" size={16} />
                    <div>
                      <p className="text-sm font-medium text-danger">Delete All Data</p>
                      <p className="text-xs text-danger-600 dark:text-danger-400 mt-1">
                        This will permanently delete all your processed emails and settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AccordionItem>
        
        {/* Appearance */}
        <AccordionItem
          key="appearance"
          aria-label="Appearance Settings"
          startContent={<Palette className="text-primary" size={20} />}
          title={
            <div className="flex items-center gap-2">
              <span className="font-medium">Appearance</span>
            </div>
          }
          subtitle="Configure how the automation interface looks"
          classNames={{
            content: "px-2"
          }}
        >
          <motion.div 
            className="space-y-5 py-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Compact View</p>
                </div>
                <Switch 
                  isSelected={compactView}
                  onValueChange={setCompactView}
                  size="sm"
                  color="primary"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Color Theme</p>
                </div>
                <Select
                  aria-label="Color Theme"
                  selectedKeys={[colorTheme]}
                  onChange={(e) => setColorTheme(e.target.value)}
                  size="sm"
                  className="max-w-[180px]"
                >
                  <SelectItem key="light">Light</SelectItem>
                  <SelectItem key="dark">Dark</SelectItem>
                  <SelectItem key="system">System</SelectItem>
                </Select>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Accent Color</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary cursor-pointer ring-2 ring-primary ring-offset-2 dark:ring-offset-black"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-success cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-warning cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-danger cursor-pointer"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AccordionItem>
        
        {/* Advanced */}
        <AccordionItem
          key="advanced"
          aria-label="Advanced Settings"
          startContent={<UserCog className="text-primary" size={20} />}
          title={
            <div className="flex items-center gap-2">
              <span className="font-medium">Advanced</span>
              <Chip size="sm" variant="flat" color="danger">Expert</Chip>
            </div>
          }
          subtitle="Advanced configuration options for power users"
          classNames={{
            content: "px-2"
          }}
        >
          <motion.div 
            className="space-y-5 py-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="bg-warning-50 dark:bg-warning-900/20 p-3 rounded-lg border border-warning-200 dark:border-warning-800 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-warning mt-0.5" size={16} />
                  <p className="text-xs text-warning-600 dark:text-warning-400">
                    These settings are for advanced users. Incorrect configuration may affect system performance.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">API Configuration</p>
                <Input
                  label="API Endpoint"
                  placeholder="https://api.example.com/v1"
                  defaultValue="http://localhost:4000"
                  variant="bordered"
                  size="sm"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Processing Limits</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Max Emails"
                    placeholder="100"
                    defaultValue="50"
                    type="number"
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Timeout (sec)"
                    placeholder="30"
                    defaultValue="60"
                    type="number"
                    variant="bordered"
                    size="sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Custom Rules</p>
                <Textarea
                  placeholder="Enter custom processing rules (JSON format)"
                  minRows={3}
                  variant="bordered"
                  size="sm"
                  defaultValue={`{
  "priority": ["urgent", "important"],
  "ignore": ["newsletter", "promotion"],
  "forward": ["invoice", "receipt"]
}`}
                />
              </div>
            </motion.div>
          </motion.div>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}; 