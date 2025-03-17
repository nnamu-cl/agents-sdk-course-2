"use client";

import React from "react";
import { Chip } from "@heroui/react";

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

interface ActivityFeedProps {
  operations: Operation[];
  getOperationIcon: (operation: Operation) => React.ReactNode;
  getOperationDescription: (operation: Operation) => string;
  formatTimestamp: (timestamp: string) => string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
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
        <div key={index} className="flex items-start gap-2 py-2 hover:bg-default-100/50 px-2 rounded-md transition-colors">
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