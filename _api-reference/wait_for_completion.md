---
layout: default
title: Wait for completion
nav_order: 200
---

# Wait for Completion
Introduced 2.7
{: .label .label-purple }

 We are enhancing index operations including `split`, `shrink`, `force` `merge`, and `open`, with the `wait_for_completion` parameter. This will transform the operation into a task if set to `false`, the same as a `reindex`, which can help to better trace the status of a long running operation.

## Path and HTTP methods

 ```bash
POST /_tasks
```

## Request body parameter

Parameter | Type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Transforms an operation into a task if set to `false`. Same as a `reindex`, which helps to better trace the status of a long running operation. |
| `task_execution_timeout` | Boolean | Placeholder text |

#### Example

```json

```

#### Response

```json

```

https://opensearch.org/docs/2.6/api-reference/index-apis/open-index/ 