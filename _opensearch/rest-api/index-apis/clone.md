---
layout: default
title: Clone index
parent: Index APIs
grand_parent: REST API reference
nav_order: 70
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/clone/
---

# Clone index

The clone index API operation clones all data in an existing read-only index into a new index. The new index cannot already exist.

## Example

```json
PUT /sample-index1/_clone/cloned-index1
{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "aliases": {
    "sample-alias1": {}
  }
}
```

## Path and HTTP methods

```
POST /<source-index>/_clone/<target-index>
PUT /<source-index>/_clone/<target-index>
```

## Index naming restrictions

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

Your request must include the source and target indexes. All other clone index parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;source-index&gt; | String | The source index to clone.
&lt;target-index&gt; | String | The index to create and add cloned data to.
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for the request to return. Default is `30s`.

## Request body

The clone index API operation creates a new target index, so you can specify any [index settings]({{site.url}}{{site.baseurl}}/opensearch/rest-api/index-apis/create-index/#index-settings) and [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias) to apply to the target index.

## Response

```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "cloned-index1"
}
```
