---
layout: default
title: Anomaly detector suggestions
parent: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
canonical_url: https://docs.opensearch.org/latest/dashboards/dashboards-assistant/suggest-anomaly-detector/
---

# Anomaly detector suggestions

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The OpenSearch Dashboards Assistant can use a large language model (LLM) to suggest the creation of an anomaly detector. The LLM analyzes data patterns in your OpenSearch indexes and recommends configuration settings for the anomaly detector, making it easier to identify unusual activity or trends in your data.

## Configuration

To configure anomaly detector suggestions, use the following steps.

### Prerequisite

Before using anomaly detector suggestions, enable query enhancements in OpenSearch Dashboards as follows:

1. On the top menu bar, go to **Management > Dashboards Management**. 
1. In the left navigation pane, select **Advanced settings**.
1. On the settings page, toggle **Enable query enhancements** to **On**.

### Step 1: Enable anomaly detector suggestions

To enable anomaly detector suggestions, configure the following `opensearch_dashboards.yml` setting:

```yaml
assistant.smartAnomalyDetector.enabled: true
```
{% include copy.html %}

### Step 2: Create an anomaly detector suggestion agent

To orchestrate anomaly detector suggestions, create an anomaly detector suggestion [agent]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/#agents). To create an agent, send a `POST /_plugins/_flow_framework/workflow?provision=true` request and provide the agent template as a payload. For more information, see [Configuring OpenSearch Assistant]({{site.url}}{{site.baseurl}}/dashboards/dashboards-assistant/index/#configuring-opensearch-assistant).

For sample agent templates, see [Flow Framework sample templates](https://github.com/opensearch-project/flow-framework/tree/2.x/sample-templates). Note the agent ID; you'll use it in the following step.

### Step 3: Configure the agent

Next, configure the anomaly detector suggestion agent created in the previous step:

```json
POST /.plugins-ml-config/_doc/os_suggest_ad
{
  "type": "suggest_anomaly_detector_agent",
  "configuration": {
    "agent_id": "<SUGGEST_ANOMALY_DETECTOR_AGENT_ID>"
  }
}
```
{% include copy-curl.html %}

This example demonstrates a system index. In security-enabled domains, only superadmins have permissions to execute this code. For information about making superadmin calls, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/). For access permissions, contact your system administrator.
{: .warning}

### Step 4: Test the agent

You can verify that the agent was created successfully by calling the agent with an example payload:

```json
POST /_plugins/_ml/agents/<SUGGEST_ANOMALY_DETECTOR_AGENT_ID>/_execute
{
  "parameters": {
    "index":"sample_weblogs_test"
  }
}
```
{% include copy-curl.html %}

## Viewing anomaly detector suggestions in OpenSearch Dashboards

To view anomaly detector suggestions in OpenSearch Dashboards, use the following steps:

1. On the top menu bar, go to **OpenSearch Dashboards > Discover**.

1. From the index pattern dropdown list, select an index pattern.

1. Select the **AI assistant** dropdown list and then select **Suggest anomaly detector**, as shown in the following image.

    <img width="420px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/suggestAD-button.png" alt="Click the Suggest anomaly detector action">

1. Wait for the LLM to populate the **Suggest anomaly detector** fields that will be used to create an anomaly detector for the index pattern. Then select the **Create detector** button to create an anomaly detector, as shown in the following image.

    <img width="800px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/suggestAD-UI.png" alt="Suggested anomaly detector">
