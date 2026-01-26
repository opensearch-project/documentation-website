---
layout: default
title: Context management
nav_order: 65
---

# Context management
**Introduced 3.5**
{: .label .label-purple }

Context management enables OpenSearch agents to dynamically optimize their context before sending requests to large language models (LLMs). This flexible feature helps prevent context window overflow, reduces token usage, and enables long-running agents by intelligently managing conversation history, tool interactions, and other contextual information.

Using context management, you can build AI agents that can do the following:

- Automatically truncate a long tool output when approaching token limits
- Summarize lengthy tool interactions to preserve essential information
- Apply sliding window approaches to maintain recent context
- Implement custom context optimization strategies based on specific use cases
- Hook into different stages of agent execution for context transformation

Context management works through a hook-based system that allows pluggable context managers to inspect and transform agent context at specific execution points. You can experiment with different configurations and combinations to find the optimal setup for your specific use case.

## Context management 

Context management organizes teams of _context managers_ that work together to optimize agent context at specific execution points during the agent lifecycle. The system is highly configurable, allowing you to tailor the behavior to your specific requirements.

Each context management can be configured with the following components:

- **Name**: Unique identifier for the context management 
- **Description**: Human-readable description of the context management's purpose
- **Hooks**: Different execution points where context managers operate
- **Context managers**: Individual components that perform specific context transformations
- **Activation rules**: Conditions that determine when context managers should execute

You can mix and match different context managers, adjust their parameters, and experiment with various activation thresholds to achieve optimal performance for your use case.

For example, to create a context management named `token-aware-truncation` with a ToolsOutputTruncateManager and a SlidingWindowManager, send the following request:

```json
POST /_plugins/_ml/context_management/token-aware-truncation
{
  "description": "Context management that truncates tool outputs longer than 100,000 characters and applies sliding window to keep last 6 messages when tokens exceed 200,000",
  "hooks": {
    "post_tool": [
      {
        "type": "ToolsOutputTruncateManager",
        "config": {
          "max_output_length": 100000
        }
      }
    ],
    "pre_llm": [
      {
        "type": "SlidingWindowManager",
        "config": {
          "max_messages": 6,
          "activation": {
            "tokens_exceed": 200000
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Hook system

Context management uses a hook-based architecture that allows teams of context managers to execute at specific points during agent execution. The current supported hooks are:

- `pre_llm` -- Executes before sending requests to the LLM
- `post_tool` -- Executes after tool execution completes

Context managers registered for each hook will be executed in the order they are defined in the context management configuration.
These hooks are supported in OpenSearch conversational agents and plan-and-execute agents. 

## Activation rules

Context managers can be configured with activation rules that determine when they should execute. If no activation rules are specified, the manager will always execute.

### message_count_exceed

### always

Always activate a context manager at the hook:

```json 
{
  "activation": {
    "rule_type": "always"
  }
}
```

Activates when the number of messages exceeds a threshold:

```json
{
  "activation": {
    "message_count_exceed": 20
  }
}
```

### tokens_exceed

Activates when the estimated token count of the entire context window exceeds a threshold. The context window includes system prompt, user prompt, chat history(memory) and tools interactions.

```json
{
  "activation": {
    "tokens_exceed": 200000
  }
}
```

### Multiple rules

You can combine multiple rules (AND logic):

```json
{
  "activation": {
    "message_count_exceed": 15,
    "tokens_exceed": 200000
  }
}
```

## Context manager types

OpenSearch provides several built-in context manager types:

### SlidingWindowManager

Implements a sliding window approach that keeps only the most recent N interactions to prevent context window overflow.

Configuration options:
- `max_messages` -- Maximum number of messages to retain (default: 20)
- `activation` -- Rules that determine when the manager should execute

```json
{
  "type": "SlidingWindowManager",
  "config": {
    "max_messages": 6,
    "activation": {
      "message_count_exceed": 12
    }
  }
}
```

### SummarizationManager

Summarizes lengthy conversations or tool interactions when token limits are approached.

Configuration options:
- `summary_ratio` -- Ratio of messages to summarize (default: 0.3, range: 0.1-0.8)
- `preserve_recent_messages` -- Number of recent messages to preserve (default: 10)
- `summarization_model_id` -- Model ID for summarization (optional, uses agent's model if not specified)
- `summarization_system_prompt` -- System prompt for summarization (default: predefined prompt)
- `activation` -- Rules that determine when the manager should execute

```json
{
  "type": "SummarizationManager",
  "config": {
    "summary_ratio": 0.3,
    "preserve_recent_messages": 10,
    "summarization_model_id": "<your-summarization-model-id>",
    "activation": {
      "tokens_exceed": 200000
    }
  }
}
```

### ToolsOutputTruncateManager

Truncates tool output when it exceeds specified limits to prevent context overflow.

Configuration options:
- `max_output_length` -- Maximum length of tool output to retain (default: 40000 characters)
- `activation` -- Rules that determine when the manager should execute

```json
{
  "type": "ToolsOutputTruncateManager",
  "config": {
    "max_output_length": 40000,
    "activation": {
      "tokens_exceed": 150000
    }
  }
}
```

## Agent integration

Context management can be applied to agents in two ways:

### During agent registration

Include the context management name when registering an agent:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "customer-service-agent",
  "type": "conversational",
  "llm": {
    "model_id": "your-llm-model-id"
  },
  "context_management_name": "customer-service-context"
}
```
{% include copy-curl.html %}

