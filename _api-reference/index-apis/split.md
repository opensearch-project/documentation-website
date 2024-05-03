---
layout: default
title: Split index
parent: Index APIs
nav_order: 70
redirect_from:
  - /opensearch/rest-api/index-apis/split/
---

# Split index
**Introduced 1.0**
{: .label .label-purple }

The split index API operation splits an existing read-only index into a new index, cutting each primary shard into some amount of primary shards in the new index.

## Example

```json
PUT /sample-index1/_split/split-index1
{
  "settings": {
    "index": {
      "number_of_shards": 4,
      "number_of_replicas": 2
    }
  },
  "aliases": {
    "sample-alias1": {}
  }
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST /<source-index>/_split/<target-index>
PUT /<source-index>/_split/<target-index>
```

## Index naming restrictions

OpenSearch indexes have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

Your request must include the source and target indexes. All split index parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;source-index&gt; | String | The source index to split.
&lt;target-index&gt; | String | The index to create.
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for the request to return. Default is `30s`.
wait_for_completion | Boolean | When set to `false`, the request returns immediately instead of after the operation is finished. To monitor the operation status, use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/) with the task ID returned by the request. Default is `true`.
task_execution_timeout | Time | The explicit task execution timeout. Only useful when wait_for_completion is set to `false`. Default is `1h`.

## Request body

The split index API operation creates a new target index, so you can specify any [index settings]({{site.url}}{{site.baseurl}}/im-plugin/index-settings/) and [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/) to apply to the target index.

## Response

```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "split-index1"
}
```

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#splits-and-shrinks).