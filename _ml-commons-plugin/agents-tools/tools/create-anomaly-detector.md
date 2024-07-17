---
layout: default
title: Create Anomaly Detector tool
has_children: false
has_toc: false
nav_order: 70
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Create Anomaly Detectors tool
**Introduced 2.16**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/skills/issues/337).    
{: .warning}

The `CreateAnomalyDetectorTool` helps to create an anomaly detector based on the given index, it will get the mappings of the index and let LLM give the suggested category field, aggregation field and correspond aggregation method which are required by the create
anomaly detector API. For more information about anomaly detectors, see [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/).

## Step 1: Register a flow agent that will run the CreateAnomalyDetectorTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

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

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "EuJYYo0B9RaBCvhuy1q8"
}
```

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

OpenSearch responds with a json string containg all the suggested parameters for creating anomaly detector:

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
, then you can create an anomaly detector by the suggested parameters by LLM:

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

## Register parameters

The following table lists all tool parameters that are available when registering an agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`model_id` | String | Required | The model ID of the large language model (LLM) to use for suggesting required parameters of the creating anomaly detector API.
`model_type` | String | Optional | The model type. Valid values are `CLAUDE` (Anthropic Claude model), `OPENAI` (OpenAI models). 

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`index` | String | Required | The index name, supports wildcards like `weblogs-*`, if wildcards is used, the tool will fetch the mappings of the first resolved index and then send the mappings to LLM. 
