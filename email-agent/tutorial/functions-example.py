from agents import function_tool

# Example 1: Basic function with integer parameters
"""
Output when printed:
FunctionTool(name='add', description='Add two numbers together.', params_json_schema={
    'properties': {
        'a': {'description': 'First number', 'title': 'A', 'type': 'integer'}, 
        'b': {'description': 'Second number', 'title': 'B', 'type': 'integer'}
    }, 
    'required': ['a', 'b'], 
    'title': 'add_args', 
    'type': 'object', 
    'additionalProperties': False
})
"""
@function_tool
def add(a: int, b: int) -> int:
    """Add two numbers together.
    
    Args:
        a: First number
        b: Second number
        
    Returns:
        The sum of a and b
    """
    return a + b

# Example 2: Similar function with same parameter structure
"""
Output when printed:
FunctionTool(name='multiply', description='Multiply two numbers together.', params_json_schema={
    'properties': {
        'a': {'description': 'First number', 'title': 'A', 'type': 'integer'}, 
        'b': {'description': 'Second number', 'title': 'B', 'type': 'integer'}
    }, 
    'required': ['a', 'b'], 
    'title': 'multiply_args', 
    'type': 'object', 
    'additionalProperties': False
})
"""
@function_tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers together.
    
    Args:
        a: First number
        b: Second number
        
    Returns:
        The product of a and b
    """
    return a * b

# Example 3: Function with a string parameter and an optional boolean parameter with default
"""
Output when printed:
FunctionTool(name='format_greeting', description='Create a greeting for a person.', params_json_schema={
    'properties': {
        'name': {'description': 'The name of the person to greet', 'title': 'Name', 'type': 'string'}, 
        'formal': {'default': False, 'description': 'Whether to use a formal greeting', 'title': 'Formal', 'type': 'boolean'}
    }, 
    'required': ['name', 'formal'], 
    'title': 'format_greeting_args', 
    'type': 'object', 
    'additionalProperties': False
})
"""
@function_tool
def format_greeting(name: str, formal: bool = False) -> str:
    """Create a greeting for a person.
    
    Args:
        name: The name of the person to greet
        formal: Whether to use a formal greeting
        
    Returns:
        A greeting string
    """
    if formal:
        return f"Good day, {name}."
    return f"Hey {name}!"

# Print the function tools to see their schemas
print(add)
print(multiply)
print(format_greeting)

# SCHEMA EXPLANATION:
"""
When we run this script, we can see how docstrings affect the generated schemas:

1. Function Name:
   - The function name becomes the tool name (e.g., 'add', 'multiply', 'format_greeting')

2. Function Description:
   - The first line of the docstring becomes the tool description

3. Parameter Descriptions:
   - The Args section in the docstring provides descriptions for each parameter
   - These descriptions appear in the params_json_schema.properties.[param].description

4. Parameter Types:
   - Type hints (int, str, bool) are converted to JSON schema types
   - add and multiply: Both have integer parameters
   - format_greeting: Has a string parameter and a boolean parameter

5. Required vs Optional Parameters:
   - Parameters without default values are marked as required
   - Parameters with default values (like formal=False) are optional
   - Note: In the schema, 'formal' still appears in required list but has a default value

6. Default Values:
   - Default values from the function signature are included in the schema
   - format_greeting: formal parameter has default=False in the schema

7. Return Type:
   - Return type annotations are not included in the schema as they're for the function's output
   - The schema only describes the input parameters

This automatic schema generation makes it easy to create tools with well-defined interfaces
that can be used by agents without manually writing JSON schemas.
""" 