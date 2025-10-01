---
layout: default
title: Log Pattern Analysis tool
has_children: false
has_toc: false
nav_order: 38
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# Log Pattern Analysis tool
**Introduced 3.3.0**
{: .label .label-purple }
<!-- vale on -->

The `LogPatternAnalysisTool` performs an advanced log analysis by detecting anomalous log patterns and sequences through comparative analysis between baseline and selection time ranges. It supports the following analysis modes: 

- Log sequence analysis (with trace correlation)
- Log pattern difference analysis
- Log insights analysis for error detection

The tool uses machine learning clustering algorithms and statistical methods to identify anomalous patterns that appear significantly more frequently in the selection period compared to the baseline period, helping detect system issues and performance anomalies.

## Analysis modes

The tool automatically selects the appropriate analysis mode based on the provided parameters:

- **Log sequence analysis**: When both a trace field and a baseline time range are provided, the tool analyzes trace-correlated log sequences to identify anomalous execution paths.
- **Log pattern difference analysis**: When a baseline time range is provided without a trace field, the tool compares log patterns between baseline and selection periods to detect anomalous patterns.
- **Log insights analysis**: When only a selection time range is provided, the tool performs pattern analysis based on error keywords in order to identify critical issues.

## Step 1: Register a flow agent that will run the LogPatternAnalysisTool

A flow agent runs a sequence of tools in order, returning the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Log_Pattern_Analysis_Tool",
  "type": "flow",
  "description": "this is a test agent for the LogPatternAnalysisTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
    {
      "type": "LogPatternAnalysisTool",
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

Run the agent to perform various analysis types.

### Log sequence analysis 

To perform a trace-based sequence analysis, provide a `traceFieldName`, `baseTimeRangeStart`, and `baseTimeRangeEnd`:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "ss4o_logs-otel-2025.06.24",
    "timeField": "@timestamp",
    "logFieldName": "body",
    "traceFieldName": "traceId",
    "baseTimeRangeStart": "2025-06-24 07:33:05",
    "baseTimeRangeEnd": "2025-06-24 07:51:27",
    "selectionTimeRangeStart": "2025-06-24 07:50:26",
    "selectionTimeRangeEnd": "2025-06-24 07:55:56"
  }
}
```
{% include copy-curl.html %}

OpenSearch returns exceptional trace sequences that differ significantly from baseline patterns:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"EXCEPTIONAL\": {\"trace456\": \"User login -> Database timeout -> Error handling -> Retry -> Response sent\"}, \"BASE\": {\"trace123\": \"User login -> Database query -> Response sent\"}}"
        }
      ]
    }
  ]
}
```

### Log pattern difference analysis

To perform a pattern comparison analysis, provide a `baseTimeRangeStart` and `baseTimeRangeEnd`:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "opensearch_dashboards_sample_data_logs",
    "timeField": "@timestamp",
    "logFieldName": "message",
    "baseTimeRangeStart": "2018-07-22 00:00:00",
    "baseTimeRangeEnd": "2018-07-22 12:00:00",
    "selectionTimeRangeStart": "2018-07-22 12:00:00",
    "selectionTimeRangeEnd": "2018-07-22 23:59:59"
  }
}
```
{% include copy-curl.html %}

OpenSearch returns patterns with significant frequency changes between time periods:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"patternMapDifference\": [{\"pattern\": \"<*> ERROR <*> Connection timeout\", \"base\": 0.02, \"selection\": 0.15, \"lift\": 7.5}]}"
        }
      ]
    }
  ]
}
```

### Log insights analysis

To perform an error pattern detection, provide only a selection time range:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "application_logs",
    "timeField": "@timestamp",
    "logFieldName": "message",
    "selectionTimeRangeStart": "2025-01-15 10:00:00",
    "selectionTimeRangeEnd": "2025-01-15 11:00:00"
  }
}
```
{% include copy-curl.html %}

OpenSearch returns error patterns with sample logs:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"logInsights\": [{\"pattern\": \"<*> ERROR User <*> authentication failed\", \"count\": 23, \"sampleLogs\": [\"2025-01-15 10:30:15 ERROR User user123 authentication failed\", \"2025-01-15 10:32:08 ERROR User admin456 authentication failed\"]}]}"
        }
      ]
    }
  ]
}
```

## Execute parameters

The following table lists the available tool parameters for running the agent.

| Parameter | Type | Required/Optional | Description |
|:----------|:-----|:------------------|:------------|
| `index` | String | Required | The name of the OpenSearch index containing log data (for example, `ss4o_logs-otel-2025.06.24`). |
| `timeField` | String | Required | A date/time field in the index mapping used for time-based filtering. |
| `logFieldName` | String | Required | The field containing raw log messages to analyze (for example, `body`, `message`, or `log`). |
| `traceFieldName` | String | Optional | The field containing a trace ID or correlation ID to enable sequence analysis (for example, `traceId` or `correlationId`). Required for the log sequence analysis mode. |
| `baseTimeRangeStart` | String | Optional | The start time for the baseline comparison period, in UTC date string format (for example, `2025-06-24 07:33:05`). Required for the sequence and pattern difference analysis modes. |
| `baseTimeRangeEnd` | String | Optional | The end time for the baseline comparison period, in UTC date string format (for example, `2025-06-24 07:51:27`). Required for the sequence and pattern difference analysis modes. |
| `selectionTimeRangeStart` | String | Required | The start time for the analysis target period, in UTC date string format (for example, `2025-06-24 07:50:26`). |
| `selectionTimeRangeEnd` | String | Required | The end time for the analysis target period, in UTC date string format (for example, `2025-06-24 07:55:56`). |

## Limitations

The Log Pattern Analysis tool has the following limitations:

- **Log volume**: The tool processes logs through PPL queries with a maximum limit of 10,000 documents per query. For optimal performance, limit analysis to specific time ranges.
- **Result limits**:
  - Pattern difference analysis: Returns the top 10 significant patterns.
  - Log insights analysis: Returns the top 5 error patterns, with up to 2 sample logs each.