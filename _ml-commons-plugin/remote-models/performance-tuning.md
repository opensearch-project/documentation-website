---
layout: default
title: Performance tuning
has_children: false
nav_order: 85
parent: Connecting to externally hosted models
grand_parent: Integrating ML models
---

# Performance tuning

**Introduced 3.9**
{: .label .label-purple }

## Limitation

Currently, these performance tuning techniques work only for externally hosted models whose [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) accepts text-document (`text_docs`) input and produces one result for each input text in the same order. A model configured with the `batch_inference_config` parameter rejects prediction requests that use another input type.

Also, note that for direct [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) calls to a remote model, the endpoint, including `{algorithm_name}` and `{model_id}`, and all request body fields except `text_docs` must be the same for the requests to be sent in a batch.

## Size-based splitting

### When to use size-based splitting

Use size-based splitting when the texts in one prediction request can exceed the model endpoint's item-count or item-size limit. This pattern is common during bulk ingest, where an [ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/) can send many documents in one prediction request.

### Choose the size limits

During [model registration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/), add [`batch_inference_config`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-batch_inference_config-parameter) and set at least one size limit. Without `batch_inference_config`, OpenSearch sends the original prediction request directly to the connector. Use the [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/) to identify the provider and exact model used by the connector. Obtain the limits from the provider's official documentation for the exact model and version, or from the model server configuration for a custom endpoint.

| Parameter | Description |
|:---|:---|
| `max_items_per_request` | The maximum number of items in one remote model call. The default value is `-1`, which disables the item-count limit. |
| `max_bytes_per_request` | The maximum combined size, in bytes, of the items in a single remote model call. This does not account for the connector request envelope and other request fields, which add to the total bytes sent to the model. For this reason, the value should be set lower than the model's actual limit to leave room for that auxiliary data. The default value is `-1`, which disables the text-size limit. |

For text-document (`text_docs`) input, OpenSearch measures each item's UTF-8 byte length. The `batch_inference_config` settings can be changed later using the [Update Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/update-model/).

### How size-based splitting works

OpenSearch evaluates the items from one prediction request in their original order and builds one or more sub-batches. Each sub-batch becomes one remote call. Before adding the next item to the current sub-batch, OpenSearch checks both enabled limits:

- `max_items_per_request` limits the number of items.
- `max_bytes_per_request` limits the combined size of the items in bytes.

If adding the next item would exceed either limit, OpenSearch starts a new sub-batch. A value exactly equal to a limit is allowed. For example, consider the following configuration and input sizes:

```text
max_items_per_request = 3
max_bytes_per_request = 10
input sizes in bytes = [4, 3, 5, 2]
```

OpenSearch creates the following remote calls:

```text
Call 1: [4, 3]
Call 2: [5, 2]
```

Adding the 5-byte item to the first call would produce 12 bytes, so it starts the second call. Both calls also remain within the three-item limit.

If the original request already fits within the limits, OpenSearch sends it as a single remote call. If an individual item is larger than max_bytes_per_request, OpenSearch places that item in a call unchanged, and the remote endpoint might reject it.

### Configure size-based splitting for ingest

#### Step 1: Register the ingest model

