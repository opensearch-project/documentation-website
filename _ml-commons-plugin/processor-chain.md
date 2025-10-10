---
layout: default
title: Processor Chain
has_children: false
nav_order: 65
---

# Processor chain
**Introduced 3.3**
{: .label .label-purple }

Processor chains enable flexible data transformation pipelines that can process both input and output data. Chain multiple processors together to create sequential transformations where each processor's output becomes the next processor's input.

## Overview

Processors provide a powerful way to:

- **Transform data formats**: Convert between different data structures (strings, JSON, arrays)
- **Extract specific information**: Use JSONPath or regex patterns to pull out relevant data
- **Clean and filter content**: Remove unwanted fields or apply formatting rules
- **Standardize data**: Ensure consistent data formats across different components

### Sequential execution

Processors execute in the order they appear in the array. Each processor receives the output from the previous processor.

## Configuration

Processors can be configured in different contexts:

- **Tool outputs**: Add an `output_processors` array in the tool's `parameters` section
- **Model outputs**: Add an `ouput_processors` array in the model's `parameters` section during a `_predict` call
- **Model inputs**: Add an `input_processors` array in the model's `parameters` section of a `_predict` call

For complete examples, see [Example usage with agents](#example-usage-with-agents) and [Example usage with models](#example-usage-with-models).

## Supported processor types

The following table lists all supported processors.

Processor | Description
:--- | :---
[`to_string`](#to_string) | Converts the input to a JSON string representation.
[`regex_replace`](#regex_replace) | Replaces text using regular expression patterns.
[`regex_capture`](#regex_capture) | Captures specific groups from regex matches.
[`jsonpath_filter`](#jsonpath_filter) | Extracts data using JSONPath expressions.
[`extract_json`](#extract_json) | Extracts JSON objects or arrays from text strings.
[`remove_jsonpath`](#remove_jsonpath) | Removes fields from JSON objects using JSONPath.
[`conditional`](#conditional) | Applies different processor chains based on conditions.
[`process_and_set`](#process_and_set) | Applies a chain of processors to the input and sets the result at a specified JSONPath location.
[`set_field`](#set_field) | Sets a field to a specified static value or copies a value from another field.
[`for_each`](#for_each) | Iterates through array elements and applies a chain of processors to each element.

### to_string

Converts the input to a JSON string representation.

**Parameters:**
- `escape_json` (Boolean, optional): Whether to escape JSON characters. Default: `false`

**Example Configuration:**
```json
{
  "type": "to_string",
  "escape_json": true
}
```

**Example Input/Output:**
```
Input: {"name": "test", "value": 123}
Output: "{\"name\":\"test\",\"value\":123}"
```

### regex_replace

Replaces text using regular expression patterns. For regex syntax details, see [Java regex syntax](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

**Parameters:**
- `pattern` (string, required): Regular expression pattern to match
- `replacement` (string, optional): Replacement text. Default: `""`
- `replace_all` (Boolean, optional): Whether to replace all matches or only the first. Default: `true`

**Example Configuration:**
```json
{
  "type": "regex_replace",
  "pattern": "^.*?\n",
  "replacement": ""
}
```

**Example Input/Output:**
```
Input: "row,health,status,index\n1,green,open,.plugins-ml-model\n2,red,closed,test-index"
Output: "1,green,open,.plugins-ml-model\n2,red,closed,test-index"
```

### regex_capture

Captures specific groups from regex matches. For regex syntax details, see [Java regex syntax](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

**Parameters:**
- `pattern` (string, required): Regular expression pattern with capture groups
- `groups` (string or array, optional): Group numbers to capture. Can be a single number like `"1"` or array like `"[1, 2, 4]"`. Default: `"1"`

**Example Configuration:**
```json
{
  "type": "regex_capture",
  "pattern": "(\\d+),(\\w+),(\\w+),([^,]+)",
  "groups": "[1, 4]"
}
```

**Example Input/Output:**
```
Input: "1,green,open,.plugins-ml-model-group,DCJHJc7pQ6Gid02PaSeXBQ,1,0"
Output: ["1", ".plugins-ml-model-group"]
```

### jsonpath_filter

Extracts data using JSONPath expressions.

**Parameters:**
- `path` (string, required): JSONPath expression to extract data
- `default` (any, optional): Default value if path is not found

**Example Configuration:**
```json
{
  "type": "jsonpath_filter",
  "path": "$.data.items[*].name",
  "default": []
}
```

**Example Input/Output:**
```
Input: {"data": {"items": [{"name": "item1"}, {"name": "item2"}]}}
Output: ["item1", "item2"]
```

### extract_json

Extracts JSON objects or arrays from text strings.

**Parameters:**
- `extract_type` (string, optional): Type of JSON to extract - `"object"`, `"array"`, or `"auto"`. Default: `"auto"`
- `default` (any, optional): Default value if JSON extraction fails

**Example Configuration:**
```json
{
  "type": "extract_json",
  "extract_type": "object",
  "default": {}
}
```

**Example Input/Output:**
```
Input: "The result is: {\"status\": \"success\", \"count\": 5} - processing complete"
Output: {"status": "success", "count": 5}
```

### remove_jsonpath

Removes fields from JSON objects using JSONPath.

**Parameters:**
- `paths` (array, required): Array of JSONPath expressions identifying fields to remove

**Example Configuration:**
```json
{
  "type": "remove_jsonpath",
  "paths": "[$.sensitive_data]"
}
```

**Example Input/Output:**
```
Input: {"name": "user1", "sensitive_data": "secret", "public_info": "visible"}
Output: {"name": "user1", "public_info": "visible"}
```

### conditional

Applies different processor chains based on conditions.

**Parameters:**
- `path` (string, optional): JSONPath to extract value for condition evaluation
- `routes` (array, required): Array of condition-processor mappings
- `default` (array, optional): Default processors if no conditions match

**Supported conditions:**
- Exact value match: `"value"`
- Numeric comparisons: `">10"`, `"<5"`, `">=", `"<="`, `"==5"`
- Existence checks: `"exists"`, `"null"`, `"not_exists"`
- Regex matching: `"regex:pattern"`
- Contains text: `"contains:substring"`

**Example Configuration:**
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

**Example Input/Output:**
```
Input: {"index": "test-index", "status": "green", "docs": 100}
Output: {"index": "test-index", "healthy": "green", "docs": 100}
```

### process_and_set

Applies a chain of processors to the input and sets the result at a specified JSONPath location.

**Parameters:**
- `path` (string, required): JSONPath expression specifying where to set the processed result
- `processors` (array, required): List of processor configurations to apply sequentially

**Path behavior:**
- If the path exists, it will be updated with the processed value
- If the path doesn't exist, attempts to create it (works for simple nested fields)
- Parent path must exist for new field creation to succeed

**Example Configuration:**
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

**Example Input/Output:**
```
Input: {"name": "Test Index!", "status": "active"}
Output: {"name": "Test Index!", "status": "active", "summary": {"clean_name": "Test_Index_"}}
```

### set_field

Sets a field to a specified static value or copies a value from another field.

**Parameters:**
- `path` (string, required): JSONPath expression specifying where to set the value
- `value` (any, conditionally required): Static value to set. Either `value` or `source_path` must be provided
- `source_path` (string, conditionally required): JSONPath to copy value from. Either `value` or `source_path` must be provided
- `default` (any, optional): Default value when `source_path` doesn't exist. Only used with `source_path`

**Path behavior:**
- If the path exists, it will be updated with the new value
- If the path doesn't exist, attempts to create it (works for simple nested fields)
- Parent path must exist for new field creation to succeed

**Example Configuration (static value):**
```json
{
  "type": "set_field",
  "path": "$.metadata.processed_at",
  "value": "2024-03-15T10:30:00Z"
}
```

**Example Configuration (copy field):**
```json
{
  "type": "set_field",
  "path": "$.userId",
  "source_path": "$.user.id",
  "default": "unknown"
}
```

**Example Input/Output:**
```
Input: {"user": {"id": 123}, "name": "John"}
Output: {"user": {"id": 123}, "name": "John", "userId": 123, "metadata": {"processed_at": "2024-03-15T10:30:00Z"}}
```

### for_each

Iterates through array elements and applies a chain of processors to each element. Useful for transforming array elements uniformly, such as adding missing fields, filtering content, or normalizing data structures.

**Parameters:**
- `path` (string, required): JSONPath expression pointing to the array to iterate over. Must use `[*]` notation for array elements
- `processors` (array, required): List of processor configurations to apply to each array element

**Behavior:**
- Each element is processed independently with the configured processor chain
- The output of the processor chain replaces the original element
- If the path doesn't exist or doesn't point to an array, returns input unchanged
- If processing an element fails, the original element is kept

**Example Configuration:**
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

**Example Input/Output:**
```
Input: {
  "items": [
    {"name": "item1", "value": 10},
    {"name": "item2", "value": 20}
  ]
}
Output: {
  "items": [
    {"name": "item1", "value": 10, "processed": true},
    {"name": "item2", "value": 20, "processed": true}
  ]
}
```

### Example usage with agents

**Step 1: Register a flow agent with output processors**

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

**Step 2: Execute the agent**

Using the `agent_id` returned in the previous step:

```json
POST /_plugins/_ml/agents/{agent_id}/_execute
{
  "parameters": {
    "question": "List the indices"
  }
}
```

**Without output processors, the raw ListIndexTool would return:**
```
row,health,status,index,uuid,pri,rep,docs.count,docs.deleted,store.size,pri.store.size
1,green,open,.plugins-ml-model-group,DCJHJc7pQ6Gid02PaSeXBQ,1,0,1,0,12.7kb,12.7kb
2,green,open,.plugins-ml-memory-message,6qVpepfRSCi9bQF_As_t2A,1,0,7,0,53kb,53kb
3,green,open,.plugins-ml-memory-meta,LqP3QMaURNKYDZ9p8dTq3Q,1,0,2,0,44.8kb,44.8kb
```

**With output processors, the agent returns:**
```
1,green,open,.plugins-ml-model-group
2,green,open,.plugins-ml-memory-message
3,green,open,.plugins-ml-memory-meta
```

The output processors transform the verbose CSV output into a clean, readable format by:
1. **`regex_replace`**: Removing the CSV header row
2. **`regex_capture`**: Extracting only essential information (row number, health, status, and index name)

## Example usage with models

The following examples demonstrate how to use processor chains with models during prediction calls.

### Input processors example

This example shows how to modify model input using `input_processors` to replace text before processing:

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

In this example, the `regex_replace` processor modifies the prompt before it's sent to the model, changing "100 words" to "20 words".

### Output processors example

This example shows how to process model output using `output_processors` to extract and format JSON data:

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

In this example, the output processors:
1. Extract the content from the model response using JSONPath
2. Parse and extract the JSON object from the text response

**Without output processors, the raw response would be:**
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

**With output processors, the response becomes:**
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
