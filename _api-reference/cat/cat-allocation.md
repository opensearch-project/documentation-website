---
layout: default
title: CAT allocation
parent: CAT APIs
redirect_from:
- /opensearch/rest-api/cat/cat-allocation/
nav_order: 5
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-allocation/
---

# CAT Allocation API
**Introduced 1.0**
{: .label .label-purple }

The CAT allocation operation lists the allocation of disk space for indexes and the number of shards on each node.



<!-- spec_insert_start
api: cat.allocation
component: endpoints
-->
## Endpoints
```json
GET /_cat/allocation
GET /_cat/allocation/{node_id}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.allocation
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, and `p`. | N/A |
| `cluster_manager_timeout` | String | A timeout for connection to the cluster manager node. | N/A |
| `format` | String | A short version of the HTTP `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from cluster-manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example requests

<!-- spec_insert_start
component: example_code
rest: GET /_cat/allocation?v
-->
{% capture step1_rest %}
GET /_cat/allocation?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.allocation(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To limit the information to a specific node, add the node name after your query:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/allocation/<node_name>
-->
{% capture step1_rest %}
GET /_cat/allocation/<node_name>
{% endcapture %}

{% capture step1_python %}


response = client.cat.allocation(
  node_id = "<node_name>"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If you want to get information for more than one node, separate the node names with commas:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/allocation/node_name_1,node_name_2,node_name_3
-->
{% capture step1_rest %}
GET /_cat/allocation/node_name_1,node_name_2,node_name_3
{% endcapture %}

{% capture step1_python %}


response = client.cat.allocation(
  node_id = "node_name_1,node_name_2,node_name_3"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following response shows that eight shards are allocated to each of the two nodes available:

```json
shards | disk.indices | disk.used | disk.avail | disk.total | disk.percent | host         | ip          | node
  8    |   989.4kb    |   25.9gb  |   32.4gb   |   58.4gb   |   44         | 172.18.0.4   | 172.18.0.4  | odfe-node1
  8    |   962.4kb    |   25.9gb  |   32.4gb   |   58.4gb   |   44         | 172.18.0.3   | 172.18.0.3  | odfe-node2
```
