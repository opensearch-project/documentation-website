---
layout: default
title: Connector input and output
has_children: false
nav_order: 15
parent: Connectors
grand_parent: Connecting to externally hosted models
great_grand_parent: Integrating ML models
---

# Connector input and output
**Introduced 2.9**
{: .label .label-purple }

A connector builds the request that OpenSearch sends to the model API and converts the model response into the format that OpenSearch requires.

## Request body templates

The following excerpt from a connector shows the fields that determine the request body. Each object in the `actions` array defines one operation that the connector supports. The `request_body` field is a template for the request body. The template contains placeholders in the format `${parameters.<parameter_name>}`. In this example, the template contains the `model` and `messages` placeholders:

```json
{
  "parameters": {
    "model": "gpt-4o-mini"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/chat/completions",
      "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages} }"
    }
  ]
}
```

When you send a [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) request, OpenSearch replaces each placeholder with the corresponding parameter value and sends the result to the model. OpenSearch obtains parameter values from the Predict API request or, if the request doesn't provide the value, from the connector `parameters` object. In this example, `model` defaults to `gpt-4o-mini`, so a Predict API request must provide only `messages`.

OpenSearch inserts each value into the template without adding quotation marks. Enclose a placeholder in quotation marks if its value is a string, as with `model` in the preceding example. Don't enclose a placeholder in quotation marks if its value is a number, a Boolean, or a JSON array or object, as with `messages`. OpenSearch escapes special characters, such as quotation marks, in string values provided in the Predict API request. For the exceptions, see the `parameters` field in [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/#request-body-fields).

The `url` field can also contain parameter placeholders, for example, `"url": "https://${parameters.endpoint}/v1/chat/completions"`, where the connector `parameters` object provides the `endpoint` value. To use parameter placeholders in headers, see [Dynamic header substitution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/dynamic-header-substitution/).

To authenticate to the model platform, a connector action can contain `${credential.<credential_name>}` placeholders in its `headers` object, for example, `"Authorization": "Bearer ${credential.openAI_key}"`. OpenSearch fills these placeholders using the values in the connector `credential` object. Credential placeholders are filled only in headers, and a Predict API request can't provide credential values.

## Input formats

OpenSearch accepts input in one of the following formats. When you call a model directly, provide input as parameters. Some OpenSearch features always send their input in a different format, which the connector preprocessing function converts into parameters. To test a connector used by one of these features, send a Predict API request in the same format.

| Input format | Request body fields | When to use |
| :--- | :--- | :--- |
| [Parameters](#providing-input-as-parameters) | `parameters` | To call any externally hosted model directly. The `ml_inference` processor also uses this format. |
| [Text documents](#providing-input-as-text-documents) | `text_docs` | To test an embedding model connector that the `text_embedding` ingest processor or `neural` query uses. |
| [Text similarity input](#providing-input-for-text-similarity) | `query_text` and `text_docs` | To test a rerank model connector that the `rerank` search processor uses. |

## Providing input as parameters

In a Predict request, the `parameters` object maps placeholder names to values: each key names a placeholder, and its value replaces that placeholder. Provide a value for every placeholder that doesn't have a default value in the connector `parameters` object.

The following examples use the OpenAI chat connector shown in [Creating a standalone connector]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/#creating-a-standalone-connector). The connector `parameters` object provides default values for `endpoint` and `model`. The `request_body` template contains the `model` and `messages` placeholders. Because `messages` has no default value, every Predict request must provide it.

After you [register a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/#step-2-register-an-externally-hosted-model) using this connector, provide the `messages` value in a Predict API request:

```json
POST /_plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ]
  }
}
```
{% include copy-curl.html %}

OpenSearch fills the template using the `messages` value from the request and the `model` value from the connector, and sends the following request body to the model:

```json
{ "model": "gpt-4o-mini", "messages": [{"role":"user","content":"Hello"}] }
```

The `dataAsMap` object in the Predict API response contains the model response:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "chatcmpl-7e6s5DYEutmM677UZokF9eH40dIY7",
            "object": "chat.completion",
            "model": "gpt-4o-mini",
            "choices": [
              {
                "index": 0,
                "message": {
                  "role": "assistant",
                  "content": "Hello! How can I assist you today?"
                },
                "finish_reason": "stop"
              }
            ]
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

To override the connector default value, provide the parameter in the request. For example, the following request sets the model to `gpt-4o`:

```json
POST /_plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ]
  }
}
```
{% include copy-curl.html %}

The `ml_inference` ingest processor also provides input as parameters. Its `input_map` maps document fields to parameter names. For more information, see [ML inference processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/).

## Providing input as text documents

Embedding features, such as the `text_embedding` ingest processor and the `neural` query, send their input as a `text_docs` array of strings. A connector for an embedding model uses the following functions to translate between this format and the model API:

- The preprocessing function converts the `text_docs` array into the parameters that fill the request body template.
- The post-processing function converts the model response into the embedding format that OpenSearch requires.

For example, the following connector uses the built-in OpenAI pre- and post-processing functions:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "OpenAI embedding connector",
  "description": "The connector to the OpenAI embeddings API",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "model": "text-embedding-3-small"
  },
  "credential": {
    "openAI_key": "<openai_key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/embeddings",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}"
      },
      "request_body": "{ \"input\": ${parameters.input}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.openai.embedding",
      "post_process_function": "connector.post_process.openai.embedding"
    }
  ]
}
```
{% include copy-curl.html %}

To test the connector using the input that these features send, provide a `text_docs` array in a Predict API request. Set the `algorithm` query parameter to `text_embedding` so that OpenSearch reads the `text_docs` field:

```json
POST /_plugins/_ml/models/{model_id}/_predict?algorithm=text_embedding
{
  "text_docs": ["red shoes", "blue hat"]
}
```
{% include copy-curl.html %}

The preprocessing function converts the strings into the `input` parameter, and OpenSearch sends the following request body to the model:

```json
{ "input": ["red shoes","blue hat"], "model": "text-embedding-3-small" }
```

If the connector doesn't define a preprocessing function, OpenSearch uses `connector.pre_process.default.embedding`, which also converts the strings into the `input` parameter.

The post-processing function extracts the embeddings from the model response. The Predict API response contains one embedding for each string:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [1536],
          "data": [-0.0147, 0.0362, ...]
        },
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [1536],
          "data": [0.0081, -0.0215, ...]
        }
      ],
      "status_code": 200
    }
  ]
}
```

