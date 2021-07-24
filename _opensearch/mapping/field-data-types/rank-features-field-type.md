---
layout: default
title: Rank features field type
parent: Field data types
grand_parent: Mapping
---
# Rank features field type
Field type `rank_features` index numeric feature map that can be used to boost documents, by using [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query.

This data type is better suited when the list of features is sparse and there no reason to add for each feature field in the mappings.

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

PUT /test/_doc/3?refresh
{
    "topics": {
        "politics": 1.2,
        "sports": 30.1
    },
    "negative_reviews": {
      "1star": 1000,
      "2star": 33
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

`positive_score_impact` - declare how features correlates with score during [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query.
For instance, if set flag `positive_score_impact` to `false` it will correlate negatively with score, if set `true` - positive. Default is `true`.

`rank_features` fields must be a hash with string keys and strictly positive numeric values.
{: .tip }

`rank_features` fields not supports multi-valued fields and negative values. During indexation - they will be rejected.
{: .note }

`rank_features` fields do not support querying, sorting or aggregating. They only used within [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) queries.
{: .note }

`rank_features` fields only preserve 9 significant bits for the precision, which translates to a relative error of about 0.4%. In practice this limitation means that values are stored with a relative precision of `2^−8 = 0.00390625`, [source](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/document/FeatureField.html).
{: .note }
