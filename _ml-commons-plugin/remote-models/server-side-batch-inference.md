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

## Size-based splitting

### When to use size-based splitting

Use size-based splitting when the texts in one prediction request can exceed the model endpoint's item-count or text-size limit. This pattern is common during ingest, where an [ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/) can send many documents in one prediction request.

Size-based splitting applies to externally hosted models whose [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) accepts text-document (`text_docs`) input and produces one result for each input text in the same order. A model configured for size-based splitting rejects prediction requests that use another input type.

### Choose the size limits

During [model registration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/), add [`batch_inference_config`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-batch_inference_config-parameter) and set at least one size limit. Without `batch_inference_config`, OpenSearch sends the original prediction request directly to the connector. Use the [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/) to identify the provider and exact model used by the connector. The example settings in this topic can be used with the Amazon Bedrock [`cohere.embed-english-v3`](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-embed-v3.html) model. Obtain the limits from the provider's official documentation for the exact model and version, or from the model server configuration for a custom endpoint.

| Parameter | Description |
|:---|:---|
| `max_items_per_request` | The maximum number of text inputs in one remote model call. The default value is `-1`, which disables the item-count limit. |
| `max_bytes_per_request` | The maximum combined UTF-8 size, in bytes, of the text inputs in one remote model call. This value excludes the connector request envelope and other request fields. The default value is `-1`, which disables the text-size limit. |

To change the limits, register a new model with the updated configuration.

### How size-based splitting works

OpenSearch evaluates the texts from one prediction request in their original order and builds one or more sub-batches. Each sub-batch becomes one remote call. Before adding the next text to the current sub-batch, OpenSearch checks both enabled limits:

- `max_items_per_request` limits the number of texts.
- `max_bytes_per_request` limits the combined UTF-8 size of the texts.

If adding the next text would exceed either limit, OpenSearch starts a new sub-batch. A value exactly equal to a limit is allowed. For example, consider the following configuration and input sizes:

```text
max_items_per_request = 3
max_bytes_per_request = 10
UTF-8 input sizes = [4, 3, 5, 2]
```

OpenSearch creates the following remote calls:

```text
Call 1: [4, 3]
Call 2: [5, 2]
```

Adding the 5-byte text to the first call would produce 12 bytes, so it starts the second call. Both calls also remain within the three-item limit.

If the original request already fits within the limits, OpenSearch sends it as one remote call. If one text is larger than `max_bytes_per_request`, OpenSearch places that text in a call by itself without truncating it. The endpoint can still reject that call.

OpenSearch sends the resulting sub-batches concurrently and combines their results in the original input order. Because several remote calls can be in flight at the same time, review the connector's [`client_config` settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields) if the endpoint limits concurrent connections or can throttle bursts.

### Configure size-based splitting for ingest

#### Step 1: Register the ingest model

Register an externally hosted model and add `batch_inference_config` at the top level of the [model registration request]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/), alongside `connector_id`. The following request omits the `queue` object, so the model uses size-based splitting only:

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
| Model `max_items_per_request` and `max_bytes_per_request` | The number and combined UTF-8 size of texts included in each call to the remote endpoint. |

With this example, the processor can include 100 documents in one prediction request, while OpenSearch sends no more than 96 texts in each remote call. The byte limit can cause OpenSearch to create smaller calls when the documents contain longer text.

#### Step 3: Run batch ingestion

Use the pipeline with the Bulk API as described in [Batch ingestion]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batch-ingestion/). The Bulk API request doesn't contain `batch_inference_config`; OpenSearch obtains that configuration from the model ID used by the processor.

### Response and failure behavior

OpenSearch waits for all remote calls created from the original prediction request. If all calls succeed, it combines their outputs in the original input order. If any call fails, the original prediction request fails and doesn't return a partial result.

OpenSearch doesn't retry failed remote calls. Connector retry and backoff settings apply independently to each call. For more information, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).

## Queue-based batching

### When to use queue-based batching

Queue-based batching is optional and disabled by default. It is useful when many small prediction requests for the same model arrive close together. This pattern is common during search, where each [neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) typically produces a prediction request containing one query text. Queue-based batching briefly holds these requests and can combine their texts when the queue flushes.

