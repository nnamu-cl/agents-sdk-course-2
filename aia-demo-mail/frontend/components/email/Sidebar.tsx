"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/react";
import { getEmails } from "@/services/emailService";
import { Email } from "@/types/email";

// Icons for sidebar
const InboxIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const SentIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const DraftsIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const SpamIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [inboxCount, setInboxCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    const fetchEmailCounts = async () => {
      try {
        const inboxEmails = await getEmails('inbox');
        const sentEmails = await getEmails('sent');
        
        setInboxCount(inboxEmails.filter(email => !email.is_read).length);
        setSentCount(sentEmails.length);
      } catch (error) {
        console.error("Failed to fetch email counts:", error);
      }
    };

    fetchEmailCounts();
    
    // Set up an interval to refresh counts every 30 seconds
    const intervalId = setInterval(fetchEmailCounts, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const navItems = [
    {
      name: "Inbox",
      href: "/",
      icon: InboxIcon,
      count: inboxCount,
      active: pathname === "/" || pathname.startsWith("/email/") && !pathname.includes("/sent"),
    },
    {
      name: "Sent",
      href: "/sent",
      icon: SentIcon,
      count: sentCount,
      active: pathname === "/sent" || (pathname.startsWith("/email/") && pathname.includes("/sent")),
    },
    {
      name: "Drafts",
      href: "#",
      icon: DraftsIcon,
      count: 0,
      active: false,
    },
    {
      name: "Trash",
      href: "#",
      icon: TrashIcon,
      count: 0,
      active: false,
    },
    {
      name: "Spam",
      href: "#",
      icon: SpamIcon,
      count: 0,
      active: false,
    },
  ];

  return (
    <div className="w-64 h-full  border-divider flex flex-col">
      <div className="p-4">
        <Link href="/compose" passHref>
          <Button color="primary" className="w-full" startContent={<PlusIcon />}>
            Compose
          </Button>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  item.active 
                    ? "bg-primary-100 text-primary dark:bg-primary-900/30" 
                    : "hover:bg-default-100"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-primary" : "text-default-500"}`} />
                <span className={item.active ? "font-medium" : ""}>{item.name}</span>
                {item.count > 0 && (
                  <Badge 
                    color={item.active ? "primary" : "default"} 
                    variant="flat" 
                    className=""
                  >
                    {item.count}
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Plus icon for compose button
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 5v14m-7-7h14" />
  </svg>
); 