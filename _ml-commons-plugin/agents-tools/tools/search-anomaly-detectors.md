---
layout: default
title: Search Anomaly Detectors tool
has_children: false
has_toc: false
nav_order: 70
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/search-anomaly-detectors/
---

<!-- vale off -->
# Search Anomaly Detectors tool
**Introduced 2.13**
{: .label .label-purple }
<!-- vale on -->

The `SearchAnomalyDetectorsTool` retrieves information about anomaly detectors set up on your cluster. For more information about anomaly detectors, see [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/).

## Step 1: Register a flow agent that will run the SearchAnomalyDetectorsTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following register agent request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_Search_Anomaly_Detectors_Tool",
  "type": "flow",
  "description": "this is a test agent for the SearchAnomalyDetectorsTool",
  "memory": {
    "type": "demo"
  },
  "tools": [
      {
      "type": "SearchAnomalyDetectorsTool",
      "name": "DemoSearchAnomalyDetectorsTool",
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
    "question": "Do I have any anomaly detectors?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch responds with a list of anomaly detectors set up on your cluster and the total number of anomaly detectors:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "AnomalyDetectors=[{id=y2M-Yo0B-yCFzT-N_XXU,name=sample-http-responses-detector,type=SINGLE_ENTITY,description=A sample detector to detect anomalies with HTTP response code logs.,index=[sample-http-responses],lastUpdateTime=1706750311891}]TotalAnomalyDetectors=1"
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
`detectorName`	| String	| The name of the detector to search for.
`detectorNamePattern`	| String | A wildcard query used to match the detector name to search for.
`indices` | String	| The index name or index pattern of the indexes that the returned detectors are using as data sources.
`highCardinality` | Boolean	| Whether to return information about high-cardinality detectors. Leave this parameter unset (or set it to `null`) to return information about both high-cardinality (multi-entity) and non-high-cardinality (single-entity) detectors. Set this parameter to `true` to only return information about high-cardinality detectors. Set this parameter to `false` to only return information about non-high-cardinality detectors.
`lastUpdateTime` | Long |	Specifies the earliest last updated time of the detectors to return, in epoch milliseconds. Default is `null`.
`sortOrder`	|String | The sort order for the results. Valid values are `asc` (ascending) and `desc` (descending). Default is `desc`. 
`sortString`| String |	Specifies the detector field by which to sort the results. Default is `name.keyword`.
`size`	| Integer |	The number of results to return. Default is `20`.
`startIndex`| Integer |	The paginated index of the detector to start from. Default is `0`.
`running`| Boolean | Whether to return information about detectors that are currently running. Leave this parameter unset (or set it to `null`) to return both running and non-running detector information. Set this parameter to `true` to only return information about running detectors. Set this parameter to `false` to return only information about detectors that are not currently running. Default is `null`.
`disabled` |	Boolean	| Whether to return information about detectors that are currently disabled. Leave this parameter unset (or set it to `null`) to return information about both enabled and disabled detectors. Set this parameter to `true` to return only information about disabled detectors. Set this parameter to `false` to return only information about enabled detectors. Default is `null`.
`failed` |	Boolean	| Whether to return information about detectors that are currently failing. Leave this parameter unset (or set it to `null`) to return information about both failed and non-failed detectors. Set this parameter to `true` to return only information about failed detectors. Set this parameter to `false` to return only information about non-failed detectors. Default is `null`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.