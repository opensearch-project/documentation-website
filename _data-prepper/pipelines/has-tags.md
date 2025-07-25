---
layout: default
title: hasTags()
parent: Functions
grand_parent: Pipelines
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/has-tags/
---

# hasTags()

The `hasTags()` function takes one or more string type arguments and returns `true` if all of the arguments passed are present in an event's tags. If an argument does not exist in the event's tags, then the function returns `false`. 

For example, if you use the expression `hasTags("tag1")` and the event contains `tag1`, then Data Prepper returns `true`. If you use the expression `hasTags("tag2")` but the event only contains `tag1`, then Data Prepper returns `false`.

#### Example

```json
{
  "events": [
    {
      "tags": ["tag1"],
      "data": {
        // ...
      }
    },
    {
      "tags": ["tag1", "tag2"],
      "data": {
        // ...
      }
    }
  ],
  "expressions": [
    {
      "expression": "hasTags(\"tag1\")",
      "expected_results": [true, true]
    },
    {
      "expression": "hasTags(\"tag2\")",
      "expected_results": [false, true]
    }
  ]
}
```
{% include copy-curl.html %}
