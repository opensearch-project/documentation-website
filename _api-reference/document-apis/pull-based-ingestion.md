---
layout: default
title: Pull-based ingestion
parent: Document APIs
has_children: true
nav_order: 60
---

# Pull-based ingestion
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Pull-based ingestion enables OpenSearch to ingest data from streaming sources such as Apache Kafka or Amazon Kinesis. Unlike traditional ingestion methods where clients actively push data to OpenSearch through REST APIs, pull-based ingestion allows OpenSearch to control the data flow by retrieving data directly from streaming sources. This approach provides exactly-once ingestion semantics and native backpressure handling, helping prevent server overload during traffic spikes.

## Prerequisites

Before using pull-based ingestion, ensure that the following prerequisites are met:

* Install an ingestion plugin for your streaming source using the command `bin/opensearch-plugin install <plugin-name>`. For more information, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/index/). OpenSearch supports the following ingestion plugins: 
  - `ingestion-kafka`
  - `ingestion-kinesis`
* Enable [segment replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/index/) with [remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/). Pull-based ingestion is not compatible with document replication.
* Configure pull-based ingestion during [index creation](#creating-an-index-for-pull-based-ingestion). You cannot convert an existing push-based index to a pull-based one.

## Creating an index for pull-based ingestion

To ingest data from a streaming source, first create an index with pull-based ingestion settings. The following request creates an index that pulls data from a Kafka topic:

```json
PUT /my-index
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
}
```
{% include copy-curl.html %}

### Ingestion source parameters

The `ingestion_source` parameters control how OpenSearch pulls data from the streaming source. A _poll_ is an operation in which OpenSearch actively requests a batch of data from the streaming source. The following table lists all parameters `ingestion_source` supports.

| Parameter | Description |
| :--- | :--- |
| `type` | The streaming source type. Required. Valid values are `kafka` or `kinesis`. |
| `pointer.init.reset` | Determines where to start reading from the stream. Optional. Valid values are `earliest`, `latest`, `rewind_by_offset`, `rewind_by_timestamp`, or `none`. See [Stream position](#stream-position). |
| `pointer.init.reset.value` | Required only for `rewind_by_offset` or `rewind_by_timestamp`. Specifies the offset value or timestamp in milliseconds. See [Stream position](#stream-position). |
| `error_strategy` | How to handle failed messages. Optional. Valid values are `DROP` (failed messages are skipped and ingestion continues) and `BLOCK` (when a message fails, ingestion stops). Default is `DROP`. We recommend using `DROP` for the current experimental release. |
| `max_batch_size` | The maximum number of records to retrieve in each poll operation. Optional. |
| `poll.timeout` | The maximum time to wait for data in each poll operation. Optional. |
| `num_processor_threads` | The number of threads for processing ingested data. Optional. Default is 1. |
| `param` | Source-specific configuration parameters. Required. <br>&ensp;&#x2022; The `ingest-kafka` plugin requires `topic` and `bootstrap_servers`. You can optionally provide additional Kafka configurations such as `fetch.min.bytes`.<br>&ensp;&#x2022; The `ingest-kinesis` plugin requires `stream`, `region`, `access_key` and `secret_key`. You can optionally provide `endpoint_override`. |

### Stream position

When creating an index, you can specify where OpenSearch should start reading from the stream by configuring the `pointer.init.reset` and `pointer.init.reset.value` settings in the `ingestion_source` parameter. OpenSearch will resume reading from the last commited position for existing indexes.

The following table provides the `pointer.init.reset` valid values and their corresponding `pointer.init.reset.value` values.

| `pointer.init.reset` | Starting ingestion point | `pointer.init.reset.value` | 
| :--- | :--- | :--- | 
| `earliest` | Beginning of stream | None | 
| `latest` | Current end of stream | None | 
| `rewind_by_offset` | Specific offset in the stream | A positive integer offset. Required. | 
| `rewind_by_timestamp` | Specific point in time | A Unix timestamp in milliseconds. Required. <br> For Kafka streams, , defaults to Kafka's `auto.offset.reset` policy if no messages are found for the given timestamp. |
| `none` | Last commited position for existing indexes | None | 

### Stream partitioning

When using partitioned streams (such as Kafka topics or Kinesis shards), note the following relationships between stream partitions and OpenSearch shards:

- OpenSearch shards map one-to-one to stream partitions.
- The number of index shards must be greater than or equal to the number of stream partitions.
- Extra shards beyond the number of partitions remain empty.
- Documents must be sent to the same partition for successful updates.

When using pull-based ingestion, traditional REST API-based ingestion is disabled for the index.
{: .note}

### Updating the error policy

You can use the [Update Settings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/) to dynamically update the error policy by setting `index.ingestion_source.error_strategy` to either `DROP` or `BLOCK`. 

The following example shows how to update the error policy:

```json
PUT /my-index/_settings
{
  "index.ingestion_source.error_strategy": "DROP"
}
```
{% include copy-curl.html %}

## Message format

To be correctly processed by OpenSearch, messages in the streaming source must have the following format:

```json
{"_id":"1", "_version":"1", "_source":{"name": "alice", "age": 30}, "_op_type": "index"}
{"_id":"2", "_version":"2", "_source":{"name": "alice", "age": 30}, "_op_type": "delete"}
```

Each data unit in the streaming source (Kafka message or Kinesis record) must include the following fields that specify how to create or modify an OpenSearch document.

| Field | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | String | No | A unique identifier for a document. If not provided, OpenSearch auto-generates an ID. Required for document updates or deletions. |
| `_version` | Long | No | A document version number, which must be maintained externally. If provided, OpenSearch drops messages with versions lower than the current document version. If not provided, no version checking occurs. |
| `_op_type` | String | No | The operation to perform. Valid values are:<br>- `index`: Creates a new document or updates an existing one<br>- `delete`: Soft deletes a document |
| `_source` | Object | Yes | The message payload containing the document data. |

## Pull-based ingestion metrics

Pull-based ingestion provides metrics that can be used to monitor the ingestion process. The `polling_ingest_stats` metric is currently supported and is available at the shard level.

The following table lists the available `polling_ingest_stats` metrics.

| Metric | Description |
| :--- | :--- |
| `message_processor_stats.total_processed_count` | The total number of messages processed by the message processor. |
| `consumer_stats.total_polled_count` | The total number of messages polled from the stream consumer. |

To retrieve shard-level pull-based ingestion metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/):

```json
GET /_nodes/stats/indices?level=shards&pretty
```
{% include copy-curl.html %}
```