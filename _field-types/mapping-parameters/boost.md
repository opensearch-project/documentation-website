---
layout: default
title: Boost
parent: Mapping parameters

nav_order: 10
has_children: false
has_toc: false
---

# Boost 

The `boost` mapping parameter is used to increase or decrease the relevance score of a field during search queries. It allows you to apply more or less weight to specific fields when calculating the overall relevance score of a document.

The `boost` parameter is applied as a multiplier to the score of a field. For example, if a field has a `boost` value of `2`, then the score contribution of that field is doubled. Conversely, a `boost` value of `0.5` would halve the score contribution of that field.

-----------

## Example

The following is an example of how you can use the `boost` parameter in an OpenSearch mapping:

```json
PUT my-index1
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "boost": 2
      },
      "description": {
        "type": "text",
        "boost": 1
      },
      "tags": {
        "type": "keyword",
        "boost": 1.5
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, the `title` field has a boost of `2`, which means that it contributes twice as much to the overall relevance score than the description field (which has a boost of `1`). The `tags` field has a boost of `1.5`, so it contributes one and a half times more than the description field.

The `boost` parameter is particularly useful when you want to apply more weight to certain fields. For example, you might want to boost the `title` field more than the `description` field because the title may be a better indicator of the document's relevance.

The `boost` parameter is a multiplicative factor---not an additive one. This means that a field with a higher boost value will have a disproportionately large effect on the overall relevance score as compared to fields with lower boost values. When using the `boost` parameter, it is recommended that you start with small values (1.5 or 2) and test the effect on your search results. Overly high boost values can skew the relevance scores and lead to unexpected or undesirable search results.
