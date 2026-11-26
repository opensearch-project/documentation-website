---
layout: default
title: Kafka source
parent: Pull-based ingestion
nav_order: 10
---

# Kafka source for pull-based ingestion
**Introduced 3.0**
{: .label .label-purple }

The `kafka` source lets an index consume messages from an Apache Kafka topic. Each OpenSearch shard reads from one partition of the topic. For more information, see [Stream partitioning]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/#stream-partitioning).

## Prerequisites

Before you create an index that uses the Kafka source, install the `ingestion-kafka` plugin on every node using `bin/opensearch-plugin install ingestion-kafka`.

## Creating an index

The following request creates an index that pulls data from a Kafka topic in the segment replication mode. For other available modes, see [Ingestion modes]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/#ingestion-modes):

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

For all `ingestion_source` settings, see [Ingestion source settings]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/#ingestion-source-settings).

## Source parameters

The following table lists the source parameters. Specify them in the `param` object of `ingestion_source`.

| Parameter | Required | Description |
| :--- | :--- | :--- |
| `topic` | Yes | The Kafka topic to consume from. |
| `bootstrap_servers` | Yes | The Kafka server addresses. |

Optionally, you can provide additional standard Kafka consumer parameters (such as `fetch.min.bytes`). These parameters are passed directly to the Kafka consumer.

## Related documentation

* [Pull-based ingestion]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/)
* [Pull-based ingestion management APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/pull-based-ingestion-management/)
