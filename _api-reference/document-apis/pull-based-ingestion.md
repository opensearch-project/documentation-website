---
layout: default
title: Pull-based ingestion
parent: Document APIs
has_children: true
nav_order: 90
---

# Pull-based Ingestion API
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
* Configure pull-based ingestion during [index creation](#creating-an-index-for-pull-based-ingestion). You cannot convert an existing push-based index to a pull-based one.

## Creating an index for pull-based ingestion

To ingest data from a streaming source, first create an index with pull-based ingestion settings. The following request creates an index that pulls data from a Kafka topic in the segment replication mode. For other available modes, see [Ingestion modes](#ingestion-modes):

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

The `ingestion_source` parameters control how OpenSearch pulls data from the streaming source. A _poll_ is an operation in which OpenSearch actively requests a batch of data from the streaming source. The following table lists all parameters that `ingestion_source` supports.

| Parameter | Description |
| :--- | :--- |
| `type` | The streaming source type. Required. Valid values are `kafka` or `kinesis`. |
| `pointer.init.reset` | Determines the stream location from which to start reading. Optional. Valid values are `earliest`, `latest`, `reset_by_offset`, `reset_by_timestamp`, or `none`. See [Stream position](#stream-position). |
| `pointer.init.reset.value` | Required only for `reset_by_offset` or `reset_by_timestamp`. Specifies the offset value or timestamp in milliseconds. See [Stream position](#stream-position). |
| `error_strategy` | How to handle failed messages. Optional. Valid values are `DROP` (failed messages are skipped and ingestion continues) and `BLOCK` (when a message fails, ingestion stops). Default is `DROP`. We recommend using `DROP` for the current experimental release. |
| `poll.max_batch_size` | The maximum number of records to retrieve in each poll operation. Optional. |
| `poll.timeout` | The maximum time to wait for data in each poll operation. Optional. |
| `num_processor_threads` | The number of threads for processing ingested data. Optional. Default is 1. |
| `internal_queue_size` | The size of the internal blocking queue for advanced tuning. Valid values are from 1 to 100,000, inclusive. Optional. Default is 100. |
| `all_active` | Whether to enable the all-active ingestion mode. Cannot be enabled for indexes that use segment replication mode. Default is `false`. See [Ingestion modes](#ingestion-modes). |
| `param` | Source-specific configuration parameters. Required. <br>&ensp;&#x2022; The `ingest-kafka` plugin requires:<br>&ensp;&ensp;- `topic`: The Kafka topic to consume from<br>&ensp;&ensp;- `bootstrap_servers`: The Kafka server addresses<br>&ensp;&ensp;Optionally, you can provide additional standard Kafka consumer parameters (such as `fetch.min.bytes`). These parameters are passed directly to the Kafka consumer. <br>&ensp;&#x2022; The `ingest-kinesis` plugin requires:<br>&ensp;&ensp;- `stream`: The Kinesis stream name<br>&ensp;&ensp;- `region`: The AWS Region<br>&ensp;&ensp;- `access_key`: The AWS access key<br>&ensp;&ensp;- `secret_key`: The AWS secret key<br>&ensp;&ensp;Optionally, you can provide an `endpoint_override`. | 


### Ingestion modes

Pull-based ingestion supports the following modes.

#### Segment replication mode

In segment replication mode, the primary shards ingest events from a streaming source and index the documents. The pull-based index is configured to use [segment replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/segment-replication/index/) to copy over the segment files from primary to replica shards, as shown in the following image.

![Pull-based ingestion segment replication mode]({{site.url}}{{site.baseurl}}/images/pull-based-ingestion/pull-based-segrep-mode.png){: width="50%" }

We recommend using this mode with [remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/).
{: .tip}

#### All-active mode

Enabling all-active mode allows both primary and replica shards to independently ingest and index events from the streaming source, as shown in the following image.

![Pull-based ingestion all active mode]({{site.url}}{{site.baseurl}}/images/pull-based-ingestion/pull-based-all-active-mode.png){: width="50%" }

There is no replication or coordination between the shards, although replica shards may fetch segment files from the primary shard during bootstrapping if a local copy is unavailable. This mode is currently not supported with segment replication.

### Stream position

When creating an index, you can specify where OpenSearch should start reading from the stream by configuring the `pointer.init.reset` and `pointer.init.reset.value` settings in the `ingestion_source` parameter. OpenSearch will resume reading from the last commited position for existing indexes.

The following table provides the valid `pointer.init.reset` values and their corresponding `pointer.init.reset.value` values.

| `pointer.init.reset` | Starting ingestion point | `pointer.init.reset.value` | 
| :--- | :--- | :--- | 
| `earliest`           | The beginning of the stream | None | 
| `latest`             | The current end of the stream | None | 
| `reset_by_offset`    | A specific offset in the stream | A positive integer offset. Required. | 
| `reset_by_timestamp` | A specific point in time | A Unix timestamp in milliseconds. Required. <br> For Kafka streams, defaults to Kafka's `auto.offset.reset` policy if no messages are found for the given timestamp. |
| `none`               | The last committed position for existing indexes | None | 

### Stream partitioning

When using partitioned streams (such as Kafka topics or Kinesis shards), note the following relationships between stream partitions and OpenSearch shards:

- OpenSearch shards map one-to-one to stream partitions.
- The number of index shards must be greater than or equal to the number of stream partitions.
- Extra shards beyond the number of partitions remain empty.
- Documents must be sent to the same partition for successful updates.

When using pull-based ingestion, traditional REST API--based ingestion is disabled for the index.
{: .note}

### Updating the error policy

You can use the [Update Settings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/) to dynamically update the error policy by setting `index.ingestion_source.error_strategy` to either `DROP` or `BLOCK`. 

The following example demonstrates how to update the error policy:

<!-- spec_insert_start
component: example_code
rest: PUT /my-index/_settings
body: |
{
  "index.ingestion_source.error_strategy": "DROP"
}
-->
{% capture step1_rest %}
PUT /my-index/_settings
{
  "index.ingestion_source.error_strategy": "DROP"
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_settings(
  index = "my-index",
  body =   {
    "index.ingestion_source.error_strategy": "DROP"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

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
| `_version` | Long | No | A document version number, which must be maintained externally. If provided, OpenSearch drops messages with versions earlier than the current document version. If not provided, no version checking occurs. |
| `_op_type` | String | No | The operation to perform. Valid values are:<br>- `index`: Creates a new document or updates an existing one.<br>- `create`: Creates a new document in append mode. Note that this will not update existing documents. <br>- `delete`: Soft deletes a document. |
| `_source` | Object | Yes | The message payload containing the document data. |

## Pull-based ingestion metrics

Pull-based ingestion provides metrics that can be used to monitor the ingestion process. The `polling_ingest_stats` metric is currently supported and is available at the shard level.

The following table lists the available `polling_ingest_stats` metrics.

| Metric | Description |
| :--- | :--- |
| `message_processor_stats.total_processed_count` | The total number of messages processed by the message processor. |
| `message_processor_stats.total_invalid_message_count` | The number of invalid messages encountered. |
| `message_processor_stats.total_version_conflicts_count` | The number of version conflicts due to which older version messages will be dropped. |
| `message_processor_stats.total_failed_count` | The total number of failed messages, which error out during processing. |
| `message_processor_stats.total_failures_dropped_count` | The total number of failed messages, which are dropped after exhausting retries. Note that messages are only dropped when the DROP error policy is used. |
| `message_processor_stats.total_processor_thread_interrupt_count` | Indicates the number of thread interruptions on the processor thread. |
| `consumer_stats.total_polled_count` | The total number of messages polled from the stream consumer. |
| `consumer_stats.total_consumer_error_count` | The total number of fatal consumer read errors. |
| `consumer_stats.total_poller_message_failure_count` | The total number of failed messages on the poller. |
| `consumer_stats.total_poller_message_dropped_count` | The total number of failed messages on the poller that were dropped. |
| `consumer_stats.total_duplicate_message_skipped_count` | The total number of skipped messages that were previously processed. |
| `consumer_stats.lag_in_millis` | Lag in milliseconds, computed as the time elapsed since the last processed message timestamp. |

To retrieve shard-level pull-based ingestion metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/):

<!-- spec_insert_start
component: example_code
rest: GET /_nodes/stats/indices?level=shards&pretty
-->
{% capture step1_rest %}
GET /_nodes/stats/indices?level=shards&pretty
{% endcapture %}

{% capture step1_python %}


response = client.nodes.info(
  metric = "indices",
  node_id = "stats",
  params = { "level": "shards", "pretty": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Limitations

The following limitations apply when using pull-based ingestion:

* [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/) are not compatible with pull-based ingestion.
* [Dynamic mapping]({{site.url}}{{site.baseurl}}/field-types/) is not supported.
* [Index rollover]({{site.url}}{{site.baseurl}}/api-reference/index-apis/rollover/) is not supported.
* Operation listeners are not supported.