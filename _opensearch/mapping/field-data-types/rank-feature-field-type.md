---
layout: default
title: Rank feature field type
parent: Field data types
grand_parent: Mapping
---
# Rank feature field type
Field type `rank_feature` index numbers that can be used to boost documents, by using [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query.

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
  "pagerank": 1,
  "url_length": 11
}

PUT /test/_doc/2?refresh
{
"pagerank": 2,
"url_length": 22
}


PUT /test/_doc/3?refresh
{
"pagerank": 3,
"url_length": 33
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

`positive_score_impact` - declare how feature correlates with score during [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) query.
For instance, if set flag `positive_score_impact` to `false` it will correlate negatively with score, if set `true` - positive. Default is `true`.

`rank_feature` fields not supports multi-valued fields and negative values. During indexation - they will be rejected.
{: .note }

`rank_feature` fields do not support querying, sorting or aggregating. They only used within [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/rank-feature/) queries.
{: .note }

`rank_feature` fields only preserve 9 significant bits for the precision, which translates to a relative error of about 0.4%. In practice this limitation means that values are stored with a relative precision of `2^−8 = 0.00390625`, [source](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/document/FeatureField.html).
{: .note }
