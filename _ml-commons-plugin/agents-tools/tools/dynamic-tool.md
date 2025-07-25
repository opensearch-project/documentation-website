---
layout: default
title: Dynamic tool
has_children: false
has_toc: false
nav_order: 130
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Dynamic tool
**Introduced 3.2**
{: .label .label-purple }
<!-- vale on -->

The `DynamicTool` supports user to customize OpenSearch APIs as a tool, previously all the tools are hard coded and user can't use an OpenSearch API as tool if the tool
is not implemented which is a hard limitation. 

## Cluster Health API as a tool
To use cluster health API as a tool, you can follow below steps.

### Step 1: Register a flow agent that will run the DynamicTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, please note the tool's
parameters configuration.

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

OpenSearch returns the CluserHealthTool results:

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

## Node stats API as a tool
To use node stats API as a tool, you can follow below steps.

### Step 1: Register a flow agent that will run the DynamicTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request, please note the tool's
parameters configuration.

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
    "question": "What the index searcher thread pool stats in the OpenSearch cluster?",
    "node_id": "-bi3Rw1OTA6-jK4Uh5_Thg"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the CluserHealthTool results:

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
| `method` | String | Required | The method that corresponding API uses. |
| `uri` | String | Required | The uri that the corresponding API uses, the uri supports `${place_holder}` configuration and these place holders will be replaced during agent run time with the parameters passed in the agent request body.|
| `request_body` | String | Optional | This is the request body of the corresponding API, the request body supports `{place_holder}` configuration and these place holders will be replaced during agent run time with the parameters passed in the agent request body. |
| `response_filter` | String | Optional | The json path response filter, the corresponding API response is always json format, so you can filter the target fields with a json path response filter.  |

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 