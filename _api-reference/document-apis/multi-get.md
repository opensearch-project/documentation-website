---
layout: default
title: Multi-get documents
parent: Document APIs
nav_order: 30
redirect_from:
 - /opensearch/rest-api/document-apis/multi-get/
canonical_url: https://docs.opensearch.org/latest/api-reference/document-apis/multi-get/
---

# Multi-get Documents API
**Introduced 1.0**
{: .label .label-purple }

The Multi-get Documents API retrieves multiple documents from one or more indexes in a single request. This operation is more efficient than executing multiple individual GET requests because it reduces network overhead and combines the operations into a single round-trip to the cluster.

Use this API when you need to retrieve specific documents by their IDs and you know which documents you want to fetch. Common scenarios include:

- Retrieving a batch of user profiles, product details, or other entities based on a list of known IDs.
- Fetching related documents from different indexes in a single operation, such as getting both an order record and its associated customer information.
- Implementing efficient data access patterns where you need to retrieve multiple documents while controlling which fields are returned for each document.

## Partial responses

The Multi-get Documents API prioritizes fast responses and will return partial results if one or more shards fail during the operation. If a specific document cannot be retrieved due to a shard failure or if the document does not exist, the response includes error details for that document while still returning successfully retrieved documents. This ensures that temporary failures or missing documents do not block the entire operation.

