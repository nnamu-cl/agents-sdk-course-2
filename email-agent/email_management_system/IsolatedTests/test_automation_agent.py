import asyncio
import uuid
import logging
import json
import argparse
from typing import List, Dict, Any
from agents import Runner, RunContextWrapper

from ..models.email_models import Email, EmailContext
from ..magents.automation_agent import AutomationAgent
from ..tools.email_tools import (
    enable_verbose_logging
)

# Configure test logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
test_logger = logging.getLogger('test_automation_agent')
test_logger.setLevel(logging.DEBUG)

# Sample emails for testing
SAMPLE_EMAILS = [
    Email(
        id=str(uuid.uuid4()),
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
        id=str(uuid.uuid4()),
        sender="newsletter@tech.com",
        recipient="user@example.com",
        subject="Weekly Tech Newsletter",
        body="Here are this week's top tech stories: 1. New AI breakthrough, 2. Latest smartphone reviews, 3. Upcoming tech events.",
        timestamp="2025-03-16T08:20:15.987654",
        is_read=False,
        folder="inbox",
        attachments=[]
    ),
    Email(
        id=str(uuid.uuid4()),
        sender="support@service.com",
        recipient="user@example.com",
        subject="Your Support Ticket #12345",
        body="Your support ticket regarding account access has been resolved. Please let us know if you need further assistance.",
        timestamp="2025-03-17T14:10:30.246810",
        is_read=False,
        folder="inbox",
        attachments=[]
    )
]

async def test_automation_agent(verbose=False):
    """Test the automation agent's ability to process emails."""
    if verbose:
        enable_verbose_logging()
        test_logger.info("Verbose logging enabled")
    
    test_logger.info("Creating email context with sample emails")
    # Create standard context with sample emails
    context = EmailContext(SAMPLE_EMAILS)
    
    # Mark all sample emails for automation
    email_ids = [email.id for email in SAMPLE_EMAILS]
    context.save_to_automation(email_ids)
    
    test_logger.info("Creating test automation agent")
    # Use the existing AutomationAgent class
    automation_agent = AutomationAgent()
    
    # Prepare email data for the model
    email_data = []
    for email in context.get_automated_emails():
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
    test_logger.info("Running automation agent test...")
    result = await Runner.run(
        automation_agent.agent,
        [{"role": "user", "content": f"Process these {len(email_data)} emails marked for automated processing: {json.dumps(email_data, indent=2)}"}],
        context=context
    )
    
    # Output results
    output_results(result, context)
    
    return context, result

def output_results(result, context):
    """Output results in text format."""
    test_logger.info("Test completed, displaying results")
    print("\n=== Automation Results ===")
    print(f"Total Emails Processed: {len(context.automation_results)}")
    
    for email_id, action_result in context.automation_results.items():
        email = context.get_email_by_id(email_id)
        if email:
            print(f"\nEmail: {email.subject}")
            print(f"From: {email.sender}")
            print(f"Action: {action_result.get('action', 'N/A')}")
            print(f"Result: {action_result.get('result', 'N/A')}")
        else:
            print(f"\nEmail ID: {email_id} (not found)")
            print(f"Action: {action_result.get('action', 'N/A')}")
            print(f"Result: {action_result.get('result', 'N/A')}")
    
    print("\n=== Agent Response ===")
    print(result.final_output)

def main():
    """Run the test with command line arguments."""
    parser = argparse.ArgumentParser(description='Test the automation agent')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    parser.add_argument('--show-emails', '-s', action='store_true', help='Show sample emails before running the test')
    args = parser.parse_args()
    
    if args.show_emails:
        print("=== Sample Emails ===")
        for i, email in enumerate(SAMPLE_EMAILS):
            print(f"\nEmail {i+1}:")
            print(f"Subject: {email.subject}")
            print(f"From: {email.sender}")
            print(f"Body: {email.body}")
    
    # Run the test
    test_logger.info("Running test_automation_agent")
    asyncio.run(test_automation_agent(verbose=args.verbose))

if __name__ == "__main__":
    main() 