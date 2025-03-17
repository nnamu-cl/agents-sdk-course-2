import asyncio
import datetime
from pydantic import BaseModel
from typing_extensions import TypedDict
from agents import Agent, Runner, function_tool, FunctionTool, RunContextWrapper

# Define a structured output model for time
class TimeInfo(BaseModel):
    hours: int
    minutes: int

@function_tool
async def get_system_time() -> dict:
    """Get the current system time.
    
    Returns:
        A dictionary containing the current hours and minutes.
    """
    now = datetime.datetime.now()
    return {"hours": now.hour, "minutes": now.minute}

# Create an agent with structured output for time
time_agent = Agent(
    name="time_agent",
    instructions="""You are an agent that returns the current time in my machine. 
    Use the get_system_time tool to fetch the actual system time.
    """,
    output_type=TimeInfo,
    tools=[get_system_time]
)

# Create a coroutine to run the agent
coro = Runner.run_sync(
    time_agent,
    [{"role": "user", "content": "What time is it now?"}]
)

print(coro.final_output)
