---
layout: default
title: Wait for completion
nav_order: 200
---

# Wait for Completion
Introduced 2.7
{: .label .label-purple }

 We are enhancing index operations including [split]({{site.url}}{{site.baseurl}}/api-reference/index-apis/split), [shrink]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index), [force merge]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/index#force_merge), and [open]({{site.url}}{{site.baseurl}}/api-reference/index-apis/open-index) with the `wait_for_completion` parameter. This parameter will transform the operation into a task when set to `false`, similar to a `reindex`. This can help to better trace the status of a long running operation.

## Path and HTTP methods

 ```bash
POST /_tasks
```

## Request body parameter

Parameter | Type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Transforms an operation into a task if set to `false`. Same as a `reindex`, which helps to better trace the status of a long running operation. Default is `true`. |
| `task_execution_timeout` | Time unit | How long to wait for the response to return. Default is `30s`. |

#### Example

```json

```
{% include copy-curl.html %}

#### Response

```json

```
