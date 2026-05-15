---
layout: default
title: Data streams API
parent: Data streams
nav_order: 20
redirect_from:
  - /opensearch/data-streams/
---


## Data streams API

You can use the index and data stream APIs to create and manage data streams, including the following operations:

- [Creating an index template](#creating-an-index-template)
- [Creating a data stream](#creating-a-data-stream)
- [Viewing data streams](#viewing-data-streams)
- [Ingesting data into the data stream](#ingesting-data-into-the-data-stream)
- [Searching a data stream](#searching-a-data-stream)
- [Rolling over a data stream](#rolling-over-a-data-stream)
- [Deleting a data stream](#deleting-a-data-stream)

### Creating an index template

To create an index template for a data stream, specify a data stream in the definition, as follows:


```json
PUT _index_template/logs-template
{
  "index_patterns": [
    "my-data-stream",
    "logs-*"
  ],
  "data_stream": {},
  "priority": 100
}
```

The `data_stream` object indicates that it’s a data stream and not a regular index template.

The index pattern should match the name of the data stream.

A data stream must havew a timestamp type field. By default this field is named `@timestamp`, but you can define a custom timestamp field as a property in the `data_stream` object. You can also add index mappings and other settings here, just as you would for a regular index template, as follows:

```json
PUT _index_template/logs-template-nginx
{
  "index_patterns": "logs-nginx",
  "data_stream": {
    "timestamp_field": {
      "name": "request_time"
    }
  },
  "priority": 200,
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  }
}
```

An index named `logs-nginx` matches both the previously defined `logs-template` and the `logs-template-nginx` template. When an index matches multiple templates, OpenSearch selects the matching index template with the higher priority value, in this case `logs-template-nginx`.

### Creating a data stream

Use the [Data Stream API] to explicitly create a data stream, as in the following example.

```json
PUT _data_stream/logs-redis
PUT _data_stream/logs-nginx
```

The Data Stream API initializes the first backing index.

You can also directly start ingesting data without creating a data stream.

Because there is a matching index template with a data_stream object, OpenSearch automatically creates the data stream:

```json
POST logs-staging/_doc
{
  "message": "login attempt failed",
  "@timestamp": "2013-03-01T00:00:00"
}
```

### Viewing data streams

You can view a [single data stream](#viewing-a-data-stream), [data stream statistics](#viewing-data-stream-statistics), or [all data streams](#viewing-all-data-streams).

#### Viewing a data stream

To see information about a specific data stream, do the following:

```json
GET _data_stream/logs-nginx
```

##### Example response

```json
{
  "data_streams" : [
    {
      "name" : "logs-nginx",
      "timestamp_field" : {
        "name" : "request_time"
      },
      "indices" : [
        {
          "index_name" : ".ds-logs-nginx-000001",
          "index_uuid" : "-VhmuhrQQ6ipYCmBhn6vLw"
        }
      ],
      "generation" : 1,
      "status" : "GREEN",
      "template" : "logs-template-nginx"
    }
  ]
}
```

The API returns the following information:
- The name of the timestamp field
- A list of the backing indexes
- The template that's used to create the data stream.
- The health of the data stream. This is the lowest health status of all its backing indexes.

#### Viewing data stream statistics

To view cluster about the data stream, use the `_stats` endpoint, as follows:

```json
GET _data_stream/logs-nginx/_stats
```

##### Example response

```json
{
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "data_stream_count" : 1,
  "backing_indices" : 1,
  "total_store_size_bytes" : 208,
  "data_streams" : [
    {
      "data_stream" : "logs-nginx",
      "backing_indices" : 1,
      "store_size_bytes" : 208,
      "maximum_timestamp" : 0
    }
  ]
}
```

#### Viewing all data streams

To see information about all data streams, use the following request:

```json
GET _data_stream
```

### Ingesting data into the data stream

To ingest data into a data stream, use the [Index Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/) as follows:

```json
POST logs-redis/_doc
{
  "message": "login attempt",
  "@timestamp": "2013-03-01T00:00:00"
}
```

Make sure every document that you index has a timestamp field. Ingesting a document that doesn't have a timestamp field generates error.
{: .warning}

### Searching a data stream

You can search a data stream just like you search a regular index or an index alias. The search operation applies to all of the backing indexes (all data present in the stream).

To search a data stream do the following:

```json
GET logs-redis/_search
{
  "query": {
    "match": {
      "message": "login"
    }
  }
}
```

#### Example response

```json
{
  "took" : 514,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.2876821,
    "hits" : [
      {
        "_index" : ".ds-logs-redis-000001",
        "_type" : "_doc",
        "_id" : "-rhVmXoBL6BAVWH3mMpC",
        "_score" : 0.2876821,
        "_source" : {
          "message" : "login attempt",
          "@timestamp" : "2013-03-01T00:00:00"
        }
      }
    ]
  }
}
```

### Rolling over a data stream

To perform manual rollover operation on the data stream:

```json
POST logs-redis/_rollover
```

#### Example response

```json
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "old_index" : ".ds-logs-redis-000001",
  "new_index" : ".ds-logs-redis-000002",
  "rolled_over" : true,
  "dry_run" : false,
  "conditions" : { }
}
```

If you now perform a `GET` operation on the `logs-redis` data stream, you see that the generation ID is incremented from 1 to 2.

You can also set up an [Index State Management (ISM) policy]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/) to automate the rollover process for the data stream.
The ISM policy is applied to the backing indexes at the time of their creation. When you associate a policy to a data stream, it only affects the future backing indexes of that data stream.

You also don’t need to provide the `rollover_alias` setting, because the ISM policy infers this information from the backing index.


### Deleting a data stream

The delete operation first deletes the backing indexes of a data stream and then deletes the data stream itself.

To delete a data stream and all of its hidden backing indexes:

```json
DELETE _data_stream/{name_of_data_stream}
```

You can use wildcards to delete more than one data stream.

We recommend deleting data from a data stream using an [ISM policy]({{site.url}}{{site.baseurl}}/im-plugin/ism/).

You can use [asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/index/), [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/), and [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) to query your data stream directly.

You can use the Security plugin to define granular permissions for the data stream name.
