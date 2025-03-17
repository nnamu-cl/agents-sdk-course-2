import asyncio
from pydantic import BaseModel
from agents import Agent, Runner

# Define a structured output model using Pydantic
class CapitalInfo(BaseModel):
    country: str
    capital: str
    population: int
    fun_fact: str

# Create an agent with structured output
structured_agent = Agent(
    name="capital_info_agent",
    instructions="You are a helpful assistant that provides information about capital cities. Return structured data with the country, capital name, approximate population, and one fun fact.",
    output_type=CapitalInfo
)

# Create a coroutine to run the agent
coro = Runner.run_sync(
    structured_agent,
    [{"role": "user", "content": "What's the capital of France?"}]
)

print(coro.final_output)
