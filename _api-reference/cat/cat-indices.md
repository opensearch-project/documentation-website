---
layout: default
title: CAT indices
parent: CAT APIs
nav_order: 25
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-indices/
---

# CAT Indices API
**Introduced 1.0**
{: .label .label-purple }

The CAT indices operation lists information related to indexes, that is, how much disk space they are using, how many shards they have, their health status, and so on.


<!-- spec_insert_start
api: cat.indices
component: endpoints
-->
## Endpoints
```json
GET /_cat/indices
GET /_cat/indices/{index}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.indices
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, and `p`. | N/A |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `health` | String | Limits indexes based on their health status. Supported values are `green`, `yellow`, and `red`. <br> Valid values are: `green`, `GREEN`, `yellow`, `YELLOW`, `red`, and `RED`. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `include_unloaded_segments` | Boolean | Whether to include information from segments not loaded into memory. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `pri` | Boolean | When `true`, returns information only from the primary shards. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `time` | String | Specifies the time units. <br> Valid values are: `nanos`, `micros`, `ms`, `s`, `m`, `h`, and `d`. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

### System index filtering

**Introduced 3.9**
{: .label .label-purple }

The optional `system` Boolean query parameter filters indexes using OpenSearch Core's system index metadata:

- `system=true` returns only system indexes.
- `system=false` returns only non-system indexes.
- Omitting `system` returns both classifications, subject to the request's index selection and wildcard expansion.

When `system=true` and `expand_wildcards` is omitted, wildcard expansion includes hidden indexes by default. When `system=false` or `system` is omitted, hidden indexes are not included in wildcard expansion by default. An explicit `expand_wildcards` value overrides this behavior. For example, `system=true&expand_wildcards=open` excludes hidden indexes, while `system=true&expand_wildcards=all` includes open, closed, and hidden indexes.

System and hidden are separate index properties. The `system` filter does not identify every hidden index or every index protected by the Security plugin. It does not grant access to indexes; the caller's existing permissions still apply. For information about Security plugin protection, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).

The `system` parameter is supported only by the CAT Indices API. The paginated List Indices API (`/_list/indices`) rejects it.

### System index response columns

**Introduced 3.9**
{: .label .label-purple }

The following columns provide system index information:

| Column | Alias | Description |
| :--- | :--- | :--- |
| `system` | `sys` | Whether the index is marked as a system index in OpenSearch Core's metadata. |
| `system.description` | `sysdesc` | The description from the matching system index descriptor, when available. |

Both columns are included in the default response when `system` is specified, including `system=false`. When `system` is omitted, the default columns are unchanged. Use `h` to select the columns explicitly. Selecting either column with `h` does not change index selection or include hidden indexes in wildcard expansion.

The description is provided independently of the `system` flag. An index without a matching descriptor has no description. If the descriptor registry and index metadata temporarily disagree, an index with `system=false` can still have a description.

For example, to list system indexes and their descriptions, including hidden indexes by default, use the following request:

```json
GET /_cat/indices?system=true&h=index,system,system.description&format=json
```

An example response for a cluster containing a task result index is:

```json
[
  {
    "index": ".tasks",
    "system": "true",
    "system.description": "Task Result Index"
  }
]
```

To display both system and non-system indexes, including open, closed, and hidden indexes, use the following request:

```json
GET /_cat/indices?expand_wildcards=all&h=index,system,system.description&format=json
```

## Example requests

<!-- spec_insert_start
component: example_code
rest: GET /_cat/indices?v
-->
{% capture step1_rest %}
GET /_cat/indices?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.indices(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To limit the information to a specific index, add the index name after your query.

<!-- spec_insert_start
component: example_code
rest: GET /_cat/indices/<index>?v
-->
{% capture step1_rest %}
GET /_cat/indices/<index>?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.indices(
  index = "<index>",
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If you want to get information for more than one index, separate the indexes with commas:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/indices/index1,index2,index3
-->
{% capture step1_rest %}
GET /_cat/indices/index1,index2,index3
{% endcapture %}

{% capture step1_python %}


response = client.cat.indices(
  index = "index1,index2,index3"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response

```json
health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
green  | open | movies | UZbpfERBQ1-3GSH2bnM3sg | 1 | 1 | 1 | 0 | 7.7kb | 3.8kb
```

## Limiting the response size

To limit the number of indexes returned, configure the `cat.indices.response.limit.number_of_indices` setting. For more information, see [Cluster-level CAT response limit settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-cat-response-limit-settings).

When `system` is specified, the limit counts only indexes matching the requested system classification.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:monitor/stats` and `cluster:monitor/state`.
