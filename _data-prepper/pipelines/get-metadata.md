---
layout: default
title: getMetadata()
parent: Functions
grand_parent: Pipelines
nav_order: 15
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/get-metadata/
---

# getMetadata()

The `getMetadata()` function takes one literal string argument and looks up specific keys in event metadata. 

If the key contains a `/`, then the function looks up the metadata recursively. When passed, the expression returns the value corresponding to the key. 

The value returned can be of any type. For example, if the metadata contains `{"key1": "value2", "key2": 10}`, then the function `getMetadata("key1")` returns `value2`. The function `getMetadata("key2")` returns `10`.

#### Example 

```json
{
  "event": {
    "metadata": {
      "key1": "value2",
      "key2": 10
    },
    "data": {
      // ...
    }
  },
  "output": [
    {
      "key": "key1",
      "value": "value2"
    },
    {
      "key": "key2",
      "value": 10
    }
  ]
}
```
{% include copy.html %}
