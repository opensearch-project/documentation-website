---
layout: default
title: Using agentic memory with Strands Agents
parent: Agentic AI
grand_parent: Generative AI
nav_order: 30
---

# Using agentic memory with Strands Agents

An AI agent retains information only within a single conversation unless you give it a memory store. This tutorial shows you how to use OpenSearch [agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/) as the long-term memory of an agent built using [Strands Agents](https://strandsagents.com/), an open-source Python agent framework. You'll create a memory container that uses an LLM to extract facts and preferences from conversations, and then write Python tools that the agent calls to add, search, update, and delete memories. Because the memories are stored in OpenSearch, the agent can recall them in later conversations.

This tutorial uses the following models hosted on Amazon Bedrock:

- [Amazon Titan Text Embeddings V2](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) (`amazon.titan-embed-text-v2:0`) for generating memory embeddings.
- [Anthropic Claude Sonnet 4.6](https://aws.amazon.com/bedrock/claude/) (`us.anthropic.claude-sonnet-4-6`) for both the Strands agent and the memory container's fact extraction.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisites

Before you start, make sure you have the following:

- An OpenSearch 3.7 or later cluster that your Python environment can reach.
- AWS credentials that can invoke the Amazon Titan Text Embeddings V2 and Anthropic Claude Sonnet 4.6 models on Amazon Bedrock. OpenSearch uses these credentials in the connectors. The Strands agent calls Amazon Bedrock directly from Python, so your Python environment must also have AWS credentials configured, for example, through environment variables or the AWS Command Line Interface (AWS CLI).
- Python 3.10 or later.

## Step 1: Register an embedding model

The memory container uses an embedding model to generate vector embeddings for extracted memories so that you can search them semantically.

First, create a connector for the Amazon Titan Text Embeddings V2 model:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock connector: Titan Text Embeddings V2",
  "description": "Connector to the Amazon Bedrock Titan Text Embeddings V2 model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "your_aws_region",
    "service_name": "bedrock",
    "model": "amazon.titan-embed-text-v2:0",
    "dimensions": 1024,
    "normalize": true,
    "embeddingTypes": ["float"]
  },
  "credential": {
    "access_key": "your_aws_access_key",
    "secret_key": "your_aws_secret_key",
    "session_token": "your_aws_session_token"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText}\", \"dimensions\": ${parameters.dimensions}, \"normalize\": ${parameters.normalize}, \"embeddingTypes\": ${parameters.embeddingTypes} }",
      "pre_process_function": "connector.pre_process.bedrock.embedding",
      "post_process_function": "connector.post_process.bedrock.embedding"
    }
  ]
}
```
{% include copy-curl.html %}

Note the connector ID; you'll use it to register the model.

Next, register the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "Amazon Bedrock Titan Text Embeddings V2",
  "function_name": "remote",
  "description": "Embedding model for agentic memory",
  "connector_id": "your_embedding_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID; you'll use it to create the memory container.

## Step 2: Register an LLM for fact extraction

The memory container uses an LLM to extract facts and user preferences from conversations and to decide whether each new fact is stored as a new memory or updates or deletes an existing one.

First, create a connector for the Anthropic Claude Sonnet 4.6 model using the Amazon Bedrock Converse API. Agentic memory passes the `system_prompt` and `user_prompt` parameters to the connector, so the request body must contain both:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock connector: Claude Sonnet 4.6",
  "description": "Connector to the Amazon Bedrock Claude Sonnet 4.6 model using the Converse API",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "your_aws_region",
    "service_name": "bedrock",
    "model": "us.anthropic.claude-sonnet-4-6"
  },
  "credential": {
    "access_key": "your_aws_access_key",
    "secret_key": "your_aws_secret_key",
    "session_token": "your_aws_session_token"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/converse",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"system\": [{\"text\": \"${parameters.system_prompt}\"}], \"messages\": [{\"role\": \"user\", \"content\": [{\"text\": \"${parameters.user_prompt}\"}]}] }",
      "supports_structured_output": true
    }
  ]
}
```
{% include copy-curl.html %}

