---
layout: default
title: CAT pending tasks
parent: CAT API
nav_order: 45
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-pending-tasks/
---

# CAT pending tasks
**Introduced 1.0**
{: .label .label-purple }

The CAT pending tasks operation lists the progress of all pending tasks, including task priority and time in queue.


<!-- spec_insert_start
api: cat.pending_tasks
component: endpoints
-->
## Endpoints
```json
GET /_cat/pending_tasks
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.pending_tasks
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/). <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, `d` | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example request

The following example request lists the progress of all pending node tasks:

```json
GET _cat/pending_tasks?v
```
{% include copy-curl.html %}

## Example response

```json
insertOrder | timeInQueue | priority | source
  1786      |    1.8s     |  URGENT  | shard-started
```
