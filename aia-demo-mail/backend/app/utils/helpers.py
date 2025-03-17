from datetime import datetime
from typing import Dict, Any

def format_timestamp(timestamp_str: str) -> str:
    """Format a timestamp string to a human-readable format"""
    try:
        dt = datetime.fromisoformat(timestamp_str)
        return dt.strftime("%B %d, %Y at %I:%M %p")
    except (ValueError, TypeError):
        return timestamp_str

def prepare_email_for_reply(original_email: Dict[str, Any]) -> Dict[str, Any]:
    """Prepare an email template for replying to an original email"""
    subject = original_email["subject"]
    if not subject.startswith("RE: "):
        subject = f"RE: {subject}"
    
    return {
        "recipient": original_email["sender"],
        "subject": subject,
        "body": "",
        "sender": "user@example.com"  # Default sender for replies
    } 