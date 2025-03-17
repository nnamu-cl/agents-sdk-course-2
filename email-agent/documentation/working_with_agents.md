# Working with Agents

This guide explains how to work with agents in the Email Management System, including how to create agents, provide them with tools, and process their responses.

## Overview

Agents are AI-powered components that perform specific tasks in the system. Each agent has:

- A name
- Instructions that define its behavior
- A set of tools it can use
- An optional output type for structured responses

## Creating an Agent

Here's how to create a new agent:

```python
from agents import Agent
from email_management_system.models.email_models import SomeOutputType
from email_management_system.tools.some_tools import tool1, tool2, tool3

class MyCustomAgent:
    def __init__(self):
        self.agent = Agent(
            name="my_custom_agent",
            instructions="""You are a custom agent. Your job is to:
1. Do task A
2. Do task B
3. Do task C

Follow these guidelines:
- Guideline 1
- Guideline 2
- Guideline 3

Use the available tools to accomplish your tasks.
""",
            tools=[tool1, tool2, tool3],
            output_type=SomeOutputType  # Optional: for structured output
        )
```

## Providing Tools to Agents

Tools are functions that agents can call to perform actions. Here's how to create and provide tools to agents:

### Creating a Tool

Tools are created using Python functions with type annotations:

```python
from typing import Dict, Any
from agents import function_tool

@function_tool
def my_custom_tool(param1: str, param2: int) -> Dict[str, Any]:
    """
    Description of what this tool does.
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        A dictionary with the result
    """
    # Tool implementation
    result = {"status": "success", "value": f"{param1}: {param2}"}
    return result
```

### Registering Tools with an Agent

Tools are provided to an agent when it's created:

```python
from email_management_system.tools.my_tools import tool1, tool2, tool3

class MyAgent:
    def __init__(self):
        self.agent = Agent(
            name="my_agent",
            instructions="Your instructions here...",
            tools=[tool1, tool2, tool3]
        )
```

## Running Agents

To run an agent, use the `Runner` class:

```python
import asyncio
from agents import Runner
from email_management_system.agents.my_agent import MyAgent

async def run_my_agent():
    # Create the agent
    my_agent = MyAgent()
    
    # Create a context (optional)
    context = SomeContext()
    
    # Run the agent
    result = await Runner.run(
        my_agent.agent,
        [{"role": "user", "content": "Your request to the agent"}],
        context=context
    )
    
    # Process the result
    print(result.final_output)
    
    return result

# Run the agent
asyncio.run(run_my_agent())
```

## Reading Agent Responses

Agents can return responses in different formats:

### Text Responses

For simple text responses:

```python
result = await Runner.run(agent, messages, context)
print(result.final_output)  # The final text output from the agent
```

### Structured Responses

For structured responses (when `output_type` is specified):

```python
result = await Runner.run(agent, messages, context)
structured_output = result.final_output

# Access fields in the structured output
print(structured_output.field1)
print(structured_output.field2)
```

### Tool Call Results

To examine tool calls made by the agent:

```python
result = await Runner.run(agent, messages, context)

# Iterate through all items in the result
for item in result.new_items:
    if item.type == 'tool_call_item':
        print(f"Tool called: {item.raw_item.name}")
        print(f"Arguments: {item.raw_item.arguments}")
    elif item.type == 'tool_call_output_item':
        print(f"Tool output: {item.output}")
    elif item.type == 'message_output_item':
        print(f"Message: {item.raw_item.content}")
```

## Example: Email Classification Agent

Here's a complete example of creating and running an email classification agent:

```python
import asyncio
import json
from agents import Agent, Runner
from email_management_system.models.email_models import Email, EmailContext, ClassificationResult
from email_management_system.tools.email_tools import classify_email

# Define the agent
class ClassificationAgent:
    def __init__(self):
        self.agent = Agent(
            name="classification_agent",
            instructions="""You are the email classification agent. Your job is to:
1. Analyze each email
2. Determine if it requires human review or can be handled automatically
3. Provide reasoning for your decision

For each email, classify it as either:
- "human_review": Emails that need human attention
- "automated": Emails that can be handled automatically

Use the classify_email tool to record your classification.
""",
            tools=[classify_email],
            output_type=ClassificationResult
        )

# Sample email
sample_email = Email(
    id="123456",
    sender="important@client.com",
    recipient="user@example.com",
    subject="Urgent: Contract Review Needed",
    body="We need your input on the contract by tomorrow. There are several critical points to discuss.",
    timestamp="2025-03-15T09:30:45.654321",
    is_read=False,
    folder="inbox",
    attachments=[]
)

# Run the agent
async def run_classification_agent():
    # Create context
    context = EmailContext([sample_email])
    
    # Create agent
    classification_agent = ClassificationAgent()
    
    # Prepare email data
    email_data = {
        "id": sample_email.id,
        "sender": sample_email.sender,
        "recipient": sample_email.recipient,
        "subject": sample_email.subject,
        "body": sample_email.body,
        "timestamp": sample_email.timestamp,
        "is_read": sample_email.is_read,
        "folder": sample_email.folder
    }
    
    # Run the agent
    result = await Runner.run(
        classification_agent.agent,
        [{"role": "user", "content": f"Classify this email: {json.dumps(email_data, indent=2)}"}],
        context=context
    )
    
    # Process the result
    print("\n=== Classification Result ===")
    print(f"Email: {sample_email.subject}")
    print(f"Classification: {result.final_output.classification}")
    print(f"Reasoning: {result.final_output.reasoning}")
    
    return result

if __name__ == "__main__":
    asyncio.run(run_classification_agent())
```

## Best Practices

1. **Clear instructions**: Provide clear, detailed instructions to the agent about its role and tasks.

2. **Appropriate tools**: Give the agent only the tools it needs to complete its tasks.

3. **Structured output**: Use `output_type` to get structured responses when needed.

4. **Error handling**: Handle potential errors in tool execution and agent responses.

5. **Context management**: Use context objects to share state between tools and across agent runs.

6. **Logging**: Enable logging to debug agent behavior and tool usage.

7. **Async execution**: Use `asyncio` for efficient execution of agent tasks.

## Troubleshooting

If you encounter issues when working with agents:

1. **Agent not using tools**: Check that the tools are properly registered and that the instructions clearly explain when to use them.

2. **Incorrect tool usage**: Verify that the agent understands the purpose and parameters of each tool.

3. **Unexpected responses**: Ensure that the instructions are clear and that the agent has all the information it needs.

4. **Performance issues**: Consider breaking complex tasks into smaller steps or using more efficient tools.

5. **Schema validation errors**: Make sure your model classes have proper type annotations and default values. 