---
layout: default
title: Shrink index
parent: Index APIs
grand_parent: REST API reference
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/shrink-index/
---

# Shrink index

The shrink index API operation moves all of your data in an existing index into a new index with fewer primary shards.

## Example

```json
POST /my-old-index/_shrink/my-new-index
{
  "settings": {
    "index.number_of_replicas": 4,
    "index.number_of_shards": 3
  },
  "aliases":{
    "new-index-alias": {}
  }
}
```

## Path and HTTP methods

```
POST /<index-name>/_shrink/<target-index>
```

When creating new indices with this operation, remember that OpenSearch indices have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

The shrink index API operation requires you to specify both the source index and the target index. All other parameters are optional.

Parameter | Type | description
:--- | :--- | :---
&lt;index-name&gt; | String | The index to shrink.
&lt;target-index&gt; | String | The target index to shrink the source index into.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for the request to return a response. Default is `30s`.

## Request body

You can use the request body to configure some index settings for the target index. All fields are optional.

Field | Type | Description
alias | Object | Sets an alias for the target index. Can have the fields `filter`, `index_routing`, `is_hidden`, `is_write_index`, `routing`, and `search_routing`. See [index aliases]({{site.url}}{{site.baseurl}}/opensearch/rest-api/alias/#request-body).
settings | Object | Index settings you can apply to your target index. See [index settings]({{site.url}}{{site.baseurl}}/opensearch/rest-api/index-apis/create-index/#index-settings).
max_primary_shard_size | Bytes | Sets the maximum size of a primary shard in the target index. For example, if this field is set to 100 GB, and the source index's primary shards total to 300 GB, then the target index has 3 primary shards of 100 GB each.