If you don't specify the algorithm, OpenSearch reads only the `parameters` object, so the template placeholders have no values and the request fails. You can also specify the algorithm as a path parameter. For more information, see [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/).

If the connector doesn't define a post-processing function, the Predict API response contains the unchanged model response. For the input that each built-in function accepts and the output that it produces, see [Built-in pre- and post-processing functions](#built-in-pre--and-post-processing-functions). To write your own functions, see [Custom pre- and post-processing functions](#custom-pre--and-post-processing-functions).

If the connector uses a built-in preprocessing function, you can also provide the input in a `parameters` object. For example, sending `{"parameters": {"input": ["red shoes", "blue hat"]}}` produces the same model request body as the preceding `text_docs` request.
{: .note}

## Providing input for text similarity

The `rerank` search processor sends its input as a `query_text` string and a `text_docs` array containing the text of each search result. A connector for a rerank model must define a preprocessing function that converts this input into parameters because OpenSearch provides no default preprocessing function for text similarity input.

For example, the following connector uses the built-in Cohere Rerank functions:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Cohere rerank connector",
  "description": "The connector to the Cohere Rerank API",
  "version": 1,
  "protocol": "http",
  "parameters": {
    "model": "rerank-english-v3.0"
  },
  "credential": {
    "cohere_key": "<cohere_key>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.cohere.ai/v1/rerank",
      "headers": {
        "Authorization": "Bearer ${credential.cohere_key}"
      },
      "request_body": "{ \"documents\": ${parameters.documents}, \"query\": \"${parameters.query}\", \"top_n\": ${parameters.top_n}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.cohere.rerank",
      "post_process_function": "connector.post_process.cohere.rerank"
    }
  ]
}
```
{% include copy-curl.html %}

To test the connector using the input that the `rerank` processor sends, provide `query_text` and `text_docs` in a Predict API request. Set the `algorithm` query parameter to `text_similarity` so that OpenSearch reads these fields:

```json
POST /_plugins/_ml/models/{model_id}/_predict?algorithm=text_similarity
{
  "query_text": "Which shoes are waterproof?",
  "text_docs": ["Waterproof hiking boots", "Canvas sneakers"]
}
```
{% include copy-curl.html %}

The preprocessing function converts the input into the `query`, `documents`, and `top_n` parameters, and OpenSearch sends the following request body to the model:

```json
{ "documents": ["Waterproof hiking boots","Canvas sneakers"], "query": "Which shoes are waterproof?", "top_n": 2, "model": "rerank-english-v3.0" }
```

The post-processing function extracts the relevance scores from the model response. The Predict API response contains one score for each string in `text_docs`, in the same order:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [0.9]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [0.6]
        }
      ],
      "status_code": 200
    }
  ]
}
```

For more information about reranking search results, see [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/).

