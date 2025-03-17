from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Set
from datetime import datetime
import time

class Email(BaseModel):
    id: str
    sender: str
    recipient: str
    subject: str
    body: str
    timestamp: str
    is_read: bool
    folder: str
    attachments: List[str] = Field(default_factory=list)

class ClassificationResult(BaseModel):
    email_id: str
    classification: str  # "human_review" or "automated"
    reasoning: str
    action_needed: Optional[str] = None

class HumanReviewOutput(BaseModel):
    review_summaries: Dict[str, str] = Field(default_factory=dict)  # email_id -> summary
    priority_notes: Dict[str, str] = Field(default_factory=dict)    # email_id -> priority notes

class AutomationResult(BaseModel):
    email_id: str
    action_taken: str
    result: str

class EmailContext:
    """Context class for storing shared data between agents."""
    
    def __init__(self, emails: List[Email] = None):
        # Original emails
        self.emails: List[Email] = emails or []
        
        # Classification results
        self.human_review_ids: List[str] = []
        self.automation_ids: List[str] = []
        
        # Processing results
        self.human_review_results: Dict[str, str] = {}  # email_id -> review summary
        self.automation_results: Dict[str, Dict[str, str]] = {}  # email_id -> {action, result}
        
        # Human review report
        self.human_review_report: str = ""
        
        # Statistics
        self.processed_count: int = 0
        self.total_count: int = len(self.emails) if self.emails else 0
        
        # Public state for API access
        self.public_state: Dict[str, Any] = {
            "status": "initialized",
            "total_emails": self.total_count,
            "processed_emails": 0,
            "human_review_count": 0,
            "automation_count": 0,
            "review_report": "",
            "operations": []
        }
    
    def _add_operation(self, operation_type: str, **kwargs):
        """
        Add an operation to the operations history with timestamp.
        
        Operation Types and Expected Fields:
        
        1. "emails_added_to_review"
           - email_ids: List[str] - IDs of emails marked for human review
        
        2. "emails_added_to_automation"
           - email_ids: List[str] - IDs of emails marked for automated processing
        
        3. "email_action_performed"
           - email_id: str - ID of the email that was processed
           - action: str - Type of action performed (e.g., "reply", "unsubscribe")
           - result: str - Result message from the action
           - content: str - The actual content of the reply (only for "reply" actions)
        
        4. "email_review_added"
           - email_id: str - ID of the email that was reviewed
        
        5. "review_report_added"
           - No additional fields required (the report itself is stored in public_state["review_report"])
        
        Args:
            operation_type: The type of operation being recorded
            **kwargs: Additional fields specific to the operation type
        """
        operation = {
            "type": operation_type,
            "timestamp": datetime.now().isoformat()
        }
        operation.update(kwargs)
        self.public_state["operations"].append(operation)
    
    def add_emails(self, emails: List[Email]):
        """Add emails to the context."""
        self.emails.extend(emails)
        self.total_count = len(self.emails)
        self.public_state["total_emails"] = self.total_count
    
    def get_email_by_id(self, email_id: str) -> Optional[Email]:
        """Get an email by its ID."""
        for email in self.emails:
            if email.id == email_id:
                return email
        return None
    
    def save_to_human_review(self, email_ids: List[str]):
        """Save emails to human review list."""
        self.human_review_ids = email_ids
        self.processed_count = len(self.human_review_ids) + len(self.automation_ids)
        
        # Update public state
        self.public_state["human_review_count"] = len(self.human_review_ids)
        self.public_state["processed_emails"] = self.processed_count
        
        # Add operation
        self._add_operation("emails_added_to_review", email_ids=email_ids)
    
    def save_to_automation(self, email_ids: List[str]):
        """Save emails to automation list."""
        self.automation_ids = email_ids
        self.processed_count = len(self.human_review_ids) + len(self.automation_ids)
        
        # Update public state
        self.public_state["automation_count"] = len(self.automation_ids)
        self.public_state["processed_emails"] = self.processed_count
        
        # Add operation
        self._add_operation("emails_added_to_automation", email_ids=email_ids)
    
    def get_human_review_emails(self) -> List[Email]:
        """Get emails marked for human review."""
        return [email for email in self.emails if email.id in self.human_review_ids]
    
    def get_automated_emails(self) -> List[Email]:
        """Get emails marked for automated processing."""
        return [email for email in self.emails if email.id in self.automation_ids]
    
    def add_human_review_result(self, email_id: str, summary: str):
        """Add a human review result."""
        self.human_review_results[email_id] = summary
        
        # Add operation
        self._add_operation("email_review_added", email_id=email_id)
    
    def add_automation_result(self, email_id: str, action: str, result: str, content: str = None):
        """
        Add an automation result.
        
        Args:
            email_id: The ID of the email
            action: The action taken (e.g., "reply", "unsubscribe")
            result: The result of the action
            content: The actual content of the reply (only for "reply" actions)
        """
        self.automation_results[email_id] = {"action": action, "result": result}
        
        # Add operation with optional content
        operation_data = {"email_id": email_id, "action": action, "result": result}
        if content is not None and action == "reply":
            operation_data["content"] = content
            
        # Add operation
        self._add_operation("email_action_performed", **operation_data)
    
    def set_human_review_report(self, report: str):
        """Set the human review report."""
        self.human_review_report = report
        
        # Update public state
        self.public_state["review_report"] = report
        
        # Add operation
        self._add_operation("review_report_added")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get processing statistics."""
        stats = {
            "total_emails": self.total_count,
            "processed_emails": self.processed_count,
            "human_review_count": len(self.human_review_ids),
            "automation_count": len(self.automation_ids)
        }
        
        # Update public state with latest statistics
        self.public_state.update(stats)
        self.public_state["status"] = "processing" if self.processed_count < self.total_count else "completed"
        
        return stats 