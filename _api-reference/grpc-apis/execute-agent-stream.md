---
layout: default
title: Execute agent stream (gRPC)
parent: gRPC APIs
nav_order: 50
---

# Execute Agent Stream API (gRPC)
**Introduced 3.8**
{: .label .label-purple }

The gRPC Execute Agent Stream API provides a binary interface for streaming the execution of an agent using protocol buffers over gRPC. The server streams response chunks to the client as the agent generates them, so the client can begin processing output before execution completes. Use streaming for conversational agents that produce token-by-token output from large language models (LLMs).

You can stream agent execution over either REST or gRPC. Both transports return the same incrementally generated output, so choose the one that best fits your client:

- **REST streaming** uses server-sent events (SSE) over HTTP, which browsers, standard HTTP clients, and command line tools such as cURL support directly. This is an experimental feature and is not recommended for use in a production environment. For more information, see [Execute Agent Stream API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-stream-agent/).
- **gRPC streaming** uses protocol buffers over HTTP/2. This transport provides lower serialization overhead and smaller payloads, native server streaming semantics with HTTP/2 flow control and connection multiplexing, and a strongly typed schema from which you can generate clients in any [gRPC-supported language](https://grpc.io/docs/languages/).

Streaming agent execution is supported for agents that use the following externally hosted models:

- [OpenAI Chat Completion](https://platform.openai.com/docs/api-reference/completions)
- [Amazon Bedrock Converse Stream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

## Prerequisites

Before using the gRPC Execute Agent Stream API, ensure that you have fulfilled the following prerequisites:

- Enable gRPC transport on the cluster. For more information, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#how-to-use-grpc-apis).
- Obtain the ML Commons protobufs on the client side. For ways to obtain the protobufs, see [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#how-to-use-grpc-apis).
- Register an agent that uses a supported streaming model. For agent and connector configuration, see [Execute Agent Stream API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-stream-agent/#step-2-register-a-compatible-externally-hosted-model).

## gRPC service and method

The gRPC Execute Agent Stream API resides in the [`MLService`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/services/ml_service.proto#L22) service.

You can submit streaming agent execution requests by invoking the [`ExecuteAgentStream`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/services/ml_service.proto#L27) method within the `MLService`. The method takes an [`MlExecuteAgentStreamRequest`](#mlexecuteagentstreamrequest-fields) and returns a stream of [`PredictResponse`](#response-fields) messages.

`ExecuteAgentStream` is a server streaming remote procedure call (RPC): the client sends a single request, and the server returns a sequence of response messages. The final message sets `is_last` to `true`, and the server then closes the stream.
{: .note}

## Request fields

The gRPC Execute Agent Stream API supports the following request fields.

### MlExecuteAgentStreamRequest fields

The [`MlExecuteAgentStreamRequest`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3396) message accepts the following fields.

| Field | Protobuf type | Required | Description |
| :---- | :---- | :---- | :---- |
| `agent_id` | `string` | Required | The ID of the agent to execute. |
| `ml_execute_agent_stream_request_body` | [`MLExecuteAgentStreamRequestBody`](#mlexecuteagentstreamrequestbody-fields) | Required | The request payload containing the execution parameters. |

<!-- vale off -->
### MLExecuteAgentStreamRequestBody fields
<!-- vale on -->

The [`MLExecuteAgentStreamRequestBody`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3318) message accepts the following fields.

| Field | Protobuf type | Required | Description |
| :---- | :---- | :---- | :---- |
| `parameters` | [`Parameters`](#parameters-fields) | Required | The input parameters passed to the agent. |

### Parameters fields

For agent execution, the [`Parameters`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3356) message accepts the following field.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `question` | `string` | The input question sent to the agent. |

## Response fields

The server streams a sequence of [`PredictResponse`](https://github.com/opensearch-project/opensearch-protobufs/blob/1.6.0/protos/schemas/common.proto#L3367) messages. Each message carries one chunk of the generated output and provides the following fields.

| Field | Protobuf type | Description |
| :---- | :---- | :---- |
| `inference_results` | `repeated InferenceResults` | The inference results for the chunk. |
| `inference_results.output` | `repeated Output` | The output objects for each inference result. |
| `inference_results.output.name` | `string` | The name of the output field (typically, `response`). |
| `inference_results.output.result` | `string` | The values of the `memory_id` and `parent_interaction_id` fields. |
| `inference_results.output.data_as_map` | `DataAsMap` | The response content and metadata for the chunk. |
| `inference_results.output.data_as_map.content` | `string` | The text content of the chunk. Concatenate the `content` values across chunks to reconstruct the full response. |
| `inference_results.output.data_as_map.is_last` | `bool` | Whether this is the final chunk in the stream. When `true`, no further messages are sent. |

## Example request

The following example shows the JSON representation of the gRPC request message. Replace the `agent_id` and `question` with values that match your agent configuration:

```json
{
  "agent_id": "your_agent_id",
  "ml_execute_agent_stream_request_body": {
    "parameters": {
      "question": "List indices in my cluster"
    }
  }
}
```
{% include copy.html %}

The following example shows a Java gRPC client that streams the execution of a conversational agent. Replace the agent ID and question with values that match your agent configuration:

```java
import org.opensearch.protobufs.*;
import org.opensearch.protobufs.services.MLServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

import java.util.Iterator;

public class ExecuteAgentStreamClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9400)
                .usePlaintext()
                .build();

        // Create a gRPC stub for ML operations
        MLServiceGrpc.MLServiceBlockingStub mlStub = MLServiceGrpc.newBlockingStub(channel);

        // Build the request parameters for the agent
        Parameters parameters = Parameters.newBuilder()
            .setQuestion("List indices in my cluster")
            .build();

        // Create the streaming agent execution request
        MlExecuteAgentStreamRequest request = MlExecuteAgentStreamRequest.newBuilder()
            .setAgentId("your_agent_id")
            .setMlExecuteAgentStreamRequestBody(MLExecuteAgentStreamRequestBody.newBuilder()
                .setParameters(parameters)
                .build())
            .build();

        // Execute the request and read the streamed response
        try {
            Iterator<PredictResponse> responses = mlStub.executeAgentStream(request);
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
            System.err.println("gRPC execute agent stream request failed with status: " + e.getStatus());
            System.err.println("Error message: " + e.getMessage());
        }

        channel.shutdown();
    }
}
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
          "name": "memory_id",
          "result": "6CMnkJ8BLGHoqtB13ipp"
        },
        {
          "name": "parent_interaction_id",
          "result": "6SMnkJ8BLGHoqtB13irB"
        },
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

- [Execute Agent Stream API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-stream-agent/) -- The REST equivalent for streaming agent execution
- [Using gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/) -- gRPC transport configuration and client requirements
