import asyncio
import os
import uuid
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from email_management_system.models.email_models import Email, EmailContext
from email_management_system.magents.manager_agent import ManagerAgent
from agents import set_default_openai_key
import uvicorn

# Create FastAPI app
app = FastAPI(title="Email Management System API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dictionary to store active processing jobs

class EmailManagementSystem:
    def __init__(self):
        self.manager_agent = ManagerAgent()

        # Make sure openai key is set for tracing to work 
        openai_key = os.getenv("OPENAI_API_KEY")
        set_default_openai_key(openai_key)
    
    async def process_emails(self, emails: List[Email], context: EmailContext):
        """
        Process a list of emails through the management system.
        
        Args:
            emails: List of emails to process
            context: The email context for tracking state
            
        Returns:
            dict: Processing results including human review and automation results
        """
        try:
            # Update public state
            context.public_state["status"] = "processing"
            
            # Create context with emails
            context = context or EmailContext(emails)
            
            # Process all emails through the manager agent
            # The manager will handle classification and handoffs to specialized agents
            results = await self.manager_agent.process_emails(emails, context)
            
            # Update public state
            context.public_state["status"] = "completed"
            context.public_state.update(results.get("statistics", {}))
            
            return results
            
        except Exception as e:
            # Update public state with error
            context.public_state["status"] = "error"
            context.public_state["error"] = str(e)
            
            print(f"Error processing emails: {str(e)}")
            return {
                "error": str(e),
                "total_count": len(emails)
            }
        


# Pydantic models for API
class EmailInput(BaseModel):
    id: str
    sender: str
    recipient: str
    subject: str
    body: str
    timestamp: str
    is_read: bool = False
    folder: str = "inbox"
    attachments: List[str] = []

class ProcessEmailsRequest(BaseModel):
    emails: List[EmailInput]

class ProcessEmailsResponse(BaseModel):
    job_id: str
    message: str
    email_count: int

class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    total_emails: int
    processed_emails: int
    human_review_count: int
    automation_count: int
    review_report: str = ""
    operations: List[Dict[str, Any]] = []
    error: str = None


active_jobs: Dict[str, tuple[EmailManagementSystem, EmailContext]] = {}


@app.post("/process-emails", response_model=ProcessEmailsResponse)
async def process_emails_endpoint(request: ProcessEmailsRequest):
    # Convert Pydantic models to Email objects
    emails = [
        Email(
            id=email.id,
            sender=email.sender,
            recipient=email.recipient,
            subject=email.subject,
            body=email.body,
            timestamp=email.timestamp,
            is_read=email.is_read,
            folder=email.folder,
            attachments=email.attachments
        ) for email in request.emails
    ]
    
    # Create a new job ID
    job_id = str(uuid.uuid4())
    
    # Create email system and context
    system = EmailManagementSystem()
    context = EmailContext(emails)
    
    # Store in active jobs
    active_jobs[job_id] = (system, context)
    
    # Start processing in background (don't await)
    asyncio.create_task(system.process_emails(emails, context))
    
    return ProcessEmailsResponse(
        job_id=job_id,
        message="Email processing started",
        email_count=len(emails)
    )

@app.get("/job-status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    if job_id not in active_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get the context for this job
    _, context = active_jobs[job_id]
    
    # Return the public state
    return JobStatusResponse(
        job_id=job_id,
        **context.public_state
    )

async def main():
    # Example usage
    system = EmailManagementSystem()
    
    # Example emails
    emails = [
        Email(
            id="524a45da-7e2b-4b2e-bda0-5bffb2bece6c",
            sender="john.doe@example.com",
            recipient="user@example.com",
            subject="Welcome to the Email App",
            body="This is a sample email to get you started with the Email Application.",
            timestamp="2025-03-13T15:30:30.333915",
            is_read=False,
            folder="inbox",
            attachments=[]
        ),
        Email(
            id="624a45da-7e2b-4b2e-bda0-5bffb2bece6d",
            sender="marketing@company.com",
            recipient="user@example.com",
            subject="Special Offer Inside!",
            body="Don't miss our exclusive sale with 50% off all products. Limited time only!",
            timestamp="2025-03-14T10:15:20.123456",
            is_read=False,
            folder="inbox",
            attachments=[]
        ),
        Email(
            id="724a45da-7e2b-4b2e-bda0-5bffb2bece6e",
            sender="ceo@company.com",
            recipient="user@example.com",
            subject="Confidential: Q2 Financial Results",
            body="Please find attached our confidential Q2 financial results. Do not share externally.",
            timestamp="2025-03-15T09:30:45.654321",
            is_read=False,
            folder="inbox",
            attachments=[]
        )
    ]
    
    # Create context
    context = EmailContext(emails)
    
    # Process emails
    results = await system.process_emails(emails, context)
    print("Processing results:", results)

def run_server():
    """Run the FastAPI server."""
    uvicorn.run("email_management_system.main:app", host="0.0.0.0", port=4000, reload=True)

if __name__ == "__main__":
    # If run directly, use the example code
    asyncio.run(main()) 