---
layout: default
title: CAT health
parent: CAT APIs
nav_order: 20
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-health/
---

# CAT Health API
**Introduced 1.0**
{: .label .label-purple }

The CAT health operation lists the status of the cluster, how long the cluster has been up, the number of nodes, and other useful information that helps you analyze the health of your cluster.


<!-- spec_insert_start
api: cat.health
component: endpoints
-->
## Endpoints
```json
GET /_cat/health
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.health
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | The unit used to display time values. <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, and `d`. | N/A |
| `ts` | Boolean | When `true`, returns `HH:MM:SS` and Unix epoch timestamps. | `true` |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example request

The following example request give cluster health information for the past 5 days: 

<!-- spec_insert_start
component: example_code
rest: GET /_cat/health?v&time=5d
-->
{% capture step1_rest %}
GET /_cat/health?v&time=5d
{% endcapture %}

{% capture step1_python %}


response = client.cat.health(
  params = { "v": "true", "time": "5d" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
GET _cat/health?v&time=5d

epoch | timestamp | cluster | status | node.total | node.data | shards | pri | relo | init | unassign | pending_tasks | max_task_wait_time | active_shards_percent
1624248112 | 04:01:52 | odfe-cluster | green | 2 | 2 | 16 | 8 | 0 | 0 | 0 | 0 | - | 100.0%
```
