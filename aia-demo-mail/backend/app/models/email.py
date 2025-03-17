from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Literal
from datetime import datetime
import uuid

class EmailBase(BaseModel):
    """Base model for email data"""
    sender: EmailStr
    recipient: EmailStr
    subject: str
    body: str

class EmailCreate(EmailBase):
    """Model for creating a new email"""
    pass

class EmailUpdate(BaseModel):
    """Model for updating an email"""
    is_read: Optional[bool] = None

class EmailResponse(EmailBase):
    """Model for email response"""
    id: str
    timestamp: datetime
    is_read: bool
    folder: Literal["inbox", "sent"]
    attachments: Optional[List[str]] = []

    class Config:
        from_attributes = True

def generate_email_id() -> str:
    """Generate a unique ID for an email"""
    return str(uuid.uuid4()) 