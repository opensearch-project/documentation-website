---
layout: default
title: Rank features field type
parent: Field data types
grand_parent: Mapping
---
# Rank features field type
A `rank_features` field can index numeric feature vectors, so that they can later be used to boost documents in queries with a [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query.

It is analogous to the [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/mapping/field-data-types/rank-feature-field-type/) data type but is better suited when the list of features is sparse so that it wouldn’t be reasonable to add one field to the mappings for each of them.

```json
PUT /test
{
  "mappings": {
    "properties": {
      "topics": {
        "type": "rank_features" 
      },
      "negative_reviews" : {
        "type": "rank_features",
        "positive_score_impact": false 
      }
    }
  }
}

PUT /test/_doc/1?refresh
{
  "topics": { 
    "politics": 20,
    "economics": 50.8
  },
  "negative_reviews": {
    "1star": 10,
    "2star": 100
  }
}

PUT /test/_doc/2?refresh
{
  "topics": {
    "politics": 5.2,
    "sports": 80.1
  },
  "negative_reviews": {
    "1star": 1,
    "2star": 10
  }
}

GET /test/_search
{
  "query": { 
    "rank_feature": {
      "field": "topics.politics"
    }
  }
}

GET /test/_search
{
  "query": { 
    "rank_feature": {
      "field": "negative_reviews.1star"
    }
  }
}
```

Rank features fields must use the rank_features field type
{: .tip }

Rank features that correlate negatively with the score need to declare it
{: .tip }

Rank features fields must be a hash with string keys and strictly positive numeric values
{: .tip }

This query ranks documents by how much they are about the "politics" topic.
{: .tip }

This query ranks documents inversely to the number of "1star" reviews they received.
{: .tip }

`rank_features` fields only support single-valued features and strictly positive values. Multi-valued fields and zero or negative values will be rejected.
{: .note }

`rank_features` fields do not support sorting or aggregating and may only be queried using [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) queries.
{: .note }

`rank_features` fields only preserve 9 significant bits for the precision, which translates to a relative error of about 0.4%. In practice this limitation means that values are stored with a relative precision of `2^−8 = 0.00390625`, [source](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/document/FeatureField.html).
{: .note }

Rank features that correlate negatively with the score should set `positive_score_impact` to `false` (defaults to `true`). This will be used by the [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query to modify the scoring formula in such a way that the score decreases with the value of the feature instead of increasing.
