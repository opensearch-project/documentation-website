---
layout: default
title: Reindex data
nav_order: 15
redirect_from:
  - /opensearch/reindex-data/
---

# Reindex data

After creating an index, you might need to make an extensive change such as adding a new field to every document or combining multiple indexes to form a new one. Rather than deleting your index, making the change offline, and then indexing your data again, you can use the `reindex` operation.

With the `reindex` operation, you can copy all or a subset of documents that you select through a query to another index. Reindex is a `POST` operation. In its most basic form, you specify a source index and a destination index.

Reindexing can be an expensive operation depending on the size of your source index. We recommend you disable replicas in your destination index by setting `number_of_replicas` to `0` and re-enable them once the reindex process is complete.
{: .note }

---

#### Table of contents
1. TOC
{:toc}


---

## Reindex all documents

You can copy all documents from one index to another.

You first need to create a destination index with your desired field mappings and settings or you can copy the ones from your source index:

```json
PUT destination
{
   "mappings":{
      "Add in your desired mappings"
   },
   "settings":{
      "Add in your desired settings"
   }
}
```

This `reindex` command copies all the documents from a source index to a destination index:

```json
POST _reindex
{
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination"
   }
}
```

If the destination index is not already created, the `reindex` operation creates a new destination index with default configurations.

## Reindex from a remote cluster

You can copy documents from an index in a remote cluster. Use the `remote` option to specify the remote hostname and the required login credentials.

This command reaches out to a remote cluster, logs in with the username and password, and copies all the documents from the source index in that remote cluster to the destination index in your local cluster:

```json
POST _reindex
{
   "source":{
      "remote":{
         "host":"https://<REST_endpoint_of_remote_cluster>:9200",
         "username":"YOUR_USERNAME",
         "password":"YOUR_PASSWORD"
      },
      "index": "source"
   },
   "dest":{
      "index":"destination"
   }
}
```

You can specify the following options:

Options | Valid values | Description | Required
:--- | :--- | :---
`host` | String | The REST endpoint of the remote cluster. | Yes
`username` | String | The username to log into the remote cluster. | No
`password` | String | The password to log into the remote cluster. | No
`socket_timeout` | Time Unit | The wait time for socket reads (default 30s). | No
`connect_timeout` | Time Unit | The wait time for remote connection timeouts (default 30s). | No


## Reindex a subset of documents

You can copy a specific set of documents that match a search query.

This command copies only a subset of documents matched by a query operation to the destination index:

```json
POST _reindex
{
   "source":{
      "index":"source",
      "query": {
        "match": {
           "field_name": "text"
         }
      }
   },
   "dest":{
      "index":"destination"
   }
}
```

For a list of all query operations, see [Full-text queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index).

## Combine one or more indexes

You can combine documents from one or more indexes by adding the source indexes as a list.

This command copies all documents from two source indexes to one destination index:

```json
POST _reindex
{
   "source":{
      "index":[
         "source_1",
         "source_2"
      ]
   },
   "dest":{
      "index":"destination"
   }
}
```
Make sure the number of shards for your source and destination indexes is the same.

## Reindex only unique documents

You can copy only documents missing from a destination index by setting the `op_type` option to `create`.
In this case, if a document with the same ID already exists, the operation ignores the one from the source index.
To ignore all version conflicts of documents, set the `conflicts` option to `proceed`.

```json
POST _reindex
{
   "conflicts":"proceed",
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination",
      "op_type":"create"
   }
}
```

## Transform documents during reindexing

You can transform your data during the reindexing process using the `script` option.
We recommend Painless for scripting in OpenSearch.

This command runs the source index through a Painless script that increments a `number` field inside an `account` object before copying it to the destination index:

```json
POST _reindex
{
   "source":{
      "index":"source"
   },
   "dest":{
      "index":"destination"
   },
   "script":{
      "lang":"painless",
      "source":"ctx._account.number++"
   }
}
```

You can also specify an ingest pipeline to transform your data during the reindexing process.

You would first have to create a pipeline with `processors` defined. You have a number of different `processors` available to use in your ingest pipeline.

Here's a sample ingest pipeline that defines a `split` processor that splits a `text` field based on a `space` separator and stores it in a new `word` field. The `script` processor is a Painless script that finds the length of the `word` field and stores it in a new `word_count` field. The `remove` processor removes the `test` field.

```json
PUT _ingest/pipeline/pipeline-test
{
"description": "Splits the text field into a list. Computes the length of the 'word' field and stores it in a new 'word_count' field. Removes the 'test' field.",
"processors": [
 {
   "split": {
     "field": "text",
     "separator": "\\s+",
     "target_field": "word"
   },
 }
 {
   "script": {
     "lang": "painless",
     "source": "ctx.word_count = ctx.word.length"
   }
 },
 {
   "remove": {
     "field": "test"
   }
 }
]
}
```

After creating a pipeline, you can use the `reindex` operation:

```json
POST _reindex
{
  "source": {
    "index": "source",
  },
  "dest": {
    "index": "destination",
    "pipeline": "pipeline-test"
  }
}
```

## Update documents in the current index

To update the data in your current index itself without copying it to a different index, use the `update_by_query` operation.

The `update_by_query` operation is `POST` operation that you can perform on a single index at a time.

```json
POST <index_name>/_update_by_query
```

If you run this command with no parameters, it increments the version number for all documents in the index.

## Source index options

You can specify the following options for your source index:

Option | Valid values | Description | Required
:--- | :--- | :---
`index` | String | The name of the source index. You can provide multiple source indexes as a list. | Yes
`max_docs` | Integer | The maximum number of documents to reindex. | No
`query` | Object | The search query to use for the reindex operation. | No
`size` | Integer | The number of documents to reindex. | No
`slice` | String | Specify manual or automatic slicing to parallelize reindexing. | No

## Destination index options

You can specify the following options for your destination index:

Option | Valid values | Description | Required
:--- | :--- | :---
`index` | String | The name of the destination index. | Yes
`version_type` | Enum | The version type for the indexing operation. Valid values: internal, external, external_gt, external_gte. | No

## Index codec considerations

For index codec considerations, see [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/#reindexing).
