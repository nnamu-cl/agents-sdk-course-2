from tinydb import TinyDB, Query
from tinydb.operations import set
from datetime import datetime
import os
import json
from typing import List, Dict, Any, Optional

from app.models.email import generate_email_id

# Ensure the data directory exists
os.makedirs(os.path.join(os.path.dirname(__file__), '..', '..', 'data'), exist_ok=True)

# Initialize TinyDB
db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'emails.json')
db = TinyDB(db_path)
emails_table = db.table('emails')

# Query object
Email = Query()

def init_db():
    """Initialize the database with sample data if it's empty"""
    if len(emails_table) == 0:
        # Add some sample emails
        sample_emails = [
            {
                "id": generate_email_id(),
                "sender": "john.doe@example.com",
                "recipient": "user@example.com",
                "subject": "Welcome to the Email App",
                "body": "This is a sample email to get you started with the Email Application.",
                "timestamp": datetime.now().isoformat(),
                "is_read": False,
                "folder": "inbox",
                "attachments": []
            },
            {
                "id": generate_email_id(),
                "sender": "support@example.com",
                "recipient": "user@example.com",
                "subject": "Your Account Information",
                "body": "Thank you for registering with our service. Here is some important information about your account.",
                "timestamp": datetime.now().isoformat(),
                "is_read": False,
                "folder": "inbox",
                "attachments": []
            },
            {
                "id": generate_email_id(),
                "sender": "user@example.com",
                "recipient": "contact@example.com",
                "subject": "Inquiry about Services",
                "body": "I would like to learn more about the services you offer. Please provide me with additional information.",
                "timestamp": datetime.now().isoformat(),
                "is_read": True,
                "folder": "sent",
                "attachments": []
            }
        ]
        
        for email in sample_emails:
            emails_table.insert(email)

def get_all_emails(folder: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get all emails, optionally filtered by folder"""
    if folder:
        return emails_table.search(Email.folder == folder)
    return emails_table.all()

def get_email_by_id(email_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific email by ID"""
    results = emails_table.search(Email.id == email_id)
    return results[0] if results else None

def create_email(email_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new email"""
    email = {
        "id": generate_email_id(),
        "timestamp": datetime.now().isoformat(),
        "is_read": False,
        "attachments": [],
        **email_data
    }
    emails_table.insert(email)
    return email

def update_email(email_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an email"""
    emails_table.update(update_data, Email.id == email_id)
    return get_email_by_id(email_id)

def delete_email(email_id: str) -> bool:
    """Delete an email"""
    return emails_table.remove(Email.id == email_id) > 0

def mark_email_as_read(email_id: str) -> Optional[Dict[str, Any]]:
    """Mark an email as read"""
    emails_table.update(set('is_read', True), Email.id == email_id)
    return get_email_by_id(email_id) 