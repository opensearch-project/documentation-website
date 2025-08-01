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


You cannot explicitly specify an ingest pipeline when calling the Update Document API. If a `default_pipeline` or `final_pipeline` is defined in your index, the following behavior applies:

- **Upsert operations**: When indexing a new document, the `default_pipeline` and `final_pipeline` defined in the index are executed as specified.  
- **Update operations**: When updating an existing document, ingest pipeline execution is not recommended because it may produce erroneous results. Support for running ingest pipelines during update operations is deprecated and will be removed in version 3.0.0. If your index has a defined ingest pipeline, the update document operation will return the following deprecation warning: 
```
the index [sample-index1] has a default ingest pipeline or a final ingest pipeline, the support of the ingest pipelines for update operation causes unexpected result and will be removed in 3.0.0
```

## Endpoints

```json
POST /<index>/_update/<_id>
```

## Path parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
&lt;index&gt; | String | Name of the index. | Yes
&lt;_id&gt; | String | The ID of the document to update. | Yes

## Query parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
if_seq_no | Integer | Only perform the update operation if the document has the specified sequence number. | No
if_primary_term | Integer | Perform the update operation if the document has the specified primary term. | No
lang | String | Language of the script. Default is `painless`. | No
require_alias | Boolean | Specifies whether the destination must be an index alias. Default is `false`. | No
refresh | Enum | If true, OpenSearch refreshes shards to make the operation visible to searching. Valid options are `true`, `false`, and `wait_for`, which tells OpenSearch to wait for a refresh before executing the operation. Default is `false`. | No
retry_on_conflict | Integer | The amount of times OpenSearch should retry the operation if there's a document conflict. Default is 0. | No
routing | String | Value to route the update operation to a specific shard. | No
_source | Boolean or List | Whether or not to include the `_source` field in the response body. Default is `false`. This parameter also supports a comma-separated list of source fields for including multiple source fields in the query response. | No
_source_excludes | List | A comma-separated list of source fields to exclude in the query response. | No
_source_includes | List | A comma-separated list of source fields to include in the query response. | No
timeout | Time | How long to wait for a response from the cluster. | No
wait_for_active_shards | String | The number of active shards that must be available before OpenSearch processes the update request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the operation to succeed. | No

## Request body fields

Your request body must contain the information with which you want to update your document. If you only want to replace certain fields in your document, your request body must include a `doc` object containing the fields that you want to update:

```json
{
  "doc": {
    "first_name": "Thomas",
    "last_name": "Wayne"
    }
}
```

You can also use a script to tell OpenSearch how to update your document:

```json
{
  "script" : {
    "source": "ctx._source.oldValue += params.newValue",
    "lang": "painless",
    "params" : {
      "newValue" : 10
    }
  }
}
```

## Example requests

### Update a document

```json
POST /sample-index1/_update/1
{
  "doc": {
    "first_name" : "Bruce",
    "last_name" : "Wayne"
  }
}
```
{% include copy-curl.html %}

### Update a document with a script 

```json
POST /test-index1/_update/1
{
  "script" : {
    "source": "ctx._source.secret_identity = \"Batman\""
  }
}
```
{% include copy-curl.html %}


### Using the upsert operation

Upsert is an operation that conditionally either updates an existing document or inserts a new one based on information in the request. This is useful when you're not sure if a document already exists and want to ensure the correct content is present either way.

In the following example, the `upsert` operation updates the `first_name` and `last_name` fields if a document already exists. If a document does not exist, a new one is indexed using content in the `upsert` object.

```json
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
```
{% include copy-curl.html %}

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

You can also add `doc_as_upsert` to the request and set it to `true` to use the information in the `doc` field for performing the upsert operation:

```json
POST /sample-index1/_update/1
{
  "doc": {
    "first_name": "Martha",
    "last_name": "Oliveira",
    "age": "31"
  },
  "doc_as_upsert": true
}
```
{% include copy-curl.html %}

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

You can also use a script to control how the document is updated. By setting the `scripted_upsert` parameter to `true`, you instruct OpenSearch to use the script even when the document doesn't exist yet. This allows you to define the entire upsert logic in the script.

In the following example, the script sets the document to contain specific fields regardless of whether it previously existed:

```json
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
```
{% include copy-curl.html %}

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

Field | Description
:--- | :---
_index | The name of the index.
_id | The document's ID.
_version | The document's version.
result | The result of the update operation.
_shards | Detailed information about the cluster's shards.
total | The total number of shards.
successful | The number of shards OpenSearch successfully updated the document in.
failed | The number of shards OpenSearch failed to update the document in.
_seq_no | The sequence number assigned when the document was indexed.
_primary_term | The primary term assigned when the document was indexed.
