---
layout: default
title: Span not
parent: Span queries
grand_parent: Query DSL
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/query-dsl/span/span-not/
---

# Span not query

The `span_not` query excludes spans that overlap with another span query. You can also specify the distance before or after the excluded spans within which matches cannot occur.

For example, you can use the `span_not` query to:
- Find terms except when they appear in certain phrases.
- Match spans unless they are near specific terms.
- Exclude matches that occur within a certain distance of other patterns.

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for the word "dress" but not when it appears in the phrase "dress shirt":

```json
GET /clothing/_search
{
  "query": {
    "span_not": {
      "include": {
        "span_term": {
          "description": "dress"
        }
      },
      "exclude": {
        "span_near": {
          "clauses": [
            {
              "span_term": {
                "description": "dress"
              }
            },
            {
              "span_term": {
                "description": "shirt"
              }
            }
          ],
          "slop": 0,
          "in_order": true
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query matches document 2 because it contains the word "dress" ("Beautiful long dress..."). Document 1 is not matched because it contains the phrase "dress shirt", which is excluded. Documents 3 and 4 are not matched because they contain variations of the word "dress" ("dressed" and "dresses"), and the query is searching the raw field. 

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json

```
</details>

## Parameters

The following table lists all top-level parameters supported by `span_not` queries.

| Parameter | Data type | Description | 
|:----------|:-----|:------------|
| `include` | Object | The span query whose matches you want to find. Required. |
| `exclude` | Object | The span query whose matches should be excluded. Required. |
| `pre` | Integer | Specifies that the `exclude` span cannot appear within the given number of token positions before the `include` span. Optional. Default is `0`. |
| `post` | Integer | Specifies that the `exclude` span cannot appear within the given number of token positions after the `include` span. Optional. Default is `0`. |
| `dist` | Integer | Equivalent to setting both `pre` and `post` to the same value. Optional. |