## Built-in pre- and post-processing functions

A preprocessing function converts `text_docs` input or text similarity input into the parameters that fill the connector request body template. A post-processing function converts the model response into the format that OpenSearch requires. To use a built-in function, specify its name in the `pre_process_function` or `post_process_function` field of a connector's `actions` array element. For more information about input formats, see [Input formats](#input-formats).

If the input is `text_docs` and the connector doesn't define a preprocessing function, OpenSearch uses the `connector.pre_process.default.embedding` function. Text similarity input requires a preprocessing function. If the input is a `parameters` object, OpenSearch fills the request body template using the values in the object.

The following table lists the built-in preprocessing functions.

| Function | Use with | Input | Parameters returned |
| :--- | :--- | :--- | :--- |
| `connector.pre_process.default.embedding` | Amazon SageMaker models or other embedding models that accept an array of strings | `text_docs` | Returns an `input` parameter containing the `text_docs` array. |
| `connector.pre_process.openai.embedding` | OpenAI and Azure OpenAI embedding models | `text_docs` | Returns an `input` parameter containing the `text_docs` array. |
| `connector.pre_process.cohere.embedding` | Cohere Embed models, including Cohere Embed models in Amazon Bedrock | `text_docs` | Returns a `texts` parameter containing the `text_docs` array. |
| `connector.pre_process.cohere.multimodal_embedding` | Cohere Embed models, for image input | `text_docs` containing image data URIs | Returns an `images` parameter containing the `text_docs` array. |
| `connector.pre_process.bedrock.embedding` | Amazon Titan Text Embeddings models in Amazon Bedrock | `text_docs` | Returns an `inputText` parameter containing the first string in `text_docs`. |
| `connector.pre_process.bedrock.multimodal_embedding` | Amazon Titan Multimodal Embeddings in Amazon Bedrock | `text_docs` containing text, optionally followed by an image | Returns an `inputText` parameter containing the first string in `text_docs` and, if `text_docs` contains a second string, an `inputImage` parameter containing that string. |
| `connector.pre_process.bedrock.nova.embedding` | Amazon Nova Multimodal Embeddings in Amazon Bedrock | `text_docs` in which the first string is plain text or a JSON object containing a `text`, `image`, `video`, or `audio` field | Returns a `text`, `image`, `video`, or `audio` parameter containing the value of the matching field. Plain text input returns a `text` parameter. |
| `connector.pre_process.bedrock.nova.text_embedding` | Amazon Nova Multimodal Embeddings in Amazon Bedrock, for text input | `text_docs` | Returns an `inputText` parameter containing the first string in `text_docs`. |
| `connector.pre_process.bedrock.nova.image_embedding` | Amazon Nova Multimodal Embeddings in Amazon Bedrock, for image input | `text_docs` | Returns an `inputImage` parameter containing the first string in `text_docs`. |
| `connector.pre_process.bedrock.nova.video_embedding` | Amazon Nova Multimodal Embeddings in Amazon Bedrock, for video input | `text_docs` | Returns an `inputVideo` parameter containing the first string in `text_docs`. |
| `connector.pre_process.bedrock.nova.audio_embedding` | Amazon Nova Multimodal Embeddings in Amazon Bedrock, for audio input | `text_docs` | Returns an `inputAudio` parameter containing the first string in `text_docs`. |
| `connector.pre_process.default.rerank` | Rerank models that accept a query, an array of documents, and the number of results to return, for example, a model that you deploy on Amazon SageMaker | `query_text` and `text_docs` (text similarity input, such as from the `rerank` search processor) | Returns a `query` parameter containing the query text, a `documents` parameter containing the `text_docs` array, and a `top_n` parameter containing the number of strings in `text_docs`. |
| `connector.pre_process.cohere.rerank` | Cohere Rerank models | `query_text` and `text_docs` (text similarity input, such as from the `rerank` search processor) | Returns a `query` parameter containing the query text, a `documents` parameter containing the `text_docs` array, and a `top_n` parameter containing the number of strings in `text_docs`. |
| `connector.pre_process.bedrock.rerank` | Rerank models accessed through the Amazon Bedrock Rerank API, such as Amazon Rerank. For an example, see [Reranking search results using Amazon Bedrock models]({{site.url}}{{site.baseurl}}/tutorials/reranking/reranking-bedrock/). | `query_text` and `text_docs` (text similarity input, such as from the `rerank` search processor) | Returns `queries`, `sources`, and `numberOfResults` parameters in the format of the Amazon Bedrock Rerank API. |

The following table lists the built-in post-processing functions. For each function, the table provides the JSON path of the model response field that contains the embeddings or results.

