---
layout: default
title: Pull-based Ingestion
nav_order: 50
has_children: false
redirect_from:
  - /opensearch/tuning-your-cluster/pull-based-ingestion
---

# Pull-based ingestion
**Introduced 3.0**
{: .label .label-purple }


Differently from the [RPC-based ingestion](https://opensearch.org/docs/latest/getting-started/ingest-data/), pull-based ingestion is a way to ingest data into OpenSearch from streaming sources such as Kafka and Kinesis. Pull-based ingestion provides exactly-once ingestion semantics and natively handles backpressure, so it allows the user to process the spike traffic smoothly without worrying about overloading the server.

**Note:**
Pull-based ingestion is an experimental feature and not fully ready for production yet.
{: .note}

## Requirements

* Ingestion plugin for respective streaming source needs to be included for using pull-based ingestion. Currently available plugins include **ingestion-kafka** and **ingestion-kinesis**.
* Pull-based ingestion is supported with segment replication and remote store. It does not work with document replication.
* Pull-based ingestion must be specified at the time of index creation. It is not possible to flip a push-based index to use pull-based ingestion.

## Create index with pull-based ingestion

To create a new index with pull-based ingestion, you can use the index creation API. For example, if you have a Kafka topic, you can create the index using the following request.

```json
PUT -H 'Content-Type: application/json' http://localhost:9200/my-index --data ' 
{
  "settings": {
    "ingestion_source": {
      "type": "kafka",
      "pointer.init.reset": "earliest",
      "param": {
        "topic": "test",
        "bootstrap_servers": "localhost:49353"
      }
    },
    "index.number_of_shards": 1,
    "index.number_of_replicas": 1,
    "index": {
      "replication.type": "SEGMENT"
    }

  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "age": {
        "type": "integer"
      }
    }
  }
}'
```
{% include copy-curl.html %}

The setting has the following generic components under ingestion_source:
* **type**: The pull-based ingestion plugin type, currently `kafka` and `kinesis` are supported.
* **pointer.init.reset**: Configuration of initial reset to the pointer in the stream, which can be `earliest`, `latest`, `rewind_by_offset`, `rewind_by_timestamp`, `none`.
* **pointer.init.reset.value**: Only required when the "pointer.init.reset" is set to  `rewind_by_offset` or `rewind_by_timestamp`, this field represents the offset value or timestamp value in milliseconds.
* **error_strategy**: Indicates the error strategy if a message fails to be processed. Currently supported values include `DROP` and `BLOCK`. By default, failed messages will be dropped. Ingestion can be paused on errors using the "BLOCK" strategy.
* **max_batch_size**: Defines the max poll size per batch.
* **poll.timeout**: Defines the poll timeout
* **num_processor_threads**: Defines the number of writer threads. Default value is 1.

Following are implementation specific components under ingestion_source:
* **param**: A map of configurations specific to a plugin. For example, Kafka plugin has the topic and bootstrap_servers, also this param can be used to directly configure Kafka consumers.

Streams can be partitioned. For example, Kafka topic has partitions and Kinesis has shards. In pull-based ingestion, 
the OpenSearch shard has one-to-one mapping to the stream partitions. OpenSearch fails to start if its number of shards 
is less than the streaming partitions; and if its number of shards is more than the streaming partitions, the additional 
shards will be empty. In addition, the documents must be produced to the same partition of the stream for upsert.

Under the pull-based ingestion mode, the push-based REST APIs are disabled and all the ingestion must be through the streaming source.

## Message format

Each message or record published to the streaming source must follow the format below.

Field    | Type   | Required | Description
:--- | :--- | :--- | :---
`_id` | String | No | Unique identifier for a document. It is auto-generated if not provided by the user. This field must be included in order to update or delete a document.
`_version` | Long | No | This field indicates the version of the document. Versions must be maintained externally by the user. If a version is provided, messages with a lower version than that present in the index will be dropped. If a version is not provided, there will be no version checks applied. 
`_op_type` | String | No | Supported values: `index`, `delete` <br>- index: creates a new document, or updates existing one if present in the index. <br>- delete: soft delete a document.
`_source` | Object | Yes | This field contains the message payload.

Examples

```json
{"_id":"1", "_version":"1", "_source":{"name": "alice", "age": 30}, "_op_type": "index"}
{"_id":"2", "_version":"2", "_source":{"name": "alice", "age": 30}, "_op_type": "delete"}
```

## Offset management

When creating an index with pull-based ingestion, you can control where data ingestion begins by configuring the `pointer.init.reset` and `pointer.init.reset.value` fields within the **settings.ingestion_source**. These settings determine the starting point within the stream.

The following table outlines the available options for pointer.init.reset and their corresponding pointer.init.reset.value.

pointer.init.reset | pointer.init.reset.value | Description
:--- | :--- | :---
earliest | N/A | Start the ingestion from the beginning of the stream.
latest | N/A | Start ingestion from the current end of the stream.
rewind_by_offset | Required | Start ingestion from a specific offset, which must be a positive integer value.
rewind_by_timestamp | Required | Start ingestion from a specific Unix timestamp in milliseconds. <br> For Kafka streams, if no messages are found for the given timestamp, it will fall back to Kafka's `auto.offset.reset` policy.

## Management API

Following APIs are supported for managing pull-based ingestion.

### Pause ingestion

This API can be used to pause ingestion for a given index. Ingestion will be paused on all shards for the provided index. This API will update the cluster state to reflect ingestion pause status and also run pause operation on each shard. The response will include request and shard level acknowledgements.

#### Endpoint

```json
POST /<index>/ingestion/_pause
```

#### Path parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
`<index>` | String | The index to pause. Can be a comma-separated list of multiple index names. | Yes

#### Query parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is 30s. | No
timeout | Time | How long to wait for a response from the cluster. Default is 30s. | No

#### Example request

```json
curl -X POST "http://localhost:9200/my-index/ingestion/_pause"
```
{% include copy.html %}

#### Example response

```json
{
    "acknowledged": "true/false",
    "shards_acknowledged": "true/false",
    "error": "error message if any",
    "failures": {
        "indexName": [
            {
                "shard": 0,
                "error": "error message "
            }
        ]
    }
}
```

### Resume ingestion

This API can be used to resume ingestion for a given index. Ingestion will be resumed on all shards for the provided index. This API will update the cluster state to reflect ingestion resume status and also run resume operation on each shard. The response will include request and shard level acknowledgements.

#### Endpoint

```json
POST /<index>/ingestion/_resume
```

#### Path parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
`<index>` | String | The index to resume. Can be a comma-separated list of multiple index names. | Yes

#### Query parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is 30s. | No
timeout | Time | How long to wait for a response from the cluster. Default is 30s. | No

#### Example request

```json
curl -X POST "http://localhost:9200/my-index/ingestion/_resume"
```
{% include copy.html %}

#### Example response

```json
{
  "acknowledged": "true/false",
  "shards_acknowledged": "true/false",
  "error": "error message if any",
  "failures": {
    "indexName": [
      {
        "shard": 0,
        "error": "error message "
      }
    ]
  }
}
```

### Get ingestion state

This API returns the current state of ingestion for the provided index. Optionally, a list of shards can be provided. This API supports pagination.

#### Endpoint

```json
GET /<index>/ingestion/_state
```

#### Path parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
`<index>` | String | The index for which ingestion state needs to be returned. Can be a comma-separated list of multiple index names. | Yes

#### Query parameters

Parameter | Type | Description | Required
:--- | :--- | :--- | :---
timeout | Time | How long to wait for a response from the cluster. Default is 30s. | No

#### Example request

Request with default settings:

```json
curl -X GET "http://localhost:9200/my-index/ingestion/_state"
```
{% include copy.html %}

Request with a page size of 20:

```json
curl -X GET "http://localhost:9200/my-index/ingestion/_state?size=20"
```
{% include copy.html %}

Request with next page token:

```json
curl -X GET "http://localhost:9200/my-index/ingestion/_state?size=20&next_token=<next_page_token>"
```
{% include copy.html %}

#### Example response

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0,
    "failures": [
      {
        "shard": 0,
        "index": "my-index",
        "status": "INTERNAL_SERVER_ERROR",
        "reason": {
          "type": "timeout_exception",
          "reason": "error message"
        }
      }
    ]
  },
  "next_page_token" : "page token if not on last page",
  "ingestion_state": {
    "indexName": [
      {
        "shard": 0,
        "poller_state": "POLLING",
        "error_policy": "DROP",
        "poller_paused": false
      }
    ]
  }
}
```

### Updating error policy

[update_settings API](https://opensearch.org/docs/latest/api-reference/index-apis/update-settings/) can be used to dynamically update the error policy by setting “index.ingestion_source.error_strategy” to either `DROP` or `BLOCK`.

Example request:

```json
curl -X PUT http://localhost:9200/my-index/_settings -H 'Content-Type: application/json' -d '{"index.ingestion_source.error_strategy":"DROP"}'
```
{% include copy.html %}

## Metrics

Pull-based ingestion provides metrics that can be used to monitor the ingestion process. The `polling_ingest_stats` metric is currently supported and is available at the shard level.

The following metrics are currently provided under polling_ingest_stats :
* **message_processor_stats.total_processed_count**: This metric indicates the total number of messages processed by the message processor.
* **consumer_stats.total_polled_count**: This metric indicates the total number of messages polled from the stream consumer.

To retrieve these metrics, you can use the following curl command

```bash
curl -X GET "http://localhost:9200/_nodes/stats/indices?level=shards&pretty"
```
{% include copy.html %}