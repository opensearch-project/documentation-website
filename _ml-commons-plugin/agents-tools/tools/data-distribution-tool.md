---
layout: default
title: Data Distribution tool
has_children: false
has_toc: false
nav_order: 25
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/data-distribution-tool/
---

<!-- vale off -->
# Data Distribution tool
**Introduced 3.3.0**
{: .label .label-purple }
<!-- vale on -->

The `DataDistributionTool` analyzes data distribution patterns within datasets and compares distributions between different time periods. It supports both single dataset analysis and comparative analysis to identify significant changes in field value distributions, helping detect anomalies, trends, and data quality issues.

The tool supports both [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/) and [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) queries for flexible data retrieval and filtering.

## Analysis modes

The tool automatically selects the appropriate analysis mode based on the provided parameters:

- **Comparative analysis**: When both baseline and selection time ranges are provided, the tool compares field distributions between the two periods to identify significant changes and divergences.
- **Single dataset analysis**: When only a selection time range is provided, the tool analyzes distribution patterns within the dataset to provide insights into field value frequencies and characteristics.

## Step 1: Register a flow agent that runs the DataDistributionTool

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

No parameters are required to register the tool. The tool uses dynamic parameter validation at execution time. 

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "OQutgJYBAc35E4_KvI1q"
}
```

## Step 2: Run the agent

Run the agent to perform either a comparative distribution analysis or a single dataset distribution analysis.

### Comparative analysis

To perform a comparative distribution analysis between two time periods, provide both the baseline and selection time ranges:

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

OpenSearch returns a field-by-field comparison showing distribution changes between time periods:

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

### Single dataset analysis

To perform a single dataset distribution analysis, provide only a selection time range:

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

OpenSearch returns distribution patterns for the analyzed dataset:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"singleAnalysis\": [{\"field\": \"status\", \"divergence\": 0.7, \"topChanges\": [{\"value\": \"error\", \"selectionPercentage\": 0.3}, {\"value\": \"success\", \"selectionPercentage\": 0.7}]}]}"
        }
      ]
    }
  ]
}
```

## Using a PPL query

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

## Using a custom DSL query

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

## Execute parameters

The following table lists the available tool parameters for running the agent.

| Parameter | Type | Required/Optional | Description |
|:----------|:-----|:------------------|:------------|
| `index` | String | Required | The name of the OpenSearch index containing the data to analyze. |
| `timeField` | String | Required | A date/time field for time-based filtering. |
| `selectionTimeRangeStart` | String | Required | The start time for the analysis period, in UTC date string format (for example, `2025-01-15 10:00:00`). |
| `selectionTimeRangeEnd` | String | Required | The end time for the analysis period, in UTC date string format (for example, `2025-01-15 11:00:00`). |
| `baselineTimeRangeStart` | String | Optional | The start time for the baseline comparison period, in UTC date string format (for example, `2025-01-15 10:00:00`). Required for the comparative analysis mode. |
| `baselineTimeRangeEnd` | String | Optional | The end time for the baseline comparison period, in UTC date string format (for example, `2025-01-15 11:00:00`). Required for the comparative analysis mode. |
| `size` | Integer | Optional | The maximum number of documents to analyze. Default is `1000`. Maximum is `10000`. |
| `queryType` | String | Optional | The query type. Valid values are `ppl` and `dsl`. Default is `dsl`. |
| `filter` | Array | Optional | Additional DSL query conditions for filtering, specified as JSON strings (for example, `["{\"term\": {\"status\": \"error\"}}", "{\"range\": {\"level\": {\"gte\": 3}}}"]`). |
| `dsl` | String | Optional | A complete raw DSL query as a JSON string. If provided, takes precedence over the `filter` parameter. |
| `ppl` | String | Optional | A complete PPL statement without time information. Used when `queryType` is `ppl`. |

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.

## Limitations

The Data Distribution tool has the following limitations:

- **Maximum document volume**: The tool has a default limit of 1,000 documents per execution, with a maximum configurable limit of 10,000 documents (`MAX_SIZE_LIMIT = 10000`).
- **Field cardinality limits**: High-cardinality fields are automatically filtered to ensure meaningful analysis results:
  - ID fields: Maximum of 30 unique values.
  - Data fields: Maximum of 10 unique values (or dataset size ÷ 2, whichever is larger).
- **Result limits**: 
  - Comparative analysis: Returns the top 10 field differences.
  - Single dataset analysis: Returns the top 30 field distributions.
  - Top changes per field: Limited to 10 items.