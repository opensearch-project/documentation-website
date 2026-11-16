---
layout: default
title: Ingest pipelines
nav_order: 5
nav_exclude: true
has_toc: true
permalink: /ingest-pipelines/
redirect_from:
   - /api-reference/ingest-apis/ingest-pipelines/
   - /ingest-pipelines/index/
---

# Ingest pipelines

An _ingest pipeline_ is a sequence of [processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/) that are applied to documents as they are ingested into an index. Each processor performs a specific task, such as filtering, transforming, or enriching data. Processors run in the order in which they're listed, and each processor receives the output of the previous one. The modified documents appear in your index after all processors run.

For example, a web server log line such as `203.0.113.24 GET /cart/checkout 200` arrives as a single string. A pipeline can split it into separate `client_ip`, `method`, `path`, and `status` fields so that you can search, filter, and aggregate on each one. The [example](#example-parsing-web-server-logs) on this page builds this pipeline.

## Ingest pipelines compared to Data Prepper

Ingest pipelines run on the nodes of your OpenSearch cluster and process each document as it's indexed. [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) runs as a separate service outside the cluster and sends processed data to OpenSearch.

Use ingest pipelines for lightweight transformations of individual documents, such as parsing fields or generating vector embeddings using a model registered in OpenSearch. Use Data Prepper for large data volumes, data from multiple sources, or processing that spans multiple documents, such as aggregating events. Moving processing to Data Prepper also removes the processing load from your cluster.

## Prerequisites 

The following are prerequisites for using ingest pipelines:

- At least one node with the `ingest` role. By default, every node has this role, so no setup is required.
- If the OpenSearch Security plugin is enabled, you must have permissions to manage ingest pipelines, for example, through the `cluster_manage_pipelines` action group. For more information, see [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/#required-permissions).

In a production environment, you can dedicate specific nodes to ingest processing by assigning the `ingest` role only to those nodes in the `node.roles` setting. For more information, see [Cluster formation]({{site.url}}{{site.baseurl}}/tuning-your-cluster/creating-a-cluster/).
{: .tip}

## Defining a pipeline

To define a pipeline, list the processors to run in the `processors` array, in the order in which they should run. Optionally, describe the pipeline in the `description` field.

Each processor is an object whose key is the processor type and whose value contains the processor's parameters. The following pipeline definition contains two processors. The `lowercase` processor converts the `category` field to lowercase, and then the `set` processor adds an `in_stock` field with the value `true`:

```json
{
  "description": "Normalizes product data",
  "processors": [
    {
      "lowercase": {
        "field": "category"
      }
    },
    {
      "set": {
        "field": "in_stock",
        "value": true
      }
    }
  ]
}
```

Each processor type has its own parameters. For the parameters of each processor, see [Ingest processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/).

A pipeline definition can also include the following optional fields:

- `version`: A version number that you can use to track changes to the pipeline. For more information, see [Pipeline versioning]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#pipeline-versioning).
- `on_failure`: Processors to run if a processor in the pipeline fails and doesn't handle the failure itself. For more information, see [Handling failures at the pipeline level]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/#handling-failures-at-the-pipeline-level).

## Example: Parsing web server logs

The following example creates a pipeline that parses web server log lines into separate fields, tests it, and then uses it to index a document.

Create a pipeline named `parse-web-logs`. The `dissect` processor splits the `message` field into four fields, the `convert` processor changes `status` to an integer, and the `remove` processor deletes the original `message` field. In the `dissect` pattern, each `%{name}` captures the text up to the next space and stores it in a field with that name:

```json
PUT _ingest/pipeline/parse-web-logs
{
  "description": "Parses web server log lines",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "%{client_ip} %{method} %{path} %{status}"
      }
    },
    {
      "convert": {
        "field": "status",
        "type": "integer"
      }
    },
    {
      "remove": {
        "field": "message"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test the pipeline on a sample document without indexing it:

```json
POST _ingest/pipeline/parse-web-logs/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "203.0.113.24 GET /cart/checkout 200"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows the document as it would be indexed. The `message` field is gone, the log line is split into four fields, and `status` is now the number `200` instead of a string:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "path": "/cart/checkout",
          "client_ip": "203.0.113.24",
          "method": "GET",
          "status": 200
        },
        "_ingest": {
          "timestamp": "2026-10-14T21:15:18.025620512Z"
        }
      }
    }
  ]
}
```

### Applying a pipeline to documents

To process a document using a pipeline, specify the pipeline ID in the `pipeline` query parameter of an indexing request. The [Index Document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/), [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/), and [Update by Query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/) APIs support this parameter. For the [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) API, specify the pipeline in the `dest.pipeline` request body field.

The following request indexes a document using the `parse-web-logs` pipeline:

```json
PUT web-logs/_doc/1?pipeline=parse-web-logs
{
  "message": "203.0.113.24 GET /cart/checkout 200"
}
```
{% include copy-curl.html %}

To verify the result, retrieve the document:

```json
GET web-logs/_doc/1
```
{% include copy-curl.html %}

The stored document contains the parsed fields:

```json
{
  "_index": "web-logs",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "path": "/cart/checkout",
    "method": "GET",
    "client_ip": "203.0.113.24",
    "status": 200
  }
}
```

You can also configure pipelines that run automatically for every document in an index, using the following index settings:

- `index.default_pipeline`: The pipeline that runs if the indexing request doesn't specify a `pipeline` parameter. To skip the default pipeline for a request, set `pipeline` to `_none`.
- `index.final_pipeline`: The pipeline that runs after the request pipeline or default pipeline. The final pipeline always runs, even if the request sets `pipeline` to `_none`. Use a final pipeline for processing that every document must receive, such as adding an ingest timestamp, regardless of which pipeline the request specifies. A final pipeline can't change the document's target index; if it changes `_index`, the document fails.

To try the final pipeline setting, first create a pipeline named `add-ingest-time` that records when each document was ingested. The {% raw %}`{{_ingest.timestamp}}`{% endraw %} template inserts the time at which OpenSearch received the document. For more information about templates and metadata, see [Access data in a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/accessing-data/):

```json
PUT _ingest/pipeline/add-ingest-time
{
  "processors": [
    {
      "set": {
        "field": "ingested_at",
        "value": "{% raw %}{{_ingest.timestamp}}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following request creates an index named `web-logs-v2` that runs the `parse-web-logs` pipeline by default and the `add-ingest-time` pipeline for every document:

```json
PUT web-logs-v2
{
  "settings": {
    "index.default_pipeline": "parse-web-logs",
    "index.final_pipeline": "add-ingest-time"
  }
}
```
{% include copy-curl.html %}

For more information about these settings, see [Dynamic index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-settings).

## Common uses for ingest pipelines

The following table lists common tasks and the processors that perform them. For a complete list, see [Ingest processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/).

Task | Processors
:--- | :---
Parse log lines and other unstructured text into fields | [`grok`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/grok/), [`dissect`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/dissect/), [`kv`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/kv/), [`csv`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/csv/)
Add, rename, copy, or remove fields | [`set`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/set/), [`rename`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/rename/), [`copy`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/copy/), [`remove`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/remove/)
Convert data types and formats | [`convert`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/convert/), [`date`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/date/), [`json`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/json/), [`bytes`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/bytes/)
Generate vector embeddings for semantic search | [`text_embedding`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-embedding/), [`sparse_encoding`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/sparse-encoding/), [`text_image_embedding`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-image-embedding/)
Add geographic information based on IP addresses | [`ip2geo`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ip2geo/)
Drop documents or route them to a different index | [`drop`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/drop/), [`date_index_name`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/date-index-name/), [`set`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/set/) (on the `_index` field)
Apply custom logic | [`script`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/script/)

## Storing pipelines

OpenSearch stores pipeline definitions in the cluster state. A snapshot includes them when you take it with `include_global_state` set to `true`. For more information, see [Global cluster state]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#global-cluster-state).

## Ingest pipeline APIs

OpenSearch supports the following ingest pipeline APIs:

- [Create a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/)
- [Test a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/)
- [Retrieve information about a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/get-ingest/)
- [Delete a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/delete-ingest/)

## Related documentation

- [Use ingest processors in OpenSearch]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/)
- [Access document fields and metadata in a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/accessing-data/)
- [Run processors conditionally]({{site.url}}{{site.baseurl}}/ingest-pipelines/conditional-execution/)
- [Handle pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/)
