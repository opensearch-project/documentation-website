---
layout: default
title: Text to Visualization
parent: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
---

# Text to Visualization
**Experimental**
{: .label .label-purple }

The OpenSearch-Dashboards Assistant text to visualization feature helps you create visualizations with natural language.

## Configuration

### Prerequisites
Follow this [guide](http://localhost:4000/docs/latest/dashboards/dashboards-assistant/index/#configuring-opensearch-assistant) to setup `os_query_assist_ppl`,
please note that you only need to setup `os_query_assist_ppl` agent for text to visualization feature.

### Enable Text to Visualization
```yaml
assistant.text2viz.enabled: true
```
{% include copy.html %}

### Create agents with OpenSearch flow-framework 
Use OpenSearch flow-framework to create the required agents. Please follow [flow-framework documentation](https://github.com/opensearch-project/flow-framework) to create the agents.
You can start with the flow-framework example template for text to visualization, see the example template [here](https://github.com/opensearch-project/flow-framework/tree/main/sample-templates).

### Configure agents
Create root agent of text to visualization
```
POST /.plugins-ml-config/_doc/os_text2vega
{
  "type": "os_chat_root_agent",
  "configuration": {
    "agent_id": "your root agent id"
  }
}
```
{% include copy-curl.html %}

Create root agent of text to visualization for user inputs with instruction
```
POST /.plugins-ml-config/_doc/os_text2vega_with_instructions
{
  "type": "os_chat_root_agent",
  "configuration": {
    "agent_id": "your root agent id"
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
    "input_question": "find unique visitors and average bytes every 3 hours",
    "input_instruction": "display with different layers, use independent scale for different layers, display unique visitors with light blue bar chart",
    "ppl": "source=opensearch_dashboards_sample_data_ecommerce| stats DISTINCT_COUNT(user) as unique_visitors, AVG(taxful_total_price) as avg_bytes by span(order_date, 3h)",
    "sampleData": """[{\"unique_visitors\":15,\"avg_bytes\":90.98684210526316,\"span(order_date,3h)\":\"2024-04-25 00:00:00\"},{\"unique_visitors\":14,\"avg_bytes\":72.72083333333333,\"span(order_date,3h)\":\"2024-04-25 03:00:00\"}]""",
    "dataSchema": """[{\"name\":\"unique_visitors\",\"type\":\"integer\"},{\"name\":\"avg_bytes\",\"type\":\"double\"},{\"name\":\"span(order_date,3h)\",\"type\":\"timestamp\"}]"""
  }
}
```
{% include copy-curl.html %}

## Text to visualization API
Call API `/api/assistant/text2vega` to generate vega based visualization, `input_instruction` is optional.
```
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

Parameter | Description | Required
:--- | :--- | :---
input_instruction | the instruction for styling the visualization | `true`
input_question | the original question used to generate the PPL query
ppl | the generated PPL query for the visualization data
dataSchema | the schema of the visualization  data
sampleData | a few samples of the visualization data


## Text to visualization UI
Start with creating a new visualization with natural language

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-start.png" alt="Create a visualization by selecting natural language">

Select a data source

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-select-data-source.png" alt="Create a visualization by selecting natural language">

Ask a question with natural language

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-ask-question.png" alt="Create a visualization by selecting natural language">

Adjust the visualization by clicking the "Edit visual" button

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-edit-visual.png" alt="Create a visualization by selecting natural language">

See the updated visualization

<img width="700" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/t2viz-edit-visual-response.png" alt="Create a visualization by selecting natural language">



