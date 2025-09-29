---
layout: default
title: Nodes APIs
has_children: true
has_toc: false
nav_order: 50
redirect_from:
  - /api-reference/nodes-apis/
---

# Nodes APIs
**Introduced 1.0**
{: .label .label-purple }

The Nodes API makes it possible to retrieve information about individual nodes in your cluster. 

## Node filters

Use the `<node-filters>` parameter to filter the target set of nodes in the API response.

<style>
table th:first-of-type {
    width: 25%;
}
table th:nth-of-type(2) {
    width: 10%;
}
table th:nth-of-type(3) {
    width: 65%;
}
</style>

Parameter | Type   | Description
:--- |:-------| :---
`<node-filters>` | String | A comma-separated list of resolution mechanisms that OpenSearch uses to identify cluster nodes.

Node filters support several node resolution mechanisms:

- Predefined constants: `_local`, `_cluster_manager`, or `_all`.
- An exact match for `nodeID`
- A simple case-sensitive wildcard pattern matching for `node-name`, `host-name`, or `host-IP-address`.
- Node roles where the `<bool>` value is set either to `true` or `false`:
  - `cluster_manager:<bool>` refers to all cluster manager-eligible nodes.
  - `data:<bool>` refers to all data nodes.
  - `ingest:<bool>` refers to all ingest nodes.
  - `voting_only:<bool>` refers to all voting-only nodes.
  - `ml:<bool>` refers to all machine learning (ML) nodes.
  - `coordinating_only:<bool>` refers to all coordinating-only nodes.
- A simple case-sensitive wildcard pattern matching for node attributes: `<node attribute*>:<attribute value*>`. The wildcard matching pattern can be used in both the key and value at the same time.

Resolution mechanisms are applied sequentially in the order specified by the client. Each mechanism specification can either add or remove nodes.

To get statistics from the elected cluster manager node only, use the following query :

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/_cluster_manager/stats
-->
{% capture step1_rest %}
GET /_nodes/_cluster_manager/stats
{% endcapture %}

{% capture step1_python %}


response = client.nodes.info(
  metric = "stats",
  node_id = "_cluster_manager"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To get statistics from nodes that are data-only nodes, use the following query:

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/data:true/stats
-->
{% capture step1_rest %}
GET /_nodes/data:true/stats
{% endcapture %}

{% capture step1_python %}


response = client.nodes.info(
  metric = "stats",
  node_id = "data:true"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Order of resolution mechanisms

The order of resolution mechanisms is applied sequentially, and each can add or remove nodes. The following examples yield different results.

To get statistics from all the nodes except the cluster manager node, use the following query:

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/_all,cluster_manager:false/stats
-->
{% capture step1_rest %}
GET /_nodes/_all,cluster_manager:false/stats
{% endcapture %}

{% capture step1_python %}


response = client.nodes.info(
  metric = "stats",
  node_id = "_all,cluster_manager:false"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

However, if you switch the resolution mechanisms, the result will include all the cluster nodes, including the cluster manager node:

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/cluster_manager:false,_all/stats
-->
{% capture step1_rest %}
GET /_nodes/cluster_manager:false,_all/stats
{% endcapture %}

{% capture step1_python %}


response = client.nodes.info(
  metric = "stats",
  node_id = "cluster_manager:false,_all"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Nodes API operations

The following nodes API operations are available:

- [Nodes hot threads]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-hot-threads/)
- [Nodes info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/)
- [Nodes reload secure settings]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-reload-secure/)
- [Nodes stats]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/)
- [Nodes usage]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-usage/)
