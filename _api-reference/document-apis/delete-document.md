---
layout: default
title: Delete document
parent: Document APIs
nav_order: 15
redirect_from:
 - /opensearch/rest-api/document-apis/delete-document/
canonical_url: https://docs.opensearch.org/latest/api-reference/document-apis/delete-document/
---

# Delete Document API
**Introduced 1.0**
{: .label .label-purple }

The Delete Document API removes a document from an index. You must specify both the index name and document ID. When a document is deleted, OpenSearch increments its version number and marks it for removal during the next segment merge.

<!-- spec_insert_start
api: delete
component: endpoints
-->
## Endpoints
```json
DELETE /{index}/_doc/{id}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: delete
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier for the document. |
| `index` | **Required** | String | Name of the target index. |

<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `if_seq_no` | Integer | Only perform the delete operation if the document has this sequence number. See [Optimistic concurrency control](#optimistic-concurrency-control). |
| `if_primary_term` | Integer | Only perform the delete operation if the document has this primary term. See [Optimistic concurrency control](#optimistic-concurrency-control). |
| `refresh` | Boolean or String | Controls when changes made by the delete operation become visible to search. Valid values are `true` (refresh immediately), `false` (default, do not refresh), and `wait_for` (wait for a refresh before responding). See [Refresh](#refresh). |
| `routing` | String | A custom value used to route the operation to a specific shard. Required if the document was indexed with a routing value. See [Routing](#routing). |
| `timeout` | Time | How long to wait for the primary shard to become available. Default is `1m` (1 minute). See [Timeout](#timeout). |
| `version` | Integer | Explicit version number for concurrency control. The specified version must match the current version of the document for the request to succeed. See [Versioning](#versioning). |
| `version_type` | Enum | Specifies the version type: `internal` (default), `external`, or `external_gte`. With `external`, the version number must be greater than the current version. With `external_gte`, it must be greater than or equal. See [Versioning](#versioning). |
| `wait_for_active_shards` | String | The number of shard copies that must be active before proceeding with the operation. Default is `1` (only the primary shard). Set to `all` or any positive integer up to the total number of shards in the index (`number_of_replicas+1`). See [Wait for active shards](#wait-for-active-shards). |

## Example request

The following example request deletes a document with the ID `1` from the `products` index:

<!-- spec_insert_start
component: example_code
rest: DELETE /products/_doc/1
-->
{% capture step1_rest %}
DELETE /products/_doc/1
{% endcapture %}

{% capture step1_python %}


response = client.delete(
  id = "1",
  index = "products"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following example response shows a successful delete operation:

```json
{
  "_index" : "products",
  "_id" : "1",
  "_version" : 9,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 45,
  "_primary_term" : 1
}
```

## Response body fields

The response body contains information about the delete operation and the affected document.

Field | Description
:--- | :---
`_index` | The name of the index from which the document was deleted.
`_id` | The unique identifier of the deleted document.
`_version` | The new version number of the document after deletion. Each delete operation increments the version number.
`result` | The result of the delete operation. Returns `deleted` if the document was successfully deleted or `not_found` if the document did not exist.
`_shards` | Contains information about the shards involved in the delete operation.
`_shards.total` | The total number of shards (primary and replicas) that should have acknowledged the delete operation.
`_shards.successful` | The number of shards that successfully processed the delete operation.
`_shards.failed` | The number of shards that failed to process the delete operation. When this value is greater than 0, the `failures` array contains details about the failures.
`_seq_no` | The sequence number assigned to the delete operation. Sequence numbers are used for optimistic concurrency control.
`_primary_term` | The primary term at the time of the delete operation. Combined with `_seq_no`, this value is used for optimistic concurrency control.

## Optimistic concurrency control

Delete operations support optimistic concurrency control through the `if_seq_no` and `if_primary_term` parameters. When you specify these parameters, OpenSearch only performs the delete operation if the document's current sequence number and primary term match the provided values. If there is a mismatch, OpenSearch returns a `version_conflict_engine_exception` error with status code `409`, indicating that the document has been modified since you last retrieved it.

The following example request deletes a document only if its sequence number is `43` and its primary term is `1`:

<!-- spec_insert_start
component: example_code
rest: DELETE /products/_doc/3?if_seq_no=43&if_primary_term=1
-->
{% capture step1_rest %}
DELETE /products/_doc/3?if_seq_no=43&if_primary_term=1
{% endcapture %}

{% capture step1_python %}


response = client.delete(
  id = "3",
  index = "products",
  params = { "if_seq_no": "43", "if_primary_term": "1" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If the document's current sequence number or primary term does not match the specified values, OpenSearch returns a version conflict error with status code `409`.

## Versioning

Every write operation on a document, including deletions, increments the document's version number. After a document is deleted, its version number remains available for a short period to support concurrent operations. The duration for which this version information is retained is controlled by the `index.gc_deletes` index setting, which defaults to 60 seconds. This allows OpenSearch to properly handle concurrent delete requests and maintain consistency across replicas.

## Automatic index creation

When you use an external versioning variant (`version_type=external` or `version_type=external_gte`), the delete operation automatically creates the specified index if it does not exist. This behavior only occurs with external versioning types and does not apply to the default internal versioning.

The following example request creates the `auto-created-index` index automatically because it uses external versioning:

<!-- spec_insert_start
component: example_code
rest: DELETE /auto-created-index/_doc/1?version=5&version_type=external
-->
{% capture step1_rest %}
DELETE /auto-created-index/_doc/1?version=5&version_type=external
{% endcapture %}

{% capture step1_python %}


response = client.delete(
  id = "1",
  index = "auto-created-index",
  params = { "version": "5", "version_type": "external" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The operation returns a `not_found` result because the document does not exist, but the index is created as a side effect. Without external versioning, attempting to delete a document from a non-existent index returns an `index_not_found_exception` error.

## Routing

When documents are indexed with a specific routing value, OpenSearch uses that value to determine which shard stores the document. To delete a routed document, you must provide the same routing value used during indexing. If your index has a mapping that sets `_routing` to `required` and you attempt to delete a document without specifying a routing value, OpenSearch rejects the request with a `RoutingMissingException`.

The following example request deletes a document that was indexed with the routing value `electronics`:

<!-- spec_insert_start
component: example_code
rest: DELETE /products/_doc/2?routing=electronics
-->
{% capture step1_rest %}
DELETE /products/_doc/2?routing=electronics
{% endcapture %}

{% capture step1_python %}


response = client.delete(
  id = "2",
  index = "products",
  params = { "routing": "electronics" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Without the correct routing value, OpenSearch cannot locate the document on the appropriate shard and the delete operation will fail.

## Distributed execution

When you send a delete request, OpenSearch hashes the document ID to determine the target shard. The request is then routed to the primary shard in that shard group. After the primary shard processes the delete operation, the changes are replicated to all replica shards in the same shard group, ensuring consistency across the cluster.

## Refresh

By default, deleted documents become visible to search operations only after the next index refresh, which occurs every second by default. You can control this behavior using the `refresh` parameter:

- `false` (default): The delete operation returns immediately, and the change becomes visible after the next automatic refresh.
- `true`: OpenSearch refreshes all affected shards immediately after the delete operation, making the change visible to search operations right away. This option has a performance impact and should be used sparingly.
- `wait_for`: The delete operation waits for the next automatic refresh before returning a response, ensuring that the change is visible when the API call completes.

## Wait for active shards

The `wait_for_active_shards` parameter controls how many shard copies must be available before OpenSearch processes a delete request. By default, this value is `1`, meaning only the primary shard must be active. You can set this to `all` to require all shard copies (primary and replicas) to be active, or specify a positive integer to require a specific number of active shards. This setting helps ensure data durability by waiting for replicas to be available before confirming the delete operation.

## Timeout

If the primary shard is unavailable when a delete request arrives (for example, during recovery or relocation), OpenSearch waits for the shard to become available. The `timeout` parameter specifies how long to wait before failing the request. The default timeout is 1 minute. If the primary shard does not become available within the specified timeout period, OpenSearch returns an error.

The following example request sets a custom timeout of 30 seconds:

<!-- spec_insert_start
component: example_code
rest: DELETE /products/_doc/4?timeout=30s
-->
{% capture step1_rest %}
DELETE /products/_doc/4?timeout=30s
{% endcapture %}

{% capture step1_python %}


response = client.delete(
  id = "4",
  index = "products",
  params = { "timeout": "30s" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
