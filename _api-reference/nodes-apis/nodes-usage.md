---
layout: default
title: Nodes usage
parent: Nodes APIs
nav_order: 40
---

# Nodes usage
**Introduced 1.0**
{: .label .label-purple }

The nodes usage endpoint returns low-level information about REST action usage on nodes.

## Path and HTTP methods

```
GET _nodes/usage
GET _nodes/<nodeId>/usage
GET _nodes/usage/<metric>
GET _nodes/<nodeId>/usage/<metric>
```

## Path parameters

You can include the following optional path parameters in your request.

Parameter | Type | Description
:--- | :--- | :---
nodeId | String | A comma-separated list of nodeIds used to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters). Defaults to `_all`.
metric | String | The metrics that will be included in the response. You can set the string to either `_all` or `rest_actions`. `rest_actions` returns the total number of times an action has been called on the node. `_all` returns all stats from the node. Defaults to `_all`.

## Query parameters

You can include the following optional query parameters in your request.

Parameter | Type | Description
:--- | :---| :---
timeout | Time | Sets the time limit for a response from the node. Default is `30s`.
cluster_manager_timeout | Time | Sets the time limit for a response from the cluster manager. Default is `30s`.

#### Example request

The following request returns usage details for all nodes:

```
GET _nodes/usage
```
{% include copy-curl.html %}

#### Example response

The following is an example response:

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "opensearch-cluster",
  "nodes" : {
    "t7uqHu4SSuWObK3ElkCRfw" : {
      "timestamp" : 1665695174312,
      "since" : 1663994849643,
      "rest_actions" : {
        "opendistro_get_rollup_action" : 3,
        "nodes_usage_action" : 1,
        "list_dangling_indices" : 1,
        "get_index_template_action" : 258,
        "nodes_info_action" : 152665,
        "get_mapping_action" : 259,
        "get_data_streams_action" : 12,
        "cat_indices_action" : 6,
        "get_indices_action" : 3,
        "ism_explain_action" : 7,
        "nodes_reload_action" : 1,
        "get_policy_action" : 3,
        "PerformanceAnalyzerClusterConfigAction" : 2,
        "index_policy_action" : 1,
        "rank_eval_action" : 3,
        "search_action" : 592,
        "get_aliases_action" : 258,
        "document_mget_action" : 2,
        "document_get_action" : 30,
        "count_action" : 1,
        "main_action" : 1
      },
      "aggregations" : { }
    }
  }
}
```

## Required permissions

If you use the Security plugin, make sure you set the following permissions: `cluster:manage/nodes` or `cluster:monitor/nodes`.