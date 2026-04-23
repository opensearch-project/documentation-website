---
layout: default
title: Update document
parent: Document APIs
nav_order: 10
redirect_from: 
 - /opensearch/rest-api/document-apis/update-document/
---

# Update Document API
**Introduced 1.0**
{: .label .label-purple }

If you need to update a document's fields in your index, you can use the update document API operation. You can do so by specifying the new data you want to be in your index or by including a script in your request body, which OpenSearch runs to update the document. By default, the update operation only updates a document that exists in the index. If a document does not exist, the API returns an error. To _upsert_ a document (update the document that exists or index a new one), use the [upsert](#using-the-upsert-operation) operation.

When you submit an update request, OpenSearch performs the following operations:

1. Fetches the current document from the shard where it is stored.
2. Applies the update using either the provided script or by merging the partial document with the existing document.
3. Reindexes the updated document and increments its version number.

Although the document must be reindexed, using the Update Document API reduces network round trips and minimizes version conflicts compared to manually retrieving the document using the `GET` method, modifying it, and reindexing it using the Index API.

To use the Update Document API, the `_source` field must be enabled in your index. 
{: .important}

You cannot explicitly specify an ingest pipeline when calling the Update Document API. If a `default_pipeline` or `final_pipeline` is defined in your index, the following behavior applies:

- **Upsert operations**: When indexing a new document, the `default_pipeline` and `final_pipeline` defined in the index are executed as specified.  
- **Update operations**: When updating an existing document, ingest pipeline execution is not recommended because it may produce erroneous results. Support for running ingest pipelines during update operations is deprecated and will be removed in version 3.0.0. If your index has a defined ingest pipeline, the update document operation will return the following deprecation warning: 

```
the index [sample-index1] has a default ingest pipeline or a final ingest pipeline, the support of the ingest pipelines for update operation causes unexpected result and will be removed in 3.0.0
```

<!-- spec_insert_start
api: update
component: endpoints
-->
## Endpoints
```json
POST /{index}/_update/{id}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The document ID. |
| `index` | **Required** | String | The index name. By default, if the index doesn't exist, it is created automatically. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description | Required
:--- | :--- | :--- | :---
`if_seq_no` | Integer | Only perform the update operation if the document has the specified sequence number. | No
`if_primary_term` | Integer | Perform the update operation if the document has the specified primary term. | No
`lang` | String | Language of the script. Default is `painless`. | No
`require_alias` | Boolean | Specifies whether the destination must be an index alias. Default is `false`. | No
`refresh` | Enum | If true, OpenSearch refreshes shards to make the operation visible to searching. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`. | No
`retry_on_conflict` | Integer | The amount of times OpenSearch should retry the operation if there's a document conflict. Default is 0. | No
`routing` | String | Value to route the update operation to a specific shard. | No
`_source` | Boolean or List | Whether or not to include the `_source` field in the response body. Default is `false`. This parameter also supports a comma-separated list of source fields for including multiple source fields in the query response. | No
`_source_excludes` | List | A comma-separated list of source fields to exclude in the query response. | No
`_source_includes` | List | A comma-separated list of source fields to include in the query response. | No
`timeout` | Time | How long to wait for a response from the cluster. | No
`wait_for_active_shards` | String | The number of active shards that must be available before OpenSearch processes the update request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed. | No

## Request body fields

