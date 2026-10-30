---
layout: default
title: Helper methods
parent: JavaScript client
nav_order: 2
---

# JavaScript helper methods

JavaScript helper methods simplify the use of complicated API tasks. For complete helper documentation, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides).

## Bulk helper

The bulk helper simplifies making complex bulk API requests. It splits the documents in the data source into batches, sends each batch to the Bulk API, and retries failed operations. Because the `onDocument` function returns the operation for each document, one call can combine `index`, `create`, `update`, and `delete` operations. To send a bulk request body that you construct yourself, use the `client.bulk` method. For more information, see the [Bulk guide](https://github.com/opensearch-project/opensearch-js/blob/main/guides/bulk.md).

### Usage

The following code creates a bulk helper instance:

```javascript
const { Client } = require('@opensearch-project/opensearch')
const documents = require('./docs.json')

const client = new Client({ ... })

const result = await client.helpers.bulk({
  datasource: documents,
  onDocument (doc) {
    return {
      index: { _index: 'example-index' }
    }
  }
})

console.log(result)
```
{% include copy.html %}

Bulk helper operations return an object with the following fields:

```json
{
  total: number,
  failed: number,
  retry: number,
  successful: number,
  noop: number,
  time: number,
  bytes: number,
  aborted: boolean
}
```

### Bulk helper configuration options

When creating a new bulk helper instance, you can use the following configuration options.

| Option | Data type | Required/Default | Description 
| :--- | :--- | :--- | :---
| `datasource` | An array, asynchronous generator, or a readable stream of strings or objects | Required | Represents the documents you need to create, delete, index, or update. 
| `onDocument` | Function | Required | A function to be invoked with each document in the given `datasource`. It returns the operation to be executed for this document. Optionally, the document can be manipulated for `create` and `index` operations by returning a new document as part of the function's result.
| `concurrency` | Integer | Optional. Default is 5. | The number of requests to be executed in parallel. 
| `flushBytes` | Integer |  Optional. Default is 5,000,000. | Maximum bulk body size to send in bytes.
| `flushInterval` | Integer |  Optional. Default is 30,000. | Time in milliseconds to wait before flushing the body after the last document has been read.
| `onDrop` | Function | Optional. Default is `noop`. | A function to be invoked for every document that can’t be indexed after reaching the maximum number of retries. 
| `refreshOnCompletion` | Boolean or string | Optional. Default is `false`. | Whether a refresh should be run at the end of the bulk operation. Set to `true` to refresh all indexes or to an index name to refresh only that index. 
| `retries` | Integer |  Optional. Defaults to the client's  `maxRetries` value. | The number of times an operation is retried before `onDrop` is called for that document.
| `wait` | Integer |  Optional. Default is 5,000. | Time in milliseconds to wait before retrying an operation.

### Examples

The following examples illustrate the index, create, update, and delete bulk helper operations. For more information and advanced index actions, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides) in GitHub.  

#### Index

The index operation creates a new document if it doesn’t exist and recreates the document if it already exists.

The following bulk operation indexes documents into `example-index`:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return {
      index: { _index: 'example-index' }
    }
  }
})
```
{% include copy.html %}

The following bulk operation indexes documents into `example-index` with document overwrite:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return [
      {
        index: { _index: 'example-index' }
      },
      { ...doc, createdAt: new Date().toISOString() }
    ]
  }
})
```
{% include copy.html %}

#### Create

The create operation creates a new document only if the document does not already exist.

The following bulk operation creates documents in the `example-index`:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return {
      create: { _index: 'example-index', _id: doc.id }
    }
  }
})
```
{% include copy.html %}

The following bulk operation creates documents in the `example-index` with document overwrite:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return [
      {
        create: { _index: 'example-index', _id: doc.id }
      },
      { ...doc, createdAt: new Date().toISOString() }
    ]
  }
})
```
{% include copy.html %}

#### Update

The update operation updates the document with the fields being sent. The document must already exist in the index.

The following bulk operation updates documents in `example-index`:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    // The update operation always requires a tuple to be returned, with the
    // first element being the action and the second being the update options.
    return [
      {
        update: { _index: 'example-index', _id: doc.id }
      },
      { doc_as_upsert: true }
    ]
  }
})
```
{% include copy.html %}

The following bulk operation updates documents in `example-index` with document overwrite:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return [
      {
        update: { _index: 'example-index', _id: doc.id }
      },
      {
        doc: { ...doc, createdAt: new Date().toISOString() },
        doc_as_upsert: true
      }
    ]
  }
})
```
{% include copy.html %}

#### Delete

The delete operation deletes a document.

The following bulk operation deletes documents from the `example-index`:

```javascript
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return {
      delete: { _index: 'example-index', _id: doc.id }
    }
  }
})
```
{% include copy.html %}

## Related documentation

- For more helper documentation, such as that for indexing and multi-search, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides).
- For complete sample applications, see the [`opensearch-js` samples](https://github.com/opensearch-project/opensearch-js/tree/main/samples).
