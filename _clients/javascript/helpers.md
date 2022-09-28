---
layout: default
title: Helpers
parent: JavaScript client
nav_order: 2
---

# Helpers

This section is currently incomplete. It does not yet cover all helper methods and is missing documentation of various helper options.
{: .warning }

## Bulk helper

Running bulk requests can be complex due to the shape of the API, this helper aims to provide a nicer developer experience around the Bulk API.

### Usage

```
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
// {
//   total: number,
//   failed: number,
//   retry: number,
//   successful: number,
//   time: number,
//   bytes: number,
//   aborted: boolean
// }
```

To create a new instance of the Bulk helper, access it as shown in the example above, the configuration options are:

| Option                | Description                                                                                                                                                                                                                                                                                 |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `concurrency`         | Number of requests to be executed in parallel. _Default: 5_                                                                                                                                                                                                                                 |
| `datasource`          | **Required.** An array, async generator or a readable stream of strings or objects representing the documents you need to create, delete, index or update.                                                                                                                                  |
| `flushBytes`          | Maximum bulk body size to send in bytes. _Default: 5000000_                                                                                                                                                                                                                                 |
| `flushInterval`       | Milliseconds to wait before flushing the body after the last document has been read. _Default: 30000_                                                                                                                                                                                       |
| `onDocument`          | **Required.** A function to be invoked with each document in the given `datasource`. It returns the operation to be executed for this document. Optionally the document can be manipulated for `create` and `index` operations by returning a new document as part of the functions result. |
| `onDrop`              | A function to be invoked for every document that can’t be indexed after reaching the maximum amount of retries.                                                                                                                                                                             |
| `refreshOnCompletion` | Whether a refresh should be run on all affected indices at the end of the bulk operation. _Default: alse_                                                                                                                                                                                   |
| `retries`             | Number of times an operation is retried before `onDrop` is called for that document. _Default: Client `maxRetries`_                                                                                                                                                                         |
| `wait`                | Milliseconds to wait before retrying an operation. _Default: 5000_                                                                                                                                                                                                                          |

### Examples

#### Index

```
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return {
      index: { _index: 'example-index' }
    }
  }
})
```

#### Index with document overwrite

```
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

#### Create

```
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return {
      create: { _index: 'example-index', _id: doc.id }
    }
  }
})
```

#### Create with document overwrite

```
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

#### Update

```
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

#### Update with document overwrite

```
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

#### Delete

```
client.helpers.bulk({
  datasource: arrayOfDocuments,
  onDocument (doc) {
    return {
      delete: { _index: 'example-index', _id: doc.id }
    }
  }
})
```
