"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import ReactMarkdown from 'react-markdown';

interface ProcessingReportProps {
  report: string;
}

export const ProcessingReport: React.FC<ProcessingReportProps> = ({ report }) => (
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