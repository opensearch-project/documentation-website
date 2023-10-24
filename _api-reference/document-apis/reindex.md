---
layout: default
title: Reindex document
parent: Document APIs
nav_order: 60
redirect_from: 
  - /opensearch/reindex-data/
  - /opensearch/rest-api/document-apis/reindex/
---

# Reindex document
**Introduced 1.0**
{: .label .label-purple}

The reindex document API operation lets you copy all or a subset of your data from a source index into a destination index.

## Example

```json
POST /_reindex
{
   "source":{
      "index":"my-source-index"
   },
   "dest":{
      "index":"my-destination-index"
   }
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST /_reindex
```

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
refresh | Boolean | If true, OpenSearch refreshes shards to make the reindex operation available to search results. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`.
timeout | Time | How long to wait for a response from the cluster. Default is `30s`.
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the reindex request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed.
wait_for_completion | Boolean | Waits for the matching tasks to complete. Default is `false`.
requests_per_second | Integer | Specifies the request’s throttling in sub-requests per second. Default is -1, which means no throttling.
require_alias | Boolean | Whether the destination index must be an index alias. Default is false.
scroll | Time | How long to keep the search context open. Default is `5m`.
slices | Integer | Number of sub-tasks OpenSearch should divide this task into. Default is 1, which means OpenSearch should not divide this task. Setting this parameter to `auto` indicates to OpenSearch that it should automatically decide how many slices to split the task into.
max_docs | Integer | How many documents the update by query operation should process at most. Default is all documents.

## Request body

Your request body must contain the names of the source index and destination index. All other fields are optional.

Field | Description
:--- | :---
conflicts | Indicates to OpenSearch what should happen if the delete by query operation runs into a version conflict. Valid options are `abort` and `proceed`. Default is abort.
source | Information about the source index to include. Valid fields are `index`, `max_docs`, `query`, `remote`, `size`, `slice`, and `_source`.
index | The name of the source index to copy data from.
max_docs | The maximum number of documents to reindex.
query | The search query to use for the reindex operation.
remote | Information about a remote OpenSearch cluster to copy data from. Valid fields are `host`, `username`, `password`, `socket_timeout`, and `connect_timeout`.
host | Host URL of the OpenSearch cluster to copy data from.
username | Username to authenticate with the remote cluster.
password | Password to authenticate with the remote cluster.
socket_timeout | The wait time for socket reads. Default is 30s.
connect_timeout | The wait time for remote connection timeouts. Default is 30s.
size | The number of documents to reindex.
slice | Whether to manually or automatically slice the reindex operation so it executes in parallel. Setting this field to `auto` allows OpenSearch to control the number of slices to use, which is one slice per shard, up to a maximum of 20. If there are multiple sources, the number of slices used are based on the index or backing index with the smallest number of shards.
_source | Whether to reindex source fields. Specify a list of fields to reindex or true to reindex all fields. Default is true.
id | The ID to associate with manual slicing.
max | Maximum number of slices.
dest | Information about the destination index. Valid values are `index`, `version_type`, and `op_type`.
index | Name of the destination index.
version_type | The indexing operation's version type. Valid values are `internal`, `external`, `external_gt` (retrieve the document if the specified version number is greater than the document’s current version), and `external_gte` (retrieve the document if the specified version number is greater or equal to than the document’s current version).
op_type | Whether to copy over documents that are missing in the destination index. Valid values are `create` (ignore documents with the same ID from the source index) and `index` (copy everything from the source index).
script | A script that OpenSearch uses to apply transformations to the data during the reindex operation.
source | The actual script that OpenSearch runs.
lang | The scripting language. Valid options are `painless`, `expression`, `mustache`, and `java`.

## Response
```json
{
    "took": 28829,
    "timed_out": false,
    "total": 111396,
    "updated": 0,
    "created": 111396,
    "deleted": 0,
    "batches": 112,
    "version_conflicts": 0,
    "noops": 0,
    "retries": {
        "bulk": 0,
        "search": 0
    },
    "throttled_millis": 0,
    "requests_per_second": -1.0,
    "throttled_until_millis": 0,
    "failures": []
}
```

## Response body fields

Field | Description
:--- | :---
took | How long the operation took in milliseconds.
timed_out | Whether the operation timed out.
total | The total number of documents processed.
updated | The number of documents updated in the destination index.
created | The number of documents created in the destination index.
deleted | The number of documents deleted.
batches | Number of scroll responses.
version_conflicts | Number of version conflicts.
noops | How many documents OpenSearch ignored during the operation.
retries | Number of bulk and search retry requests.
throttled_millis | Number of throttled milliseconds during the request.
requests_per_second | Number of requests executed per second during the operation.
throttled_until_millis | The amount of time until OpenSearch executes the next throttled request.
failures | Any failures that occurred during the operation.
