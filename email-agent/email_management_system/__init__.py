# Make the package importable
from .models.email_models import Email, EmailContext, ClassificationResult, HumanReviewOutput, AutomationResult

__all__ = [
    'Email',
    'EmailContext',
    'ClassificationResult',
    'HumanReviewOutput',
    'AutomationResult'
] 