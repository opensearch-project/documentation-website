---
layout: default
title: Text to visualization
parent: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
---

# Text to visualization

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The OpenSearch Dashboards Assistant can create visualizations using natural language instructions.

## Configuration

To configure text to visualization, use the following steps.

### Step 1: Enable text to visualization

To enable text to visualization, configure the following `opensearch_dashboards.yml` setting:

```yaml
assistant.text2viz.enabled: true
```
{% include copy.html %}

### Step 2: Create an agent

To orchestrate text to visualization, create an `os_query_assist_ppl` agent. To create an agent, send a `POST /_plugins/_ml/agents/_register` request and provide the agent template as a payload. For more information, see [Configuring OpenSearch Assistant]({{site.url}}{{site.baseurl}}/dashboards/dashboards-assistant/index/#configuring-opensearch-assistant).

Create text to visualization agents with flow template: `text-to-visualization-claude.json`
```json
POST /_plugins/_flow_framework/workflow
{/*please take the sample json payload from flow framework templates as reference*/}
```

You should get a workflow id from the above API call, now call provision API to create the resources
```json
POST /_plugins/_flow_framework/workflow/<workflow_id>/_provision
```

View the status of the workflow, and you can find all created resources includes the agent ids that will be used in the following steps
```json
/_plugins/_flow_framework/workflow/<workflow_id>/_status
```

For sample agent templates, see [Flow Framework sample templates](https://github.com/opensearch-project/flow-framework/tree/2.x/sample-templates). Note the agent ID; you'll use it in the following step.

### Step 3: Configure the root agent

Next, configure a root agent for text to visualization:

```json
POST /.plugins-ml-config/_doc/os_text2vega
{
  "type": "os_chat_root_agent",
  "configuration": {
    "agent_id": "<ROOT_AGENT_ID>"
  }
}
```
{% include copy-curl.html %}

Configure the agent to receive user instructions for creating visualizations:

```json
POST /.plugins-ml-config/_doc/os_text2vega_with_instructions
{
  "type": "os_chat_root_agent",
  "configuration": {
    "agent_id": "<ROOT_AGENT_ID>"
  }
}
```
{% include copy-curl.html %}

### Step 4: Test the agent

You can verify that the agent was created successfully by calling the agent with an example payload:

```json
POST /_plugins/_ml/agents/<ROOT_AGENT_ID>/_execute
{
  "parameters": {
    "input_question": "find unique visitors and average bytes every 3 hours",
    "input_instruction": "display with different layers, use independent scale for different layers, display unique visitors with light blue bar chart",
    "ppl": "source=opensearch_dashboards_sample_data_ecommerce| stats DISTINCT_COUNT(user) as unique_visitors, AVG(taxful_total_price) as avg_bytes by span(order_date, 3h)",
    "sampleData": """[{\"unique_visitors\":15,\"avg_bytes\":90.98684210526316,\"span(order_date,3h)\":\"2024-04-25 00:00:00\"},{\"unique_visitors\":14,\"avg_bytes\":72.72083333333333,\"span(order_date,3h)\":\"2024-04-25 03:00:00\"}]""",
    "dataSchema": """[{\"name\":\"unique_visitors\",\"type\":\"integer\"},{\"name\":\"avg_bytes\",\"type\":\"double\"},{\"name\":\"span(order_date,3h)\",\"type\":\"timestamp\"}]"""
  }
}
```
{% include copy-curl.html %}

## Generating a visualization from text

You can generate a visualization from text by calling the `/api/assistant/text2vega` API endpoint. The `input_instruction` parameter is optional:

```json
POST /api/assistant/text2vega
{
  "input_instruction": "<input_instruction>",
  "input_question": "<input_question>",
  "ppl": "<ppl_query>",
  "dataSchema": "<data_schema_of_ppl_response>",
  "sampleData": "<sample_data_of_ppl_response>"
}
```
{% include copy-curl.html %}

The following table describes the Text to Visualization API parameters.

Parameter | Required/Optional | Description 
:--- | :--- | :---
`input_question` | Required | The user's original question used to generate the corresponding Piped Processing Language (PPL) query.
`ppl` | Required | 	The generated PPL query that retrieves the data required for the visualization.
`dataSchema` | Required | Describes the structure and types of the data fields in the visualization output, based on the PPL response.
`sampleData` | Required | Provides sample entries from the data that will populate the visualization.
`input_instruction` | Optional | Specifies the styling instructions, such as colors, for the visualization.

## Generating visualizations from text in OpenSearch Dashboards

To generate visualizations from text in OpenSearch Dashboards, use the following steps:

1. On the top menu bar, go to **OpenSearch Dashboards > Visualize** and then select **Create visualization**.

1. In the **New Visualization** dialog, select **Natural language**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-start.png" alt="Create a visualization by selecting natural language">

1. From the data sources dropdown list, select a data source, as shown in the following image. 

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-select-data-source.png" alt="Create a visualization by selecting natural language">

1. In the text box on the upper right, enter a question using natural language, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-ask-question.png" alt="Create a visualization by selecting natural language">

1. To modify the generated visualization, select **Edit visual**. In the **Edit visual** dialog, enter the desired modifications and then select **Apply**, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-edit-visual.png" alt="Create a visualization by selecting natural language">

    The visualization is updated, as shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-edit-visual-response.png" alt="Create a visualization by selecting natural language">



