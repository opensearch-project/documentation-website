---
layout: default
title: subList()
parent: Functions
grand_parent: Pipelines
nav_order: 
---

# subList(\<key>, <start_index, inclusive>, <end_index, exclusive>)

The `subList()` function takes first argument as JSON pointer type to a list field in events and takes second and third arguments as start index (inclusive) and end index (exclusive) for the subList, and returns the subList of the passed list.

An end index value of -1, could signal to extract from start_index to the end of the list.

This function could then be used in the add_entries processor like this

```
input: {"my_list": [ 0, 1, 2, 3, 4, 5, 6]}
```
```yaml
add_entries:
  entries:
    - key: "my_list"
      value_expression: '/subList(/my_list, 1, 4)'
      overwrite_if_key_exists: true
```
```
output: my_list: [1, 2, 3]
```

#### Example 

```json
{
  "event": {
    "/my_list":  [0, 1, 2, 3, 4, 5, 6]

  },
  "expression": "subList(/message, "0", "3")",
  "expected_output": [0, 1, 2]
}
{
  "event": {
    "/my_list":  [0, 1, 2, 3, 4, 5, 6]

  },
  "expression": "subList(/message, "4", "-1")",
  "expected_output": [4, 5, 6]
}
```
{% include copy-curl.html %}