Because OpenSearch combines texts from multiple requests, the connector must accept `text_docs` input and produce one result for each input text in the same order.

Queue settings are stored on the registered model. To use queue-based batching for search without adding queue wait time to ingest, register separate model IDs for the two workloads and enable the queue only on the search model. Both model IDs can reference the same connector and remote model endpoint.

### Choose the queue settings

Set `queue.enabled` to `true` in `batch_inference_config`. The following settings control the queue:

| Parameter | Description |
|:---|:---|
| `queue.enabled` | Enables queue-based batching when set to `true`. The default value is `false`. |
| `queue.flush_timeout_ms` | The maximum time, in milliseconds, that the first request waits before the queue flushes. The default value is `50`, and valid values range from `1` through `10,000`. This setting doesn't control the remote request timeout. |

A queue-enabled model must also define at least one [size limit](#choose-the-size-limits). These limits define the maximum size of each remote call created after the queue flushes. To combine one-text search requests, configure limits that allow more than one text in a remote call. For example, setting `max_items_per_request` to `1` causes each one-text request to flush immediately.

### How queue-based batching works

Each prediction request enters a queue for its model ID on the node processing the request. OpenSearch removes the waiting requests from the queue when any of the following conditions is met:

- The accumulated number of texts reaches an enabled `max_items_per_request` limit.
- The accumulated UTF-8 text size reaches an enabled `max_bytes_per_request` limit.
- The timer started by the first queued request reaches `flush_timeout_ms`.

When the queue flushes, OpenSearch groups requests whose prediction inputs are identical except for `text_docs`. For search, requests can be grouped when they use the same model ID and embedding settings, while their query text can differ. Requests with different prediction settings are sent in separate remote calls.

For each group, OpenSearch combines the texts and applies the configured item and byte limits. A queue flush can therefore produce more than one remote call. When the calls complete, OpenSearch restores the text order within each source request and returns each result to the request that supplied it.

### Configure queue-based batching for search

#### Step 1: Register a queue-enabled search model

Register the search model with the endpoint limits and an enabled `queue` object:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-embedding-model-for-search",
  "function_name": "remote",
  "connector_id": "<connector_id>",
  "batch_inference_config": {
    "max_items_per_request": 96,
    "max_bytes_per_request": 4000000,
    "queue": {
      "enabled": true,
      "flush_timeout_ms": 50
    }
  }
}
```
{% include copy-curl.html %}

The registration request returns a task ID and a separate model ID for search. A request can wait up to `flush_timeout_ms`, but the queue flushes earlier when the accumulated texts reach 96 items or 4,000,000 UTF-8 bytes.

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

The query contains only the model ID. Queue settings remain on the registered model and aren't added to the query. Only requests waiting in the same queue before a flush are considered together. Requests that arrive after a flush start a later batch.

### Queue scope and resource usage

Each queue belongs to one model ID on one node:

- Requests that use different model IDs don't share a queue, even when both models reference the same connector.
- Requests for the same model that are routed to different nodes enter different queues.
- Requests for the same model and node share a queue. Within that queue, OpenSearch groups requests by all prediction input fields other than `text_docs`, and each group uses separate remote calls.

All model queues on a node share one memory budget. Queue entries retain memory while they are waiting and while their remote calls are in flight. If the budget is exhausted, OpenSearch rejects new queue entries before calling the remote endpoint. Empty queues become eligible for removal after their configured idle period. For the memory and idle queue settings, see [Configure server-side batch queues]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#configure-server-side-batch-queues).

### Response and failure behavior

OpenSearch routes each output to the request and position that supplied the corresponding text. After connector response processing, each remote call must produce one result for each input text. A result-count mismatch fails the affected requests because OpenSearch cannot route the outputs to their callers.

If a queued remote call fails, every source request represented in that call fails. Requests whose texts were sent only in other successful calls can still succeed. OpenSearch doesn't retry the failed call; connector retry and backoff settings apply independently to each remote call.
