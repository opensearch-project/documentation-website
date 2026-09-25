---
layout: default
title: Request batching
has_children: false
nav_order: 85
parent: Connecting to externally hosted models
grand_parent: Integrating ML models
---

# Batching requests to externally hosted models
**Introduced 3.9**
{: .label .label-purple }

OpenSearch provides two techniques for controlling how prediction requests are grouped into calls to an externally hosted model:

- Large prediction requests can be split so that each call to the model stays within the model endpoint's limits.

- Small prediction requests can be combined into fewer calls to the model, which increases throughput at the cost of a short wait before each call.

Both techniques are optional and disabled by default, and both operate on input strings. An input string is one string in the `text_docs` array of a prediction request, such as the text of one document field during ingestion or the query text during search.

You configure both techniques in the `batch_inference_config` parameter when you register the model. For field descriptions and default values, see [The `batch_inference_config` parameter]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-batch_inference_config-parameter).

These techniques work only for externally hosted models whose [connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/) accepts text-document (`text_docs`) input and produces one result for each input string in the same order. A model configured with the `batch_inference_config` parameter rejects prediction requests that use another input type.

For direct [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) calls to an externally hosted model, requests can be sent in a batch only if their endpoints, including `{algorithm_name}` and `{model_id}` and all request body fields except `text_docs` are identical.

## Splitting large prediction requests

Use request splitting when the input strings in one prediction request can exceed the model endpoint's limit on the number or combined size of input strings. This pattern is common during bulk ingestion because an [ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/) can send many documents in one prediction request.

### Choosing the size limits

During [model registration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/), provide the `batch_inference_config` parameter and set `max_items_per_request`, `max_bytes_per_request`, or both. Use the [OpenSearch-provided connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/supported-connectors/) to identify the provider and exact model used by the connector. Obtain the limits from the provider's official documentation for the exact model and version, or from the model server configuration for a custom endpoint.

The `max_items_per_request` parameter limits the number of input strings in each call to the model, and `max_bytes_per_request` limits their combined size in bytes. OpenSearch measures the size of each input string as its UTF-8 byte length. The byte limit counts only the input strings. The request sent to the model also contains the other fields defined in the connector's `request_body` template, so set `max_bytes_per_request` lower than the model's actual limit to leave room for them.

To change the `batch_inference_config` settings later, use the [Update Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/update-model/). OpenSearch stores `batch_inference_config` on the registered model, so ingest pipelines, Bulk API requests, and queries that use the model don't require any changes.

### Splitting rules

OpenSearch splits the `text_docs` array of a prediction request into consecutive groups of input strings, keeping the original order, and sends each group to the model in a separate call. OpenSearch adds input strings to the current call until the next input string would exceed `max_items_per_request` or `max_bytes_per_request` and then starts a new call. A call can reach a limit exactly. For example, consider the following configuration and input sizes:

```text
max_items_per_request = 3
max_bytes_per_request = 10
input sizes in bytes = [4, 3, 5, 2]
```

OpenSearch creates the following calls to the model:

```text
Call 1: [4, 3]
Call 2: [5, 2]
```

Adding the 5-byte input string to the first call would produce 12 bytes, so OpenSearch starts the second call. Both calls also remain within the limit of three input strings.

If the original request already fits within the limits, OpenSearch sends it as a single call to the model. If an individual input string is larger than `max_bytes_per_request`, OpenSearch sends that input string unchanged, and the model endpoint might reject it.

OpenSearch waits for all calls to the model created from the original prediction request. If all calls succeed, OpenSearch combines their outputs in the original input order. If any call fails, the original prediction request fails and doesn't return a partial result.

For information about configuring retry and backoff settings for failed calls, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#request-body-fields).

### Configuring request splitting

To configure request splitting for batch ingestion, follow these steps.

#### Step 1: Register the ingestion model

Register an externally hosted model and provide the `batch_inference_config` parameter in the [model registration request]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/). The following request configures request splitting without dynamic batching:

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

Use the model ID in an ingest processor. The processor's `batch_size` sets the number of documents in each prediction request, and the model's limits then split each prediction request into calls to the model. The following example configures a [`text_embedding` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-embedding/) that sends up to 100 documents in each prediction request. Because the model registered in Step 1 sets `max_items_per_request` to `96`, OpenSearch splits each of these requests into calls containing no more than 96 input strings:

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

#### Step 3: Run batch ingestion

Use the pipeline with the Bulk API as described in [Batch ingestion]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batch-ingestion/).

## Dynamically batching small prediction requests

Dynamic batching is useful when many small prediction requests for the same model arrive close together. This pattern is common during search because each [neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) typically produces a prediction request containing one input string, the query text. Dynamic batching briefly queues these requests and sends them to the model as a single batch.

To apply dynamic batching to search independently from ingestion, register separate model IDs for the two workloads and enable dynamic batching only on the search model.

To enable dynamic batching, set `dynamic_batching.enabled` to `true`. You must also set `max_items_per_request`, `max_bytes_per_request`, or both. These limits set the maximum size of each batch call, so configure them to allow more than one input string per call to the model. For more information, see [Choosing the size limits](#choosing-the-size-limits).

The `dynamic_batching.flush_timeout_ms` parameter sets the maximum time that the first request waits for additional requests. When traffic is low and neither size limit is reached, the first request waits for the full `dynamic_batching.flush_timeout_ms` value. Setting the value to `10000`, for example, can add 10 seconds before the model is invoked.

OpenSearch queues each prediction request on the node that processes it and invokes the model in batch when any of the following conditions is met:

- The accumulated number of input strings reaches the configured `max_items_per_request` limit.
- The accumulated size of the input strings, in bytes, reaches the configured `max_bytes_per_request` limit.
- The time elapsed since the first request was received reaches `flush_timeout_ms`.

### Batching scope and resource usage

Each batch belongs to one model ID on one node:

- Requests that use different model IDs don't share a batch, even when both models reference the same connector.
- Requests for the same model that are routed to different nodes enter different batches.
- Requests for the same model and node share a batch. Within that batch, OpenSearch groups requests whose prediction input fields are all identical except the field the model supports for batching. Each group is sent as a separate batch request to the model.

All models on a node share the memory available for queued requests. A batch retains memory while it waits for additional requests and while its call to the model is in progress. If this memory is exhausted, OpenSearch rejects new requests before calling the model endpoint. For information about the memory settings, see [Dynamic batching memory settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#dynamic-batching-memory-settings).

### Response routing

OpenSearch routes each output to the request and position that supplied the corresponding input. After connector response processing, each call to the model must produce one result for each input string. A result-count mismatch fails the affected requests because OpenSearch cannot route the outputs to their callers.

### Configuring dynamic batching for search

To configure dynamic batching for search, follow these steps.

#### Step 1: Register a search model with dynamic batching enabled

Register the search model with the endpoint limits and provide a `dynamic_batching` parameter:

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

The registration request returns a task ID and a separate model ID for search. A request can wait up to `flush_timeout_ms`, but the model might be invoked earlier if the accumulated input strings reach a count of 96 or a combined size of 4,000,000 UTF-8 bytes.

#### Step 2: Use the model to generate query embeddings

After the registration task reaches the `COMPLETED` state, use the search model ID in all requests that generate query embeddings. The following example specifies the search model ID in a [neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) for a `knn_vector` field:

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

## Related documentation

- [The `batch_inference_config` parameter]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-batch_inference_config-parameter)
- [ML cluster settings: Dynamic batching memory settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#dynamic-batching-memory-settings)