Your request body must contain the information with which you want to update your document. The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`doc` | Object | A partial document containing fields to merge into the existing document. Use this for simple field updates. See [Updating a document using a doc object](#updating-a-document-using-a-doc-object).
`script` | Object | A script that defines how to update the document. Use this for complex updates requiring conditional logic or computed values. If both `doc` and `script` are specified, `doc` is ignored. See [Updating a document using a script](#updating-a-document-using-a-script).
`upsert` | Object | The document to index if the target document does not exist. Used in combination with `doc` or `script` for conditional upsert operations. See [Upsert](#upsert).
`doc_as_upsert` | Boolean | If `true`, uses the `doc` content for both updates and inserts. Default is `false`. See [Doc as upsert](#doc-as-upsert).
`scripted_upsert` | Boolean | If `true`, runs the script whether or not the document exists. Default is `false`. Requires both `script` and `upsert` fields. See [Scripted upsert](#scripted-upsert).
`detect_noop` | Boolean | If `true`, OpenSearch checks whether the update changes the document. If no changes are detected, the update is skipped. Default is `true`. See [Detecting noop updates](#detecting-noop-updates).

### Script context and variables

Scripts can access and modify the document through the `ctx` map, which provides access to the following variables.

Variable | Description
:--- | :---
`ctx._source` | The document source. You can read and modify this object to update document fields.
`ctx._index` | The name of the index containing the document.
`ctx._id` | The document ID.
`ctx._version` | The current document version.
`ctx._routing` | The routing value used to route the document to a shard (if custom routing was used).
`ctx._now` | The current timestamp in milliseconds since the epoch.
`ctx.op` | The operation to perform. Set this to `delete` to delete the document or `none` to perform no operation (noop).

You can use these variables in your scripts to implement conditional logic based on the document's current state.

## Example setup

The following examples use test documents in a `sample-index1` index. To follow along, first create an index with sample documents:

<!-- spec_insert_start
component: example_code
rest: PUT /sample-index1/_doc/1
body: |
{
  "first_name": "Bruce",
  "last_name": "Wayne",
  "age": 35,
  "gadgets": ["batarang"]
}
-->
{% capture step1_rest %}
PUT /sample-index1/_doc/1
{
  "first_name": "Bruce",
  "last_name": "Wayne",
  "age": 35,
  "gadgets": [
    "batarang"
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.index(
  index = "sample-index1",
  id = "1",
  body =   {
    "first_name": "Bruce",
    "last_name": "Wayne",
    "age": 35,
    "gadgets": [
      "batarang"
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example requests

The following examples demonstrate how to use different request body fields to update documents.

### Updating a document using a doc object

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "doc": {
    "first_name" : "Bruce",
    "last_name" : "Wayne"
  }
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "doc": {
    "first_name": "Bruce",
    "last_name": "Wayne"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "doc": {
      "first_name": "Bruce",
      "last_name": "Wayne"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Updating a document using a script

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "script" : {
    "source": "ctx._source.secret_identity = \"Batman\""
  }
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "script": {
    "source": "ctx._source.secret_identity = \"Batman\""
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "script": {
      "source": "ctx._source.secret_identity = \"Batman\""
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Using the upsert operation

Upsert is an operation that conditionally either updates an existing document or inserts a new one based on information in the request. This is useful when you're not sure if a document already exists and want to ensure the correct content is present either way.

#### Upsert

In the following example, the `upsert` operation updates the `first_name` and `last_name` fields if a document already exists. If a document does not exist, a new one is indexed using content in the `upsert` object.

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "doc": {
    "first_name": "Martha",
    "last_name": "Rivera"
  },
  "upsert": {
    "last_name": "Oliveira",
    "age": "31"
  }
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "doc": {
    "first_name": "Martha",
    "last_name": "Rivera"
  },
  "upsert": {
    "last_name": "Oliveira",
    "age": "31"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "doc": {
      "first_name": "Martha",
      "last_name": "Rivera"
    },
    "upsert": {
      "last_name": "Oliveira",
      "age": "31"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Consider an index that contains the following document:

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_score": 1,
  "_source": {
    "first_name": "Bruce",
    "last_name": "Wayne"
  }
}
```
{% include copy-curl.html %}

After the upsert operation, the document's `first_name` and `last_name` fields are updated:

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_score": 1,
  "_source": {
    "first_name": "Martha",
    "last_name": "Rivera"
  }
}
```
{% include copy-curl.html %}

If the document does not exist in the index, a new document is indexed with the fields specified in the `upsert` object:

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_score": 1,
  "_source": {
    "last_name": "Oliveira",
    "age": "31"
  }
}
```
{% include copy-curl.html %}

#### Doc as upsert

You can also add `doc_as_upsert` to the request and set it to `true` to use the information in the `doc` field for performing the upsert operation:

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "doc": {
    "first_name": "Martha",
    "last_name": "Oliveira",
    "age": "31"
  },
  "doc_as_upsert": true
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "doc": {
    "first_name": "Martha",
    "last_name": "Oliveira",
    "age": "31"
  },
  "doc_as_upsert": true
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "doc": {
      "first_name": "Martha",
      "last_name": "Oliveira",
      "age": "31"
    },
    "doc_as_upsert": true
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Consider an index that contains the following document:

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_score": 1,
  "_source": {
    "first_name": "Bruce",
    "last_name": "Wayne"
  }
}
```
{% include copy-curl.html %}

After the upsert operation, the document's `first_name` and `last_name` fields are updated and an `age` field is added. If the document does not exist in the index, a new document is created using the fields from the `doc` object:

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_score": 1,
  "_source": {
    "first_name": "Martha",
    "last_name": "Oliveira",
    "age": "31"
  }
}
```
{% include copy-curl.html %}

#### Scripted upsert

You can also use a script to control how the document is updated. By setting the `scripted_upsert` parameter to `true`, you instruct OpenSearch to use the script even when the document doesn't exist yet. This allows you to define the entire upsert logic in the script.

In the following example, the script sets the document to contain specific fields regardless of whether it previously existed:

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/2
body: |
{
  "scripted_upsert": true,
  "script": {
    "source": "ctx._source.first_name = params.first_name; ctx._source.last_name = params.last_name; ctx._source.age = params.age;",
    "params": {
      "first_name": "Selina",
      "last_name": "Kyle",
      "age": 28
    }
  },
  "upsert": {}
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/2
{
  "scripted_upsert": true,
  "script": {
    "source": "ctx._source.first_name = params.first_name; ctx._source.last_name = params.last_name; ctx._source.age = params.age;",
    "params": {
      "first_name": "Selina",
      "last_name": "Kyle",
      "age": 28
    }
  },
  "upsert": {}
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "2",
  index = "sample-index1",
  body =   {
    "scripted_upsert": true,
    "script": {
      "source": "ctx._source.first_name = params.first_name; ctx._source.last_name = params.last_name; ctx._source.age = params.age;",
      "params": {
        "first_name": "Selina",
        "last_name": "Kyle",
        "age": 28
      }
    },
    "upsert": {}
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If the document with ID `2` does not already exist, this operation creates it using the script. If the document does exist, the script updates the specified fields. In both cases, the result is:

```json
{
  "_index": "sample-index1",
  "_id": "2",
  "_score": 1,
  "_source": {
    "first_name": "Selina",
    "last_name": "Kyle",
    "age": 28
  }
}
```
{% include copy-curl.html %}

Using `scripted_upsert` gives you full control over document creation and updates when standard `doc`-based operations are not flexible enough.

### Detecting noop updates

By default, OpenSearch detects whether an update operation actually changes the document. If the update doesn't make any changes, OpenSearch skips the operation and returns `"result": "noop"` to indicate that no operation was performed. This optimization avoids unnecessary reindexing when the document already contains the values you're trying to set.

The following example attempts to update document `1` with values it already contains:

```json
POST /sample-index1/_update/1
{
  "doc": {
    "first_name": "Bruce",
    "last_name": "Wayne",
    "age": 35
  }
}
```
{% include copy-curl.html %}

Because the document already has these exact values, OpenSearch detects no changes and returns a noop response:

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_version": 2,
  "result": "noop",
  "_shards": {
    "total": 0,
    "successful": 0,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```
{% include copy-curl.html %}

Note that `_shards.total` is `0` when a noop is detected, indicating that no shard operations were performed.

You can disable noop detection by setting `detect_noop` to `false`. This forces OpenSearch to reindex the document even when the values haven't changed:

```json
POST /sample-index1/_update/1
{
  "doc": {
    "first_name": "Bruce",
    "last_name": "Wayne",
    "age": 35
  },
  "detect_noop": false
}
```
{% include copy-curl.html %}

With noop detection disabled, OpenSearch reindexes the document and increments its version number even though the content is identical.


## Example response

```json
{
  "_index": "sample-index1",
  "_id": "1",
  "_version": 3,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 4,
  "_primary_term": 17
}
```

## Response body fields

The following table lists all response body fields.

Field | Description
:--- | :---
`_index` | The name of the index.
`_id` | The document's ID.
`_version` | The document's version. Incremented each time the document is updated.
`result` | The result of the update operation. Returns `updated` when the document was successfully updated, `created` when an upsert operation creates a new document, or `noop` when no changes were made.
`_shards` | Detailed information about the cluster's shards.
`_shards.total` | The total number of shards (primary and replicas).
`_shards.successful` | The number of shards that successfully processed the update operation.
`_shards.failed` | The number of shards that failed to process the update operation.
`_seq_no` | The sequence number assigned when the document was updated. Used for optimistic concurrency control.
`_primary_term` | The primary term assigned when the document was updated. Used with `_seq_no` for optimistic concurrency control.

## Advanced script examples

The following examples demonstrate advanced scripting capabilities for document updates.

#### Adding items to an array

You can use a script to add items to an array field. The following example adds a gadget to the `gadgets` array (the gadget is added even if it already exists in the list):

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "script": {
    "source": "ctx._source.gadgets.add(params.gadget)",
    "lang": "painless",
    "params": {
      "gadget": "grappling hook"
    }
  }
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "script": {
    "source": "ctx._source.gadgets.add(params.gadget)",
    "lang": "painless",
    "params": {
      "gadget": "grappling hook"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "script": {
      "source": "ctx._source.gadgets.add(params.gadget)",
      "lang": "painless",
      "params": {
        "gadget": "grappling hook"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Removing items from an array

You can use a script to remove items from an array. The Painless `remove` function takes the array index of the element you want to remove. To avoid a runtime error, first check that the item exists. If the list contains duplicate items, this script removes only one occurrence:

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "script": {
    "source": "if (ctx._source.gadgets.contains(params.gadget)) { ctx._source.gadgets.remove(ctx._source.gadgets.indexOf(params.gadget)) }",
    "lang": "painless",
    "params": {
      "gadget": "grappling hook"
    }
  }
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "script": {
    "source": "if (ctx._source.gadgets.contains(params.gadget)) { ctx._source.gadgets.remove(ctx._source.gadgets.indexOf(params.gadget)) }",
    "lang": "painless",
    "params": {
      "gadget": "grappling hook"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "script": {
      "source": "if (ctx._source.gadgets.contains(params.gadget)) { ctx._source.gadgets.remove(ctx._source.gadgets.indexOf(params.gadget)) }",
      "lang": "painless",
      "params": {
        "gadget": "grappling hook"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Adding and removing fields

You can use scripts to add or remove fields from a document. The following example adds a new field:

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "script": "ctx._source.bat_signal_location = 'Gotham City Hall'"
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "script": "ctx._source.bat_signal_location = 'Gotham City Hall'"
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "script": "ctx._source.bat_signal_location = 'Gotham City Hall'"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The following example removes a field:

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "script": "ctx._source.remove('bat_signal_location')"
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "script": "ctx._source.remove('bat_signal_location')"
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "script": "ctx._source.remove('bat_signal_location')"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Changing the operation type

You can use scripts to change the operation that is executed based on document content. The following example deletes the document if the `gadgets` field contains `kryptonite`; otherwise, it performs no operation (`noop`):

<!-- spec_insert_start
component: example_code
rest: POST /sample-index1/_update/1
body: |
{
  "script": {
    "source": "if (ctx._source.gadgets.contains(params.gadget)) { ctx.op = 'delete' } else { ctx.op = 'none' }",
    "lang": "painless",
    "params": {
      "gadget": "kryptonite"
    }
  }
}
-->
{% capture step1_rest %}
POST /sample-index1/_update/1
{
  "script": {
    "source": "if (ctx._source.gadgets.contains(params.gadget)) { ctx.op = 'delete' } else { ctx.op = 'none' }",
    "lang": "painless",
    "params": {
      "gadget": "kryptonite"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.update(
  id = "1",
  index = "sample-index1",
  body =   {
    "script": {
      "source": "if (ctx._source.gadgets.contains(params.gadget)) { ctx.op = 'delete' } else { ctx.op = 'none' }",
      "lang": "painless",
      "params": {
        "gadget": "kryptonite"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Error responses

The following examples show common error responses you may encounter when using the Update Document API.

### Document not found

If you try to update a document that doesn't exist in the index without using the upsert operation, OpenSearch returns a 404 error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "document_missing_exception",
        "reason": "[1]: document missing",
        "index": "sample-index1",
        "shard": "0",
        "index_uuid": "aAsFqTI0Tc2W0LCWgPNrOA"
      }
    ],
    "type": "document_missing_exception",
    "reason": "[1]: document missing",
    "index": "sample-index1",
    "shard": "0",
    "index_uuid": "aAsFqTI0Tc2W0LCWgPNrOA"
  },
  "status": 404
}
```

To avoid this error, use the [upsert operation](#using-the-upsert-operation) to create the document if it doesn't exist.

### Version conflict

If you're using optimistic concurrency control with `if_seq_no` and `if_primary_term` parameters and the document has been modified since you last read it, OpenSearch returns a 409 conflict error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "version_conflict_engine_exception",
        "reason": "[1]: version conflict, required seqNo [3], primary term [1]. current document has seqNo [4] and primary term [1]",
        "index": "sample-index1",
        "shard": "0",
        "index_uuid": "aAsFqTI0Tc2W0LCWgPNrOA"
      }
    ],
    "type": "version_conflict_engine_exception",
    "reason": "[1]: version conflict, required seqNo [3], primary term [1]. current document has seqNo [4] and primary term [1]",
    "index": "sample-index1",
    "shard": "0",
    "index_uuid": "aAsFqTI0Tc2W0LCWgPNrOA"
  },
  "status": 409
}
```

To handle this error, retrieve the latest version of the document and retry the update with the correct `if_seq_no` and `if_primary_term` values, or use the `retry_on_conflict` parameter to automatically retry the operation.

### Script compilation error

If there's an error in your Painless script, OpenSearch returns a 400 error with details about the compilation failure:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "illegal_argument_exception",
        "reason": "failed to execute script"
      }
    ],
    "type": "illegal_argument_exception",
    "reason": "failed to execute script",
    "caused_by": {
      "type": "script_exception",
      "reason": "compile error",
      "script_stack": [
        "ctx._source.value = params.newValue",
        "                         ^---- HERE"
      ],
      "script": "ctx._source.value = params.newValue",
      "lang": "painless",
      "position": {
        "offset": 25,
        "start": 0,
        "end": 34
      },
      "caused_by": {
        "type": "illegal_argument_exception",
        "reason": "cannot resolve symbol [params.newValue]"
      }
    }
  },
  "status": 400
}
```

Review the `script_stack` and `caused_by` fields in the error response to identify and fix the script error.
