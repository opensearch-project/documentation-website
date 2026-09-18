---
layout: default
title: Server-side batch inference
has_children: false
nav_order: 85
parent: Connecting to externally hosted models
grand_parent: Integrating ML models
---

# Server-side batch inference

**Introduced 3.9**
{: .label .label-purple }

Remote model endpoints commonly limit both the number of text inputs and the payload size of each request. During ingest, an [ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/) can send a multi-text prediction request that exceeds one of these limits and is rejected by the endpoint. During search, concurrent [neural queries]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) commonly generate one-text prediction requests, producing many small remote calls that leave the model's batch capacity underused.

Server-side batch inference addresses both request patterns before the [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) creates the remote request. It provides two optional behaviors:

- **Size-based splitting** divides the texts from one prediction request into remote calls that follow configured item-count and UTF-8 text-size limits.
- **Queue-based batching** briefly collects compatible prediction requests from concurrent callers and combines their texts into shared remote calls.

Both behaviors are configured during [model registration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/). The model-level `batch_inference_config` object enables size-based splitting when it contains at least one size limit. Enabling its `queue` object also enables queue-based batching. Queued texts still pass through size-based splitting before OpenSearch invokes the model. If the model doesn't contain `batch_inference_config`, OpenSearch sends each prediction request directly to the connector.

Because the batching configuration belongs to the model, ingest pipelines, search queries, and [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) callers continue to use their existing request formats. The connector's request and response mappings also remain unchanged.

## Prerequisites

Server-side batch inference requires an externally hosted model endpoint that meets the [connection prerequisites]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#prerequisites) and a [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-connector) configured for that endpoint. The connector's request mapping and the endpoint must accept a list of text inputs. After processing the endpoint response, the connector must produce one result for each input text in the same order.

Server-side batch inference currently has the following scope restrictions:

- OpenSearch can batch only prediction requests whose input is a list of text documents (`text_docs`). A model that has `batch_inference_config` rejects requests that use another input type.
- Queue-based batching applies to non-streaming prediction requests. [Streaming prediction requests]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict-stream/) bypass the queue, but configured size-based splitting still applies.
- The [Batch Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/batch-predict/) uses a separate offline inference path and doesn't use `batch_inference_config`.

To change the batching settings, register a new model with the updated configuration. Separate model IDs can reference the same connector, so ingest and search can use different batching settings without duplicating connector configuration.

## How server-side batching creates remote calls

After a model has `batch_inference_config`, both batching modes use its size limits to create remote calls. At least one of `max_items_per_request` and `max_bytes_per_request` must be a positive value.

### Size-based splitting

For one prediction request, OpenSearch evaluates the texts in their original order and builds one or more sub-batches. Each sub-batch becomes one remote call. Before adding the next text to the current sub-batch, OpenSearch checks both enabled limits:

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

If the original request already fits within the limits, OpenSearch sends it as one remote call. If one text is larger than `max_bytes_per_request`, OpenSearch places that text in a call by itself without truncating it. The call can still be rejected by the endpoint.

OpenSearch sends the resulting sub-batches concurrently. After all calls complete, it combines the results in the same order as the original texts. Because several remote calls can be in flight at the same time, review the connector's [`client_config` settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields) if the endpoint limits concurrent connections or can throttle bursts.

### Queue-based batching

When queue-based batching is enabled, each prediction request enters a queue for its model ID on the node processing the request. OpenSearch removes the waiting requests from the queue and prepares them for remote calls when the queue _flushes_. A flush occurs when any of the following conditions is met:

- The accumulated number of texts reaches the enabled `max_items_per_request` limit.
- The accumulated UTF-8 text size reaches the enabled `max_bytes_per_request` limit.
- The timer started by the first queued request reaches `flush_timeout_ms`.

When a queue flushes, OpenSearch first groups compatible requests. Requests are compatible only when they use the same input type and have the same non-text request settings, such as prediction parameters and result filters. Requests with different settings are placed in separate groups.

OpenSearch then applies the size-based splitting rules to each group, including the handling of a single text that exceeds the byte limit. Thus, a queue flush can produce multiple remote calls. When the calls complete, OpenSearch restores the text order within each source request and returns each result to the caller that submitted it.

## Choose the batching settings

Use the [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/) to identify the provider and exact model used by the connector. Obtain `max_items_per_request` and `max_bytes_per_request` from the provider's official documentation for the exact model and version, or from the model server configuration for a custom endpoint.

Use the following guidance when setting [`batch_inference_config`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-batch_inference_config-parameter).

