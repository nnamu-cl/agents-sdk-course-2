import asyncio
import uuid
import logging
import json
from typing import List, Dict, Any
from agents import Agent, Runner, RunContextWrapper 

from ..models.email_models import Email, EmailContext
from ..magents.manager_agent import MANAGER_INSTRUCTIONS
from ..tools.email_tools import (
    save_emails_to_human_review,
    save_emails_to_automation,
    get_statistics,
    enable_verbose_logging
)

# Configure test logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
test_logger = logging.getLogger('test_manager_agent')
test_logger.setLevel(logging.DEBUG)

# Enable verbose logging for email tools
enable_verbose_logging()

# Sample emails for testing
SAMPLE_EMAILS = [
    Email(
        id=str(uuid.uuid4()),
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

# Use the actual production tools
MANAGER_TEST_TOOLS = [
    save_emails_to_human_review,
    save_emails_to_automation,
    get_statistics
]

async def test_manager_agent():
    """Test the manager agent's ability to classify emails."""
    test_logger.info("Creating email context with sample emails")
    # Create standard context with sample emails
    context = EmailContext(SAMPLE_EMAILS)
    
    test_logger.info("Creating test manager agent")
    # Create a test agent without handoffs
    test_agent = Agent(
        name="test_manager_agent",
        instructions=MANAGER_INSTRUCTIONS,
        tools=MANAGER_TEST_TOOLS
    )
    
    # Prepare email data for the model
    email_data = []
    for email in SAMPLE_EMAILS:
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
    test_logger.info("Running manager agent test...")
    result = await Runner.run(
        test_agent,
        [{"role": "user", "content": f"Process these {len(SAMPLE_EMAILS)} emails: {json.dumps(email_data, indent=2)}"}],
        context=context
    )
    
    # Print results
    test_logger.info("Test completed, displaying results")
    print("\n=== Classification Results ===")
    print(f"Human Review Emails: {len(context.human_review_ids)}")
    for email_id in context.human_review_ids:
        email = context.get_email_by_id(email_id)
        if email:
            print(f"  - Subject: {email.subject}")
            print(f"    From: {email.sender}")
        else:
            print(f"  - Email with ID {email_id} not found")
    
    print(f"\nAutomated Processing Emails: {len(context.automation_ids)}")
    for email_id in context.automation_ids:
        email = context.get_email_by_id(email_id)
        if email:
            print(f"  - Subject: {email.subject}")
            print(f"    From: {email.sender}")
        else:
            print(f"  - Email with ID {email_id} not found")
    
    # Get function call information from context statistics
    test_logger.info("Retrieving processing statistics")
    print("\n=== Processing Statistics ===")
    stats = context.get_statistics()
    print(f"Total Emails: {stats['total_emails']}")
    print(f"Processed Emails: {stats['processed_emails']}")
    print(f"Human Review Count: {stats['human_review_count']}")
    print(f"Automation Count: {stats['automation_count']}")
    
    print("\n=== Agent Response ===")
    print(result.final_output)
    
    return context

def main():
    """Run the test interactively."""
    test_logger.info("Starting Manager Agent Isolated Test")
    print("=== Manager Agent Isolated Test ===")
    print("This test will run the manager agent on sample emails to test classification.")
    print(f"Sample emails: {len(SAMPLE_EMAILS)}")
    
    for i, email in enumerate(SAMPLE_EMAILS):
        print(f"\nEmail {i+1}:")
        print(f"Subject: {email.subject}")
        print(f"From: {email.sender}")
        print(f"Body: {email.body[:50]}...")
    
    input("\nPress Enter to run the test...")
    
    # Run the test
    test_logger.info("Running test_manager_agent")
    context = asyncio.run(test_manager_agent())
    
    # Interactive exploration
    test_logger.info("Starting interactive exploration menu")
    while True:
        print("\n=== Test Menu ===")
        print("1. Show all emails")
        print("2. Show human review emails")
        print("3. Show automated emails")
        print("4. Show statistics")
        print("5. Exit")
        
        choice = input("\nEnter your choice (1-5): ")
        test_logger.debug(f"User selected menu option: {choice}")
        
        if choice == "1":
            test_logger.debug("Displaying all emails")
            print("\n=== All Emails ===")
            for i, email in enumerate(context.emails):
                print(f"\nEmail {i+1}:")
                print(f"ID: {email.id}")
                print(f"Subject: {email.subject}")
                print(f"From: {email.sender}")
                print(f"Body: {email.body}")
        
        elif choice == "2":
            test_logger.debug("Displaying human review emails")
            print("\n=== Human Review Emails ===")
            human_review_emails = context.get_human_review_emails()
            for i, email in enumerate(human_review_emails):
                print(f"\nEmail {i+1}:")
                print(f"ID: {email.id}")
                print(f"Subject: {email.subject}")
                print(f"From: {email.sender}")
                print(f"Body: {email.body}")
        
        elif choice == "3":
            test_logger.debug("Displaying automated emails")
            print("\n=== Automated Emails ===")
            automated_emails = context.get_automated_emails()
            for i, email in enumerate(automated_emails):
                print(f"\nEmail {i+1}:")
                print(f"ID: {email.id}")
                print(f"Subject: {email.subject}")
                print(f"From: {email.sender}")
                print(f"Body: {email.body}")
        
        elif choice == "4":
            test_logger.debug("Displaying processing statistics")
            print("\n=== Processing Statistics ===")
            stats = context.get_statistics()
            print(f"Total Emails: {stats['total_emails']}")
            print(f"Processed Emails: {stats['processed_emails']}")
            print(f"Human Review Count: {stats['human_review_count']}")
            print(f"Automation Count: {stats['automation_count']}")
            
            # Show the review results
            print("\n=== Human Review Results ===")
            for email_id, summary in context.human_review_results.items():
                email = context.get_email_by_id(email_id)
                if email:
                    print(f"Email: {email.subject}")
                    print(f"Summary: {summary}")
                else:
                    print(f"Email with ID {email_id} not found")
                    print(f"Summary: {summary}")
            
            # Show the automation results
            print("\n=== Automation Results ===")
            for email_id, result in context.automation_results.items():
                email = context.get_email_by_id(email_id)
                if email:
                    print(f"Email: {email.subject}")
                    print(f"Action: {result.get('action', 'N/A')}")
                    print(f"Result: {result.get('result', 'N/A')}")
                else:
                    print(f"Email with ID {email_id} not found")
                    print(f"Action: {result.get('action', 'N/A')}")
                    print(f"Result: {result.get('result', 'N/A')}")
        
        elif choice == "5":
            test_logger.info("Exiting test")
            print("\nExiting test...")
            break
        
        else:
            test_logger.warning(f"Invalid choice: {choice}")
            print("\nInvalid choice. Please try again.")

if __name__ == "__main__":
    main() 