| Function | Use with | Response field (JSON path) |
| :--- | :--- | :--- |
| `connector.post_process.default.embedding` | Amazon SageMaker models or other embedding models that return a two-dimensional array | `$[*]`: Each entry of a top-level array. |
| `connector.post_process.openai.embedding` | OpenAI and Azure OpenAI embedding models | `$.data[*].embedding` |
| `connector.post_process.cohere.embedding` | Cohere Embed models, including Cohere Embed models in Amazon Bedrock | `$.embeddings` |
| `connector.post_process.cohere_v2.embedding.float` | Cohere Embed models using the v2 API, for `float` embeddings | `$.embeddings.float` |
| `connector.post_process.cohere_v2.embedding.int8` | Cohere Embed models using the v2 API, for `int8` embeddings | `$.embeddings.int8` |
| `connector.post_process.cohere_v2.embedding.uint8` | Cohere Embed models using the v2 API, for `uint8` embeddings | `$.embeddings.uint8` |
| `connector.post_process.cohere_v2.embedding.binary` | Cohere Embed models using the v2 API, for `binary` embeddings | `$.embeddings.binary` |
| `connector.post_process.cohere_v2.embedding.ubinary` | Cohere Embed models using the v2 API, for `ubinary` embeddings | `$.embeddings.ubinary` |
| `connector.post_process.bedrock.embedding` | Amazon Titan Text Embeddings V1 and Amazon Titan Multimodal Embeddings in Amazon Bedrock | `$.embedding` |
| `connector.post_process.bedrock_v2.embedding.float` | Amazon Titan Text Embeddings V2 in Amazon Bedrock, for `float` embeddings | `$.embeddingsByType.float` |
| `connector.post_process.bedrock_v2.embedding.binary` | Amazon Titan Text Embeddings V2 in Amazon Bedrock, for `binary` embeddings | `$.embeddingsByType.binary` |
| `connector.post_process.bedrock.nova.embedding` | Amazon Nova Multimodal Embeddings in Amazon Bedrock | `$.embeddings[*].embedding` |
| `connector.post_process.default.rerank` | Rerank models that return a top-level array of results, each containing an `index` and a `relevance_score`, for example, a model that you deploy on Amazon SageMaker | `$[*]`: Each entry of a top-level array. The Predict API response contains one score for each document, in the order of the input documents. |
| `connector.post_process.cohere.rerank` | Cohere Rerank models | `$.results` |
| `connector.post_process.bedrock.rerank` | Rerank models accessed through the Amazon Bedrock Rerank API, such as Amazon Rerank. For an example, see [Reranking search results using Amazon Bedrock models]({{site.url}}{{site.baseurl}}/tutorials/reranking/reranking-bedrock/). | `$.results` |
| `connector.post_process.mlcommons.passthrough` | Endpoints that return responses in the Predict API format, such as ML Commons in another OpenSearch cluster or the OpenSearch Agent Server. For an example, see [Filling templates in the agent server]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/agentic-search-templates/agent-server/). | `$`: The entire response. If the response contains an `inference_results` array, the function returns the `output` objects from the array, so the Predict API response doesn't contain one `inference_results` array nested inside another. |

## Default embedding functions

When you use [semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/), OpenSearch sends text to the model and requires embeddings in return. [Pretrained models provided by OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) accept and return these formats. However, a model hosted on an external platform may expect a different format. For example, a model deployed on Amazon SageMaker might accept an array of strings and return one embedding for each string. The default embedding functions, `connector.pre_process.default.embedding` and `connector.post_process.default.embedding`, convert between these formats.

