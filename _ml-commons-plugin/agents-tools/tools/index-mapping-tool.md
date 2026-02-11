---
layout: default
title: Index Mapping tool
has_children: false
has_toc: false
nav_order: 30
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/index-mapping-tool/
---

<!-- vale off -->
# Index Mapping tool
**Introduced 2.13**
{: .label .label-purple }
<!-- vale on -->

The `IndexMappingTool` retrieves mapping and setting information for indexes in your cluster.

## Step 1: Register a flow agent that will run the IndexMappingTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_IndexMapping_tool",
  "type": "flow",
  "description": "this is a test agent for the IndexMappingTool",
  "tools": [
      {
      "type": "IndexMappingTool",
      "name": "DemoIndexMappingTool",
      "parameters": {
        "index": "${parameters.index}",
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

Before you run the agent, make sure that you add the sample OpenSearch Dashboards `Sample eCommerce orders` dataset. To learn more, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart#adding-sample-data).

Then, run the agent by sending the following request and providing the index name and the question:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "index": [ "sample-ecommerce" ],
    "question": "What fields are in the sample-ecommerce index?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the mappings and settings for the specified index:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """index: sample-ecommerce

mappings:
properties={items_purchased_failure={type=integer}, items_purchased_success={type=integer}, order_id={type=integer}, timestamp={type=date}, total_revenue_usd={type=integer}}


settings:
index.creation_date=1706752839713
index.number_of_replicas=1
index.number_of_shards=1
index.provided_name=sample-ecommerce
index.replication.type=DOCUMENT
index.uuid=UPYOQcAfRGqFAlSxcZlRjw
index.version.created=137217827


"""
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent.

Parameter | Type | Required/Optional | Description
:--- | :--- | :--- | :---
`input` | String | Required | The user input used to return index information.
`index` | Array | Required | A comma-delimited list of one or more indexes for which to obtain mapping and setting information. Default is an empty list, which means all indexes.
`local` | Boolean | Optional | Whether to return information from the local node only instead of the cluster manager node (default is `false`).

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 
`index` | Array | Optional | A comma-delimited list of one or more indexes for which to obtain mapping and setting information. Default is an empty list, which means all indexes.

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.