---
layout: default
title: Dynamic tool
has_children: false
has_toc: false
nav_order: 25
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/dynamic-tool/
---

<!-- vale off -->
# Dynamic tool
**Introduced 3.2**
{: .label .label-purple }
<!-- vale on -->

The `DynamicTool` converts OpenSearch APIs into executable tools for machine learning (ML) agents. This allows you to integrate cluster management and monitoring operations directly into your AI workflows.

For example, you can create tools that check cluster health, retrieve node statistics, or perform other administrative tasks, then have ML agents execute these tools as part of automated workflows or in response to natural language queries.

## Running the Cluster Health API as a tool

To run the [Cluster Health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) as a tool, follow these steps.

### Step 1: Register a flow agent that will run the DynamicTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, specifying the tool's parameters:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_DynamicTool",
  "type": "flow",
  "description": "this is a test agent that converts Cluster Health API to a tool via DynamicTool",
  "tools": [
    {
      "type": "DynamicTool",
      "name": "ClusterHealthTool",
      "parameters": {
        "method": "GET",
        "uri": "_cluster/health?wait_for_status=yellow&timeout=50s",
        "response_filter": "$.active_primary_shards"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

### Step 2: Run the agent

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How many active primary shards are there in the OpenSearch cluster?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the `ClusterHealthTool` results:

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "response",
                    "result": "7"
                }
            ]
        }
    ]
}
```

## Running the Node Stats API as a tool

To run the [Node Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) as a tool, follow these steps.

### Step 1: Register a flow agent that will run the DynamicTool

To create a flow agent, send the following register agent request, specifying the tool's parameters:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_DynamicTool",
  "type": "flow",
  "description": "this is a test agent that converts node stats API to a tool via DynamicTool",
  "tools": [
    {
      "type": "DynamicTool",
      "name": "NodeStatsTool",
      "parameters": {
        "method": "GET",
        "uri": "/_nodes/${node_id}/stats",
        "response_filter": "$.thread_pool.index_searcher"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

### Step 2: Run the agent

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "What are the index searcher thread pool stats in the OpenSearch cluster?",
    "node_id": "-bi3Rw1OTA6-jK4Uh5_Thg"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the `NodeStatsTool` results:

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "response",
                    "result": "{\"threads\": 0,\"queue\": 0,\"active\": 0,\"rejected\": 0,\"largest\": 0,\"completed\": 0,\"total_wait_time_in_nanos\": 0}"
                }
            ]
        }
    ]
}
```


## Register parameters

The following table lists all tool parameters that are available when registering an agent.


| Parameter | Type | Required/Optional | Description |
|:---|:---|:---|:---|
| `method` | String | Required | The HTTP method used by the API (for example, `GET`, `POST`).                                                                               |
| `uri` | String | Required | The API URI. Supports `${placeholder}` syntax. Placeholders are replaced at runtime with values from the agent request body. |
| `request_body`    | String | Optional | The API request body. Supports `${placeholder}` syntax. Placeholders are replaced at runtime with values from the agent request body. |
| `response_filter` | String | Optional | A JSONPath expression used to filter fields from the API's JSON response. |


## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the large language model (LLM). 