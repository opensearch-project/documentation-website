---
layout: default
title: Data Distribution tool
has_children: false
has_toc: false
nav_order: 39
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Data Distribution tool
**Introduced 3.3.0**
{: .label .label-purple }
<!-- vale on -->

The `DataDistributionTool` analyzes data distribution patterns within datasets and compares distributions between different time periods. It supports both single dataset analysis and comparative analysis to identify significant changes in field value distributions, helping detect anomalies, trends, and data quality issues.

The tool supports both [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/) and [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) queries for flexible data retrieval and filtering.

## Analysis Modes

The tool automatically selects the appropriate analysis mode based on the provided parameters:

- **Comparative Analysis**: When both baseline and selection time ranges are provided, compares field distributions between the two periods to identify significant changes and divergences.
- **Single Dataset Analysis**: When only selection time range is provided, analyzes distribution patterns within the dataset to provide insights into field value frequencies and characteristics.

## Step 1: Register a flow agent that will run the DataDistributionTool

A flow agent runs a sequence of tools in order, returning the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Data_Distribution_Tool",
  "type": "flow",
  "description": "this is a test agent for the DataDistributionTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
    {
      "type": "DataDistributionTool",
      "parameters": {}
    }
  ]
}
```
{% include copy-curl.html %}

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "OQutgJYBAc35E4_KvI1q"
}
```

## Step 2: Run the agent

### Comparative Analysis Example

Run the agent for comparative distribution analysis between two time periods:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "logs-2025.01.15",
    "timeField": "@timestamp",
    "selectionTimeRangeStart": "2025-01-15 10:00:00",
    "selectionTimeRangeEnd": "2025-01-15 11:00:00",
    "baselineTimeRangeStart": "2025-01-15 08:00:00",
    "baselineTimeRangeEnd": "2025-01-15 09:00:00",
    "size": 1000,
    "queryType": "dsl",
    "filter": ["{\"term\": {\"status\": \"error\"}}", "{\"range\": {\"response_time\": {\"gte\": 100}}}"]
  }
}
```
{% include copy-curl.html %}

### Single Dataset Analysis Example

Run the agent for single dataset distribution analysis:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "application_logs",
    "timeField": "@timestamp",
    "selectionTimeRangeStart": "2025-01-15 10:00:00",
    "selectionTimeRangeEnd": "2025-01-15 11:00:00",
    "size": 1000,
    "queryType": "dsl"
  }
}
```
{% include copy-curl.html %}

### PPL Query Example

Run the agent using PPL for data retrieval:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "logs-2025.01.15",
    "timeField": "@timestamp",
    "selectionTimeRangeStart": "2025-01-15 10:00:00",
    "selectionTimeRangeEnd": "2025-01-15 11:00:00",
    "size": 1000,
    "queryType": "ppl",
    "ppl": "source=logs-2025.01.15 | where status='error'"
  }
}
```
{% include copy-curl.html %}

### Custom DSL Query Example

Run the agent with a complete custom DSL query:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "logs-2025.01.15",
    "timeField": "@timestamp",
    "selectionTimeRangeStart": "2025-01-15 10:00:00",
    "selectionTimeRangeEnd": "2025-01-15 11:00:00",
    "size": 1000,
    "queryType": "dsl",
    "dsl": "{\"bool\": {\"must\": [{\"term\": {\"status\": \"error\"}}], \"filter\": [{\"range\": {\"response_time\": {\"gte\": 100}}}]}}"
  }
}
```
{% include copy-curl.html %}

## Response Examples

### Comparative Analysis Response

OpenSearch returns field-by-field comparison showing distribution changes between time periods:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"comparisonAnalysis\": [{\"field\": \"status\", \"divergence\": 0.2, \"topChanges\": [{\"value\": \"error\", \"selectionPercentage\": 0.3, \"baselinePercentage\": 0.1}, {\"value\": \"success\", \"selectionPercentage\": 0.7, \"baselinePercentage\": 0.9}]}]}"
        }
      ]
    }
  ]
}
```

### Single Dataset Analysis Response

OpenSearch returns distribution patterns for the analyzed dataset:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"singleAnalysis\": [{\"field\": \"status\", \"divergence\": 0.7, \"topChanges\": [{\"value\": \"error\", \"selectionPercentage\": 0.3, \"baselinePercentage\": 0.0}, {\"value\": \"success\", \"selectionPercentage\": 0.7, \"baselinePercentage\": 0.0}]}]}"
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists the available tool parameters for agent registration.

| Parameter | Type | Required/Optional | Description |
|:----------|:-----|:------------------|:------------|
| No parameters required for registration | | | The tool uses dynamic parameter validation at execution time. |

## Execute parameters

The following table lists the available tool parameters for running the agent.

| Parameter | Type | Required/Optional | Description |
|:----------|:-----|:------------------|:------------|
| `index` | String | Required | Target OpenSearch index name containing the data to analyze. |
| `timeField` | String | Optional | Date/time field for time-based filtering. Default is `@timestamp`. |
| `selectionTimeRangeStart` | String | Required | Start time for the analysis period (UTC date string, e.g., '2025-01-15 10:00:00'). |
| `selectionTimeRangeEnd` | String | Required | End time for the analysis period (UTC date string, e.g., '2025-01-15 11:00:00'). |
| `baselineTimeRangeStart` | String | Optional | Start time for baseline comparison period. Required for comparative analysis mode. |
| `baselineTimeRangeEnd` | String | Optional | End time for baseline comparison period. Required for comparative analysis mode. |
| `size` | Integer | Optional | Maximum number of documents to analyze. Default is `1000`, maximum is `10000`. |
| `queryType` | String | Optional | Query type: 'ppl' or 'dsl'. Default is 'dsl'. |
| `filter` | Array | Optional | Additional DSL query conditions as JSON strings for filtering (e.g., `["{\"term\": {\"status\": \"error\"}}", "{\"range\": {\"level\": {\"gte\": 3}}}"]`). |
| `dsl` | String | Optional | Complete raw DSL query as JSON string. Takes precedence over filter parameter when provided. |
| `ppl` | String | Optional | Complete PPL statement without time information. Used when queryType is 'ppl'. |