---
layout: default
title: Index document
parent: Document APIs
nav_order: 1
redirect_from: 
 - /opensearch/rest-api/document-apis/index-document/
---

# Index Document API
**Introduced 1.0**
{: .label .label-purple}

The Index Document API adds a JSON document to a specified index and makes it searchable. If a document with the same ID already exists, the API updates the document and increments its version number.


## Endpoints

```json
PUT {index}/_doc/{id}
POST {index}/_doc

PUT {index}/_create/{id}
POST {index}/_create/{id}
```

Use the following endpoint combinations to control how documents are indexed:

- `PUT {index}/_doc/{id}`: Adds a new document with a specified ID or updates an existing document with the same ID.
- `POST {index}/_doc`: Adds a new document and automatically generates a unique ID.
- `PUT {index}/_create/{id}` or `POST {index}/_create/{id}`: Adds a new document with a specified ID only if a document with that ID does not already exist. If the document exists, the operation fails.


## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the index. If the index does not exist, OpenSearch creates it automatically unless automatic index creation is disabled. Required. |
| `id` | String | The unique document ID. Required when using PUT. Omit this parameter when using POST to let OpenSearch automatically generate a unique ID. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `if_seq_no` | Integer | Only performs the operation if the document's current sequence number matches the specified value. Used for optimistic concurrency control. See [Optimistic concurrency control](#optimistic-concurrency-control). |
| `if_primary_term` | Integer | Only performs the operation if the document's current primary term matches the specified value. Used for optimistic concurrency control. See [Optimistic concurrency control](#optimistic-concurrency-control). |
| `op_type` | Enum | The operation type. Valid values are `create` (indexes a document only if it does not already exist) and `index` (creates a new document or updates an existing document). If a document ID is specified, the default is `index`. Otherwise, the default is `create`. |
| `pipeline` | String | The ID of the ingest pipeline to use for preprocessing the document before indexing. |
| `routing` | String | A custom routing value used to route the operation to a specific shard. See [Routing](#routing). |
| `refresh` | Enum | Whether to refresh the affected shards after the operation. Valid values are `true` (refresh immediately), `false` (do not refresh), and `wait_for` (wait for a refresh to occur before responding). Default is `false`. See [Refresh](#refresh). |
| `timeout` | Time | The amount of time to wait for the primary shard to become available if it is unavailable. Default is `1m`. See [Timeout](#timeout). |
| `version` | Integer | The explicit version number for concurrency control. The document is only indexed if its current version matches this value. See [Versioning](#versioning). |
| `version_type` | Enum | The version type for external versioning. Valid values are `external` (only indexes if the specified version is greater than the stored version) and `external_gte` (only indexes if the specified version is greater than or equal to the stored version). Default is `internal`. See [Versioning](#versioning). |
| `wait_for_active_shards` | String | The number of active shard copies required before proceeding with the operation. Valid values are `all` or a positive integer up to the total number of shards. Default is `1` (only the primary shard). See [Wait for active shards](#wait-for-active-shards). |
| `require_alias` | Boolean | Whether the target index name must be an index alias. If `true` and the target is not an alias, the request fails. Default is `false`. |

## Example requests

The following example requests create a sample index document for an index named `sample_index`.


### Example PUT request

<!-- spec_insert_start
component: example_code
rest: PUT /sample_index/_doc/1
body: |
{
  "name": "Example",
  "price": 29.99,
  "description": "To be or not to be, that is the question"
}
-->
{% capture step1_rest %}
PUT /sample_index/_doc/1
{
  "name": "Example",
  "price": 29.99,
  "description": "To be or not to be, that is the question"
}
{% endcapture %}

{% capture step1_python %}


response = client.index(
  index = "sample_index",
  id = "1",
  body =   {
    "name": "Example",
    "price": 29.99,
    "description": "To be or not to be, that is the question"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Example POST request

<!-- spec_insert_start
component: example_code
rest: POST /sample_index/_doc
body: |
{
  "name": "Another Example",
  "price": 19.99,
  "description": "We are such stuff as dreams are made on"
}
-->
{% capture step1_rest %}
POST /sample_index/_doc
{
  "name": "Another Example",
  "price": 19.99,
  "description": "We are such stuff as dreams are made on"
}
{% endcapture %}

{% capture step1_python %}


response = client.index(
  index = "sample_index",
  body =   {
    "name": "Another Example",
    "price": 19.99,
    "description": "We are such stuff as dreams are made on"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "_index": "sample-index",
  "_id": "1",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_index` | String | The name of the index to which the document was added. |
| `_id` | String | The document's unique identifier. |
| `_version` | Integer | The document's version number. Incremented each time the document is updated. |
| `result` | String | The result of the indexing operation. Possible values are `created` (a new document was created) and `updated` (an existing document was updated). |
| `_shards` | Object | Information about the replication process. |
| `_shards.total` | Integer | The number of shard copies (primary and replicas) on which the operation should be executed. |
| `_shards.successful` | Integer | The number of shard copies on which the operation succeeded. When the operation succeeds, this value is at least 1 (the primary shard). |
| `_shards.failed` | Integer | The number of shard copies on which the operation failed. If the operation succeeds, this value is 0. |
| `_seq_no` | Integer | The sequence number assigned to the document for this indexing operation. Sequence numbers are used to ensure that an older version of a document does not overwrite a newer version. See [Optimistic concurrency control]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/#optimistic-concurrency-control). |
| `_primary_term` | Integer | The primary term assigned to the document for this indexing operation. See [Optimistic concurrency control]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/#optimistic-concurrency-control). |


## Automatic index creation

By default, if the specified index does not exist, the Index Document API automatically creates it and applies any configured index templates. The API also creates a dynamic mapping for new fields if no explicit mapping exists.

Automatic index creation is controlled by the `action.auto_create_index` setting. By default, this setting is `true`, allowing any index to be created automatically. You can modify this setting to allow or block index creation based on specific patterns or disable automatic index creation entirely. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).

## Optimistic concurrency control

You can use the `if_seq_no` and `if_primary_term` parameters to perform conditional indexing based on the document's current sequence number and primary term. This ensures that the operation only succeeds if the document has not been modified since you last retrieved it.

For example, to update a document only if it has sequence number 3 and primary term 1, include these parameters in your request:

```json
PUT sample-index/_doc/1?if_seq_no=3&if_primary_term=1
{
  "name": "Updated Example",
  "price": 39.99
}
```

If the sequence number or primary term does not match the current values, OpenSearch returns a version conflict error (HTTP 409), allowing you to retrieve the latest version and retry the operation. For more information, see [Optimistic concurrency control]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/#optimistic-concurrency-control).

## Automatic ID generation

When you use the POST method without specifying a document ID, OpenSearch automatically generates a unique ID for the document. The `op_type` is automatically set to `create`, ensuring a new document is always created.

The following example indexes a document without specifying an ID, allowing OpenSearch to generate one automatically:

```json
POST sample-index/_doc
{
  "user": "john_doe",
  "post_date": "2024-01-15T10:30:00",
  "message": "Hello, OpenSearch!"
}
```

The response includes the automatically generated ID:

```json
{
  "_index": "sample-index",
  "_id": "W0tpsmIBdwcYyG50zbta",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

The generated ID is a Base64-encoded UUID that ensures uniqueness across your cluster.

## Routing

By default, OpenSearch determines which shard stores a document by computing a hash of the document's ID. You can override this behavior by providing a custom `routing` parameter value.

The following example routes the document to a shard based on the routing value `user123`:

```json
POST sample-index/_doc?routing=user123
{
  "user": "john_doe",
  "message": "Hello, world!"
}
```

When you use custom routing during indexing, you must provide the same routing value when retrieving, updating, or deleting the document. Otherwise, OpenSearch cannot locate the document.

## Distributed model

The index operation is directed to the primary shard based on the document's routing value (either the document ID or a custom routing value). Once the primary shard completes the operation, OpenSearch distributes the update to all applicable replica shards in the replication group.

This distributed approach ensures that all shard copies remain synchronized. The primary shard coordinates the replication process and waits for confirmation from the required number of active shards before acknowledging success to the client.

## Wait for active shards

To improve write operation resiliency, you can configure the Index Document API to wait for a certain number of active shard copies before proceeding. By default, the operation waits only for the primary shard to be active (`wait_for_active_shards=1`).

You can set `wait_for_active_shards` to `all` or any positive integer up to the total number of shard copies (`number_of_replicas + 1`). If the required number of active shards is not available, the operation waits and retries until the shards become available or a timeout occurs.

For example, consider a cluster with three nodes (A, B, and C) and an index with `number_of_replicas` set to 3, resulting in 4 shard copies (one primary and three replicas). By default, an indexing operation proceeds as long as the primary shard is available, even if nodes B and C are down and node A hosts the primary shard copy.

If you set `wait_for_active_shards=3` on the request, the indexing operation requires 3 active shard copies before proceeding. This requirement can be met when all 3 nodes are running, with each node containing a copy of the shard. However, if you set `wait_for_active_shards=all` (or `4`), the indexing operation does not proceed because you need all 4 copies active, but only 3 nodes exist. The operation times out unless a new node joins the cluster to host the fourth shard copy.

The following example requires at least 2 active shard copies (the primary and one replica) before proceeding:

```json
PUT sample-index/_doc/1?wait_for_active_shards=2
{
  "name": "Example",
  "price": 29.99
}
```

This setting reduces the risk of writing to an insufficient number of shard copies but does not eliminate it entirely. The check occurs before the write operation begins. Once the operation is underway, replication can still fail on some replicas while succeeding on the primary. The `_shards` section of the response indicates how many shard copies succeeded or failed.

## Refresh

The `refresh` parameter controls when indexed documents become visible to search operations. For most use cases, use the default value (`false`) for optimal performance.

Valid options are:

- `false` (default): The document becomes visible according to the index refresh interval (by default, 1 second).
- `true`: Forces an immediate refresh after indexing, making the document immediately searchable. Use sparingly, as frequent refreshes can significantly impact performance.
- `wait_for`: Waits for the next scheduled refresh before responding. More efficient than `true` for batch operations.

For more information, see [Refresh behavior]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/#refresh-behavior).

## Timeout

If the primary shard is unavailable when you submit an index request (for example, during recovery or relocation), the operation waits for up to 1 minute by default before failing. You can adjust this behavior using the `timeout` parameter:

```json
PUT sample-index/_doc/1?timeout=5m
{
  "name": "Example",
  "price": 29.99
}
```

## Versioning

Every indexed document has a version number. By default, OpenSearch uses internal versioning, starting at 1 and incrementing with each update or delete operation.

For external versioning (such as maintaining version numbers in a separate database), set the `version_type` parameter to control how OpenSearch handles version conflicts. The following table lists the available version types.

| Version type | Description |
| :--- | :--- |
| `internal` | Only indexes the document if the specified version is identical to the version of the stored document. This is the default version type. |
| `external` or `external_gt` | Only indexes the document if the specified version is strictly greater than the version of the stored document or if there is no existing document. The specified version is used as the new version and stored with the document. The supplied version must be a non-negative long integer. |
| `external_gte` | Only indexes the document if the specified version is greater than or equal to the version of the stored document. If there is no existing document, the operation succeeds. The specified version is used as the new version and stored with the document. The supplied version must be a non-negative long integer. |

The `external_gte` version type is intended for special use cases and should be used with care. If used incorrectly, it can result in data loss.

For example, to index a document using external versioning:

```json
PUT sample-index/_doc/1?version=5&version_type=external
{
  "name": "Example",
  "price": 29.99,
  "description": "Updated from external system"
}
```

If the provided version does not meet the requirements of the specified version type, OpenSearch returns a version conflict error. Versioning is completely real time and is not affected by the near-real-time aspects of search operations.

## Noop updates

When you update a document using the Index Document API, OpenSearch always creates a new version of the document, even if the document content has not changed. This behavior can be inefficient if you frequently reindex documents with the same content.

If you need to avoid creating unnecessary document versions, use the [Update Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/) with the `detect_noop` parameter set to `true`. The Update API fetches the existing document, compares it to the new content, and only creates a new version if the content has changed.

The Index Document API does not support noop detection because it does not fetch the old source for comparison. Whether noop updates are problematic depends on several factors, including how frequently your data source sends updates that do not change the document and the query load on the shard receiving the updates.

