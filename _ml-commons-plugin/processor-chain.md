---
layout: default
title: Processor chains
has_children: false
nav_order: 50
---

# Processor chains
**Introduced 3.3**
{: .label .label-purple }

Processor chains enable flexible data transformation pipelines that can process both input and output data. Chain multiple processors together to create sequential transformations where each processor's output becomes the next processor's input.

Processors provide a way to:

- **Transform data formats**: Convert between different data structures (strings, JSON, arrays).
- **Extract specific information**: Use JSONPath or regex patterns to extract relevant data.
- **Clean and filter content**: Remove unwanted fields or apply formatting rules.
- **Standardize data**: Ensure consistent data formats across different components.

Processors execute in the order in which they appear in the array. Each processor receives the output from the previous processor.
{: .note}

Processor chains are specifically designed for ML workflows and differ from processors in ingest and search pipelines:

- [**Ingest pipelines**]({{site.url}}{{site.baseurl}}/ingest-pipelines/): Transform documents during indexing into OpenSearch.
- [**Search pipelines**]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/): Transform queries and search results during search operations.
- **Processor chains**: Transform data within ML Commons workflows (agent tools, model inputs/outputs).

Processor chains provide specialized data transformation capabilities tailored for AI/ML use cases, such as cleaning model responses, extracting structured data from LLM outputs, and preparing inputs for model inference.

## Configuration

Processors can be configured in different contexts:

- **Tool outputs**: Add an `output_processors` array in the tool's `parameters` section.
- **Model outputs**: Add an `output_processors` array in the model's `parameters` section during a `_predict` call.
- **Model inputs**: Add an `input_processors` array in the model's `parameters` section of a `_predict` call.

