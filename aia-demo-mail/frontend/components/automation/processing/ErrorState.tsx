"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  message: string;
  onClose: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onClose }) => (
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
    <Button
      variant="flat"
      color="default"
      onPress={onClose}
      className="mt-4 font-medium"
    >
      Close
    </Button>
  </motion.div>
); 