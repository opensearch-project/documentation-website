---
layout: default
title: Suggest Anomaly Detector
parent: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
---

# Suggest Anomaly Detector
**Experimental**
{: .label .label-purple }

The OpenSearch-Dashboards Assistant suggest anomaly detector feature helps you create anomaly detector based on the suggestion given by LLM.

## Configuration

### Prerequisites
1. Please note that you only need to setup `os_suggest_ad` agent for suggest anomaly detector feature, follow this [guide](http://localhost:4000/docs/latest/dashboards/dashboards-assistant/index/#configuring-opensearch-assistant) to setup `os_suggest_ad` agent.
2. Ensure query enhancements feature is enabled, you can goto `Dashboards Management`>`Advanced settings` to enable this feature.

### Enable Suggest Anomaly Detector
```yaml
assistant.smartAnomalyDetector.enabled: true
```
{% include copy.html %}

### Create agents with OpenSearch flow-framework 
Use OpenSearch flow-framework to create the required agents. Please follow [flow-framework documentation](https://github.com/opensearch-project/flow-framework) to create the agents.
You can start with the flow-framework example template for suggest anomaly detector, see the example template [here](https://github.com/opensearch-project/flow-framework/tree/main/sample-templates).

### Configure agents
Configure agent for suggest anomaly detector
```
POST /.plugins-ml-config/_doc/os_suggest_ad
{
  "type": "suggest_anomaly_detector_agent",
  "configuration": {
    "agent_id": "your agent id of suggest anomaly detector"
  }
}
```
{% include copy-curl.html %}

### Verify
You can verify if the agents were create successfully by call the agents with example payload
```
POST /_plugins/_ml/agents/<your agent id>/_execute
{
  "parameters": {
    "index":"sample_weblogs_test"
  }
}
```
{% include copy-curl.html %}

## Suggest Anomaly Detector UI

Select an index pattern, click the `AI assistant` button and then click the `Suggest anomaly detector` action:

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/suggestAD-button.png" alt="Click the Suggest anomaly detector action">

Wait LLM to give the suggested model features and category field for creating anomaly detector for the index pattern, then click the `Create detector` button to create an anomaly detector.

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/suggestAD-UI.png" alt="Suggested anomaly detector">



