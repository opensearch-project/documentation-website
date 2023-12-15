---
layout: default
title: Significant terms
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 180
---

# Significant terms aggregations

The `significant_terms` aggregation lets you spot unusual or interesting term occurrences in a filtered subset relative to the rest of the data in an index.

A foreground set is the set of documents that you filter. A background set is a set of all documents in an index.
The `significant_terms` aggregation examines all documents in the foreground set and finds a score for significant occurrences in contrast to the documents in the background set.

In the sample web log data, each document has a field containing the `user-agent` of the visitor. This example searches for all requests from an iOS operating system. A regular `terms` aggregation on this foreground set returns Firefox because it has the most number of documents within this bucket. On the other hand, a `significant_terms` aggregation returns Internet Explorer (IE) because IE has a significantly higher appearance in the foreground set as compared to the background set.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "query": {
    "terms": {
      "machine.os.keyword": [
        "ios"
      ]
    }
  },
  "aggs": {
    "significant_response_codes": {
      "significant_terms": {
        "field": "agent.keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
"aggregations" : {
  "significant_response_codes" : {
    "doc_count" : 2737,
    "bg_count" : 14074,
    "buckets" : [
      {
        "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
        "doc_count" : 818,
        "score" : 0.01462731514608217,
        "bg_count" : 4010
      },
      {
        "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
        "doc_count" : 1067,
        "score" : 0.009062566630410223,
        "bg_count" : 5362
      }
    ]
  }
 }
}
```

If the `significant_terms` aggregation doesn't return any result, you might have not filtered the results with a query. Alternatively, the distribution of terms in the foreground set might be the same as the background set, implying that there isn't anything unusual in the foreground set.

The default source of statistical information for background term frequencies is the entire index. You can narrow this scope with a background filter for more focus

