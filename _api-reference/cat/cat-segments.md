---
layout: default
title: CAT segments
parent: CAT APIs
nav_order: 55
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-segments/
---

# CAT Segments API
**Introduced 1.0**
{: .label .label-purple }

The cat segments operation lists Lucene segment-level information for each index.


<!-- spec_insert_start
api: cat.segments
component: endpoints
-->
## Endpoints
```json
GET /_cat/segments
GET /_cat/segments/{index}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.segments
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, and `p`. | N/A |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example requests

<!-- spec_insert_start
component: example_code
rest: GET /_cat/segments?v
-->
{% capture step1_rest %}
GET /_cat/segments?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.segments(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To see only the information about segments of a specific index, add the index name after your query.

<!-- spec_insert_start
component: example_code
rest: GET /_cat/segments/<index>?v
-->
{% capture step1_rest %}
GET /_cat/segments/<index>?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.segments(
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
rest: GET /_cat/segments/index1,index2,index3
-->
{% capture step1_rest %}
GET /_cat/segments/index1,index2,index3
{% endcapture %}

{% capture step1_python %}


response = client.cat.segments(
  index = "index1,index2,index3"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
index | shard | prirep | ip | segment | generation | docs.count | docs.deleted | size | size.memory | committed | searchable | version | compound
movies | 0 | p | 172.18.0.4 | _0 | 0 | 1 | 0 | 3.5kb | 1364 | true | true | 8.7.0 | true
movies | 0 | r | 172.18.0.3 | _0 | 0 | 1 | 0 | 3.5kb | 1364 | true | true | 8.7.0 | true
```

## Limiting the response size

To limit the number of indexes returned, configure the `cat.segments.response.limit.number_of_indices` setting. For more information, see [Cluster-level CAT response limit settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/#cluster-level-cat-response-limit-settings).