---
layout: default
title: Search Alerts tool
has_children: false
has_toc: false
nav_order: 67
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/search-alerts-tool/
---

<!-- vale off -->
# Search Alerts tool
**Introduced 2.12**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/1161).    
{: .warning}

The `SearchAlertsTool` retrieves information about generated alerts. For more information about alerts, see [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/).

## Step 1: Register a flow agent that will run the SearchAlertsTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Search_Alerts_Tool",
  "type": "flow",
  "description": "this is a test agent for the SearchAlertsTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
      {
      "type": "SearchAlertsTool",
      "name": "DemoSearchAlertsTool",
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
  "agent_id": "EuJYYo0B9RaBCvhuy1q8"
}
```

## Step 2: Run the agent

Run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/EuJYYo0B9RaBCvhuy1q8/_execute
{
  "parameters": {
    "question": "Do I have any alerts?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch responds with a list of generated alerts and the total number of alerts:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "Alerts=[Alert(id=rv9nYo0Bk4MTqirc_DkW, version=394, schemaVersion=5, monitorId=ZuJnYo0B9RaBCvhuEVux, workflowId=, workflowName=, monitorName=test-monitor-2, monitorVersion=1, monitorUser=User[name=admin, backend_roles=[admin], roles=[own_index, all_access], custom_attribute_names=[], user_requested_tenant=null], triggerId=ZeJnYo0B9RaBCvhuEVul, triggerName=t-1, findingIds=[], relatedDocIds=[], state=ACTIVE, startTime=2024-02-01T02:03:18.420Z, endTime=null, lastNotificationTime=2024-02-01T08:36:18.409Z, acknowledgedTime=null, errorMessage=null, errorHistory=[], severity=1, actionExecutionResults=[], aggregationResultBucket=null, executionId=ZuJnYo0B9RaBCvhuEVux_2024-02-01T02:03:18.404853331_51c18f2c-5923-47c3-b476-0f5a66c6319b, associatedAlertIds=[])]TotalAlerts=1"
        }
      ]
    }
  ]
}
```

If no alerts are found, OpenSearch responds with an empty array in the results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "Alerts=[]TotalAlerts=0"
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent. All parameters are optional.

Parameter	| Type | Description	
:--- | :--- | :---
`alertIds`	| Array	| The ID of the alert to search for.
`monitorId`	| String	| The name of the monitor by which to filter the alerts.
`workflowIds`	| Array | A list of workflow IDs by which to filter the alerts.
`alertState` |	String	| The alert state by which to filter the alerts. Valid values are `ALL`, `ACTIVE`, `ERROR`, `COMPLETED`, and `ACKNOWLEDGED`. Default is `ALL`.
`severityLevel` | String| The severity level by which to filter the alerts. Valid values are `ALL`, `1`, `2`, and `3`. Default is `ALL`.
`searchString` | String	| The search string to use for searching for a specific alert.
`sortOrder`| String | The sort order of the results. Valid values are `asc` (ascending) and `desc` (descending). Default is `asc`. 
`sortString`| String |	Specifies the monitor field by which to sort the results. Default is `monitor_name.keyword`.
`size`	| Integer |	The number of results to return. Default is `20`.
`startIndex`| Integer |	The paginated index of the alert to start from. Default is `0`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 