### During agent execution

Specify the context management name in the execution request. If you specify a different context management in the execution request than what was configured during agent registration, the execution request will override the registered setting. 

```json
POST /_plugins/_ml/agents/agent-id/_execute
{
  "parameters": {
    "question": "How can I help you today?"
  },
  "context_management_name": "customer-service-context"
}
```
{% include copy-curl.html %}

## Example use cases

The following examples demonstrate how you can use context management.

### Long conversation optimization

Create a context management that maintains recent conversation flow while preventing context overflow:

- Use `SlidingWindowManager` to keep recent n number of messages
- Hook into `pre_llm` to optimize before LLM calls

### Tool-heavy agent optimization

Build context management for agents that use many tools:

- Use `ToolsOutputTruncateManager` to limit tool output size
- Apply `SlidingWindowManager` for tool interaction history
- Hook into `post_tool` to clean up after tool execution

### Multi-tool used summarization approach

Build context management for agents with extensive tool interactions:

- Use `ToolsOutputTruncateManager` to limit tool output size
- Apply `SlidingWindowManager` for tool interaction history
- Use `SummarizationManager` to summarize earlier tool interactions
- Hook into `pre_llm` to optimize before LLM calls

## API operations

Context management supports full CRUD operations:

- **[Create context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/)**: `POST /_plugins/_ml/context_management/{context_management_name}`
- **[Get context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/get-context-management/)**: `GET /_plugins/_ml/context_management/{context_management_name}`
- **[Update context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/update-context-management/)**: `PUT /_plugins/_ml/context_management/{context_management_name}`
- **[Delete context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/delete-context-management/)**: `DELETE /_plugins/_ml/context_management/{context_management_name}`
- **[List context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/list-context-management/)**: `GET /_plugins/_ml/context_management`

## Getting started

To implement context management in your agents:

1. **[Create a context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/)** with appropriate managers and hooks.
2. **[Register an agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/)** with the context management or specify it during execution.
3. **[Execute the agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/)** and observe context optimization in action.
4. **[Monitor and adjust]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/update-context-management/)** context management configurations based on performance.

**Tip**: Start with conservative settings and gradually adjust thresholds, manager combinations, and activation rules to find the optimal configuration for your specific workload and performance requirements.

For detailed API documentation, see [Context Management APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/).

## Next steps

- Explore [context management configuration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/) options.
- Review the complete [Context Management API reference]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/).
- Learn about [agent integration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/) with context management.
