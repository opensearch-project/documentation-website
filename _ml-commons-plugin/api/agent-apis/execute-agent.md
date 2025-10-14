---
layout: default
title: Execute agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/agent-apis/execute-agent/
---

# Execute Agent API
**Introduced 2.13**
{: .label .label-purple }

When an agent is executed, it runs the tools with which it is configured. Starting with OpenSearch version 3.0, you can execute an agent asynchronously by setting the `async` query parameter to `true`.

### Endpoints

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
```

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Required/Optional | Description
:---  | :--- | :--- 
`async` | Boolean | Optional | If `true`, executes the agent asynchronously and returns a `task_id` to track execution. To check the status of the task, use the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Default is `false`.

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`parameters`| Object | Required | The parameters required by the agent. 
`parameters.verbose`| Boolean | Optional | Provides verbose output. 

## Example request

```json
POST /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": """ Based on the given context, the key information is:

The metro area population of Seattle in 2021 was 3,461,000.
The metro area population of Seattle in 2023 is 3,519,000.

To calculate the population increase from 2021 to 2023:

Population in 2023 (3,519,000) - Population in 2021 (3,461,000) = 58,000

Therefore, the population increase of Seattle from 2021 to 2023 is 58,000."""
        }
      ]
    }
  ]
}
```