The `supports_structured_output` field enables constrained decoding for fact extraction. When it is `true`, OpenSearch adds a `toolConfig` object to the Converse API request during fact extraction. The `toolConfig` object requires the model to call an `extract_facts` tool, so the model returns the facts in a fixed JSON schema. OpenSearch then reads the facts from the tool call in the response, so you don't need to set `llm_result_path`. If you omit this field, OpenSearch adds format instructions to the fact extraction prompt and reads the model's text response. For more information, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).

Note the connector ID; you'll use it to register the model.

Next, register the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "Amazon Bedrock Claude Sonnet 4.6",
  "function_name": "remote",
  "description": "LLM for agentic memory fact extraction",
  "connector_id": "your_llm_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID; you'll use it to create the memory container.

## Step 3: Create a memory container

Create a memory container that uses the two models. The container in this example uses the following strategies, both scoped to the `user_id` namespace so that each user's memories are stored separately:

- `SEMANTIC` extracts facts, such as the user's name or job.
- `USER_PREFERENCE` extracts the user's preferences, such as hobbies or favorite foods, and identity statements, such as the user's job.

Each strategy extracts memories independently, so a fact that matches both strategies is stored twice, once for each strategy.

Because strategies are configured, OpenSearch creates the session, working memory, long-term memory, and history indexes for the container:

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "strands-personal-assistant",
  "description": "Long-term memory for a Strands Agents personal assistant",
  "configuration": {
    "embedding_model_type": "TEXT_EMBEDDING",
    "embedding_model_id": "your_embedding_model_id",
    "embedding_dimension": 1024,
    "llm_id": "your_llm_model_id",
    "strategies": [
      {
        "type": "SEMANTIC",
        "namespace": ["user_id"]
      },
      {
        "type": "USER_PREFERENCE",
        "namespace": ["user_id"]
      }
    ]
  }
}
```
{% include copy-curl.html %}

The response contains the memory container ID:

```json
{
  "memory_container_id": "xthvpZgBOh0h20Y9O3Sa",
  "status": "created"
}
```

Note the memory container ID; you'll use it in the agent code. For more information about the container configuration, see [Create Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/).

## Step 4: Create the agent and memory tools

Agentic memory is accessed through REST APIs, so you can use it from any agent framework. In this step, you'll define each memory operation as a Strands Agents tool. Strands Agents uses each tool's docstring and type hints to describe the tool to the LLM, so the agent can decide when to call it.

Install the required Python packages:

```bash
pip install strands-agents requests
```
{% include copy.html %}

Save the following code as `memory_agent.py`. The code defines the following tools:

- `add_memory` sends a conversation turn to the [Add Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/) with `infer` set to `true`, so the LLM extracts facts from it into long-term memory.
- `search_memories` finds relevant long-term memories using the [Semantic Search Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/semantic-search-memory/). The API retrieves the `k` memories in the container that are closest to the query and then filters them by namespace, so when a container stores memories for many users, it can return fewer than `k` memories for a user.
- `list_memories` returns all of the user's long-term memories using the [Search Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/).
- `update_memory` and `delete_memory` change or remove a long-term memory by ID using the [Update Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/update-memory/) and [Delete Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/delete-memory/). When you update a memory's text, OpenSearch regenerates its embedding, so semantic search finds the memory by its new text.

Each time the script starts, it creates a new session using the [Create Session API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-session/). The session ID is stored with each conversation turn in working memory. The long-term memories are scoped only to the `user_id` namespace, so they are available in every session:

```python
from typing import Any, Dict, List, Optional

import requests
from requests.auth import HTTPBasicAuth
from strands import Agent, tool
from strands.models import BedrockModel

OPENSEARCH_URL = "your_opensearch_endpoint"  # For example, https://localhost:9200
OPENSEARCH_USERNAME = "your_username"
OPENSEARCH_PASSWORD = "your_password"
# Set to False only for a local test cluster that uses self-signed certificates.
VERIFY_CERTS = True

MEMORY_CONTAINER_ID = "your_memory_container_id"
USER_ID = "your_user_id"
AWS_REGION = "your_aws_region"

MEMORIES_PATH = f"/_plugins/_ml/memory_containers/{MEMORY_CONTAINER_ID}/memories"
session_id: Optional[str] = None


