from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional

from app.models.email import EmailCreate, EmailUpdate, EmailResponse
from app.database import db

router = APIRouter()

@router.get("/emails", response_model=List[EmailResponse])
async def get_emails(folder: Optional[str] = Query(None, description="Filter emails by folder (inbox or sent)")):
    """
    Get all emails, optionally filtered by folder.
    """
    if folder and folder not in ["inbox", "sent"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Folder must be either 'inbox' or 'sent'"
        )
    
    emails = db.get_all_emails(folder)
    # Sort emails by timestamp (newest first)
    emails.sort(key=lambda x: x["timestamp"], reverse=True)
    return emails

@router.get("/emails/{email_id}", response_model=EmailResponse)
async def get_email(email_id: str):
    """
    Get a specific email by ID and mark it as read.
    """
    email = db.get_email_by_id(email_id)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID {email_id} not found"
        )
    
    # Mark the email as read if it's in the inbox
    if email["folder"] == "inbox" and not email["is_read"]:
        email = db.mark_email_as_read(email_id)
    
    return email

@router.post("/emails", response_model=EmailResponse, status_code=status.HTTP_201_CREATED)
async def create_email(email: EmailCreate):
    """
    Create a new email (send an email).
    """
    # Determine the folder based on the sender/recipient
    # For simplicity, we'll assume emails from 'user@example.com' go to 'sent'
    # and all others go to 'inbox'
    folder = "sent" if email.sender == "user@example.com" else "inbox"
    
    email_data = {
        **email.model_dump(),
        "folder": folder
    }
    
    created_email = db.create_email(email_data)
    return created_email

@router.patch("/emails/{email_id}", response_model=EmailResponse)
async def update_email(email_id: str, email_update: EmailUpdate):
    """
    Update an email (e.g., mark as read/unread).
    """
    existing_email = db.get_email_by_id(email_id)
    if not existing_email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID {email_id} not found"
        )
    
    updated_email = db.update_email(email_id, email_update.model_dump(exclude_unset=True))
    return updated_email

@router.delete("/emails/{email_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_email(email_id: str):
    """
    Delete an email.
    """
    existing_email = db.get_email_by_id(email_id)
    if not existing_email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID {email_id} not found"
        )
    
    db.delete_email(email_id)
    return None

@router.post("/emails/{email_id}/reply", response_model=EmailResponse, status_code=status.HTTP_201_CREATED)
async def reply_to_email(email_id: str, reply: EmailCreate):
    """
    Reply to an existing email.
    """
    original_email = db.get_email_by_id(email_id)
    if not original_email:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with ID {email_id} not found"
        )
    
    # For a reply, the recipient should be the original sender
    # and the subject should have "RE: " prefix if it doesn't already
    subject = original_email["subject"]
    if not subject.startswith("RE: "):
        subject = f"RE: {subject}"
    
    # Create the reply email
    reply_data = {
        **reply.model_dump(),
        "subject": subject,
        "folder": "sent"  # Replies always go to sent folder
    }
    
    created_reply = db.create_email(reply_data)
    return created_reply 