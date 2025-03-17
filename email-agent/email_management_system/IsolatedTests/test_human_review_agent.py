import asyncio
import uuid
import logging
import json
import argparse
from typing import List, Dict, Any
from agents import Runner, RunContextWrapper

from ..models.email_models import Email, EmailContext
from ..magents.human_review_agent import HumanReviewAgent
from ..tools.email_tools import (
    enable_verbose_logging
)

# Configure test logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
test_logger = logging.getLogger('test_human_review_agent')
test_logger.setLevel(logging.DEBUG)

# Sample emails for testing
SAMPLE_EMAILS = [
    Email(
        id=str(uuid.uuid4()),
        sender="ceo@company.com",
        recipient="user@example.com",
        subject="Confidential: Q2 Financial Results",
        body="Please find attached our confidential Q2 financial results. Do not share externally.",
        timestamp="2025-03-15T09:30:45.654321",
        is_read=False,
        folder="inbox",
        attachments=[]
    ),
    Email(
        id=str(uuid.uuid4()),
        sender="legal@company.com",
        recipient="user@example.com",
        subject="Contract Review Required",
        body="Please review the attached contract before our meeting tomorrow. We need your input on sections 3.2 and 4.5.",
        timestamp="2025-03-16T11:20:15.987654",
        is_read=False,
        folder="inbox",
        attachments=[]
    ),
    Email(
        id=str(uuid.uuid4()),
        sender="client@bigcorp.com",
        recipient="user@example.com",
        subject="Project Proposal Discussion",
        body="I'd like to schedule a call to discuss our project proposal. We have some concerns about the timeline and budget.",
        timestamp="2025-03-17T14:10:30.246810",
        is_read=False,
        folder="inbox",
        attachments=[]
    )
]

async def test_human_review_agent(verbose=False):
    """Test the human review agent's ability to process emails."""
    if verbose:
        enable_verbose_logging()
        test_logger.info("Verbose logging enabled")
    
    test_logger.info("Creating email context with sample emails")
    # Create standard context with sample emails
    context = EmailContext(SAMPLE_EMAILS)
    
    # Mark all sample emails for human review
    email_ids = [email.id for email in SAMPLE_EMAILS]
    context.save_to_human_review(email_ids)
    
    test_logger.info("Creating test human review agent")
    # Use the existing HumanReviewAgent class
    human_review_agent = HumanReviewAgent()
    
    # Prepare email data for the model
    email_data = []
    for email in context.get_human_review_emails():
        email_data.append({
            "id": email.id,
            "sender": email.sender,
            "recipient": email.recipient,
            "subject": email.subject,
            "body": email.body,
            "timestamp": email.timestamp,
            "is_read": email.is_read,
            "folder": email.folder
        })
    
    # Run the agent
    test_logger.info("Running human review agent test...")
    result = await Runner.run(
        human_review_agent.agent,
        [{"role": "user", "content": f"Process these {len(email_data)} emails marked for human review: {json.dumps(email_data, indent=2)}"}],
        context=context
    )
    
    # Output results
    output_results(result, context)
    
    return context, result

def output_results(result, context):
    """Output results in text format."""
    test_logger.info("Test completed, displaying results")
    print("\n=== Human Review Report ===")
    
    if context.human_review_report:
        print(context.human_review_report)
    else:
        print("No human review report was generated.")
    
    print("\n=== Agent Response ===")
    print(result.final_output)

def main():
    """Run the test with command line arguments."""
    parser = argparse.ArgumentParser(description='Test the human review agent')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    parser.add_argument('--show-emails', '-s', action='store_true', help='Show sample emails before running the test')
    args = parser.parse_args()
    
    if args.show_emails:
        print("=== Sample Emails ===")
        for i, email in enumerate(SAMPLE_EMAILS):
            print(f"\nEmail {i+1}:")
            print(f"ID: {email.id}")
            print(f"Subject: {email.subject}")
            print(f"From: {email.sender}")
            print(f"Body: {email.body}")
    
    # Run the test
    test_logger.info("Running test_human_review_agent")
    asyncio.run(test_human_review_agent(verbose=args.verbose))

if __name__ == "__main__":
    main() 