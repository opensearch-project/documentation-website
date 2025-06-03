---
layout: default
title: subList()
parent: Functions
grand_parent: Pipelines
nav_order: 35
---

# subList(<key>, <start_index, inclusive>, <end_index, exclusive>)

The `subList()` function extracts a sublist from a list field in an event. It takes the following arguments:

- A JSON pointer to a list field in the event
- A start index (inclusive)
- An end index (exclusive)

The function returns the portion of the list between the specified start and end indexes. If the end index is `-1`, the function extracts elements from the start index to the end of the list.


## Examples

The following examples show how the `sublist()` function works.

### add_entries processor

You can use `subList()` in the `add_entries` processor, as shown in the following example.

For example, the function will use the following input to extact a sublist:

```
input: {"my_list": [ 0, 1, 2, 3, 4, 5, 6]}
```

Then, the following configuration uses the `add_entries` processor to extract a sublist from `my_list`, starting at index 1 and ending before index 4: 

```yaml
add_entries:
  entries:
    - key: "my_list"
      value_expression: '/subList(/my_list, 1, 4)'
      overwrite_if_key_exists: true
```
{% include copy-curl.html %}

The following output shows the resulting list after extracting elements from index 1 to 3 and overwriting the original list:

```
output: my_list: [1, 2, 3]
```

### Specific ranges

Each of the following examples demonstrates how the `subList()` function extracts a specific range of elements from a list.

The following example extracts elements from index `0` to `2` (excluding index `3`), resulting in the first three elements of the list:

```json
{
  "event": {
    "/my_list": [0, 1, 2, 3, 4, 5, 6]
  },
  "expression": "subList(/my_list, 4, -1)",
  "expected_output": [4, 5, 6]
}
```
{% include copy-curl.html %}

The following example uses `-1` as the end index, which tells the function to include all elements from index `4` to the end of the list:

```json
{
  "event": {
    "/my_list": [0, 1, 2, 3, 4, 5, 6]
  },
  "expression": "subList(/my_list, 4, -1)",
  "expected_output": [4, 5, 6]
}
```
{% include copy-curl.html %}
