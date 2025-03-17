from agents import Agent, Runner
from email_management_system.models.email_models import AutomationResult, EmailContext
from email_management_system.tools.email_tools import reply_to_email, unsubscribe_from_email, get_automated_emails
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
from .react_prompt import REACT_PROMPT

# Define tools outside the class for easier testing
AUTOMATION_TOOLS = [
    reply_to_email, 
    unsubscribe_from_email, 
    get_automated_emails
]

# Define instructions outside the class for easier testing
AUTOMATION_INSTRUCTIONS = f"""

{RECOMMENDED_PROMPT_PREFIX}


You are the automation agent. Your job is to:
1. Process emails marked for automated handling
2. Decide appropriate actions:
   - Reply to the email
   - Unsubscribe from mailing lists
   - Ignore the email
3. Execute the chosen action

You have the following tools available:
- get_automated_emails: Retrieves the list of emails marked for automated processing
- reply_to_email: Sends an automated reply to an email
- unsubscribe_from_email: Unsubscribes from a mailing list or newsletter

Guidelines for actions:
- Reply: For simple queries that can be answered automatically
- Unsubscribe: For marketing emails, newsletters, or unwanted communications
- Ignore: For spam or low-priority automated notifications

First, get the list of emails marked for automated processing using the get_automated_emails tool.
Then, for each email:
1. Analyze the content
2. Determine the most appropriate action
3. Execute the action using the appropriate tool (reply_to_email or unsubscribe_from_email)
4. Record the result

Finally, provide a summary of all actions taken.

IMPORTANT: Once you have finished processing the emails, hand off to the manager agent. This is a critical step - do not forget to do this handoff.

"""

class AutomationAgent:
    def __init__(self):
        self.agent = Agent(
            name="automation_agent",
            instructions=AUTOMATION_INSTRUCTIONS,
            tools=AUTOMATION_TOOLS,
            model="o1-2024-12-17"
        )
    
    # The process_automated_emails method is removed as it's no longer needed with handoffs 