---
layout: default
title: boost
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 10
has_children: false
has_toc: false
---

# `boost` 

The `boost` mapping parameter is used to increase or decrease the relevance score of a field during search queries. It allows you to give more or less weight to specific fields when calculating the overall relevance score for a document.

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

In this example, the `title` field has a boost of 2, which means it contributes twice as much to the overall relevance score as the description field (which has a boost of 1). The `tags` field has a boost of 1.5, so it contributes 1.5 times more than the description field.

The `boost` parameter is particularly useful when you want to give more weight to certain fields that are more important for your use case. For example, you might want to boost the `title` field more than the `description` field, as the title is often a better indicator of the document's relevance.

It is important to note that the `boost` parameter is a multiplicative factor, not an additive one. This means that a field with a higher boost value will have a disproportionately higher impact on the overall relevance score compared to fields with lower boost values.

When using the `boost` parameter, it is recommended to start with small values (1.5 or 2) and test the impact on your search results. Overly high boost values can skew the relevance scores and lead to unexpected or undesirable search results.
