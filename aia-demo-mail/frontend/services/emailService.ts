import { Email, EmailCreateRequest, EmailUpdateRequest } from "@/types/email";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || `API error: ${response.status}`);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Get all emails, optionally filtered by folder
export const getEmails = async (folder?: 'inbox' | 'sent'): Promise<Email[]> => {
  const url = folder 
    ? `${API_URL}/emails?folder=${folder}` 
    : `${API_URL}/emails`;
  
  const response = await fetch(url);
  return handleResponse(response);
};

// Get a specific email by ID
export const getEmailById = async (id: string): Promise<Email> => {
  const response = await fetch(`${API_URL}/emails/${id}`);
  return handleResponse(response);
};

// Create a new email
export const createEmail = async (email: EmailCreateRequest): Promise<Email> => {
  const response = await fetch(`${API_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  });
  
  return handleResponse(response);
};

// Reply to an email
export const replyToEmail = async (id: string, email: EmailCreateRequest): Promise<Email> => {
  const response = await fetch(`${API_URL}/emails/${id}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  });
  
  return handleResponse(response);
};

// Update an email (mark as read/unread)
export const updateEmail = async (id: string, update: EmailUpdateRequest): Promise<Email> => {
  const response = await fetch(`${API_URL}/emails/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });
  
  return handleResponse(response);
};

// Delete an email
export const deleteEmail = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/emails/${id}`, {
    method: 'DELETE',
  });
  
  return handleResponse(response);
};

// Mark an email as read
export const markAsRead = async (id: string): Promise<Email> => {
  return updateEmail(id, { is_read: true });
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}; 