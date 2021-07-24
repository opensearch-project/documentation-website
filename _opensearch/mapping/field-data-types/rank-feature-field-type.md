---
layout: default
title: Rank feature field type
parent: Field data types
grand_parent: Mapping
---
# Rank feature field type
A `rank_feature` field can index numbers so that they can later be used to boost documents in queries with a [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query.

```json
PUT /test
{
  "mappings": {
    "properties": {
      "pagerank": {
        "type": "rank_feature" 
      },
      "url_length": {
        "type": "rank_feature",
        "positive_score_impact": false 
      }
    }
  }
}

PUT /test/_doc/1?refresh
{
  "pagerank": 8,
  "url_length": 22
}

GET /test/_search
{
  "query": {
    "rank_feature": {
      "field": "pagerank"
    }
  }
}
```
Rank feature fields must use the `rank_feature` field type
{: .tip }

Rank features that correlate negatively with the score need to declare it
{: .tip }

`rank_feature` fields only support single-valued fields and strictly positive values. Multi-valued fields and negative values will be rejected.
{: .note }

`rank_feature` fields do not support querying, sorting or aggregating. They may only be used within [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) queries.
{: .note }

`rank_feature` fields only preserve 9 significant bits for the precision, which translates to a relative error of about 0.4%. In practice this limitation means that values are stored with a relative precision of `2^−8 = 0.00390625`, [source](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/document/FeatureField.html).
{: .note }

Rank features that correlate negatively with the score should set `positive_score_impact` to `false` (defaults to `true`). 
This will be used by the [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query to modify the scoring formula in such a way that the score decreases with the value of the feature instead of increasing. For instance in web search, the url length is a commonly used feature which correlates negatively with scores.
