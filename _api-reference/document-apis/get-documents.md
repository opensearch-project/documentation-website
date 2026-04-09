---
layout: default
title: Get document
parent: Document APIs
nav_order: 5
redirect_from:
 - /opensearch/rest-api/document-apis/get-documents/
canonical_url: https://docs.opensearch.org/latest/api-reference/document-apis/get-documents/
---

# Get Document API
**Introduced 1.0**
{: .label .label-purple }

The Get Document API retrieves a JSON document and its metadata from an index by document ID. You can also use HEAD requests to verify that a document or its source exists without retrieving the full content.

## Endpoints

To retrieve a document and its metadata from an index, use the `GET` method:

```json
GET /{index}/_doc/{id}
```

To retrieve only the document source, use the following endpoint:

```json
GET /{index}/_source/{id}
```

To verify that a document exists, use the `HEAD` method:

```json
HEAD /{index}/_doc/{id}
HEAD /{index}/_source/{id}
```

<!-- spec_insert_start
api: get
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier of the document. |
| `index` | **Required** | String | The name of the index containing the document. |

<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Methods | Data type | Description | Default |
| :--- | :--- | :--- | :--- | :--- |
| `_source` | `GET` | Boolean or List or String | Whether to return the `_source` field. Set to `true` to include it, `false` to exclude it, or specify a comma-separated list of field names to return. See [Source filtering](#source-filtering).| N/A |
| `_source_excludes` | `GET` | List or String | A comma-separated list of source fields to exclude from the response. See [Source filtering](#source-filtering). | N/A |
| `_source_includes` | `GET` | List or String | A comma-separated list of source fields to include in the response. See [Source filtering](#source-filtering). | N/A |
| `preference` | `GET`, `HEAD` | String | A preference for which node or shard should handle the operation. By default, OpenSearch selects a shard replica randomly. See [Preference](#preference). | `random` |
| `realtime` | `GET`, `HEAD` | Boolean | Whether the request is real time. If `true`, the request retrieves the most recent version of the document. If `false`, the request is near-real-time and retrieves the document based on the last refresh. See [Real-time behavior](#real-time-behavior). | `true` |
| `refresh` | `GET`, `HEAD` | Boolean or String | Whether to refresh the affected shards before the operation to make recent changes visible. <br> Valid values are: <br> - `false`: Do not refresh the affected shards. <br> - `true`: Refresh the affected shards immediately. <br> - `wait_for`: Wait for the changes to become visible before responding. See [Refresh](#refresh). | `false` |
| `routing` | `GET`, `HEAD` | List or String | The routing value used to target a specific primary shard. See [Routing](#routing).| N/A |
| `stored_fields` | `GET` | List or String | A comma-separated list of stored fields to return. If no fields are specified, no stored fields are included in the response. If this parameter is specified, the `_source` parameter defaults to `false`. | N/A |
| `version` | `GET`, `HEAD` | Integer | The explicit version number for concurrency control. The specified version must match the current version of the document for the request to succeed. | N/A |
| `version_type` | `GET`, `HEAD` | String | The version type for concurrency control. <br> Valid values are: <br> - `internal`: The version number is managed internally by OpenSearch. <br> - `external`: The version number must be greater than the current version. <br> - `external_gte`: The version number must be greater than or equal to the current version. | `internal` |

## Example request

The following example retrieves a document by its ID:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/1
-->
{% capture step1_rest %}
GET /products/_doc/1
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "1",
  index = "products"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The following example shows a response from a `GET` request:

```json
{
  "_index": "products",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with optical sensor",
    "price": 29.99,
    "category": "Electronics",
    "in_stock": true,
    "manufacturer": "TechCorp",
    "model": "WM-2000",
    "tags": [
      "wireless",
      "ergonomic",
      "optical"
    ]
  }
}
```

## Response body fields

The `GET` response contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`_index` | String | The name of the index containing the document.
`_id` | String | The document's unique identifier.
`_version` | Integer | The document's version number. Incremented each time the document is updated.
`_seq_no` | Integer | The sequence number assigned to the document for the indexing operation. Used to ensure an older version doesn't overwrite a newer version.
`_primary_term` | Integer | The primary term assigned to the document for the indexing operation. Used with `_seq_no` for optimistic concurrency control.
`found` | Boolean | Indicates whether the document exists. `true` if the document was found, `false` otherwise.
`_routing` | String | The routing value used to determine which shard stores the document. Only included if a routing value was specified when the document was indexed.
`_source` | Object | The original JSON document that was indexed. Excluded if the `_source` parameter is set to `false` or if the `stored_fields` parameter is used.
`_fields` | Object | Contains stored field values when the `stored_fields` parameter is specified. Only returned if `stored_fields` is set and `found` is `true`. Field values are always returned as arrays. See [Retrieving stored fields](#retrieving-stored-fields).

## Source filtering

By default, the Get Document API returns the entire contents of the `_source` field. You can control which parts of the source are returned or exclude it entirely.

### Disabling source retrieval

To exclude the `_source` field from the response, set the `_source` parameter to `false`. The following example retrieves document metadata without the source content:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/1?_source=false
-->
{% capture step1_rest %}
GET /products/_doc/1?_source=false
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "1",
  index = "products",
  params = { "_source": "false" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response excludes the `_source` field:

```json
{
  "_index": "products",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true
}
```

### Source includes and excludes

To retrieve only specific fields from a large document, use the `_source_includes` parameter to include specific fields or the `_source_excludes` parameter to exclude fields. This reduces network overhead by transferring only the required data.

The following example retrieves only the `name` and `price` fields:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/1?_source_includes=name,price
-->
{% capture step1_rest %}
GET /products/_doc/1?_source_includes=name,price
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "1",
  index = "products",
  params = { "_source_includes": "name,price" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The `_source` field of the response contains only the `price` and `name` fields:

```json
{
  "_index": "products",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "price": 29.99,
    "name": "Wireless Mouse"
  }
}
```

### Shorter notation

If you only need to include certain fields without excluding any, use the shorter notation by specifying fields directly in the `_source` parameter. The following example retrieves only the `name` and `price` fields:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/1?_source=name,price
-->
{% capture step1_rest %}
GET /products/_doc/1?_source=name,price
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "1",
  index = "products",
  params = { "_source": "name,price" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Retrieving the source field only

Use the `_source` endpoint to retrieve only the document source without metadata. The following example retrieves only the source content:

<!-- spec_insert_start
component: example_code
rest: GET /products/_source/1
-->
{% capture step1_rest %}
GET /products/_source/1
{% endcapture %}

{% capture step1_python %}


response = client.get_source(
  id = "1",
  index = "products"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the `_source` field only:

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with optical sensor",
  "price": 29.99,
  "category": "Electronics",
  "in_stock": true,
  "manufacturer": "TechCorp",
  "model": "WM-2000",
  "tags": [
    "wireless",
    "ergonomic",
    "optical"
  ]
}
```

You can combine the `_source` endpoint with source filtering parameters. The following example retrieves only specific fields from the source:

<!-- spec_insert_start
component: example_code
rest: GET /products/_source/1?_source=name,price
-->
{% capture step1_rest %}
GET /products/_source/1?_source=name,price
{% endcapture %}

{% capture step1_python %}


response = client.get_source(
  id = "1",
  index = "products",
  params = { "_source": "name,price" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains only the `price` and `name` fields:

```json
{
  "price": 29.99,
  "name": "Wireless Mouse"
}
```

You can use HEAD with the `_source` endpoint to check whether the document source exists:

<!-- spec_insert_start
component: example_code
rest: HEAD /products/_source/1
-->
{% capture step1_rest %}
HEAD /products/_source/1
{% endcapture %}

{% capture step1_python %}


response = client.exists_source(
  id = "1",
  index = "products"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains only `200 - true`.

## Routing

When documents are indexed with a custom routing value, you must provide the same routing value when retrieving them. The routing value determines which shard stores the document.

The following example retrieves a document that was indexed with routing value `user1`:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/2?routing=user1
-->
{% capture step1_rest %}
GET /products/_doc/2?routing=user1
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "2",
  index = "products",
  params = { "routing": "user1" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the document with the specified routing:

```json
{
  "_index": "products",
  "_id": "2",
  "_version": 1,
  "_seq_no": 1,
  "_primary_term": 1,
  "_routing": "user1",
  "found": true,
  "_source": {
    "name": "Mechanical Keyboard",
    "description": "RGB mechanical gaming keyboard",
    "price": 149.99,
    "category": "Electronics",
    "in_stock": true,
    "manufacturer": "GameGear",
    "model": "MK-500",
    "tags": [
      "mechanical",
      "rgb",
      "gaming"
    ]
  }
}
```

If you don't specify the correct routing value, OpenSearch cannot locate the document and returns a `found: false` response.

## Retrieving stored fields

Use the `stored_fields` parameter to retrieve specific fields that were stored in the index at indexing time. Only fields with `store: true` in the mapping are returned. Fields without this setting are ignored.

The following example retrieves only the `category` and `manufacturer` stored fields from a document:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/1?stored_fields=category,manufacturer
-->
{% capture step1_rest %}
GET /products/_doc/1?stored_fields=category,manufacturer
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "1",
  index = "products",
  params = { "stored_fields": "category,manufacturer" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Note that field values retrieved from stored fields are always returned as arrays. Even though `category` and `manufacturer` are single-valued fields, they are returned in arrays:

```json
{
  "_index": "products",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "fields": {
    "category": [
      "Electronics"
    ],
    "manufacturer": [
      "TechCorp"
    ]
  }
}
```

When retrieving stored fields from a document indexed with routing, you must provide the routing value. The following example retrieves stored fields from a document with routing:

<!-- spec_insert_start
component: example_code
rest: GET /products/_doc/2?routing=user1&stored_fields=category,manufacturer
-->
{% capture step1_rest %}
GET /products/_doc/2?routing=user1&stored_fields=category,manufacturer
{% endcapture %}

{% capture step1_python %}


response = client.get(
  id = "2",
  index = "products",
  params = { "routing": "user1", "stored_fields": "category,manufacturer" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Checking document existence

You can use the HEAD method to verify whether a document exists without retrieving its content. OpenSearch returns HTTP status code `200` if the document exists or `404` if it doesn't.

The following example checks whether a document exists:

<!-- spec_insert_start
component: example_code
rest: HEAD /products/_doc/1
-->
{% capture step1_rest %}
HEAD /products/_doc/1
{% endcapture %}

{% capture step1_python %}


response = client.exists(
  id = "1",
  index = "products"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains only `200 - true`.

## Preference

The `preference` parameter controls which shard replica handles the request. By default, OpenSearch randomly distributes get operations across available shard replicas.

You can set the `preference` parameter to one of the following values:

- `_local`: Directs the operation to a locally allocated shard replica, reducing network overhead.
- Custom string value: Routes requests with the same custom value to the same shard replicas. This ensures consistent results when shards are in different refresh states. Common custom values include session IDs or usernames.

## Real-time behavior

By default, the Get Document API operates in real time, retrieving the latest version of a document regardless of the index refresh rate. This means you can retrieve a document immediately after indexing it, even before the index has been refreshed to make it searchable.

When you request stored fields (using the `stored_fields` parameter) and the document has been updated but not yet refreshed, OpenSearch parses and analyzes the document source to extract the requested stored fields.

To disable real-time behavior and retrieve the document based on the last refreshed state of the index, set the `realtime` parameter to `false`.

## Refresh

The `refresh` parameter can be set to `true` to refresh the relevant shard before retrieving the document. Refreshing makes recent changes searchable but can impose significant system load and slow indexing. Carefully evaluate the trade-off between data freshness and performance before enabling this parameter.

## Versioning

You can use the `version` parameter to retrieve a document only if its current version matches the specified number. This ensures data consistency when working with versioned documents.

Internally, OpenSearch marks the old document version as deleted when a document is updated and creates an entirely new document version. Although you cannot access old versions through the Get Document API, OpenSearch automatically cleans up deleted versions in the background during indexing.

## Distributed model

The Get Document API uses the document ID to compute a hash value that identifies the shard storing the document. OpenSearch then routes the request to one of the replicas in that shard group (including the primary shard and its replicas) and returns the result.

Having more shard replicas improves GET operation scalability because the load is distributed across multiple replicas, increasing throughput for retrieval requests.
