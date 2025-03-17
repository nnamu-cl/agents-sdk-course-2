# Running Isolated Tests on Agents

This guide explains how to create and run isolated tests for agents in the Email Management System.

## Overview

Isolated tests allow you to test individual agents in isolation, without the complexity of the full system. This is useful for:

- Developing and debugging new agents
- Testing agent behavior with specific inputs
- Verifying that agents handle edge cases correctly
- Ensuring agents produce expected outputs

## Test Structure

A typical isolated test for an agent follows this structure:

1. Import necessary modules and the agent to test
2. Create sample data (e.g., emails)
3. Set up a test context
4. Run the agent with the sample data
5. Verify the results

## Example: Testing the Human Review Agent

Here's an example of how to test the Human Review Agent:

```python
import asyncio
import uuid
import logging
from agents import Runner
from email_management_system.models.email_models import Email, EmailContext
from email_management_system.agents.human_review_agent import HumanReviewAgent
from email_management_system.tools.email_tools import enable_verbose_logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('test_human_review_agent')

# Create sample emails
sample_emails = [
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
        logger.info("Verbose logging enabled")
    
    # Create context with sample emails
    context = EmailContext(sample_emails)
    
    # Mark all sample emails for human review
    email_ids = [email.id for email in sample_emails]
    context.save_to_human_review(email_ids)
    
    # Create the human review agent
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
    logger.info("Running human review agent test...")
    result = await Runner.run(
        human_review_agent.agent,
        [{"role": "user", "content": f"Process these {len(email_data)} emails marked for human review: {json.dumps(email_data, indent=2)}"}],
        context=context
    )
    
    # Output results
    print("\n=== Human Review Report ===")
    if context.human_review_report:
        print(context.human_review_report)
    else:
        print("No human review report was generated.")
    
    print("\n=== Agent Response ===")
    print(result.final_output)
    
    return context, result

if __name__ == "__main__":
    asyncio.run(test_human_review_agent(verbose=True))
```

## Example: Testing the Automation Agent

Here's an example of how to test the Automation Agent:

```python
import asyncio
import uuid
import logging
import json
from agents import Runner
from email_management_system.models.email_models import Email, EmailContext
from email_management_system.agents.automation_agent import AutomationAgent
from email_management_system.tools.email_tools import enable_verbose_logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('test_automation_agent')

# Create sample emails
sample_emails = [
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
        logger.info("Verbose logging enabled")
    
    # Create context with sample emails
    context = EmailContext(sample_emails)
    
    # Mark all sample emails for automation
    email_ids = [email.id for email in sample_emails]
    context.save_to_automation(email_ids)
    
    # Create the automation agent
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
    logger.info("Running automation agent test...")
    result = await Runner.run(
        automation_agent.agent,
        [{"role": "user", "content": f"Process these {len(email_data)} emails marked for automated processing: {json.dumps(email_data, indent=2)}"}],
        context=context
    )
    
    # Output results
    print("\n=== Automation Results ===")
    print(f"Total Emails Processed: {len(context.automation_results)}")
    
    for email_id, action_result in context.automation_results.items():
        email = context.get_email_by_id(email_id)
        if email:
            print(f"\nEmail: {email.subject}")
            print(f"From: {email.sender}")
            print(f"Action: {action_result.get('action', 'N/A')}")
            print(f"Result: {action_result.get('result', 'N/A')}")
    
    print("\n=== Agent Response ===")
    print(result.final_output)
    
    return context, result

if __name__ == "__main__":
    asyncio.run(test_automation_agent(verbose=True))
```

## Running Tests from Command Line

You can run the isolated tests from the command line using the following commands:

```bash
# Run the human review agent test
python -m email_management_system.IsolatedTests.test_human_review_agent --verbose --show-emails

# Run the automation agent test
python -m email_management_system.IsolatedTests.test_automation_agent --verbose --show-emails
```

Command line options:
- `--verbose` or `-v`: Enable verbose logging
- `--show-emails` or `-s`: Show sample emails before running the test

## Best Practices

1. **Use real agent instances**: Always use the actual agent classes (e.g., `HumanReviewAgent`, `AutomationAgent`) rather than creating new agent instances with the same configuration.

2. **Create realistic test data**: Use sample data that represents real-world scenarios.

3. **Enable verbose logging**: Use the `enable_verbose_logging()` function to see detailed logs during testing.

4. **Check context after execution**: Examine the context object after running the agent to verify that the expected changes were made.

5. **Verify tool usage**: Check that the agent used the appropriate tools and that the tools were called with the expected parameters.

6. **Test edge cases**: Include tests for edge cases, such as empty emails, malformed data, or unusual content.

## Troubleshooting

If you encounter issues when running tests:

1. **Schema validation errors**: Ensure that your model classes have proper type annotations and default values.

2. **Tool execution errors**: Check that the tools are properly registered and that they have the correct signatures.

3. **Agent execution errors**: Verify that the agent instructions are clear and that the agent has access to the necessary tools.

4. **Context issues**: Make sure the context is properly initialized and that the emails are correctly marked for processing. 