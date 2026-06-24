---
layout: default
title: Search Monitors tool
has_children: false
has_toc: false
nav_order: 100
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/search-monitors-tool/
---

<!-- vale off -->
# Search Monitors tool
**Introduced 2.12**
{: .label .label-purple }
<!-- vale on -->

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/1161).    
{: .warning}

The `SearchMonitorsTool` retrieves information about alerting monitors set up on your cluster. For more information about alerting monitors, see [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/).

## Step 1: Register a flow agent that will run the SearchMonitorsTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Search_Monitors_Tool",
  "type": "flow",
  "description": "this is a test agent for the SearchMonitorsTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
    {
      "type": "SearchMonitorsTool",
      "name": "DemoSearchMonitorsTool",
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
    "question": "Do I have any alerting monitors?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch responds with a list of alerting monitors set up on your cluster and the total number of alerting monitors:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "Monitors=[{id=j_9mYo0Bk4MTqircEzk_,name=test-monitor,type=query_level_monitor,enabled=true,enabledTime=1706752873144,lastUpdateTime=1706752873145}{id=ZuJnYo0B9RaBCvhuEVux,name=test-monitor-2,type=query_level_monitor,enabled=true,enabledTime=1706752938405,lastUpdateTime=1706752938405}]TotalMonitors=2"
        }
      ]
    }
  ]
}
```

If no monitors are found, OpenSearch responds with an empty array in the results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "Monitors=[]TotalMonitors=0"
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
`monitorId`	| String	| The ID of the monitor to search for.
`monitorName`	| String	| The name of the monitor to search for.
`monitorNamePattern`	| String | A wildcard query used to match the monitor name to search for.
`enabled` |	Boolean	| Whether to return information about monitors that are currently enabled. Leave this parameter unset (or set it to `null`) to return information about both enabled and disabled monitors. Set this parameter to `true` to return only information about enabled monitors. Set this parameter to `false` to return only information about disabled monitors. Default is `null`.
`hasTriggers` |	Boolean	| Whether to return information about monitors that have triggers enabled. Leave this parameter unset (or set it to `null`) to return information about monitors that have triggers enabled and disabled. Set this parameter to `true` to return only information about monitors with triggers enabled. Set this parameter to `false` to return only information about monitors with triggers disabled. Default is `null`.
`indices` | String	| The index name or index pattern of the indexes tracked by the returned monitors.
`sortOrder`| String | The sort order of the results. Valid values are `asc` (ascending) and `desc` (descending). Default is `asc`. 
`sortString`| String |	Specifies the monitor field by which to sort the results. Default is `name.keyword`.
`size`	| Integer |	The number of results to return. Default is `20`.
`startIndex`| Integer |	The paginated index of the monitor to start from. Default is `0`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 
