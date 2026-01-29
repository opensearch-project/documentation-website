---
layout: default
title: Context management
parent: Memory and context
nav_order: 20
---

# Context management
**Introduced 3.5**
{: .label .label-purple }

Context management enables OpenSearch agents to dynamically optimize their context before sending requests to large language models (LLMs). This flexible feature helps prevent context window overflow, reduces token usage, and enables long-running agents by intelligently managing conversation history, tool interactions, and other contextual information.

Using context management, you can build AI agents that can:

- Automatically truncate a long tool output when approaching token limits.
- Summarize lengthy tool interactions to preserve essential information.
- Apply sliding window approaches to maintain recent context.
- Implement custom context optimization strategies based on specific use cases.
- Hook into different stages of agent execution for context transformation.

Context management uses a hook-based system that allows pluggable context managers to inspect and transform agent context at specific execution points. You can experiment with different configurations and combinations to find the optimal setup for your specific use case.

## Configuring context management

Context management organizes teams of _context managers_ that work together to optimize agent context at specific execution points during the agent lifecycle. The system is highly configurable, allowing you to tailor the behavior to your specific requirements.

Each context management can be configured with the following components:

- **Name**: Unique identifier for the context management. 
- **Description**: Human-readable description of the context management's purpose.
- **Hooks**: Different execution points where context managers operate.
- **Context managers**: Individual components that perform specific context transformations.
- **Activation rules**: Conditions that determine when context managers should execute.

You can mix and match different context managers, adjust their parameters, and experiment with various activation thresholds to achieve optimal performance for your use case.

For example, to create a context management named `token-aware-truncation` with a `ToolsOutputTruncateManager` and a `SlidingWindowManager`, send the following request:

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

## The hook system

Context management uses a hook-based architecture that allows teams of context managers to execute at specific points during agent execution. The supported hooks are:

- `pre_llm` -- Runs before sending requests to the LLM.
- `post_tool` -- Runs after tool execution completes.

Context managers registered for each hook are executed in the order they are defined in the context management configuration.

These hooks are supported in OpenSearch [conversational agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/) and [plan-and-execute agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/). 

## Activation rules

Activation rules determine when context managers execute during agent interactions. These rules help you control resource usage and optimize performance by triggering context optimization only when needed. If no activation rules are specified, context managers execute on every interaction at their configured hooks.

Context managers support several types of activation rules that can be used individually or combined together.

### Always activate

Use the `always` rule type to activate a context manager on every execution at its configured hook, regardless of conversation state:

```json
{
  "activation": {
    "rule_type": "always"
  }
}
```

This is equivalent to not specifying any activation rules and is useful when you want explicit control over activation behavior.

### Message count threshold

Use `message_count_exceed` to activate a context manager when the conversation history exceeds a specified number of messages:

```json
{
  "activation": {
    "message_count_exceed": 20
  }
}
```

This rule is useful for applying context optimization strategies like sliding windows or summarization when conversations become lengthy.

### Token count threshold

Use `tokens_exceed` to activate a context manager when the estimated token count of the entire context window exceeds a threshold. The context window includes the system prompt, user prompt, chat history (memory), and tool interactions:

```json
{
  "activation": {
    "tokens_exceed": 200000
  }
}
```

This rule helps prevent context window overflow and manage LLM API costs by triggering optimization strategies before hitting model limits.

### Combining multiple rules

You can combine multiple activation rules using AND logic. The context manager executes only when all specified conditions are met:

```json
{
  "activation": {
    "message_count_exceed": 15,
    "tokens_exceed": 200000
  }
}
```

This example activates the context manager only when both the message count exceeds 15 AND the token count exceeds 200,000, providing fine-grained control over when optimization occurs.

## Context manager types

OpenSearch provides the following context manager types. For complete configuration parameter details, see [Context manager configurations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/#context-manager-configurations).

### SlidingWindowManager

Implements a sliding window approach that keeps only the most recent N interactions to prevent context window overflow. This example shows a sliding window manager that retains the 6 most recent messages and activates when the conversation exceeds 12 messages:

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

For more information, see [SlidingWindowManager]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/#slidingwindowmanager).

### SummarizationManager

Summarizes lengthy conversations or tool interactions when token limits are approached. This example shows a summarization manager that summarizes 30% of the conversation history while preserving the 10 most recent messages, activating when the context exceeds 200,000 tokens:

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

For more information, see [SummarizationManager]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/#summarizationmanager).

### ToolsOutputTruncateManager

Truncates tool output when it exceeds specified limits to prevent context overflow. This example shows a truncation manager that limits tool output to 40,000 characters and activates when the context exceeds 150,000 tokens:

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

For more information, see [ToolsOutputTruncateManager]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/#toolsoutputtruncatemanager).

## Agent integration

Context management can be applied to agents either during agent registration or during agent execution.

### During agent registration

To apply context management to agents during agent registration, include the context management name when registering an agent:

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

To apply context management to agents during agent execution, specify the context management name in the execution request. If you specify a different context management in the execution request than the name that was configured during agent registration, the execution request overrides the registered setting: 

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

### Long conversation 

To support long conversations, configure context management that maintains recent conversation flow while preventing context overflow:

- Use a `SlidingWindowManager` to keep the most recent N number of messages.
- Hook into `pre_llm` to optimize before LLM calls.

### Tool-heavy agent 

Configure context management for agents that use many tools:

- Use a `ToolsOutputTruncateManager` to limit tool output size.
- Apply a `SlidingWindowManager` for tool interaction history.
- Hook into `post_tool` to clean up after tool execution.

### Tool-heavy agent with summarization

Configure context management for agents with extensive tool interactions:

- Use `ToolsOutputTruncateManager` to limit tool output size
- Apply `SlidingWindowManager` for tool interaction history
- Use `SummarizationManager` to summarize earlier tool interactions
- Hook into `pre_llm` to optimize before LLM calls

## Getting started

To implement context management in your agents:

1. **[Create a context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/)** containing appropriate managers and hooks.
2. **[Register an agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/)** with the context management or specify it during execution.
3. **[Execute the agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/)** and observe context optimization in action.
4. **[Monitor and adjust]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/update-context-management/)** context management configurations based on performance.

Start with conservative settings and gradually adjust thresholds, manager combinations, and activation rules to find the optimal configuration for your specific workload and performance requirements.
{: .tip}

## Next steps

- Explore [context management configuration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/) options.
- Review the complete [Context Management API reference]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/).
- Learn about [agent integration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/) with context management.