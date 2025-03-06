---
layout: default
title: CAT snapshots
parent: CAT API
nav_order: 65
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-snapshots/
---

# CAT snapshots
**Introduced 1.0**
{: .label .label-purple }

The CAT snapshots operation lists all snapshots for a repository.


<!-- spec_insert_start
api: cat.snapshots
component: endpoints
-->
## Endpoints
```json
GET /_cat/snapshots/{repository}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.snapshots
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
| `ignore_unavailable` | Boolean | When `true`, the response does not include information from unavailable snapshots. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | Specifies the time units, for example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/). <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, `d` | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example request

The following example request lists all snapshots for the repository:

```
GET _cat/snapshots/{repository}
```
{% include copy-curl.html %}


## Example response

```json
id                 | status  | start_epoch | start_time | end_epoch  | end_time | duration | indices | successful_shards | failed_shards | total_shards
nightly-1732912545 | SUCCESS | 1732912585  | 20:36:25   | 1732912585 | 20:36:25 | 0s       | 1       | 1                 | 0             | 1
nightly-1732826145 | SUCCESS | 1732912631  | 20:37:11   | 1732912631 | 20:37:11 | 0s       | 1       | 1                 | 0             | 1
nightly-1732998945 | SUCCESS | 1732912647  | 20:37:27   | 1732912647 | 20:37:27 | 202ms    | 1       | 1                 | 0             | 1
```