---
layout: default
title: Diversified sampler
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 40
redirect_from:
  - /query-dsl/aggregations/bucket/diversified-sampler/
---

# Diversified sampler

The `diversified_sampler` aggregation lets you reduce the bias in the distribution of the sample pool by deduplicating documents containing the same `field`. It does so by using the `max_docs_per_value` and `field` settings, which limit the maximum number of documents collected on a shard for the provided `field`. The `max_docs_per_value` setting is an optional parameter used to determine up to how many documents per `field` will be returned. The default value of this setting is `1`.

Similarly to the [`sampler` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/sampler/), you can use the `shard_size` setting to control the maximum number of documents collected on any one shard, as shown in the following example:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "diversified_": {
        "shard_size": 1000,
        "field": "response.keyword"
      },
      "aggs": {
        "terms": {
          "terms": {
            "field": "agent.keyword"
          }
        }
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
  "sample" : {
    "doc_count" : 3,
    "terms" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
          "doc_count" : 2
        },
        {
          "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
          "doc_count" : 1
        }
      ]
    }
  }

 }
}
```
 
