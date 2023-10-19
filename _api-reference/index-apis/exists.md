---
layout: default
title: Index exists
parent: Index APIs
nav_order: 50
redirect_from:
  - /opensearch/rest-api/index-apis/exists/
---

# Index exists
**Introduced 1.0**
{: .label .label-purple }

The index exists API operation returns whether or not an index already exists.

## Example

```json
HEAD /sample-index
```
{% include copy-curl.html %}

## Path and HTTP methods

```
HEAD /<index-name>
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indexes. Default is true.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are all (match all indexes), open (match open indexes), closed (match closed indexes), hidden (match hidden indexes), and none (do not accept wildcard expressions). Default is open.
flat_settings | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of "index": { "creation_date": "123456789" } is "index.creation_date": "123456789".
include_defaults | Boolean | Whether to include default settings as part of the response. This parameter is useful for identifying the names and current values of settings you want to update.
ignore_unavailable | Boolean | If true, OpenSearch does not search for missing or closed indexes. Default is false.
local | Boolean | Whether to return information from only the local node instead of from the cluster manager node. Default is false.


## Response

The index exists API operation returns only one of two possible response codes: `200` -- the index exists, and `404` -- the index does not exist.
