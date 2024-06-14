---
layout: default
title: Validate query
nav_order: 87
---

# Validate Query

The Validate Query API checks if a large query will run without running the query. The query can be sent either as a path parameter or in the request body.

## Paths and HTTP Methods

The Validate Query API contains the following paths:

```
GET <index>/_validate/query
```

## Path parameters

All path parameters are optional.

Option | Type | Description
:--- | :--- | :---
`index` | String | The index to validate the query against. If you don't specify an index or multiple indexes as part of the URL (or want to override the URL value for an individual search), you can include it here. Examples include `"logs-*"` and `["my-store", "sample_data_ecommerce"]`.
`query` | Query object | The query using [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

## Request options

Use the following options in the request body. All request options are optional.

Parameter | Type | Description
:--- | :--- | :---
`all_shards` | Boolean | When `true`, validation is run against all shards instead of one shard per index. Default is `false`.
`allow_no_indices` | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
allow_partial_search_results | Boolean | Whether to return partial results if the request runs into an error or times out. Default is `true`.