<!-- spec_insert_start
api: mget
component: endpoints
-->
## Endpoints
```json
GET  /_mget
POST /_mget
GET  /{index}/_mget
POST /{index}/_mget
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: mget
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the index to retrieve documents from when `ids` are specified, or when a document in the `docs` array does not specify an index. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: mget
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `_source` | Boolean or List or String | Set to `true` or `false` to return the `_source` field or not, or a list of fields to return. | N/A |
| `_source_excludes` | List or String | A comma-separated list of source fields to exclude from the response. You can also use this parameter to exclude fields from the subset specified in `_source_includes` query parameter. | N/A |
| `_source_includes` | List or String | A comma-separated list of source fields to include in the response. If this parameter is specified, only these source fields are returned. You can exclude fields from this subset using the `_source_excludes` query parameter. If the `_source` parameter is `false`, this parameter is ignored. | N/A |
| `preference` | String | Specifies the node or shard the operation should be performed on. Random by default. | `random` |
| `realtime` | Boolean | If `true`, the request is real time as opposed to near real time. | N/A |
| `refresh` | Boolean or String | If `true`, the request refreshes relevant shards before retrieving documents. <br> Valid values are: <br> - `false`: Do not refresh the affected shards. <br> - `true`: Refresh the affected shards immediately. <br> - `wait_for`: Wait for the changes to become visible before replying. | N/A |
| `routing` | List or String | A custom value used to route operations to a specific shard. | N/A |
| `stored_fields` | List or String | If `true`, retrieves the document fields stored in the index rather than the document `_source`. | N/A |

<!-- spec_insert_end -->

## Request body fields

The request body specifies which documents to retrieve. If you don't specify an index in the request path, you must include the index name for each document in the request body. The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`docs` | Array of objects | The documents to retrieve. Required if the `ids` field is not specified. Each object can include the following fields: `_index`, `_id`, `routing`, `_source`, and `stored_fields`.
`docs._index` | String | The name of the index containing the document. Required if an index is not specified in the request path.
`docs._id` | String | The document ID. Required.
`docs.routing` | String | The routing value used to route the operation to a specific shard. Required if a custom routing value was used when indexing the document.
`docs._source` | Boolean, Array, or Object | Controls which source fields are returned. If `false`, the `_source` field is excluded from the response. If an array, specifies the fields to include. If an object, can contain `includes` and `excludes` arrays to control field inclusion and exclusion. Default is `true`.
`docs._source.includes` | Array of strings | The source fields to include in the response. For example, `["title", "author"]` returns only the `title` and `author` fields.
`docs._source.excludes` | Array of strings | The source fields to exclude from the response. For example, `["internal_notes"]` excludes the `internal_notes` field.
`docs.stored_fields` | Array of strings | The stored fields to retrieve instead of the `_source` field. Only fields explicitly stored in the index mapping can be retrieved. If specified, the `_source` field is not returned unless explicitly requested.
`ids` | Array of strings | A simplified way to specify document IDs when all documents are in the same index. Can only be used when an index is specified in the request path. If provided, the `docs` field is not required.

## Example: Retrieving documents from multiple indexes

The following example retrieves one document from the `books` index and one document from the `articles` index:

<!-- spec_insert_start
component: example_code
rest: GET /_mget
body: |
{
  "docs": [
    {
      "_index": "books",
      "_id": "1"
    },
    {
      "_index": "articles",
      "_id": "1"
    }
  ]
}
-->
{% capture step1_rest %}
GET /_mget
{
  "docs": [
    {
      "_index": "books",
      "_id": "1"
    },
    {
      "_index": "articles",
      "_id": "1"
    }
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.mget(
  body =   {
    "docs": [
      {
        "_index": "books",
        "_id": "1"
      },
      {
        "_index": "articles",
        "_id": "1"
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Using the IDs array

When retrieving multiple documents from the same index, you can simplify the request by specifying the index in the path and using the `ids` array. The following example retrieves three documents from the `books` index:

<!-- spec_insert_start
component: example_code
rest: GET /books/_mget
body: |
{
  "ids": ["1", "2", "3"]
}
-->
{% capture step1_rest %}
GET /books/_mget
{
  "ids": [
    "1",
    "2",
    "3"
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.mget(
  index = "books",
  body =   {
    "ids": [
      "1",
      "2",
      "3"
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Filtering source fields

You can control which fields are returned for each document by using the `_source` parameter. The following example demonstrates different source filtering options: excluding the source entirely for the first document, returning specific fields for the second document, and using includes to return selected fields for the third document:

<!-- spec_insert_start
component: example_code
rest: GET /_mget
body: |
{
  "docs": [
    {
      "_index": "books",
      "_id": "1",
      "_source": false
    },
    {
      "_index": "books",
      "_id": "2",
      "_source": ["title", "author"]
    },
    {
      "_index": "books",
      "_id": "3",
      "_source": {
        "includes": ["title", "year"]
      }
    }
  ]
}
-->
{% capture step1_rest %}
GET /_mget
{
  "docs": [
    {
      "_index": "books",
      "_id": "1",
      "_source": false
    },
    {
      "_index": "books",
      "_id": "2",
      "_source": [
        "title",
        "author"
      ]
    },
    {
      "_index": "books",
      "_id": "3",
      "_source": {
        "includes": [
          "title",
          "year"
        ]
      }
    }
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.mget(
  body =   {
    "docs": [
      {
        "_index": "books",
        "_id": "1",
        "_source": false
      },
      {
        "_index": "books",
        "_id": "2",
        "_source": [
          "title",
          "author"
        ]
      },
      {
        "_index": "books",
        "_id": "3",
        "_source": {
          "includes": [
            "title",
            "year"
          ]
        }
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Retrieving stored fields

If your index mapping includes stored fields, you can retrieve them instead of the document source. The following example retrieves different stored fields from two user documents:

<!-- spec_insert_start
component: example_code
rest: GET /_mget
body: |
{
  "docs": [
    {
      "_index": "users",
      "_id": "1",
      "stored_fields": ["name", "location"]
    },
    {
      "_index": "users",
      "_id": "2",
      "stored_fields": ["email", "joined_date"]
    }
  ]
}
-->
{% capture step1_rest %}
GET /_mget
{
  "docs": [
    {
      "_index": "users",
      "_id": "1",
      "stored_fields": [
        "name",
        "location"
      ]
    },
    {
      "_index": "users",
      "_id": "2",
      "stored_fields": [
        "email",
        "joined_date"
      ]
    }
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.mget(
  body =   {
    "docs": [
      {
        "_index": "users",
        "_id": "1",
        "stored_fields": [
          "name",
          "location"
        ]
      },
      {
        "_index": "users",
        "_id": "2",
        "stored_fields": [
          "email",
          "joined_date"
        ]
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example: Specifying routing values

If you used custom routing when indexing documents, you must provide the routing value when retrieving those documents. The following example retrieves two order documents using their routing values: the first document uses the routing value from the query parameter, and the second document specifies its own routing value:

<!-- spec_insert_start
component: example_code
rest: GET /_mget?routing=user123
body: |
{
  "docs": [
    {
      "_index": "orders",
      "_id": "1"
    },
    {
      "_index": "orders",
      "_id": "2",
      "routing": "user456"
    }
  ]
}
-->
{% capture step1_rest %}
GET /_mget?routing=user123
{
  "docs": [
    {
      "_index": "orders",
      "_id": "1"
    },
    {
      "_index": "orders",
      "_id": "2",
      "routing": "user456"
    }
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.mget(
  params = { "routing": "user123" },
  body =   {
    "docs": [
      {
        "_index": "orders",
        "_id": "1"
      },
      {
        "_index": "orders",
        "_id": "2",
        "routing": "user456"
      }
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

The Multi-get Documents API returns a `docs` array containing the retrieved documents in the same order as they were requested. Each document includes its metadata and source data, or an error if the document could not be retrieved.

<details markdown="block">
  <summary>
    Response for retrieving documents from multiple indexes
  </summary>
  {: .text-delta}

```json
{
  "docs": [
    {
      "_index": "books",
      "_id": "1",
      "_version": 2,
      "_seq_no": 2,
      "_primary_term": 3,
      "found": true,
      "_source": {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "year": 1925,
        "genre": "Fiction",
        "pages": 180
      }
    },
    {
      "_index": "articles",
      "_id": "1",
      "_version": 1,
      "_seq_no": 0,
      "_primary_term": 1,
      "found": true,
      "_source": {
        "title": "Introduction to OpenSearch",
        "author": "Jane Smith",
        "published": "2024-01-15",
        "category": "Technology",
        "views": 1500
      }
    }
  ]
}
```
</details>

<details markdown="block">
  <summary>
    Response for using the IDs array
  </summary>
  {: .text-delta}

```json
{
  "docs": [
    {
      "_index": "books",
      "_id": "1",
      "_version": 2,
      "_seq_no": 2,
      "_primary_term": 3,
      "found": true,
      "_source": {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "year": 1925,
        "genre": "Fiction",
        "pages": 180
      }
    },
    {
      "_index": "books",
      "_id": "2",
      "_version": 2,
      "_seq_no": 3,
      "_primary_term": 3,
      "found": true,
      "_source": {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "year": 1960,
        "genre": "Fiction",
        "pages": 324
      }
    },
    {
      "_index": "books",
      "_id": "3",
      "_version": 1,
      "_seq_no": 4,
      "_primary_term": 3,
      "found": true,
      "_source": {
        "title": "1984",
        "author": "George Orwell",
        "year": 1949,
        "genre": "Dystopian",
        "pages": 328
      }
    }
  ]
}
```
</details>

<details markdown="block">
  <summary>
    Response for filtering source fields
  </summary>
  {: .text-delta}

```json
{
  "docs": [
    {
      "_index": "books",
      "_id": "1",
      "_version": 2,
      "_seq_no": 2,
      "_primary_term": 3,
      "found": true
    },
    {
      "_index": "books",
      "_id": "2",
      "_version": 2,
      "_seq_no": 3,
      "_primary_term": 3,
      "found": true,
      "_source": {
        "author": "Harper Lee",
        "title": "To Kill a Mockingbird"
      }
    },
    {
      "_index": "books",
      "_id": "3",
      "_version": 1,
      "_seq_no": 4,
      "_primary_term": 3,
      "found": true,
      "_source": {
        "year": 1949,
        "title": "1984"
      }
    }
  ]
}
```
</details>

<details markdown="block">
  <summary>
    Response for retrieving stored fields
  </summary>
  {: .text-delta}

```json
{
  "docs": [
    {
      "_index": "users",
      "_id": "1",
      "_version": 1,
      "_seq_no": 0,
      "_primary_term": 1,
      "found": true,
      "fields": {
        "name": [
          "Alice Johnson"
        ],
        "location": [
          "San Francisco"
        ]
      }
    },
    {
      "_index": "users",
      "_id": "2",
      "_version": 1,
      "_seq_no": 1,
      "_primary_term": 1,
      "found": true,
      "fields": {
        "joined_date": [
          "2021-06-20T00:00:00.000Z"
        ],
        "email": [
          "bob@example.com"
        ]
      }
    }
  ]
}
```
</details>

<details markdown="block">
  <summary>
    Response for specifying routing values
  </summary>
  {: .text-delta}

```json
{
  "docs": [
    {
      "_index": "orders",
      "_id": "1",
      "_version": 2,
      "_seq_no": 3,
      "_primary_term": 14,
      "_routing": "user123",
      "found": true,
      "_source": {
        "order_id": "ORD-001",
        "user_id": "user123",
        "product": "Laptop",
        "amount": 1299.99
      }
    },
    {
      "_index": "orders",
      "_id": "2",
      "_version": 2,
      "_seq_no": 4,
      "_primary_term": 14,
      "_routing": "user456",
      "found": true,
      "_source": {
        "order_id": "ORD-002",
        "user_id": "user456",
        "product": "Smartphone",
        "amount": 899.99
      }
    }
  ]
}
```
</details>

## Response body fields

The response contains a `docs` array with one element for each requested document, returned in the same order as the request. The following table lists the response body fields.

Field | Data type | Description
:--- | :--- | :---
`docs` | Array of objects | The retrieved documents. Each object represents one document and includes the fields described in this table.
`_index` | String | The name of the index containing the document.
`_id` | String | The document ID.
`_version` | Integer | The document version number. This number is incremented each time the document is updated.
`_seq_no` | Integer | The sequence number assigned to the document when it was indexed. Used for optimistic concurrency control.
`_primary_term` | Integer | The primary term assigned to the document when it was indexed. Used with `_seq_no` for optimistic concurrency control.
`found` | Boolean | Whether the document was found. If `false`, the document does not exist, and the `_source` field is not included.
`_source` | Object | The document's original JSON content. Omitted if `found` is `false`, if `_source` was set to `false` in the request, or if `stored_fields` was specified.
`fields` | Object | The stored fields for the document. Only included when `stored_fields` is specified in the request and `found` is `true`. Each field value is returned as an array.
`_routing` | String | The routing value used to direct the document to a specific shard. Only included if a custom routing value was used.
`error` | Object | Error information if the document could not be retrieved due to a failure. Contains details about the error type and reason.