| Parameter | Selection guidance |
|:---|:---|
| `max_items_per_request` | Set this value to the maximum number of text inputs accepted in one model invocation. Omit the parameter or set it to `-1` when the endpoint doesn't enforce an item-count limit. |
| `max_bytes_per_request` | Start with the endpoint's total payload limit and reserve space for the connector request envelope and other fields. This parameter counts only the UTF-8 bytes in the text inputs, not the complete HTTP request body. Omit the parameter or set it to `-1` when a text-size limit isn't needed. |
| `queue.enabled` | Set this value to `true` to combine compatible requests across callers. Omit the queue or leave this value as `false` to use size-based splitting only. |
| `queue.flush_timeout_ms` | Set this value to the maximum queue wait that the workload can accept. The default is `50` milliseconds, and valid values range from `1` through `10,000`. This setting controls queue wait time, not the remote request timeout. |

## Configure size-based splitting for ingest

Use size-based splitting when an ingest processor can place more texts or text bytes in one prediction request than the endpoint should receive in one call.

### Step 1: Register the ingest model

Register an externally hosted model and add `batch_inference_config` at the top level of the [model registration request]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/), alongside `connector_id`. The following request omits the `queue` object, so the model uses size-based splitting only:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-embedding-model-for-ingest",
  "function_name": "remote",
  "connector_id": "<connector_id>",
  "batch_inference_config": {
    "max_items_per_request": <max_texts_per_request>,
    "max_bytes_per_request": <text_byte_limit>
  }
}
```
{% include copy-curl.html %}

The registration request returns a task ID and model ID. Use the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) to wait for the task to reach the `COMPLETED` state before using the model ID.

### Step 2: Add the model to an ingest pipeline

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
        "batch_size": <batch_size>
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

If the processor request fits within all enabled model limits, the connector receives one call. Otherwise, OpenSearch sends multiple calls concurrently and combines their results before returning the prediction response to the processor.

### Step 3: Run batch ingestion

Use the pipeline with the Bulk API as described in [Batch ingestion]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batch-ingestion/). The Bulk API request doesn't contain `batch_inference_config`; OpenSearch obtains that configuration from the model ID used by the processor.

<a id="configure-queueing-for-search"></a>

## Configure queue-based batching for search

A neural query commonly generates a prediction request containing one query text. Queue-based batching gives compatible requests that arrive close together an opportunity to share a remote call. Because the queue is configured on a model ID, it affects every compatible non-streaming prediction request that uses that model. Registering a separate model ID for search avoids adding queue wait time to ingest requests. The ingest and search model IDs can reference the same connector and model endpoint.

### Step 1: Register a queue-enabled search model

Register the search model with the endpoint limits and an enabled `queue` object:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "remote-embedding-model-for-search",
  "function_name": "remote",
  "connector_id": "<connector_id>",
  "batch_inference_config": {
    "max_items_per_request": <max_texts_per_request>,
    "max_bytes_per_request": <text_byte_limit>,
    "queue": {
      "enabled": true,
      "flush_timeout_ms": <flush_timeout_ms>
    }
  }
}
```
{% include copy-curl.html %}

The registration request returns a task ID and a separate model ID for search. A request can wait up to `flush_timeout_ms`, but the queue flushes earlier when it reaches an enabled size limit.

The configured limits must leave capacity for multiple texts if the queue is intended to combine one-text search requests. For example, setting `max_items_per_request` to `1` causes each one-text request to flush immediately.

### Step 2: Use the model for query embeddings

After the registration task reaches the `COMPLETED` state, use the search model ID wherever OpenSearch generates query embeddings. The following example specifies it in a [neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) for a `knn_vector` field:

```json
GET /my-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "How does server-side batching work?",
        "model_id": "<search_model_id>",
        "k": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

The query contains only the model ID. Queue settings remain on the registered model and aren't added to the query. Requests must overlap in time to share a remote call; sequential requests normally flush separately when their timers expire.

## Queue scope and resource usage

Each queue belongs to one model ID on one node:

- Requests that use different model IDs don't share a queue, even when both models reference the same connector.
- Requests for the same model that are routed to different nodes enter different queues.
- Requests for the same model and node can share a queue, but incompatible requests are sent in separate groups when the queue flushes.

All model queues on a node share one memory budget. Queue entries retain memory while they are waiting and while their remote calls are in flight. If the budget is exhausted, OpenSearch rejects new queue entries before calling the remote endpoint. Empty queues become eligible for removal after their configured idle period. For the memory and idle queue settings, see [Configure server-side batch queues]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#configure-server-side-batch-queues).

## Response and failure behavior

Server-side batching preserves each caller's response boundary:

- For size-based splitting, OpenSearch waits for all sub-batches and, if all calls succeed, combines the outputs in input order.
- For queue-based batching, OpenSearch routes each output to the request and position that supplied the corresponding text.
- After connector response processing, each remote call must produce one result for each input text. For queued calls, a result-count mismatch fails the affected requests because OpenSearch cannot route the outputs to their callers.

Failure handling depends on which texts were included in the failed remote call:

- If any sub-batch from one split request fails, the original request fails and doesn't return a partial result.
- If a queued remote call fails, every source request represented in that call fails. Requests whose texts were sent only in other successful calls can still succeed.
- The batching layer doesn't retry failed remote calls. Connector retry and backoff settings continue to apply independently to each call. For more information, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).
