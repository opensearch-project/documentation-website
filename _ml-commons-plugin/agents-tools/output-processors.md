---
layout: default
title: Output processors
parent: Agents and tools
grand_parent: ML Commons APIs
nav_order: 30
---

# Output processors
**Introduced 3.3**
{: .label .label-purple }

Output processors allow you to modify and transform the output of any tool before it's returned to the agent or user. You can chain multiple output processors together to create complex data transformation pipelines that execute sequentially.

## Overview

Output processors provide a powerful way to:

- **Transform data formats**: Convert between different data structures (strings, JSON, arrays)
- **Extract specific information**: Use JSONPath or regex patterns to pull out relevant data
- **Clean and filter content**: Remove unwanted fields or apply formatting rules
- **Standardize outputs**: Ensure consistent data formats across different tools

Each tool can have multiple output processors that execute in the order they are defined. The output of one processor becomes the input for the next processor in the chain.

## Configuration

Add output processors to any tool by including an `output_processors` array in the tool's `parameters` section during agent registeration:

Example:
```json
{
  "type": "ToolName",
  "parameters": {
    "output_processors": [
      {
        "type": "processor_type",
        "parameter1": "value1",
        "parameter2": "value2"
      },
      {
        "type": "another_processor_type",
        "parameter": "value"
      }
    ]
  }
}
```

### Sequential execution

Output processors execute in the order they appear in the array. Each processor receives the output from the previous processor (or the original tool output for the first processor):

```
Tool Output → Processor 1 → Processor 2 → Processor 3 → Final Output
```

### Complete example

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

## Supported Output Processor Types

### to_string

Converts the input to a JSON string representation.

**Parameters:**
- `escape_json` (boolean, optional): Whether to escape JSON characters. Default: `false`

**Configuration:**
```json
{
  "type": "to_string",
  "escape_json": true
}
```

**Input/Output Example:**
```
Input: {"name": "test", "value": 123}
Output: "{\"name\":\"test\",\"value\":123}"
```

### regex_replace

Replaces text using regular expression patterns.

**Parameters:**
- `pattern` (string, required): Regular expression pattern to match
- `replacement` (string, optional): Replacement text. Default: `""`
- `replace_all` (boolean, optional): Whether to replace all matches or just the first. Default: `true`

**Configuration:**
```json
{
  "type": "regex_replace",
  "pattern": "ERROR",
  "replacement": "WARNING",
  "replace_all": true
}
```

**Input/Output Example:**
```
Input: "ERROR: Connection failed. ERROR: Timeout occurred."
Output: "WARNING: Connection failed. WARNING: Timeout occurred."
```

### jsonpath_filter

Extracts data using JSONPath expressions.

**Parameters:**
- `path` (string, required): JSONPath expression to extract data
- `default` (any, optional): Default value if path is not found

**Configuration:**
```json
{
  "type": "jsonpath_filter",
  "path": "$.data.items[*].name",
  "default": []
}
```

**Input/Output Example:**
```
Input: {"data": {"items": [{"name": "item1"}, {"name": "item2"}]}}
Output: ["item1", "item2"]
```

### extract_json

Extracts JSON objects or arrays from text strings.

**Parameters:**
- `extract_type` (string, optional): Type of JSON to extract - `"object"`, `"array"`, or `"auto"`. Default: `"auto"`
- `default` (any, optional): Default value if JSON extraction fails

**Configuration:**
```json
{
  "type": "extract_json",
  "extract_type": "object",
  "default": {}
}
```

**Input/Output Example:**
```
Input: "The result is: {\"status\": \"success\", \"count\": 5} - processing complete"
Output: {"status": "success", "count": 5}
```

### regex_capture

Captures specific groups from regex matches.

**Parameters:**
- `pattern` (string, required): Regular expression pattern with capture groups
- `groups` (string or array, optional): Group numbers to capture. Can be a single number like `"1"` or array like `"[1, 2, 4]"`. Default: `"1"`

**Configuration:**
```json
{
  "type": "regex_capture",
  "pattern": "(\\d+),(\\w+),(\\w+),([^,]+)",
  "groups": "[1, 4]"
}
```

**Input/Output Example:**
```
Input: "1,green,open,.plugins-ml-model-group,DCJHJc7pQ6Gid02PaSeXBQ,1,0"
Output: ["1", ".plugins-ml-model-group"]
```

### remove_jsonpath

Removes fields from JSON objects using JSONPath.

**Parameters:**
- `path` (string, required): JSONPath expression identifying fields to remove

**Configuration:**
```json
{
  "type": "remove_jsonpath",
  "path": "$.sensitive_data"
}
```

**Input/Output Example:**
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

**Configuration:**
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

**Input/Output Example:**
```
Input: {"index": "test-index", "status": "green", "docs": 100}
Output: {"index": "test-index", "healthy": "green", "docs": 100}
```