---
layout: default
title: Cluster state
nav_order: 55
parent: Cluster APIs
redirect_from:
  - /api-reference/cluster-state/
  - /opensearch/rest-api/cluster-state/
---

# Cluster state
**Introduced 1.0**
{: .label .label-purple }

The cluster state operation lets you dump the cluster state for review or monitoring purposes.

## Endpoints

```json
GET _cluster/state
```

## Path parameters

All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
| `allow_no_indices` | Boolean | When `false`, the Refresh Index API returns an error when a wildcard expression, index alias, or `_all` targets only closed or missing indexes, even when the request is made against open indexes. Default is `true`. |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error when it target gets an error returned. Default is `false`.
| `expand_wildcards` | String | Option to expand wildcard patterns |
| `flat_settings` | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of `"cluster": { "max_shards_per_node": 500 }` is `"cluster.max_shards_per_node": "500"`.
| `master_timeout` | Time unit | The amount of time to wait in total for the response.
| `cluster_manager_timeout` | Time unit | The amount of time to wait for a response from the cluster manager node. Default is `30 seconds`.

## Example requests

The following example requests show how to use the cluster state API.

### Check cluster status

The following will show the entire cluster state of all components:

```json
GET _cluster/state?flat_settings=true
```
{% include copy-curl.html %}

Using filter_path, you can only return specific components, for example `nodes`:

```json
GET _cluster/state?flat_settings=true&filter_path=nodes
```
{% include copy-curl.html %}
