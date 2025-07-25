---
layout: default
title: Delete index
parent: Index APIs
grand_parent: REST API reference
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/delete-index/
---

# Delete index
Introduced 1.0
{: .label .label-purple }

If you no longer need an index, you can use the delete index API operation to delete it.

## Example

```json
DELETE /sample-index
```

## Path and HTTP methods

```
DELETE /<index-name>
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indices. Default is true.
expand_wildcards | String | Expands wildcard expressions to different indices. Combine multiple values with commas. Available values are all (match all indices), open (match open indices), closed (match closed indices), hidden (match hidden indices), and none (do not accept wildcard expressions), which must be used with open, closed, or both. Default is open.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indices in the response.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for the response to return. Default is `30s`.


## Response
```json
{
  "acknowledged": true
}
```
