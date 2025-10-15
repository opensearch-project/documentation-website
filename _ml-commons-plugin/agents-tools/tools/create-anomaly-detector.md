---
layout: default
title: Create Anomaly Detector tool
has_children: false
has_toc: false
nav_order: 22
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Create Anomaly Detector tool
**Introduced 2.16**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/skills/issues/337).    
{: .warning}

The `CreateAnomalyDetectorTool` helps create anomaly detectors based on your provided index. This tool retrieves index mappings and enables a large language model (LLM) to recommend category fields, aggregation fields, and their corresponding aggregation methods, which are required by the Create Anomaly Detector API. 

For comprehensive information about anomaly detectors, see [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/).
{: .tip}

## Step 1: Register a flow agent that runs the CreateAnomalyDetectorTool

A flow agent runs a sequence of tools in order, returning the output of the last tool. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Create_Anomaly_Detector_Tool",
  "type": "flow",
  "description": "this is a test agent for the CreateAnomalyDetectorTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
      {
      "type": "CreateAnomalyDetectorTool",
      "name": "DemoCreateAnomalyDetectorTool",
      "parameters": {
        "model_id": "<the model id of LLM>"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

OpenSearch responds with an agent ID, for example, as follows:

```json
{
  "agent_id": "EuJYYo0B9RaBCvhuy1q8"
}
```
{% include copy-curl.html %} 

## Step 2: Run the agent

Run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/EuJYYo0B9RaBCvhuy1q8/_execute
{
  "parameters": {
    "index": "sample_weblogs_test"
  }
}
```
{% include copy-curl.html %} 

OpenSearch responds with a JSON string containing all of the recommended parameters for creating an anomaly detector, such as the string shown in the following example repsonse:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result":"""{"index":"sample_weblogs_test","categoryField":"ip.keyword","aggregationField":"bytes,response,responseLatency","aggregationMethod":"sum,avg,avg","dateFields":"utc_time,timestamp"}"""
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %} 

You can then create an anomaly detector containing the recommended parameters by sending a request similar to the following: 

```json
POST _plugins/_anomaly_detection/detectors
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "sample_weblogs_test"
  ],
  "feature_attributes": [
    {
      "feature_name": "feature_bytes",
      "feature_enabled": true,
      "aggregation_query": {
        "agg1": {
          "sum": {
            "field": "bytes"
          }
        }
      }
    },
    {
      "feature_name": "feature_response",
      "feature_enabled": true,
      "aggregation_query": {
        "agg2": {
          "avg": {
            "field": "response"
          }
        }
      }
    },
    {
      "feature_name": "feature_responseLatency",
      "feature_enabled": true,
      "aggregation_query": {
        "agg3": {
          "avg": {
            "field": "responseLatency"
          }
        }
      }
    }
  ],
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  }
}
```
{% include copy-curl.html %} 

## Register parameters

The following table lists the available tool parameters for agent registration.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`model_id` | String | Required | The LLM model ID used for suggesting required Create Anomaly Detector API parameters.
`model_type` | String | Optional | The model type. Valid values are `CLAUDE` (Anthropic Claude models) and `OPENAI` (OpenAI models). 

## Execute parameters

The following table lists the available tool parameters for running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`index` | String | Required | The index name. Supports wildcards (for example, `weblogs-*`). If wildcards are used, then the tool fetches mappings from the first resolved index and sends them to the LLM. 

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.