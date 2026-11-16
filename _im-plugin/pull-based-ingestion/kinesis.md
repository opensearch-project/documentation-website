---
layout: default
title: Kinesis source
parent: Pull-based ingestion
nav_order: 20
---

# Kinesis source for pull-based ingestion
**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The `kinesis` source lets an index consume records from an Amazon Kinesis data stream. Each OpenSearch shard reads from one Kinesis shard. For more information, see [Stream partitioning]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/#stream-partitioning).

## Prerequisites

Before you create an index that uses the Kinesis source, install the `ingestion-kinesis` plugin on every node using `bin/opensearch-plugin install ingestion-kinesis`.

## Creating an index

The following request creates an index that pulls data from a Kinesis stream in the segment replication mode. For other available modes, see [Ingestion modes]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/#ingestion-modes):

```json
PUT /my-index
{
  "settings": {
    "ingestion_source": {
      "type": "kinesis",
      "pointer.init.reset": "earliest",
      "param": {
        "stream": "test",
        "region": "us-east-1",
        "access_key": "<access_key>",
        "secret_key": "<secret_key>"
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
| `stream` | Yes | The Kinesis stream name. |
| `region` | Yes | The AWS Region. |
| `access_key` | Yes | The AWS access key. |
| `secret_key` | Yes | The AWS secret key. |
| `endpoint_override` | No | A custom endpoint for the Kinesis service. |

When you reset a Kinesis consumer by offset, provide a Kinesis sequence number as the offset. For more information, see [Resume Ingestion API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/resume-ingestion/).

## Related documentation

* [Pull-based ingestion]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/)
* [Pull-based ingestion management APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/pull-based-ingestion-management/)
