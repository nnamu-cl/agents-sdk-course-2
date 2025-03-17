import asyncio
from pydantic import BaseModel
from agents import Agent, Runner, function_tool, RunContextWrapper

# Define a context class to store data
class MyContext(BaseModel):
    user_name: str
    preferences: dict
    history: list = []

# Create a context instance
my_context = MyContext(
    user_name="Alice",
    preferences={"theme": "dark"}
)

# Define a function tool that uses context
@function_tool
def get_user_info(ctx: RunContextWrapper[MyContext]) -> dict:
    """Get information about the current user."""
    context_data = ctx
    return {
        "name": context_data.user_name,
        "preferences": context_data.preferences
    }

@function_tool
def add_to_history(ctx: RunContextWrapper[MyContext], action: str) -> bool:
    """Add an action to the user's history."""
    context_data = ctx
    context_data.history.append(action)
    ctx.set(context_data)
    return True

# Create an agent with the context-aware tools
agent = Agent(
    name="context_agent",
    instructions="Use get_user_info to retrieve user information. Use add_to_history to record actions.",
    tools=[get_user_info, add_to_history]
)


# Create a runner with the context
runner = Runner(context=my_context)

# Run the agent with a message
result = runner.run_sync(
    agent,
    [{"role": "user", "content": "What are my preferences?"}]
)

print("Agent response:", result.final_output)

# Print the updated context to show changes
print("\nUpdated context:", my_context)