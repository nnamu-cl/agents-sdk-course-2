"use client";

import React, { ReactNode } from "react";

interface EmailLayoutProps {
  children: ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex flex-col w-full h-full py-4">
      {children}
    </div>
  );
}; 