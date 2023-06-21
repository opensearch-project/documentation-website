---
layout: default
title: Ingest APIs
has_children: true
nav_order: 40
redirect_from:
  - /opensearch/rest-api/ingest-apis/index/
---

# Ingest APIs

OpenSearch ingest APIs simplify the data ingestion process with a standard and structured way to process input data. Particularly, ingest APIs manage tasks for ingest pipelines and processors. Ingest pipelines preprocess and transform data before it's indexed in OpenSearch. A pipeline consists of processors, customizable tasks that run specific changes sequentially on incoming documents. The transformed data is then ingested in your index.

The key fields typically used in a pipeline are `description` and `processors`. The `description` is an optional field that provides a description of the pipeline's purpose or functionality. The `processors` field is an array that defines the sequence of processing stages within the pipeline. The output of one processor becomes the input for the next.

```json
{
  "description" : "...",
  "processors" : [ ... ]
}
```

## OpenSearch ingest processor types

To learn which processors are installed in your version of OpenSearch, run the following command:

```json
curl -X GET "localhost:9200/_nodes/ingest?pretty"
```
{% include copy.html %}

Your response should be similar to the following:

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "opensearch-cluster",
  "nodes" : {
    "i9hLyCxYTqOpa22BcJkKyg" : {
      "name" : "opensearch-node1",
      "transport_address" : "172.18.0.3:9300",
      "host" : "172.18.0.3",
      "ip" : "172.18.0.3",
      "version" : "2.7.0",
      "build_type" : "tar",
      "build_hash" : "b7a6e09e492b1e965d827525f7863b366ef0e304",
      "roles" : [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "ingest" : {
        "processors" : [
          {
            "type" : "append"
          },
          {
            "type" : "bytes"
          },
          {
            "type" : "convert"
          },
          {
            "type" : "csv"
          },
          {
            "type" : "date"
          },
          {
            "type" : "date_index_name"
          },
          {
            "type" : "dissect"
          },
          {
            "type" : "dot_expander"
          },
          {
            "type" : "drop"
          },
          {
            "type" : "fail"
          },
          {
            "type" : "foreach"
          },
          {
            "type" : "geoip"
          },
          {
            "type" : "geojson-feature"
          },
          {
            "type" : "grok"
          },
          {
            "type" : "gsub"
          },
          {
            "type" : "html_strip"
          },
          {
            "type" : "join"
          },
          {
            "type" : "json"
          },
          {
            "type" : "kv"
          },
          {
            "type" : "lowercase"
          },
          {
            "type" : "pipeline"
          },
          {
            "type" : "remove"
          },
          {
            "type" : "rename"
          },
          {
            "type" : "script"
          },
          {
            "type" : "set"
          },
          {
            "type" : "sort"
          },
          {
            "type" : "split"
          },
          {
            "type" : "text_embedding"
          },
          {
            "type" : "trim"
          },
          {
            "type" : "uppercase"
          },
          {
            "type" : "urldecode"
          },
          {
            "type" : "user_agent"
          }
        ]
      }
    }
  }
}
```

## Next steps

- Start with [Ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-pipelines/).
- Learn more about OpenSearch [ingest processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/).