Register an externally hosted model and add `batch_inference_config` at the top level of the [model registration request]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/), alongside `connector_id`. The following request configures size-based splitting without dynamic batching:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-embedding-model-for-ingest",
  "function_name": "remote",
  "connector_id": "<connector_id>",
  "batch_inference_config": {
    "max_items_per_request": 96,
    "max_bytes_per_request": 4000000
  }
}
```
{% include copy-curl.html %}

The registration request returns a task ID and model ID. Use the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) to wait for the task to reach the `COMPLETED` state before using the model ID.

#### Step 2: Add the model to an ingest pipeline

Use the model ID in an ingest processor. The following example configures a [`text_embedding` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-embedding/):

```json
PUT /_ingest/pipeline/embedding-pipeline
{
  "processors": [
    {
      "text_embedding": {
        "model_id": "<ingest_model_id>",
        "field_map": {
          "passage_text": "passage_embedding"
        },
        "batch_size": 100
      }
    }
  ]
}
```
{% include copy-curl.html %}

The two configurations control different request boundaries.

| Setting | Boundary |
|:---|:---|
| Processor `batch_size` | The number of documents included in one OpenSearch prediction request. |
| Model `max_items_per_request` and `max_bytes_per_request` | The number of texts and their combined size, in bytes, included in each call to the remote endpoint. |

With this example, the processor can include 100 documents in one prediction request, while OpenSearch sends no more than 96 items in each remote call. The byte limit can cause OpenSearch to create smaller calls when the documents contain longer text.

#### Step 3: Run batch ingestion

Use the pipeline with the Bulk API as described in [Batch ingestion]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batch-ingestion/). The Bulk API request doesn't contain `batch_inference_config`; OpenSearch obtains that configuration from the model ID used by the processor.

### Response and failure behavior

OpenSearch waits for all remote calls created from the original prediction request. If all calls succeed, it combines their outputs in the original input order. If any call fails, the original prediction request fails and doesn't return a partial result.

For configuring retry and backoff settins for failed calls, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).

## Dynamic batching

### When to use dynamic batching

Dynamic batching is optional and disabled by default. It is useful when many small prediction requests for the same model arrive close together. This pattern is common during search, where each [neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) typically produces a prediction request containing one query text. Dynamic batching briefly holds these requests and sends them to the model as a single batch.

Dynamic batching settings are stored on the registered model. To apply dynamic batching to search independently from ingest, register separate model IDs for the two workloads and enable dynamic batching only on the search model.

### Settings

| Parameter | Description |
|:---|:---|
| `dynamic_batching.enabled` | Enables dynamic batching when set to `true`. The default value is `false`. |
| `dynamic_batching.flush_timeout_ms` | The maximum time, in milliseconds, that the first request waits for additional requests before the model is invoked in batch. Valid values are 1-10000. The batch may be invoked earlier if the accumulated texts reach `max_items_per_request` or `max_bytes_per_request` before the timeout is reached. |

To use dynamic batching, you must also define at least one [size limit](#choose-the-size-limits). These limits set the maximum size of each batch call. Configure them to allow more than one text per remote call so that multiple requests can be combined.

When traffic is low and neither size limit is reached, the first request waits for the full `dynamic_batching.flush_timeout_ms` value. Setting the value to `10000`, for example, can add 10 seconds before the model is invoked.

### How dynamic batching works

Each prediction request is held on the node processing it. OpenSearch invokes the model in batch when any of the following conditions is met:

- The accumulated number of items reaches the configured `max_items_per_request` limit.
- The accumulated item size, in bytes, reaches the configured `max_bytes_per_request` limit.
- The time elapsed since the first request was received reaches `flush_timeout_ms`.

### Configure dynamic batching for search

#### Step 1: Register a dynamic batching search model

Register the search model with the endpoint limits and an enabled `dynamic_batching` object:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-embedding-model-for-search",
  "function_name": "remote",
  "connector_id": "<connector_id>",
  "batch_inference_config": {
    "max_items_per_request": 96,
    "max_bytes_per_request": 4000000,
    "dynamic_batching": {
      "enabled": true,
      "flush_timeout_ms": 50
    }
  }
}
```
{% include copy-curl.html %}

The registration request returns a task ID and a separate model ID for search. A request can wait up to `flush_timeout_ms`, but the model may be invoked earlier if the accumulated texts reach 96 items or 4,000,000 UTF-8 bytes.

#### Step 2: Use the model for query embeddings

After the registration task reaches the `COMPLETED` state, use the search model ID wherever OpenSearch generates query embeddings. The following example specifies it in a [neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) for a `knn_vector` field:

```json
GET /my-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "How does remote inference batching work?",
        "model_id": "<search_model_id>",
        "k": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

The query contains only the model ID. Dynamic batching settings remain on the registered model and aren't added to the query.

### Batching scope and resource usage

Each batch belongs to one model ID on one node:

- Requests that use different model IDs don't share a batch, even when both models reference the same connector.
- Requests for the same model that are routed to different nodes enter different batches.
- Requests for the same model and node share a batch. Within that batch, OpenSearch groups requests whose prediction input fields are all identical except the field the model supports for batching. Each group is sent as a separate remote batch request.

All models on a node share a single memory budget for holding requests. A batch retains memory while it waits for additional requests and while its remote call is in flight. If the budget is exhausted, OpenSearch rejects new requests before calling the remote endpoint. For the memory settings, see [Configure dynamic batch memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#configure-dynamic-batch-memory).

### Response behavior

OpenSearch routes each output to the request and position that supplied the corresponding input. After connector response processing, each remote call must produce one result for each input. A result-count mismatch fails the affected requests because OpenSearch cannot route the outputs to their callers.