def opensearch_request(method: str, path: str, body: Optional[Dict] = None) -> Dict[str, Any]:
    """Send a request to OpenSearch and return the JSON response."""
    response = requests.request(
        method,
        f"{OPENSEARCH_URL}{path}",
        json=body,
        auth=HTTPBasicAuth(OPENSEARCH_USERNAME, OPENSEARCH_PASSWORD),
        verify=VERIFY_CERTS,
        timeout=30,
    )
    if not response.ok:
        print(f"OpenSearch returned {response.status_code}: {response.text}")
    response.raise_for_status()
    return response.json()


def create_session() -> str:
    """Create a session for this conversation and return its ID."""
    body = {
        "summary": "Strands Agents personal assistant conversation",
        "namespace": {"user_id": USER_ID},
    }
    return opensearch_request("POST", f"{MEMORIES_PATH}/sessions", body)["session_id"]


def to_memory_list(search_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Convert a search response into a compact list for the agent."""
    return [
        {
            "memory_id": hit["_id"],
            "memory": hit["_source"]["memory"],
            "strategy_type": hit["_source"]["strategy_type"],
        }
        for hit in search_response["hits"]["hits"]
    ]


@tool
def add_memory(user_message: str, assistant_message: Optional[str] = None) -> Dict[str, Any]:
    """Store a conversation turn so that facts and preferences in it are remembered.

    Call this tool when the user shares information about themselves that is worth
    remembering in future conversations, such as their name, job, or preferences.

    Args:
        user_message: The user's message that contains the information to remember.
        assistant_message: Your reply to the user's message, if any.
    """
    messages = [{"role": "user", "content": [{"text": user_message, "type": "text"}]}]
    if assistant_message:
        messages.append({"role": "assistant", "content": [{"text": assistant_message, "type": "text"}]})
    body = {
        "messages": messages,
        "namespace": {"user_id": USER_ID, "session_id": session_id},
        "payload_type": "conversational",
        "infer": True,
    }
    return opensearch_request("POST", MEMORIES_PATH, body)


@tool
def search_memories(query: str, k: int = 5) -> List[Dict[str, Any]]:
    """Find the user's long-term memories that are most relevant to a query.

    Args:
        query: A natural language description of the information you need.
        k: The maximum number of memories to return.
    """
    body = {"query": query, "k": k, "namespace": {"user_id": USER_ID}}
    response = opensearch_request("POST", f"{MEMORIES_PATH}/long-term/_semantic_search", body)
    return to_memory_list(response)


@tool
def list_memories(size: int = 50) -> List[Dict[str, Any]]:
    """List all of the user's long-term memories, newest first.

    Args:
        size: The maximum number of memories to return.
    """
    body = {
        "query": {"term": {"namespace.user_id": USER_ID}},
        "size": size,
        "_source": {"excludes": ["memory_embedding"]},
        "sort": [{"created_time": {"order": "desc"}}],
    }
    response = opensearch_request("GET", f"{MEMORIES_PATH}/long-term/_search", body)
    return to_memory_list(response)


@tool
def update_memory(memory_id: str, memory: str) -> Dict[str, Any]:
    """Replace the text of a long-term memory, for example, when the user corrects a fact.

    Args:
        memory_id: The ID of the memory to update, as returned by search_memories or list_memories.
        memory: The corrected memory text.
    """
    return opensearch_request("PUT", f"{MEMORIES_PATH}/long-term/{memory_id}", {"memory": memory})


@tool
def delete_memory(memory_id: str) -> Dict[str, Any]:
    """Delete a long-term memory, for example, when the user asks you to forget something.

    Args:
        memory_id: The ID of the memory to delete, as returned by search_memories or list_memories.
    """
    return opensearch_request("DELETE", f"{MEMORIES_PATH}/long-term/{memory_id}")


SYSTEM_PROMPT = """You are a personal assistant with long-term memory.
- When the user shares facts or preferences about themselves, call add_memory.
- Before answering a question that depends on what you know about the user, call search_memories.
  When the user asks what you know about them, call list_memories.
- When the user corrects a fact, find the memory and call update_memory.
- When the user asks you to forget something, find the memory and call delete_memory.
Facts are extracted in the background, so memories that you just added might not appear in results yet."""


def main():
    global session_id
    session_id = create_session()

    model = BedrockModel(model_id="us.anthropic.claude-sonnet-4-6", region_name=AWS_REGION)
    agent = Agent(
        model=model,
        tools=[add_memory, search_memories, list_memories, update_memory, delete_memory],
        system_prompt=SYSTEM_PROMPT,
    )

    print(f"Memory agent started. Container: {MEMORY_CONTAINER_ID}, session: {session_id}")
    print("Type 'exit' to quit.")
    while True:
        user_input = input("\n> ")
        if user_input.strip().lower() == "exit":
            break
        try:
            agent(user_input)
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    main()
```
{% include copy.html %}

## Step 5: Chat with the agent

Run the script:

```bash
python memory_agent.py
```
{% include copy.html %}

In the first session, tell the agent about yourself. The agent calls `add_memory` for each message, and the memory container extracts facts from the messages in the background. The agent's replies vary between runs; the following is an example conversation:

```
Memory agent started. Container: xthvpZgBOh0h20Y9O3Sa, session: S-dqiJkB1SltqOcZ1cYO
Type 'exit' to quit.

> Hi, I'm Alex. I'm a software engineer and I live in Seattle.

Tool #1: add_memory
Nice to meet you, Alex! I've made a note that you're a software engineer living in Seattle. Feel free to ask me anything. I'm here to help!
> I like hiking and Thai food.

Tool #2: add_memory
Great interests! I've saved that you enjoy hiking and Thai food. Seattle is a fantastic place for both: you've got amazing trails like those in the Cascades right at your doorstep, and Seattle has a wonderful Thai food scene!
> exit
```

Run the script again to start a second session. The agent has no conversation history from the first session, but it can retrieve the memories extracted from it. In this example, the agent updates and deletes two memories for each change because both strategies stored the location and Thai food facts:

```
Memory agent started. Container: xthvpZgBOh0h20Y9O3Sa, session: jTYm35kBt8CyICnjxJl9
Type 'exit' to quit.

> What do you know about me?

Tool #1: list_memories
Here's what I know about you:

- **Name:** Alex
- **Occupation:** Software Engineer
- **Location:** Seattle
- **Interests/Hobbies:** Hiking
- **Food Preferences:** Thai food

Is there anything you'd like to add, correct, or have me forget?
> Actually, I moved to Portland last month.
Got it, let me update that for you!
Tool #2: update_memory

Tool #3: update_memory
Done! I've updated your location from Seattle to Portland. Welcome to your new city! Is there anything else you'd like to update?
> Can you suggest a plan for this weekend?

Tool #4: search_memories

Tool #5: search_memories
Here's a fun weekend plan tailored for you in Portland, Alex!

**Saturday:**
- **Morning Hike:** Head out to **Forest Park**, one of the largest urban forests in the US, right in Portland. The Wildwood Trail offers beautiful scenery for all levels.
- **Lunch/Dinner:** Check out some of Portland's great Thai restaurants!

**Sunday:**
- **Morning Hike:** If you're up for a bit more of a drive, **Multnomah Falls** and the surrounding trails in the Columbia River Gorge are stunning and definitely worth a visit.
...
> Please forget that I like Thai food.
Sure!
Tool #6: delete_memory

Tool #7: delete_memory
Done! I've forgotten that you like Thai food. Is there anything else you'd like to update or remove?
> exit
```

## Step 6: Inspect the stored memories

To view the long-term memories that the memory container extracted, send the following request:

```json
GET /_plugins/_ml/memory_containers/your_memory_container_id/memories/long-term/_search
{
  "query": {
    "term": {
      "namespace.user_id": "your_user_id"
    }
  },
  "_source": {
    "excludes": ["memory_embedding"]
  },
  "sort": [
    {
      "created_time": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains one document for each extracted memory. The `strategy_type` field shows the strategy that extracted the memory. Both strategies stored the job, location, and hiking facts, so each fact appears twice. The two location memories that the agent updated in the second session contain the new location, and the Thai food memories that the agent deleted are no longer stored:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 14,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": ".plugins-ml-am-default-memory-long-term",
        "_id": "knfxQaEBH4GznK_vmeM7",
        "_version": 1,
        "_seq_no": 28,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "created_time": 1792107714677,
          "memory": "Alex likes hiking.",
          "last_updated_time": 1792107714677,
          "namespace_size": 1,
          "namespace": {
            "user_id": "your_user_id"
          },
          "strategy_id": "semantic_8f9ade02",
          "strategy_type": "SEMANTIC",
          "memory_container_id": "xthvpZgBOh0h20Y9O3Sa"
        },
        "sort": [1792107714677]
      },
      {
        "_index": ".plugins-ml-am-default-memory-long-term",
        "_id": "jnfxQaEBH4GznK_vmOPV",
        "_version": 1,
        "_seq_no": 26,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "created_time": 1792107714561,
          "memory": "Alex likes hiking.",
          "last_updated_time": 1792107714561,
          "namespace_size": 1,
          "namespace": {
            "user_id": "your_user_id"
          },
          "strategy_id": "user_preference_5f897716",
          "strategy_type": "USER_PREFERENCE",
          "memory_container_id": "xthvpZgBOh0h20Y9O3Sa"
        },
        "sort": [1792107714561]
      },
      {
        "_index": ".plugins-ml-am-default-memory-long-term",
        "_id": "c3fxQaEBH4GznK_vi-No",
        "_version": 1,
        "_seq_no": 16,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "created_time": 1792107710851,
          "memory": "Alex is a software engineer.",
          "last_updated_time": 1792107710851,
          "namespace_size": 1,
          "namespace": {
            "user_id": "your_user_id"
          },
          "strategy_id": "user_preference_5f897716",
          "strategy_type": "USER_PREFERENCE",
          "memory_container_id": "xthvpZgBOh0h20Y9O3Sa"
        },
        "sort": [1792107710851]
      },
      {
        "_index": ".plugins-ml-am-default-memory-long-term",
        "_id": "dHfxQaEBH4GznK_vi-No",
        "_version": 2,
        "_seq_no": 34,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "created_time": 1792107710851,
          "memory": "Alex lives in Portland.",
          "last_updated_time": 1792107743470,
          "namespace_size": 1,
          "namespace": {
            "user_id": "your_user_id"
          },
          "strategy_id": "user_preference_5f897716",
          "strategy_type": "USER_PREFERENCE",
          "memory_container_id": "xthvpZgBOh0h20Y9O3Sa"
        },
        "sort": [1792107710851]
      },
      {
        "_index": ".plugins-ml-am-default-memory-long-term",
        "_id": "cXfxQaEBH4GznK_vi-Ne",
        "_version": 1,
        "_seq_no": 12,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "created_time": 1792107710840,
          "memory": "Alex is a software engineer.",
          "last_updated_time": 1792107710840,
          "namespace_size": 1,
          "namespace": {
            "user_id": "your_user_id"
          },
          "strategy_id": "semantic_8f9ade02",
          "strategy_type": "SEMANTIC",
          "memory_container_id": "xthvpZgBOh0h20Y9O3Sa"
        },
        "sort": [1792107710840]
      },
      {
        "_index": ".plugins-ml-am-default-memory-long-term",
        "_id": "cnfxQaEBH4GznK_vi-Ne",
        "_version": 2,
        "_seq_no": 35,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "created_time": 1792107710840,
          "memory": "Alex lives in Portland.",
          "last_updated_time": 1792107743470,
          "namespace_size": 1,
          "namespace": {
            "user_id": "your_user_id"
          },
          "strategy_id": "semantic_8f9ade02",
          "strategy_type": "SEMANTIC",
          "memory_container_id": "xthvpZgBOh0h20Y9O3Sa"
        },
        "sort": [1792107710840]
      }
    ]
  }
}
```
</details>

The history memory type records the long-term memories that the memory container adds, updates, and deletes when it processes conversations. Changes made using the Update Memory and Delete Agentic Memory APIs, such as the agent's update and deletion in this tutorial, are not recorded in history. To review the memories that the memory container extracted, send the following request:

```json
GET /_plugins/_ml/memory_containers/your_memory_container_id/memories/history/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "created_time": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Next steps

- For more information about memory types, strategies, and namespaces, see [Agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).
- To combine keyword and semantic search over memories, see [Hybrid Search Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/hybrid-search-memory/).
- For the complete list of memory operations, see [Agentic Memory APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/).

## Related documentation

- [Create Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/)
- [Add Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/add-memory/)
- [Search Agentic Memory API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/search-memory/)
- [Connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/)
