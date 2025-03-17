from typing import Dict, List, Any
from agents.tool import function_tool
from agents import RunContextWrapper
from email_management_system.models.email_models import Email, EmailContext
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('email_tools')

# Verbose mode flag - set to False by default
verbose_mode = False

def enable_verbose_logging():
    """Enable verbose logging for all email tools."""
    global verbose_mode
    verbose_mode = True
    logger.setLevel(logging.DEBUG)
    logger.debug("Verbose logging enabled for email tools")

def disable_verbose_logging():
    """Disable verbose logging for email tools."""
    global verbose_mode
    verbose_mode = False
    logger.setLevel(logging.INFO)
    logger.info("Verbose logging disabled for email tools")

@function_tool
def reply_to_email(context: RunContextWrapper[EmailContext], email_id: str, response: str) -> str:
    """
    Reply to an email with the given response.
    
    This function:
    1. Sends a reply to the specified email
    2. Adds an "email_action_performed" operation to the operations history
       with the email ID, action type ("reply"), result, and the actual reply content
    
    Args:
        context: The agent context
        email_id: The ID of the email to reply to
        response: The response text to send
        
    Returns:
        str: Confirmation message
    """
    if verbose_mode:
        logger.debug(f"reply_to_email called with email_id: {email_id}")
        
    try:
        email = context.context.get_email_by_id(email_id)
        if not email:
            error_msg = f"Error: Email with ID {email_id} not found"
            if verbose_mode:
                logger.error(error_msg)
            return error_msg
        
        if verbose_mode:
            logger.debug(f"Found email: Subject: {email.subject}, From: {email.sender}")
            logger.debug(f"Sending response: {response[:50]}...")
        
        # Here you would implement actual email sending logic
        result = f"Successfully replied to email {email_id} from {email.sender}"
        
        # Store the result in context, including the actual response content
        context.context.add_automation_result(email_id, "reply", result, content=response)
        
        if verbose_mode:
            logger.debug(f"Added automation result for email {email_id}")
            
        return result
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        if verbose_mode:
            logger.exception(f"Exception in reply_to_email: {str(e)}")
        return error_msg

@function_tool
def unsubscribe_from_email(context: RunContextWrapper[EmailContext], email_id: str) -> str:
    """
    Unsubscribe from the mailing list associated with the email.
    
    This function:
    1. Unsubscribes from the mailing list for the specified email
    2. Adds an "email_action_performed" operation to the operations history
       with the email ID, action type ("unsubscribe"), and result
    
    Args:
        context: The agent context
        email_id: The ID of the email to unsubscribe from
        
    Returns:
        str: Confirmation message
    """
    if verbose_mode:
        logger.debug(f"unsubscribe_from_email called with email_id: {email_id}")
        
    try:
        email = context.context.get_email_by_id(email_id)
        if not email:
            error_msg = f"Error: Email with ID {email_id} not found"
            if verbose_mode:
                logger.error(error_msg)
            return error_msg
        
        if verbose_mode:
            logger.debug(f"Found email: Subject: {email.subject}, From: {email.sender}")
            logger.debug(f"Processing unsubscribe request")
        
        # Here you would implement actual unsubscribe logic
        result = f"Successfully unsubscribed from mailing list for email {email_id}"
        
        # Store the result in context
        context.context.add_automation_result(email_id, "unsubscribe", result)
        
        if verbose_mode:
            logger.debug(f"Added automation result for email {email_id}")
            
        return result
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        if verbose_mode:
            logger.exception(f"Exception in unsubscribe_from_email: {str(e)}")
        return error_msg

@function_tool
def save_emails_to_human_review(context: RunContextWrapper[EmailContext], email_ids: List[str]) -> str:
    """
    Save a list of emails to the human review list.
    
    This function:
    1. Marks the specified emails for human review
    2. Updates the public state with the new counts
    3. Adds an "emails_added_to_review" operation to the operations history
       with the list of email IDs
    
    Args:
        context: The agent context
        email_ids: List of email IDs to save for human review
        
    Returns:
        str: Confirmation message
    """
    if verbose_mode:
        logger.debug(f"save_emails_to_human_review called with {len(email_ids)} email IDs")
        if email_ids:
            logger.debug(f"Email IDs: {', '.join(email_ids[:5])}{' and more...' if len(email_ids) > 5 else ''}")
    
    try:
        # Save to context
        context.context.save_to_human_review(email_ids)
        
        result = f"Successfully saved {len(email_ids)} emails for human review"
        if verbose_mode:
            logger.debug(result)
            
        return result
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        if verbose_mode:
            logger.exception(f"Exception in save_emails_to_human_review: {str(e)}")
        return error_msg

