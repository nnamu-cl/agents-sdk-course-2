import asyncio
from agents import Agent, Runner

# Create a basic agent with simple instructions
basic_agent = Agent(
    name="basic_agent",
    instructions="You are a helpful assistant that provides concise and accurate information."
)

# Create a coroutine to run the agent
coro = Runner.run_sync(
    basic_agent,
    [{"role": "user", "content": "What's the capital of France?"}]
)

print(coro.final_output)

# Alternative to asyncio.run
# result  =  Runner.run(
#     basic_agent,
#     [{"role": "user", "content": "What's the capital of France?"}]
# )

# print(result.agent_output)
