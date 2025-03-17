"use client";

import React from "react";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading job status..." 
}) => (
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