"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AutomatePopup } from "./AutomatePopup";
import { Sparkles } from "lucide-react";

export const AutomateButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Button
          color="primary"
          size="lg"
          radius="full"
          className="font-medium px-6 h-14"
          startContent={
            <motion.div
              animate={{ rotate: isHovered ? 15 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Sparkles size={20} />
            </motion.div>
          }
          onPress={togglePopup}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: 1,
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            Automate Emails
          </motion.span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <AutomatePopup isOpen={isOpen} onClose={togglePopup} />
        )}
      </AnimatePresence>
    </>
  );
}; 