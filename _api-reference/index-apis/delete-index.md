---
layout: default
title: Delete index
parent: Index APIs
nav_order: 35
redirect_from:
  - /opensearch/rest-api/index-apis/delete-index/
---

# Delete index
**Introduced 1.0**
{: .label .label-purple }

If you no longer need an index, you can use the delete index API operation to delete it.

## Example

```json
DELETE /sample-index
```
{% include copy-curl.html %}

## Path and HTTP methods

```
DELETE /<index-name>
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indexes. Default is true.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are all (match all indexes), open (match open indexes), closed (match closed indexes), hidden (match hidden indexes), and none (do not accept wildcard expressions), which must be used with open, closed, or both. Default is open.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for the response to return. Default is `30s`.


## Response
```json
{
  "acknowledged": true
}
```
