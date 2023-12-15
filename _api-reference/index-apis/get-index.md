---
layout: default
title: Get index
parent: Index APIs
nav_order: 40
redirect_from:
  - /opensearch/rest-api/index-apis/get-index/
---

# Get index
**Introduced 1.0**
{: .label .label-purple }

You can use the get index API operation to return information about an index.

## Example

```json
GET /sample-index
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET /<index-name>
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indexes. Default is true.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are all (match all indexes), open (match open indexes), closed (match closed indexes), hidden (match hidden indexes), and none (do not accept wildcard expressions), which must be used with open, closed, or both. Default is open.
flat_settings | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of "index": { "creation_date": "123456789" } is "index.creation_date": "123456789".
include_defaults | Boolean | Whether to include default settings as part of the response. This parameter is useful for identifying the names and current values of settings you want to update.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
local | Boolean | Whether to return information from only the local node instead of from the cluster manager node. Default is false.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.


## Response
```json
{
  "sample-index1": {
    "aliases": {},
    "mappings": {},
    "settings": {
      "index": {
        "creation_date": "1633044652108",
        "number_of_shards": "2",
        "number_of_replicas": "1",
        "uuid": "XcXA0aZ5S0aiqx3i1Ce95w",
        "version": {
          "created": "135217827"
        },
        "provided_name": "sample-index1"
      }
    }
  }
}
```

## Response body fields

Field | Description
:--- | :---
aliases | Any aliases associated with the index.
mappings | Any mappings in the index.
settings | The index's settings
creation_date | The Unix epoch time of when the index was created.
number_of_shards | How many shards the index has.
number_of_replicas | How many replicas the index has.
uuid | The index's uuid.
created | The version of OpenSearch when the index was created.
provided_name | Name of the index.
