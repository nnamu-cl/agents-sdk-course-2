export interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  is_read: boolean;
  folder: 'inbox' | 'sent';
  attachments?: string[];
}

export interface EmailCreateRequest {
  sender: string;
  recipient: string;
  subject: string;
  body: string;
}

export interface EmailUpdateRequest {
  is_read?: boolean;
} 