---
layout: default
title: Explain Policy API
parent: Snapshot Management APIs
nav_order: 60
---

# Explain Policy API

**Introduced 2.4**
{: .label .label-purple }

The Explain Policy API provides insight into the current state of a snapshot management policy. This API is useful for debugging or monitoring snapshot policy activity, such as understanding when the policy last executed, what triggered the execution, or whether any retries occurred.

<!-- spec_insert_start
api: sm.explain_policy
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_sm/policies/{policy_name}/_explain
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.explain_policy
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `policy_name` | **Required** | String | The name of the snapshot management policy to explain. |

<!-- spec_insert_end -->

## Example request

```json
GET /_plugins/_sm/policies/daily-snapshots/_explain
```
{% include copy-curl.html %}

## Example response

```json
{
  "policies": [
    {
      "name": "daily-snapshots",
      "enabled": true,
      "policy_seq_no": 10,
      "policy_primary_term": 1,
      "creation": {
        "current_state": "SUCCESS",
        "latest_execution": {
          "info": {
            "cause": "",
            "message": "Snapshot created successfully"
          }
        },
        "retry": {
          "count": 0
        },
        "trigger": {
          "time": 1686151296000
        }
      },
      "deletion": {
        "current_state": "NOT_EXECUTED",
        "latest_execution": {},
        "retry": {
          "count": 0
        },
        "trigger": {
          "time": 0
        }
      }
    }
  ]
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property   | Data type        | Description   |
| :---- | :---- | :---- |
| `policies` | Array of objects | A list of snapshot management policies with their current execution state and metadata. |

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code>
  </summary>
  {: .text-delta}

Each element in the `policies` array is a JSON object with the following fields:

| Property   | Data type | Description     |
| :---- | :--- | :---- |
| `name`    | String    | The name of the policy.     |
| `enabled`  | Boolean   | Whether the policy is currently enabled. |
| `policy_seq_no`   | Integer   | The sequence number of the policy.       |
| `policy_primary_term` | Integer   | The primary term of the policy.     |
| `creation`  | Object    | The snapshot creation execution state.   |
| `deletion`   | Object    | The snapshot deletion execution state.   |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code> > <code>creation</code>
  </summary>
  {: .text-delta}

The `creation` object provides information about snapshot creation policy execution.

| Property   | Data type | Description     |
| :--- | :--- | :--- |
| `current_state`    | String    | The current state of the policy execution.             |
| `latest_execution` | Object    | Details about the most recent policy execution.        |
| `retry`            | Object    | Information about any retry attempts that occurred.    |
| `trigger`          | Object    | Information about what triggered the policy execution. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code> > <code>creation</code> > <code>latest_execution</code>
  </summary>
  {: .text-delta}

The `latest_execution` object contains information about the most recent policy execution.

| Property | Data type | Description   |
| :--- | :--- | :---- |
| `info`   | Object    | Metadata about the execution result. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code> > <code>creation</code> > <code>latest_execution</code> > <code>info</code>
  </summary>
  {: .text-delta}

The `info` object provides messages related to the most recent execution result.

| Property  | Data type | Description    |
| :--- | :---- | :--- |
| `cause`   | String    | The reason policy execution failed, if applicable.    |
| `message` | String    | A detailed message about the policy execution result. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code> > <code>creation</code> > <code>retry</code>
  </summary>
  {: .text-delta}

The `retry` object provides metadata about retry attempts.

| Property | Data type | Description  |
| :--- | :---- | :---- |
| `count`  | Integer   | The number of retry attempts made. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code> > <code>creation</code> > <code>trigger</code>
  </summary>
  {: .text-delta}

The `trigger` object describes the trigger that initiated the policy execution.

| Property | Data type | Description |
| :--- | :---- | :--- |
| `time`   | Integer   | The time when the policy was triggered, in epoch milliseconds. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>policies</code> > <code>deletion</code>
  </summary>
  {: .text-delta}

The `deletion` object provides information about snapshot deletion policy execution.

| Property   | Data type | Description     |
| :---- | :---- | :----- |
| `current_state`    | String    | The current state of the policy execution.             |
| `latest_execution` | Object    | Details about the most recent policy execution.        |
| `retry`            | Object    | Information about any retry attempts that occurred.    |
| `trigger`          | Object    | Information about what triggered the policy execution. |

</details>


