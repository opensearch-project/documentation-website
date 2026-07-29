---
layout: default
title: Predict model stream (gRPC)
parent: gRPC APIs
nav_order: 40
---

# Predict Model Stream API (gRPC)
**Introduced 3.8**
{: .label .label-purple }

The gRPC Predict Model Stream API provides a binary interface for streaming predictions from remote machine learning (ML) models using protocol buffers over gRPC. The server streams response chunks to the client as the underlying model generates them, so the client can begin processing output before inference completes. Use streaming for token-by-token generation from large language models (LLMs).

You can stream predictions over either REST or gRPC. Both transports return the same incrementally generated model output, so choose the one that best fits your client:

- **REST streaming** uses server-sent events (SSE) over HTTP, which browsers, standard HTTP clients, and command line tools such as cURL support directly. This is an experimental feature and is not recommended for use in a production environment. For more information, see [Predict Stream API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict-stream/).
- **gRPC streaming** uses protocol buffers over HTTP/2. This transport provides lower serialization overhead and smaller payloads, native server streaming semantics with HTTP/2 flow control and connection multiplexing, and a strongly typed schema from which you can generate clients in any [gRPC-supported language](https://grpc.io/docs/languages/).

Streaming predictions are supported for the following externally hosted models:

- [OpenAI Chat Completion](https://platform.openai.com/docs/api-reference/completions)
- [Amazon Bedrock Converse Stream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

## Prerequisites

Before using the gRPC Predict Model Stream API, ensure that you have fulfilled the following prerequisites:

- Enable gRPC transport on the cluster. For more information, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#how-to-use-grpc-apis).
- Obtain the ML Commons protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#how-to-use-grpc-apis).
- Configure an externally hosted model and streaming connector for a supported model type. For model and connector configuration, see [Predict Stream API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict-stream/#step-2-register-a-compatible-externally-hosted-model).

## gRPC service and method

The gRPC Predict Model Stream API resides in the [`MLService`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/services/ml_service.proto#L22) service.

You can submit streaming prediction requests by invoking the [`PredictModelStream`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/services/ml_service.proto#L24) method within the `MLService`. The method takes an [`MlPredictModelStreamRequest`](#mlpredictmodelstreamrequest-fields) and returns a stream of [`PredictResponse`](#response-fields) messages.

`PredictModelStream` is a server streaming remote procedure call (RPC): the client sends a single request, and the server returns a sequence of response messages. The final message sets `is_last` to `true`, and the server then closes the stream.
{: .note}

## Request fields

The gRPC Predict Model Stream API supports the following request fields.

### MlPredictModelStreamRequest fields

The [`MlPredictModelStreamRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3406) message accepts the following fields.

| Field | Protobuf type | Required | Description |
| :---- | :---- | :---- | :---- |
| `model_id` | `string` | Required | The ID of the model to run predictions against. The model must be a supported externally hosted model. |
| `ml_predict_model_stream_request_body` | [`MLPredictModelStreamRequestBody`](#mlpredictmodelstreamrequestbody-fields) | Required | The request payload containing the prediction parameters. |

<!-- vale off -->
### MLPredictModelStreamRequestBody fields
<!-- vale on -->

The [`MLPredictModelStreamRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3323) message accepts the following fields.

| Field | Protobuf type | Required | Description |
| :---- | :---- | :---- | :---- |
| `parameters` | [`Parameters`](#parameters-fields) | Required | The input parameters passed to the remote model. |

### Parameters fields

For streaming predictions, the [`Parameters`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3356) message accepts the following fields. Provide the fields that match your model type.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `messages` | `repeated` [`Messages`](#messages-fields) | The conversation messages sent to a chat completion model, such as OpenAI Chat Completion. |
| `inputs` | `string` | The input text sent to the model, for example, when using an Amazon Bedrock Converse Stream model. |
| `x_llm_interface` | `string` | The LLM interface that corresponds to your model type. Valid values are `openai/v1/chat/completions` and `bedrock/converse/claude`. |

### Messages fields

The [`Messages`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3328) message accepts the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `role` | `string` | The role of the message sender, for example, `system` or `user`. |
| `content` | `string` | The message content. |

## Response fields

The server streams a sequence of [`PredictResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3367) messages. Each message carries one chunk of the generated output and provides the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `inference_results` | `repeated InferenceResults` | The inference results for the chunk. |
| `inference_results.output` | `repeated Output` | The output objects for each inference result. |
| `inference_results.output.name` | `string` | The name of the output field (typically, `response`). |
| `inference_results.output.data_as_map` | `DataAsMap` | The response content and metadata for the chunk. |
| `inference_results.output.data_as_map.content` | `string` | The text content of the chunk. Concatenate the `content` values across chunks to reconstruct the full response. |
| `inference_results.output.data_as_map.is_last` | `bool` | Whether this is the final chunk in the stream. When `true`, no further messages are sent. |

## Example request

Both the field that carries the model input and the `x_llm_interface` value depend on the model type. The following examples show the JSON representation of the gRPC request message for each supported model type. In both examples, replace `model_id` with the ID of your registered model.

For an OpenAI Chat Completion model, provide the conversation in the `messages` field and set `x_llm_interface` to `openai/v1/chat/completions`:

```json
{
  "model_id": "your_model_id",
  "ml_predict_model_stream_request_body": {
    "parameters": {
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "Can you summarize Prince Hamlet of William Shakespeare in around 100 words?"
        }
      ],
      "x_llm_interface": "openai/v1/chat/completions"
    }
  }
}
```
{% include copy.html %}

For an Amazon Bedrock Converse Stream model, provide the input text in the `inputs` field and set `x_llm_interface` to `bedrock/converse/claude`:

```json
{
  "model_id": "your_model_id",
  "ml_predict_model_stream_request_body": {
    "parameters": {
      "inputs": "Can you summarize Prince Hamlet of William Shakespeare in around 100 words?",
      "x_llm_interface": "bedrock/converse/claude"
    }
  }
}
```
{% include copy.html %}

The following example shows a Java gRPC client that streams predictions from an OpenAI Chat Completion model. Replace the model ID and messages with values that match your model configuration:

```java
import org.opensearch.protobufs.*;
import org.opensearch.protobufs.services.MLServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

import java.util.Iterator;

public class PredictModelStreamClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9400)
                .usePlaintext()
                .build();

        // Create a gRPC stub for ML operations
        MLServiceGrpc.MLServiceBlockingStub mlStub = MLServiceGrpc.newBlockingStub(channel);

        // Build the request parameters for an OpenAI Chat Completion model
        Parameters parameters = Parameters.newBuilder()
            .addMessages(Messages.newBuilder()
                .setRole("system")
                .setContent("You are a helpful assistant.")
                .build())
            .addMessages(Messages.newBuilder()
                .setRole("user")
                .setContent("Can you summarize Prince Hamlet of William Shakespeare in around 100 words?")
                .build())
            .setXLlmInterface("openai/v1/chat/completions")
            .build();

        // Create the streaming predict request
        MlPredictModelStreamRequest request = MlPredictModelStreamRequest.newBuilder()
            .setModelId("your_model_id")
            .setMlPredictModelStreamRequestBody(MLPredictModelStreamRequestBody.newBuilder()
                .setParameters(parameters)
                .build())
            .build();

        // Execute the request and read the streamed response
        try {
            Iterator<PredictResponse> responses = mlStub.predictModelStream(request);
            while (responses.hasNext()) {
                PredictResponse response = responses.next();
                for (InferenceResults results : response.getInferenceResultsList()) {
                    for (Output output : results.getOutputList()) {
                        DataAsMap chunk = output.getDataAsMap();
                        System.out.print(chunk.getContent());
                        if (chunk.getIsLast()) {
                            System.out.println("\n[stream complete]");
                        }
                    }
                }
            }
        } catch (io.grpc.StatusRuntimeException e) {
            System.err.println("gRPC predict stream request failed with status: " + e.getStatus());
            System.err.println("Error message: " + e.getMessage());
        }

        channel.shutdown();
    }
}
```
{% include copy.html %}

For an Amazon Bedrock Converse Stream model, build the request parameters using `setInputs` instead of `addMessages`. The rest of the client code is unchanged:

```java
Parameters parameters = Parameters.newBuilder()
    .setInputs("Can you summarize Prince Hamlet of William Shakespeare in around 100 words?")
    .setXLlmInterface("bedrock/converse/claude")
    .build();

MlPredictModelStreamRequest request = MlPredictModelStreamRequest.newBuilder()
    .setModelId("your_model_id")
    .setMlPredictModelStreamRequestBody(MLPredictModelStreamRequestBody.newBuilder()
        .setParameters(parameters)
        .build())
    .build();
```
{% include copy.html %}

## Example response

The server returns a sequence of `PredictResponse` messages. Each message carries a chunk of generated text in the `content` field, and the final message sets `isLast` to `true`. The following example shows the JSON representation of a streamed chunk:

```json
{
  "inferenceResults": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "content": "Hello",
            "isLast": false
          }
        }
      ]
    }
  ]
}
```

## Related documentation

- [Predict Stream API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict-stream/) -- The REST equivalent for streaming predictions
- [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/) -- gRPC transport configuration and client requirements
