---
layout: default
title: List Index tool
has_children: false
has_toc: false
nav_order: 35
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# List Index tool
**Introduced 3.0**
{: .label .label-purple }
<!-- vale on -->

The `ListIndexTool` retrieves index information for the OpenSearch cluster, similarly to the [List Indices API]({{site.url}}{{site.baseurl}}/api-reference/list/list-indices/).

The `ListIndexTool` replaces the `CatIndexTool` starting with OpenSearch version 3.0.
{: .note}

## Step 1: Register a flow agent that will run the ListIndexTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ListIndex_tool",
  "type": "flow",
  "description": "this is a test agent for the ListIndexTool",
  "tools": [
    {
      "type": "ListIndexTool",
      "name": "DemoListIndexTool",
      "parameters": {
        "input": "${parameters.question}"
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

## Step 2: Run the agent

Before you run the agent, make sure that you add the sample OpenSearch Dashboards `Sample eCommerce orders` dataset. To learn more, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "How many indices do I have?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the index information:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)
1,green,open,.plugins-ml-model-group,lHgGEgJhT_mpADyOZoXl2g,1,0,9,2,16.7kb,16.7kb
2,green,open,.plugins-ml-config,G7gxGQB7TZeQzBasHd5PUg,1,0,1,0,3.9kb,3.9kb
3,green,open,sample-ecommerce,UPYOQcAfRGqFAlSxcZlRjw,1,0,40320,0,2mb,2mb
4,green,open,.plugins-ml-model,WYcjBHcnRuSDHeVWPVupoA,1,0,191,45,2.1gb,2.1gb
5,green,open,opensearch_dashboards_sample_data_ecommerce,wnE6r7OvSPqc5YHj8wHSLA,1,0,4675,0,4.9mb,4.9mb
...
"""
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent.

<!-- vale off -->
Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`indices` | Array | Optional | An array of one or more indexes on which to run the list index operation, specified as a JSON array (for example, `["index1", "index2"]`). Default is an empty array, which means all indexes.
`local` | Boolean | Optional | When `true`, retrieves information from the local node only instead of the cluster manager node. Default is `false`.
`page_size` | Integer | Optional | Specifies the number of index results returned per page when using the List Indices API. The API retrieves index status in a paginated manner. Default is `100`.
`include_unloaded_segments` | Boolean | Optional | When `true`, the index statistics include information from segments that are not loaded into memory. Default is `false`.
<!-- vale on -->

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.