For complete examples, see [Example usage with agents](#example-usage-with-agents) and [Example usage with models](#example-usage-with-models).

## Supported processor types

The following table lists all supported processors.

Processor | Description
:--- | :---
[`conditional`](#conditional) | Applies different processor chains based on conditions.
[`extract_json`](#extract_json) | Extracts JSON objects or arrays from text strings.
[`for_each`](#for_each) | Iterates through array elements and applies a chain of processors to each element.
[`jsonpath_filter`](#jsonpath_filter) | Extracts data using JSONPath expressions.
[`process_and_set`](#process_and_set) | Applies a chain of processors to the input and sets the result at a specified JSONPath location.
[`regex_capture`](#regex_capture) | Captures specific groups from regex matches.
[`regex_replace`](#regex_replace) | Replaces text using regular expression patterns.
[`remove_jsonpath`](#remove_jsonpath) | Removes fields from JSON objects using JSONPath.
[`set_field`](#set_field) | Sets a field to a specified static value or copies a value from another field.
[`to_string`](#to_string) | Converts the input to a JSON string representation.

### conditional

Applies different processor chains based on conditions.

**Parameters**:

- `path` (string, optional): The JSONPath expression used to extract the value for condition evaluation.
- `routes` (array, required): An array of condition-processor mappings.
- `default` (array, optional): The default processors if no conditions match.

**Supported conditions**:

- Exact value match: `"value"`
- Numeric comparisons: `">10"`, `"<5"`, `">="`, `"<="`, `"==5"`
- Existence checks: `"exists"`, `"null"`, `"not_exists"`
- Regex matching: `"regex:pattern"`
- Contains text: `"contains:substring"`

**Example configuration**:

```json
{
  "type": "conditional",
  "path": "$.status",
  "routes": [
    {
      "green": [
        {"type": "regex_replace", "pattern": "status", "replacement": "healthy"}
      ]
    },
    {
      "red": [
        {"type": "regex_replace", "pattern": "status", "replacement": "unhealthy"}
      ]
    }
  ],
  "default": [
    {"type": "regex_replace", "pattern": "status", "replacement": "unknown"}
  ]
}
```

**Example input**:

```json
{"index": "test-index", "status": "green", "docs": 100}
```

**Example output**:

```json
{"index": "test-index", "healthy": "green", "docs": 100}
```

### extract_json

Extracts JSON objects or arrays from text strings.

**Parameters**:

- `extract_type` (string, optional): The type of JSON to extract: `"object"`, `"array"`, or `"auto"`. Default is `"auto"`.
- `default` (any, optional): The default value if JSON extraction fails.

**Example configuration**:

```json
{
  "type": "extract_json",
  "extract_type": "object",
  "default": {}
}
```

**Example input**:

```json
"The result is: {\"status\": \"success\", \"count\": 5} - processing complete"
```

**Example output**:

```json
{"status": "success", "count": 5}
```

### for_each

Iterates through array elements and applies a chain of processors to each element. Useful for transforming array elements uniformly, such as when adding missing fields, filtering content, or normalizing data structures.

**Parameters**:

- `path` (string, required): The JSONPath expression pointing to the array to iterate over. Must use `[*]` notation for array elements.
- `processors` (array, required): A list of processor configurations to apply to each array element.

**Behavior**:

- Each element is processed independently using the configured processor chain.
- The output of the processor chain replaces the original element.
- If the path doesn't exist or doesn't point to an array, the input is returned unchanged.
- If the processing of an element fails, the original element is kept.

**Example configuration**:

```json
{
  "type": "for_each",
  "path": "$.items[*]",
  "processors": [
    {
      "type": "set_field",
      "path": "$.processed",
      "value": true
    }
  ]
}
```

**Example input**:

```json
{
  "items": [
    {"name": "item1", "value": 10},
    {"name": "item2", "value": 20}
  ]
}
```

**Example output**:

```json
{
  "items": [
    {"name": "item1", "value": 10, "processed": true},
    {"name": "item2", "value": 20, "processed": true}
  ]
}
```

### jsonpath_filter

Extracts data using JSONPath expressions.

**Parameters**:

- `path` (string, required): The JSONPath expression used to extract data.
- `default` (any, optional): The default value if the path is not found.

**Example configuration**:

```json
{
  "type": "jsonpath_filter",
  "path": "$.data.items[*].name",
  "default": []
}
```

**Example input**:

```json
{"data": {"items": [{"name": "item1"}, {"name": "item2"}]}}
```

**Example output**:

```json
["item1", "item2"]
```

### process_and_set

Applies a chain of processors to the input and sets the result at a specified JSONPath location.

**Parameters**:

- `path` (string, required): The JSONPath expression specifying where to set the processed result.
- `processors` (array, required): A list of processor configurations to apply sequentially.

**Path behavior**:

- If the path exists, it will be updated with the processed value.
- If the path doesn't exist, attempts to create it (works for simple nested fields).
- A parent path must exist for new field creation to succeed.

**Example configuration**:

```json
{
  "type": "process_and_set",
  "path": "$.summary.clean_name",
  "processors": [
    {
      "type": "to_string"
    },
    {
      "type": "regex_replace",
      "pattern": "[^a-zA-Z0-9]",
      "replacement": "_"
    }
  ]
}
```

**Example input**:

```json
{"name": "Test Index!", "status": "active"}
```

**Example output**:

```json
{"name": "Test Index!", "status": "active", "summary": {"clean_name": "Test_Index_"}}
```

### regex_capture

Captures specific groups from regex matches. For regex syntax details, see [Java regex syntax](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

**Parameters**:

- `pattern` (string, required): A regular expression pattern with capture groups.
- `groups` (string or array, optional): Group numbers to capture. Can be a single number like `"1"` or array like `"[1, 2, 4]"`. Default is `"1"`.

**Example configuration**:

```json
{
  "type": "regex_capture",
  "pattern": "(\\d+),(\\w+),(\\w+),([^,]+)",
  "groups": "[1, 4]"
}
```

**Example input**:

```json
"1,green,open,.plugins-ml-model-group,DCJHJc7pQ6Gid02PaSeXBQ,1,0"
```

**Example output**:

```json
["1", ".plugins-ml-model-group"]
```

### regex_replace

Replaces text using regular expression patterns. For regex syntax details, see [Java regex syntax](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

**Parameters**:
- `pattern` (string, required): A regular expression pattern to match.
- `replacement` (string, optional): Replacement text. Default is `""`.
- `replace_all` (Boolean, optional): Whether to replace all matches or only the first. Default is `true`.

**Example configuration**:

```json
{
  "type": "regex_replace",
  "pattern": "^.*?\n",
  "replacement": ""
}
```

**Example input**:

```json
"row,health,status,index\n1,green,open,.plugins-ml-model\n2,red,closed,test-index"
```

**Example output**:

```json
"1,green,open,.plugins-ml-model\n2,red,closed,test-index"
```

### remove_jsonpath

Removes fields from JSON objects using JSONPath.

**Parameters**:

- `paths` (array, required): An array of JSONPath expressions identifying fields to remove.

**Example configuration**:

```json
{
  "type": "remove_jsonpath",
  "paths": "[$.sensitive_data]"
}
```

**Example input**:

```json
{"name": "user1", "sensitive_data": "secret", "public_info": "visible"}
```

**Example output**:

```json
{"name": "user1", "public_info": "visible"}
```

### set_field

Sets a field to a specified static value or copies a value from another field.

**Parameters**:

- `path` (string, required): The JSONPath expression specifying where to set the value.
- `value` (any, conditionally required): The static value to set. Either `value` or `source_path` must be provided.
- `source_path` (string, conditionally required): The JSONPath expression to copy the value from. Either `value` or `source_path` must be provided.
- `default` (any, optional): The default value when `source_path` doesn't exist. Only used with `source_path`.

**Path behavior**:

- If the path exists, it will be updated with the new value.
- If the path doesn't exist, attempts to create it (works for simple nested fields).
- A parent path must exist for new field creation to succeed.

**Example configuration (static value)**:

```json
{
  "type": "set_field",
  "path": "$.metadata.processed_at",
  "value": "2024-03-15T10:30:00Z"
}
```

**Example configuration (copy field)**:

```json
{
  "type": "set_field",
  "path": "$.userId",
  "source_path": "$.user.id",
  "default": "unknown"
}
```

**Example input**:

```json
{"user": {"id": 123}, "name": "John"}
```

**Example output**:

```json
{"user": {"id": 123}, "name": "John", "userId": 123, "metadata": {"processed_at": "2024-03-15T10:30:00Z"}}
```

### to_string

Converts the input to a JSON string representation.

**Parameters**:

- `escape_json` (Boolean, optional): Whether to escape JSON characters. Default is `false`.

**Example configuration**:

```json
{
  "type": "to_string",
  "escape_json": true
}
```

**Example input**:

```json
{"name": "test", "value": 123}
```

**Example output**:

```json
"{\"name\":\"test\",\"value\":123}"
```

## Example usage with agents

The following example demonstrates using processor chains with agents.

### Step 1: Register a flow agent with output processors

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Index Summary Agent",
  "type": "flow",
  "description": "Agent that provides clean index summaries",
  "tools": [
    {
      "type": "ListIndexTool",
      "parameters": {
        "output_processors": [
          {
            "type": "regex_replace",
            "pattern": "^.*?\n",
            "replacement": ""
          },
          {
            "type": "regex_capture",
            "pattern": "(\\d+,\\w+,\\w+,([^,]+))"
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2: Execute the agent

Using the `agent_id` returned in the previous step:

```json
POST /_plugins/_ml/agents/{agent_id}/_execute
{
  "parameters": {
    "question": "List the indices"
  }
}
```
{% include copy-curl.html %}

Without output processors, the raw `ListIndexTool` returns verbose CSV output with headers and extra columns:

```cs
row,health,status,index,uuid,pri,rep,docs.count,docs.deleted,store.size,pri.store.size
1,green,open,.plugins-ml-model-group,DCJHJc7pQ6Gid02PaSeXBQ,1,0,1,0,12.7kb,12.7kb
2,green,open,.plugins-ml-memory-message,6qVpepfRSCi9bQF_As_t2A,1,0,7,0,53kb,53kb
3,green,open,.plugins-ml-memory-meta,LqP3QMaURNKYDZ9p8dTq3Q,1,0,2,0,44.8kb,44.8kb
```

The output processors transform the verbose CSV output into a clean, readable format by:

1. **`regex_replace`**: Removing the CSV header row.
2. **`regex_capture`**: Extracting only essential information (row number, health, status, and index name).

With output processors, the agent returns clean, formatted data with only essential index information:

```cs
1,green,open,.plugins-ml-model-group
2,green,open,.plugins-ml-memory-message
3,green,open,.plugins-ml-memory-meta
```

## Example usage with models

The following examples demonstrate how to use processor chains with models during Predict API calls.

### Example: Input processors

This example shows you how to modify model input using `input_processors` to replace text before processing:

```json
POST _plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "system_prompt": "You are a helpful assistant.",
    "prompt": "Can you summarize Prince Hamlet of William Shakespeare in around 100 words?",
    "input_processors": [
      {
        "type": "regex_replace",
        "pattern": "100",
        "replacement": "20"
      }
    ]
  }
}
```
{% include copy-curl.html %}

In this example, the `regex_replace` processor modifies the prompt before it's sent to the model, changing "100 words" to "20 words".

### Example: Output processors

This example shows you how to process model output using `output_processors` to extract and format JSON data. In this example, the output processors first extract the content from the model response using JSONPath. Then they parse and extract the JSON object from the text response:

```json
POST _plugins/_ml/models/{model_id}/_predict
{
  "parameters": {
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "${parameters.system_prompt}"
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Can you convert this into a json object: user name is Bob, he likes swimming"
          }
        ]
      }
    ],
    "system_prompt": "You are a helpful assistant",
    "output_processors": [
      {
        "type": "jsonpath_filter",
        "path": "$.choices[0].message.content"
      },
      {
        "type": "extract_json",
        "extract_type": "auto"
      }
    ]
  }
}
```
{% include copy-curl.html %}

Without output processors, the raw response contains the full model output with extensive metadata and nested structure:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "test-id",
            "object": "chat.completion",
            "created": 1.759580469E9,
            "model": "gpt-4o-mini-2024-07-18",
            "choices": [
              {
                "index": 0.0,
                "message": {
                  "role": "assistant",
                  "content": "Sure! Here is the information you provided converted into a JSON object:\n\n```json\n{\n  \"user\": {\n    \"name\": \"Bob\",\n    \"likes\": \"swimming\"\n  }\n}\n```",
                  "refusal": null,
                  "annotations": []
                },
                "logprobs": null,
                "finish_reason": "stop"
              }
            ],
            "usage": {
              "prompt_tokens": 33.0,
              "completion_tokens": 42.0,
              "total_tokens": 75.0,
              "prompt_tokens_details": {
                "cached_tokens": 0.0,
                "audio_tokens": 0.0
              },
              "completion_tokens_details": {
                "reasoning_tokens": 0.0,
                "audio_tokens": 0.0,
                "accepted_prediction_tokens": 0.0,
                "rejected_prediction_tokens": 0.0
              }
            },
            "service_tier": "default",
            "system_fingerprint": "test-fingerprint"
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

With output processors, the response is simplified to contain only the extracted and parsed JSON data:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "user": {
              "name": "Bob",
              "likes": "swimming"
            }
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```
