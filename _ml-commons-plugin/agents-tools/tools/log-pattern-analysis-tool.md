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

The `LogPatternAnalysisTool` performs advanced log analysis by detecting exceptional log patterns and sequences through comparative analysis between baseline and selection time ranges. It supports three analysis modes: log sequence analysis (with trace correlation), log pattern difference analysis, and log insights analysis for error detection.
The tool uses machine learning clustering algorithms and statistical methods to identify anomalous patterns that appear significantly more frequently in the selection period compared to the baseline period, helping detect system issues and performance anomalies.

## Analysis Modes

The tool automatically selects the appropriate analysis mode based on the provided parameters:

- **Log Sequence Analysis**: When both `traceFieldName` and baseline time range are provided, analyzes trace-correlated log sequences to identify exceptional execution paths.
- **Log Pattern Difference Analysis**: When baseline time range is provided without trace field, compares log patterns between baseline and selection periods to detect anomalous patterns.
- **Log Insights Analysis**: When only selection time range is provided, performs error keyword-based pattern analysis to identify critical issues.

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

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "OQutgJYBAc35E4_KvI1q"
}
```

## Step 2: Run the agent

### Log Sequence Analysis Example

Run the agent for trace-based sequence analysis by sending the following request:

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

### Log Pattern Difference Analysis Example

Run the agent for pattern comparison analysis:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "opensearch_dashboards_sample_data_logs",
    "timeField": "@timestamp",
    "logFieldName": "message",
    "baseTimeRangeStart": "2018-07-22T00:00:00",
    "baseTimeRangeEnd": "2018-07-22T12:00:00",
    "selectionTimeRangeStart": "2018-07-22T12:00:00",
    "selectionTimeRangeEnd": "2018-07-22T23:59:59"
  }
}
```
{% include copy-curl.html %}

### Log Insights Analysis Example

Run the agent for error pattern detection:

```json
POST /_plugins/_ml/agents/OQutgJYBAc35E4_KvI1q/_execute
{
  "parameters": {
    "index": "application_logs",
    "timeField": "@timestamp",
    "logFieldName": "message",
    "selectionTimeRangeStart": "2025-01-15T10:00:00",
    "selectionTimeRangeEnd": "2025-01-15T11:00:00"
  }
}
```
{% include copy-curl.html %}

## Response Examples

### Log Sequence Analysis Response

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

### Log Pattern Difference Analysis Response

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

### Log Insights Analysis Response

OpenSearch returns error patterns with sample logs:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"logInsights\": [{\"pattern\": \"<*> FATAL <*> OutOfMemoryError\", \"count\": 45, \"sampleLogs\": [\"2025-01-15 10:30:15 FATAL JVM OutOfMemoryError: Java heap space\"]}]}"
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
| `index` | String | Required | Target OpenSearch index name containing log data (e.g., 'ss4o_logs-otel-2025.06.24'). |
| `timeField` | String | Optional | Date/time field in the index mapping used for time-based filtering. Default is `@timestamp`. |
| `logFieldName` | String | Required | Field containing raw log messages to analyze (e.g., 'body', 'message', 'log'). |
| `traceFieldName` | String | Optional | Field for trace/correlation ID to enable sequence analysis (e.g., 'traceId', 'correlationId'). Required for log sequence analysis mode. |
| `baseTimeRangeStart` | String | Optional | Start time for baseline comparison period (UTC date string, e.g., '2025-06-24 07:33:05'). Required for sequence and pattern difference analysis modes. |
| `baseTimeRangeEnd` | String | Optional | End time for baseline comparison period (UTC date string, e.g., '2025-06-24 07:51:27'). Required for sequence and pattern difference analysis modes. |
| `selectionTimeRangeStart` | String | Required | Start time for analysis target period (UTC date string, e.g., '2025-06-24 07:50:26'). |
| `selectionTimeRangeEnd` | String | Required | End time for analysis target period (UTC date string, e.g., '2025-06-24 07:55:56'). |