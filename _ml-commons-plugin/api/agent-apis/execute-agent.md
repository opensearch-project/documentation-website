---
layout: default
title: Execute agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Execute an agent
**Introduced 2.13**
{: .label .label-purple }

When an agent is executed, it runs the tools with which it is configured.

### Endpoints

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
```

From 3.0, agents can also be executed asynchronously by passing query parameter `async=true` 

## Request Parameters
The following table lists the available request parameters.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`async` **Introduced 3.0**| Boolean | Optional | If set to `true`, executes agent asynchronously and returns a `task_id` to track execution. `false` by default,


## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`parameters`| Object | Required | The parameters required by the agent. 
`parameters.verbose`| Boolean | Optional | Provides verbose output. 

#### Example request

```json
POST /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %}

#### Example response

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