The following example request creates an Amazon SageMaker text embedding connector that uses the default functions. The connector doesn't define a preprocessing function, so OpenSearch uses `connector.pre_process.default.embedding`:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Sagemaker text embedding connector",
  "description": "The connector to Sagemaker",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "<YOUR SAGEMAKER ACCESS KEY>",
    "secret_key": "<YOUR SAGEMAKER SECRET KEY>",
    "session_token": "<YOUR AWS SECURITY TOKEN>"
  },
  "parameters": {
    "region": "ap-northeast-1",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://runtime.sagemaker.ap-northeast-1.amazonaws.com/endpoints/<endpoint_name>/invocations",
      "headers": {
        "content-type": "application/json"
      },
      "post_process_function": "connector.post_process.default.embedding",
      "request_body": "${parameters.input}"
    }
  ]
}
```
{% include copy-curl.html %}

Set the `request_body` template to `${parameters.input}` so that OpenSearch sends the array of strings as the entire request body.
{: .important}

### Preprocessing function

The `connector.pre_process.default.embedding` function converts the `text_docs` input into the `input` parameter. For example, the following input contains two strings:

```json
{
  "text_docs": ["hello", "world"]
}
```

The function converts this input into the following parameters:

```json
{
  "parameters": {
    "input": ["hello", "world"]
  }
}
```

The `${parameters.input}` request body template then sends the list to the model, so the model input format must be a list of strings, for example:

```json
["hello", "world"]
```

### Post-processing function

The `connector.post_process.default.embedding` function parses the model response and transforms it into the embedding format that OpenSearch requires.

The remote text embedding model output must be a two-dimensional float array, each element of which represents an embedding of a string from the input list. For example, the following two-dimensional array corresponds to the embedding of the list `["hello", "world"]`:

```json
[
  [
    -0.048237994,
    -0.07612697,
    ...
  ],
  [
    0.32621247,
    0.02328475,
    ...
  ]
]
```

## Custom pre- and post-processing functions

If the built-in functions don't support the request or response format of your model API, write your own functions as [Painless]({{site.url}}{{site.baseurl}}/scripting/painless/) scripts.

A custom preprocessing function reads the input from `params`, for example, `params.text_docs`, and returns a JSON string containing a `parameters` object. The values in the `parameters` object fill the `request_body` template.

A custom post-processing function reads the model response from `params`. If the response is a JSON object, `params` contains its fields, for example, `params.embedding`. If the response is a JSON array, `params.result` contains the array. The function returns a JSON string containing an output object or an array of output objects. Each output object contains a `name` field and either the `data_type`, `shape`, and `data` fields for an embedding or a `dataAsMap` object for other output. To escape special characters in strings that you insert into the returned JSON, call the built-in `escape()` function. If the function returns a string that isn't valid JSON, the Predict API response contains the string in `dataAsMap.response`.

For example, the following preprocessing function sends the first string in `text_docs` to the Amazon Bedrock Titan embedding model in the `inputText` parameter:

```js
StringBuilder builder = new StringBuilder();
builder.append("\"");
String first = params.text_docs[0];
builder.append(first);
builder.append("\"");
def parameters = "{" + "\"inputText\":" + builder + "}";
return "{" + "\"parameters\":" + parameters + "}";
```

The following post-processing function converts the `embedding` field of the model response into an output object:

```js
def name = "sentence_embedding";
def dataType = "FLOAT32";
if (params.embedding == null || params.embedding.length == 0) {
  return params.message;
}
def shape = [params.embedding.length];
def json = "{" +
  "\"name\":\"" + name + "\"," +
  "\"data_type\":\"" + dataType + "\"," +
  "\"shape\":" + shape + "," +
  "\"data\":" + params.embedding +
  "}";
return json;
```

To use the functions, provide each script as a string in the `pre_process_function` and `post_process_function` fields of the connector action:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Connector: embedding",
  "description": "The connector to the Bedrock Titan embedding model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "<YOUR AWS REGION>",
    "service_name": "bedrock"
  },
  "credential": {
    "access_key": "<YOUR AWS ACCESS KEY>",
    "secret_key": "<YOUR AWS SECRET KEY>",
    "session_token": "<YOUR AWS SECURITY TOKEN>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/amazon.titan-embed-text-v1/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText}\" }",
      "pre_process_function": "\n    StringBuilder builder = new StringBuilder();\n    builder.append(\"\\\"\");\n    String first = params.text_docs[0];\n    builder.append(first);\n    builder.append(\"\\\"\");\n    def parameters = \"{\" +\"\\\"inputText\\\":\" + builder + \"}\";\n    return  \"{\" +\"\\\"parameters\\\":\" + parameters + \"}\";",
      "post_process_function": "\n      def name = \"sentence_embedding\";\n      def dataType = \"FLOAT32\";\n      if (params.embedding == null || params.embedding.length == 0) {\n        return params.message;\n      }\n      def shape = [params.embedding.length];\n      def json = \"{\" +\n                 \"\\\"name\\\":\\\"\" + name + \"\\\",\" +\n                 \"\\\"data_type\\\":\\\"\" + dataType + \"\\\",\" +\n                 \"\\\"shape\\\":\" + shape + \",\" +\n                 \"\\\"data\\\":\" + params.embedding +\n                 \"}\";\n      return json;\n    "
    }
  ]
}
```
{% include copy-curl.html %}

## Next steps

- To write a connector definition for a model that has no OpenSearch-provided blueprint, see [Creating a custom blueprint]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).
- For descriptions of all connector fields, see [Create Connector API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/connector-apis/create-connector/#request-body-fields).
- For all Predict API parameters and request fields, see [Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/).
