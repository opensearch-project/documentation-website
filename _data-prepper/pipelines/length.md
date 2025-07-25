---
layout: default
title: length()
parent: Functions
grand_parent: Pipelines
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/length/
---

# length()

The `length()` function takes one argument of the JSON pointer type and returns the length of the passed value. For example, `length(/message)` returns a length of `10` when a key message exists in the event and has a value of `1234567890`.

#### Example 

```json
{
  "event": {
    "/message": "1234567890"
  },
  "expression": "length(/message)",
  "expected_output": 10
}
```
{% include copy-curl.html %}
