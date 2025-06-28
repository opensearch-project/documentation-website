---
layout: default
title: Composite
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 20
has_children: true
---

# Composite

The `composite` aggregation is a multi-bucket aggregation that creates composite buckets from different sources. It is useful for efficiently paginating multi-level aggregations and retrieving all buckets. Composite buckets are built from combinations of values extracted from documents for each specified source field.

## Syntax

```json
{
  "composite": {
    "sources": [
      {
        "source_field_1": {
          "terms": {
            "field": "field_name"
          }
        }
      },
      {
        "source_field_2": {
          "terms": {
            "field": "another_field_name"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

Property | Description |
---------|------------|
`composite` | The aggregation type.
`sources ` | An array of source objects, where each object defines a source field for the composite buckets.
`terms` | The subaggregation type used to extract the values from the specified field for each source. 
`field` | The field name in your documents from which the values will be extracted for the corresponding source.

For example, consider the following document: 

```json
{
  "product": "T-Shirt",
  "category": "Clothing",
  "brand": "Acme",
  "price": 19.99,
  "sizes": ["S", "M", "L"],
  "colors": ["red", "blue"]
}
```
{% include copy-curl.html %}

Using `sizes` and `colors` as source fields for the aggregation results in the following composite buckets: 

```json
{ "sizes": "S", "colors": "red" }
{ "sizes": "S", "colors": "blue" }
{ "sizes": "M", "colors": "red" }
{ "sizes": "M", "colors": "blue" }
{ "sizes": "L", "colors": "red" }
{ "sizes": "L", "colors": "blue" }
```
{% include copy-curl.html %}

## Compatibility and limitations 

<SME: What version of OpenSearch is this compatible with? What are the limitations?>

## Performance considerations

<What are the performance implications or best practices for using this aggregation?>