@function_tool
def save_emails_to_automation(context: RunContextWrapper[EmailContext], email_ids: List[str]) -> str:
    """
    Save a list of emails to the automation list.
    
    This function:
    1. Marks the specified emails for automated processing
    2. Updates the public state with the new counts
    3. Adds an "emails_added_to_automation" operation to the operations history
       with the list of email IDs
    
    Args:
        context: The agent context
        email_ids: List of email IDs to save for automated processing
        
    Returns:
        str: Confirmation message
    """
    if verbose_mode:
        logger.debug(f"save_emails_to_automation called with {len(email_ids)} email IDs")
        if email_ids:
            logger.debug(f"Email IDs: {', '.join(email_ids[:5])}{' and more...' if len(email_ids) > 5 else ''}")
    
    try:
        # Save to context
        context.context.save_to_automation(email_ids)
        
        result = f"Successfully saved {len(email_ids)} emails for automated processing"
        if verbose_mode:
            logger.debug(result)
            
        return result
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        if verbose_mode:
            logger.exception(f"Exception in save_emails_to_automation: {str(e)}")
        return error_msg

@function_tool
def get_human_review_emails(context: RunContextWrapper[EmailContext]) -> List[Email]:
    """
    Get the list of emails marked for human review.
    
    Args:
        context: The agent context
        
    Returns:
        List[Email]: Emails requiring human review
    """
    if verbose_mode:
        logger.debug("get_human_review_emails called")
    
    try:
        emails = context.context.get_human_review_emails()
        
        if verbose_mode:
            logger.debug(f"Retrieved {len(emails)} emails for human review")
            if emails:
                for i, email in enumerate(emails[:3]):
                    logger.debug(f"Email {i+1}: Subject: {email.subject}, From: {email.sender}")
                if len(emails) > 3:
                    logger.debug(f"... and {len(emails) - 3} more")
        
        return emails
    except Exception as e:
        if verbose_mode:
            logger.exception(f"Exception in get_human_review_emails: {str(e)}")
        print(f"Error retrieving human review emails: {str(e)}")
        return []

@function_tool
def get_automated_emails(context: RunContextWrapper[EmailContext]) -> List[Email]:
    """
    Get the list of emails marked for automated processing.
    
    Args:
        context: The agent context
        
    Returns:
        List[Email]: Emails for automated processing
    """
    if verbose_mode:
        logger.debug("get_automated_emails called")
    
    try:
        emails = context.context.get_automated_emails()
        
        if verbose_mode:
            logger.debug(f"Retrieved {len(emails)} emails for automated processing")
            if emails:
                for i, email in enumerate(emails[:3]):
                    logger.debug(f"Email {i+1}: Subject: {email.subject}, From: {email.sender}")
                if len(emails) > 3:
                    logger.debug(f"... and {len(emails) - 3} more")
        
        return emails
    except Exception as e:
        if verbose_mode:
            logger.exception(f"Exception in get_automated_emails: {str(e)}")
        print(f"Error retrieving automated emails: {str(e)}")
        return []

@function_tool
def add_human_review_result(context: RunContextWrapper[EmailContext], email_id: str, summary: str) -> str:
    """
    Add a human review result.
    
    This function:
    1. Stores the review summary for the specified email
    2. Adds an "email_review_added" operation to the operations history
       with the email ID
    
    Args:
        context: The agent context
        email_id: The ID of the email
        summary: The review summary
        
    Returns:
        str: Confirmation message
    """
    if verbose_mode:
        logger.debug(f"add_human_review_result called for email_id: {email_id}")
        logger.debug(f"Summary: {summary[:50]}...")
    
    try:
        context.context.add_human_review_result(email_id, summary)
        
        result = f"Successfully added review result for email {email_id}"
        if verbose_mode:
            logger.debug(result)
            
        return result
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        if verbose_mode:
            logger.exception(f"Exception in add_human_review_result: {str(e)}")
        return error_msg

@function_tool
def get_statistics(context: RunContextWrapper[EmailContext]) -> Dict[str, Any]:
    """
    Get processing statistics.
    
    Args:
        context: The agent context
        
    Returns:
        Dict[str, Any]: Processing statistics
    """
    if verbose_mode:
        logger.debug("get_statistics called")
    
    try:
        stats = context.context.get_statistics()
        
        if verbose_mode:
            logger.debug(f"Statistics retrieved: {stats}")
            
        return stats
    except Exception as e:
        if verbose_mode:
            logger.exception(f"Exception in get_statistics: {str(e)}")
        print(f"Error retrieving statistics: {str(e)}")
        return {}

@function_tool
def write_human_review_report(context: RunContextWrapper[EmailContext], report: str) -> str:
    """
    Write a comprehensive human review report for emails requiring human attention.
    
    This function:
    1. Stores the human review report in the context
    2. Updates the public state with the report text
    3. Adds a "review_report_added" operation to the operations history
    
    Args:
        context: The agent context
        report: The detailed report containing analysis of emails requiring human review
        
    Returns:
        str: Confirmation message
    """
    if verbose_mode:
        logger.debug("write_human_review_report called")
        logger.debug(f"Report length: {len(report)} characters")
    
    try:
        # Store the report in context using the new method
        context.context.set_human_review_report(report)
        
        result = "Successfully saved human review report"
        if verbose_mode:
            logger.debug(result)
            
        return result
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        if verbose_mode:
            logger.exception(f"Exception in write_human_review_report: {str(e)}")
        return error_msg 