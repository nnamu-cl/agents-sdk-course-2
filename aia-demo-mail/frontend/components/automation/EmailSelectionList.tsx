"use client";

import React from "react";
import { motion } from "framer-motion";
import { Checkbox, Spinner } from "@heroui/react";
import { Email } from "@/types/email";

interface EmailSelectionListProps {
  emails: Email[];
  selectedEmails: string[];
  toggleEmailSelection: (emailId: string) => void;
  isLoading: boolean;
}

// Animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: i * 0.05
    }
  })
};

export const EmailSelectionList: React.FC<EmailSelectionListProps> = ({
  emails,
  selectedEmails,
  toggleEmailSelection,
  isLoading
}) => {
  return (
    <div className="border-2 border-divider rounded-lg overflow-hidden bg-background dark:bg-default-100/5">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner size="sm" color="primary" />
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-6 text-default-400">
          <p>No emails to process</p>
        </div>
      ) : (
        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
          {emails.map((email, index) => (
            <motion.div
              key={email.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className={`flex items-center gap-3 p-3 border-b border-divider last:border-b-0 ${
                selectedEmails.includes(email.id) 
                  ? 'bg-primary/5 border-l-4 border-l-primary' 
                  : 'hover:bg-default-100/50 border-l-4 border-l-transparent'
              } transition-colors cursor-pointer`}
              onClick={() => toggleEmailSelection(email.id)}
            >
              <Checkbox
                isSelected={selectedEmails.includes(email.id)}
                size="sm"
                color="primary"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{email.sender}</p>
                <p className="text-xs text-default-500 truncate">{email.subject}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}; 