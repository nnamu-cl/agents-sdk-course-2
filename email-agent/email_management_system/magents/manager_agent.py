from agents import Agent, Runner, RunConfig, RunContextWrapper
from typing import List, Dict, Any
import json
from email_management_system.models.email_models import Email, EmailContext
from email_management_system.tools.email_tools import (
    save_emails_to_human_review, 
    save_emails_to_automation,
    get_statistics,
    write_human_review_report,
    get_human_review_emails
)
from email_management_system.magents.automation_agent import AutomationAgent
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
from email_management_system.magents.react_prompt import REACT_PROMPT


# Define tools outside the class for easier testing
MANAGER_TOOLS = [
    save_emails_to_human_review, 
    save_emails_to_automation,
    get_statistics,
    write_human_review_report,
]

# Define instructions outside the class for easier testing
MANAGER_INSTRUCTIONS = f"""

{RECOMMENDED_PROMPT_PREFIX}

You are the manager agent responsible for:
1. Handling all incoming emails
2. Classifying emails into two categories:
   - Human Review: Emails requiring human attention
   - Automated Processing: Emails that can be handled automatically
3. Saving emails to their respective lists
4. Writing a comprehensive human review report
5. Handing off to specialized agents for processing
6. Creating a final report of actions taken

You have the following tools available:
- save_emails_to_human_review: Save emails that need human review
- save_emails_to_automation: Save emails for automated processing
- get_statistics: Get processing statistics
- write_human_review_report: Write a report for emails needing human review

Classification Guidelines:
Human Review if:
- Contains sensitive or confidential information
- Requires complex decision making
- Contains important business information
- From key stakeholders or clients
- Contains legal or compliance matters

Automated Processing if:
- Marketing or promotional emails
- Newsletter subscriptions
- Automated notifications
- Simple queries that can be answered automatically
- Spam or unwanted communications

After classification:
1. Save the emails to their respective lists using the appropriate tools:
   - Use save_emails_to_human_review for emails needing human attention
   - Use save_emails_to_automation for emails that can be automated
2. For emails needing human review:
   - Create a comprehensive report in markdown format that:
     * Starts with a # Heading for the overview
     * Uses ## Subheadings for priority groups (High/Medium/Low Priority)
     * Uses bullet points for listing emails
     * Formats email references as `[Subject](ID)`
     * Uses > blockquotes for recommendations
     * Uses **bold** and *italic* for emphasis where appropriate
     * Includes a ### Summary section at the end
   - Save the report using write_human_review_report (ALWAYS MAKE SURE TO DO THIS)
3. IMPORTANT: Make sure to save all emails to their respective lists BEFORE handing off to the automation_agent
4. Hand off to the automation_agent for emails that can be processed automatically
5. Create a final report summarizing the actions taken"""

class ManagerAgent:
    def __init__(self):
        # Create automation agent
        automation_agent = AutomationAgent().agent
        
        self.agent = Agent(
            name="manager_agent",
            instructions=MANAGER_INSTRUCTIONS,
            tools=MANAGER_TOOLS,
            handoffs=[
                automation_agent
            ],
            model="o1-2024-12-17"
        )

        # give the automation agent its handoff as well
        # the automation agent will hand off to the manager agent when done processing 
        automation_agent.handoffs = [self.agent]
    
    async def process_emails(self, emails: List[Email], context: EmailContext):
        """
        Process all emails by classifying and routing them.
        
        Args:
            emails: List of emails to process
            context: The email context
            
        Returns:
            dict: Processing results
        """
        try:
            # Prepare email data for the model
            email_data = []
            for email in emails:
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
                
            config = RunConfig(
                workflow_name="Email Management Flow",
                tracing_disabled=False,
            )
                
            # Run the manager agent, which will handle classification and handoffs
            result = await Runner.run(
                self.agent,
                [{"role": "user", "content": f"Process these {len(emails)} emails: {json.dumps(email_data, indent=2)}"}],
                context=context,
                run_config=config
            )
            
            # Get statistics after processing - using the context directly instead of calling the tool
            stats = context.get_statistics()
            
            return {
                "result": result,
                "statistics": stats
            }
            
        except Exception as e:
            print(f"Error in manager agent: {str(e)}")
            return {"error": str(e)} 