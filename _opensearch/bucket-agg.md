---
layout: default
title: Bucket Aggregations
parent: Aggregations
nav_order: 2
has_children: false
canonical_url: https://docs.opensearch.org/latest/aggregations/bucket/index/
---

# Bucket aggregations

Bucket aggregations categorize sets of documents as buckets. The type of bucket aggregation determines whether a given document falls into a bucket or not.

You can use bucket aggregations to implement faceted navigation (usually placed as a sidebar on a search result landing page) to help your users narrow down the results.

## Terms

The `terms` aggregation dynamically creates a bucket for each unique term of a field.

The following example uses the `terms` aggregation to find the number of documents per response code in web log data:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10
      }
    }
  }
}
```

#### Sample Response

```json
...
"aggregations" : {
  "response_codes" : {
    "doc_count_error_upper_bound" : 0,
    "sum_other_doc_count" : 0,
    "buckets" : [
      {
        "key" : "200",
        "doc_count" : 12832
      },
      {
        "key" : "404",
        "doc_count" : 801
      },
      {
        "key" : "503",
        "doc_count" : 441
      }
    ]
  }
 }
}
```

The values are returned with the key `key`.
`doc_count` specifies the number of documents in each bucket. By default, the buckets are sorted in descending order of `doc-count`.

The response also includes two keys named `doc_count_error_upper_bound` and `sum_other_doc_count`.

The `terms` aggregation returns the top unique terms. So, if the data has many unique terms, then some of them might not appear in the results. The `sum_other_doc_count` field is the sum of the documents that are left out of the response. In this case, the number is 0 because all the unique values appear in the response.

The `doc_count_error_upper_bound` field represents the maximum possible count for a unique value that's left out of the final results. Use this field to estimate the error margin for the count.

The count might not be accurate. A coordinating node that’s responsible for the aggregation prompts each shard for its top unique terms. Imagine a scenario where the `size` parameter is 3.
The `terms` aggregation requests each shard for its top 3 unique terms. The coordinating node takes each of the results and aggregates them to compute the final result. If a shard has an object that’s not part of the top 3, then it won't show up in the response.

This is especially true if `size` is set to a low number. Because the default size is 10, an error is unlikely to happen. If you don’t need high accuracy and want to increase the performance, you can reduce the size.

### Account for pre-aggregated data

While the `doc_count` field provides a representation of the number of individual documents aggregated in a bucket, `doc_count` by itself does not have a way to correctly increment documents that store pre-aggregated data. To account for pre-aggregated data and accurately calculate the number of documents in a bucket, you can use the `_doc_count` field to add the number of documents in a single summary field. When a document includes the `_doc_count` field, all bucket aggregations recognize its value and increase the bucket `doc_count` cumulatively. Keep these considerations in mind when using the `_doc_count` field:

* The field does not support nested arrays; only positive integers can be used.
* If a document does not contain the `_doc_count` field, aggregation uses the document to increase the count by 1.

OpenSearch features that rely on an accurate document count illustrate the importance of using the `_doc_count` field. To see how this field can be used to support other search tools, refer to [Index rollups](https://docs.opensearch.org/latest/im-plugin/index-rollups/index/), an OpenSearch feature for the Index Management (IM) plugin that stores documents with pre-aggregated data in rollup indexes.
{: .tip}

### Example usage

```json
PUT /my_index/_doc/1
{
  "response_code": 404,
  "date":"2022-08-05",
  "_doc_count": 20
}

PUT /my_index/_doc/2
{
  "response_code": 404,
  "date":"2022-08-06",
  "_doc_count": 10
}

PUT /my_index/_doc/3
{
  "response_code": 200,
  "date":"2022-08-06",
  "_doc_count": 300
}

GET /my_index/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field" : "response_code"
      }
    }
  }
}
```

#### Example response

```json
{
  "took" : 20,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "response_codes" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 200,
          "doc_count" : 300
        },
        {
          "key" : 404,
          "doc_count" : 30
        }
      ]
    }
  }
}
```

## Multi-terms

Similar to the `terms` bucket aggregation, you can also search for multiple terms using the `multi_terms` aggregation. Multi-terms aggregations are useful when you need to sort by document count, or when you need to sort by a metric aggregation on a composite key and get the top `n` results. For example, you could search for a specific number of documents (e.g., 1000) and the number of servers per location that show CPU usage greater than 90%. The top number of results would be returned for this multi-term query.

The `multi_terms` aggregation does consume more memory than a `terms` aggregation, so its performance might be slower.
{: .tip }

### Multi-terms aggregation parameters

Parameter | Description
:--- | :---
multi_terms | Indicates a multi-terms aggregation that gathers buckets of documents together based on criteria specified by multiple terms.
size | Specifies the number of buckets to return. Default is 10.
order | Indicates the order to sort the buckets. By default, buckets are ordered according to document count per bucket. If the buckets contain the same document count, then `order` can be explicitly set to the term value instead of document count. (e.g., set `order` to "max-cpu").
doc_count | Specifies the number of documents to be returned in each bucket. By default, the top 10 terms are returned.

#### Sample Request

```json
GET sample-index100/_search
{
  "size": 0, 
  "aggs": {
    "hot": {
      "multi_terms": {
        "terms": [{
          "field": "region" 
        },{
          "field": "host" 
        }],
        "order": {"max-cpu": "desc"}
      },
      "aggs": {
        "max-cpu": { "max": { "field": "cpu" } }
      }      
    }
  }
}
```

#### Sample Response

```json
{
  "took": 118,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 8,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "multi-terms": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": [
            "dub",
            "h1"
          ],
          "key_as_string": "dub|h1",
          "doc_count": 2,
          "max-cpu": {
            "value": 90.0
          }
        },
        {
          "key": [
            "dub",
            "h2"
          ],
          "key_as_string": "dub|h2",
          "doc_count": 2,
          "max-cpu": {
            "value": 70.0
          }
        },
        {
          "key": [
            "iad",
            "h2"
          ],
          "key_as_string": "iad|h2",
          "doc_count": 2,
          "max-cpu": {
            "value": 50.0
          }
        },
        {
          "key": [
            "iad",
            "h1"
          ],
          "key_as_string": "iad|h1",
          "doc_count": 2,
          "max-cpu": {
            "value": 15.0
          }
        }
      ]
    }
  }
}
```

## sampler, diversified_sampler

If you're aggregating over millions of documents, you can use a `sampler` aggregation to reduce its scope to a small sample of documents for a faster response. The `sampler` aggregation selects the samples by top-scoring documents.

The results are approximate but closely represent the distribution of the real data. The `sampler` aggregation significantly improves query performance, but the estimated responses are not entirely reliable.

The basic syntax is:

```json
“aggs”: {
  "SAMPLE": {
    "sampler": {
      "shard_size": 100
    },
    "aggs": {...}
  }
}
```

The `shard_size` property tells OpenSearch how many documents (at most) to collect from each shard.

The following example limits the number of documents collected on each shard to 1,000 and then buckets the documents by a `terms` aggregation:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 1000
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

#### Example response

```json
...
"aggregations" : {
  "sample" : {
    "doc_count" : 1000,
    "terms" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
          "doc_count" : 368
        },
        {
          "key" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.50 Safari/534.24",
          "doc_count" : 329
        },
        {
          "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
          "doc_count" : 303
        }
      ]
    }
  }
 }
}
```

The `diversified_sampler` aggregation lets you reduce the bias in the distribution of the sample pool. You can use the `field` setting to control the maximum number of documents collected on any one shard which shares a common value:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "diversified_sampler": {
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

## significant_terms, significant_text

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

The `significant_text` aggregation is similar to the `significant_terms` aggregation but it's for raw text fields.
Significant text measures the change in popularity measured between the foreground and background sets using statistical analysis. For example, it might suggest Tesla when you look for its stock acronym TSLA.

The `significant_text` aggregation re-analyzes the source text on the fly, filtering noisy data like duplicate paragraphs, boilerplate headers and footers, and so on, which might otherwise skew the results.

Re-analyzing high-cardinality datasets can be a very CPU-intensive operation. We recommend using the `significant_text` aggregation inside a sampler aggregation to limit the analysis to a small selection of top-matching documents, for example 200.

You can set the following parameters:

- `min_doc_count` - Return results that match more than a configured number of top hits. We recommend not setting `min_doc_count` to 1 because it tends to return terms that are typos or misspellings. Finding more than one instance of a term helps reinforce that the significance is not the result of a one-off accident. The default value of 3 is used to provide a minimum weight-of-evidence.
- `shard_size` - Setting a high value increases stability (and accuracy) at the expense of computational performance.
- `shard_min_doc_count` - If your text contains many low frequency words and you're not interested in these (for example typos), then you can set the `shard_min_doc_count` parameter to filter out candidate terms at a shard level with a reasonable certainty to not reach the required `min_doc_count` even after merging the local significant text frequencies. The default value is 1, which has no impact until you explicitly set it. We recommend setting this value much lower than the `min_doc_count` value.

Assume that you have the complete works of Shakespeare indexed in an OpenSearch cluster. You can find significant texts in relation to the word "breathe" in the `text_entry` field:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggregations": {
    "my_sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggregations": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 4
          }
        }
      }
    }
  }
}
```

#### Example response

```json
"aggregations" : {
  "my_sample" : {
    "doc_count" : 59,
    "keywords" : {
      "doc_count" : 59,
      "bg_count" : 111396,
      "buckets" : [
        {
          "key" : "breathe",
          "doc_count" : 59,
          "score" : 1887.0677966101694,
          "bg_count" : 59
        },
        {
          "key" : "air",
          "doc_count" : 4,
          "score" : 2.641295376716233,
          "bg_count" : 189
        },
        {
          "key" : "dead",
          "doc_count" : 4,
          "score" : 0.9665839666414213,
          "bg_count" : 495
        },
        {
          "key" : "life",
          "doc_count" : 5,
          "score" : 0.9090787433467572,
          "bg_count" : 805
        }
      ]
    }
  }
 }
}
```

The most significant texts in relation to `breathe` are `air`, `dead`, and `life`.

The `significant_text` aggregation has the following limitations:

- Doesn't support child aggregations because child aggregations come at a high memory cost. As a workaround, you can add a follow-up query using a `terms` aggregation with an include clause and a child aggregation.
- Doesn't support nested objects because it works with the document JSON source.
- The counts of documents might have some (typically small) inaccuracies as it's based on summing the samples returned from each shard. You can use the `shard_size` parameter to fine-tune the trade-off between accuracy and performance. By default, the `shard_size` is set to -1 to automatically estimate the number of shards and the `size` parameter.

For both `significant_terms` and `significant_text` aggregations, the default source of statistical information for background term frequencies is the entire index. You can narrow this scope with a background filter for more focus:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggregations": {
    "my_sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggregations": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "background_filter": {
              "term": {
                "speaker": "JOHN OF GAUNT"
              }
            }
          }
        }
      }
    }
  }
}
```


## missing

If you have documents in your index that don’t contain the aggregating field at all or the aggregating field has a value of NULL, use the `missing` parameter to specify the name of the bucket such documents should be placed in.

The following example adds any missing values to a bucket named "N/A":

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10,
        "missing": "N/A"
      }
    }
  }
}
```

Because the default value for the `min_doc_count` parameter is 1, the `missing` parameter doesn't return any buckets in its response. Set `min_doc_count` parameter to 0 to see the "N/A" bucket in the response:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10,
        "missing": "N/A",
        "min_doc_count": 0
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "response_codes" : {
    "doc_count_error_upper_bound" : 0,
    "sum_other_doc_count" : 0,
    "buckets" : [
      {
        "key" : "200",
        "doc_count" : 12832
      },
      {
        "key" : "404",
        "doc_count" : 801
      },
      {
        "key" : "503",
        "doc_count" : 441
      },
      {
        "key" : "N/A",
        "doc_count" : 0
      }
    ]
  }
 }
}
```

## histogram, date_histogram

The `histogram` aggregation buckets documents based on a specified interval.

With `histogram` aggregations, you can visualize the distributions of values in a given range of documents very easily. Now OpenSearch doesn’t give you back an actual graph of course, that’s what OpenSearch Dashboards is for. But it'll give you the JSON response that you can use to construct your own graph.

The following example buckets the `number_of_bytes` field by 10,000 intervals:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "histogram": {
        "field": "bytes",
        "interval": 10000
      }
    }
  }
}
```

Sample Response

```json
...
"aggregations" : {
  "number_of_bytes" : {
    "buckets" : [
      {
        "key" : 0.0,
        "doc_count" : 13372
      },
      {
        "key" : 10000.0,
        "doc_count" : 702
      }
    ]
  }
 }
}
```

The `date_histogram` aggregation uses [date math]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#date-math) to generate histograms for time-series data.

For example, you can find how many hits your website gets per month:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "logs_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "logs_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595
      }
    ]
  }
}
}
```

The response has three months worth of logs. If you graph these values, you can see the peak and valleys of the request traffic to your website month over month.

## range, date_range, ip_range

The `range` aggregation lets you define the range for each bucket.

For example, you can find the number of bytes between 1000 and 2000, 2000 and 3000, and 3000 and 4000.
Within the `range` parameter, you can define ranges as objects of an array.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes_distribution": {
      "range": {
        "field": "bytes",
        "ranges": [
          {
            "from": 1000,
            "to": 2000
          },
          {
            "from": 2000,
            "to": 3000
          },
          {
            "from": 3000,
            "to": 4000
          }
        ]
      }
    }
  }
}
```

The response includes the `from` key values and excludes the `to` key values:

#### Example response

```json
...
"aggregations" : {
  "number_of_bytes_distribution" : {
    "buckets" : [
      {
        "key" : "1000.0-2000.0",
        "from" : 1000.0,
        "to" : 2000.0,
        "doc_count" : 805
      },
      {
        "key" : "2000.0-3000.0",
        "from" : 2000.0,
        "to" : 3000.0,
        "doc_count" : 1369
      },
      {
        "key" : "3000.0-4000.0",
        "from" : 3000.0,
        "to" : 4000.0,
        "doc_count" : 1422
      }
    ]
  }
 }
}
```

The `date_range` aggregation is conceptually the same as the `range` aggregation, except that it lets you perform date math.
For example, you can get all documents from the last 10 days. To make the date more readable, include the format with a `format` parameter:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "date_range": {
        "field": "@timestamp",
        "format": "MM-yyyy",
        "ranges": [
          {
            "from": "now-10d/d",
            "to": "now"
          }
        ]
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "number_of_bytes" : {
    "buckets" : [
      {
        "key" : "03-2021-03-2021",
        "from" : 1.6145568E12,
        "from_as_string" : "03-2021",
        "to" : 1.615451329043E12,
        "to_as_string" : "03-2021",
        "doc_count" : 0
      }
    ]
  }
 }
}
```

The `ip_range` aggregation is for IP addresses.
It works on `ip` type fields. You can define the IP ranges and masks in the [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "access": {
      "ip_range": {
        "field": "ip",
        "ranges": [
          {
            "from": "1.0.0.0",
            "to": "126.158.155.183"
          },
          {
            "mask": "1.0.0.0/8"
          }
        ]
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "access" : {
    "buckets" : [
      {
        "key" : "1.0.0.0/8",
        "from" : "1.0.0.0",
        "to" : "2.0.0.0",
        "doc_count" : 98
      },
      {
        "key" : "1.0.0.0-126.158.155.183",
        "from" : "1.0.0.0",
        "to" : "126.158.155.183",
        "doc_count" : 7184
      }
    ]
  }
 }
}
```

If you add a document with malformed fields to an index that has `ip_range` set to `false` in its mappings, OpenSearch rejects the entire document. You can set `ignore_malformed` to `true` to specify that OpenSearch should ignore malformed fields. The default is `false`.

```json
...
"mappings": {
  "properties": {
    "ips": {
      "type": "ip_range",
      "ignore_malformed": true
    }
  }
}
```

## filter, filters

A `filter` aggregation is a query clause, exactly like a search query — `match` or `term` or `range`. You can use the `filter` aggregation to narrow down the entire set of documents to a specific set before creating buckets.

The following example shows the `avg` aggregation running within the context of a filter. The `avg` aggregation only aggregates the documents that match the `range` query:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "low_value": {
      "filter": {
        "range": {
          "taxful_total_price": {
            "lte": 50
          }
        }
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "low_value" : {
    "doc_count" : 1633,
    "avg_amount" : {
      "value" : 38.363175998928355
    }
  }
 }
}
```

A `filters` aggregation is the same as the `filter` aggregation, except that it lets you use multiple filter aggregations.
While the `filter` aggregation results in a single bucket, the `filters` aggregation returns multiple buckets, one for each of the defined filters.

To create a bucket for all the documents that didn't match the any of the filter queries, set the `other_bucket` property to `true`:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "200_os": {
      "filters": {
        "other_bucket": true,
        "filters": [
          {
            "term": {
              "response.keyword": "200"
            }
          },
          {
            "term": {
              "machine.os.keyword": "osx"
            }
          }
        ]
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "bytes"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "200_os" : {
    "buckets" : [
      {
        "doc_count" : 12832,
        "avg_amount" : {
          "value" : 5897.852711970075
        }
      },
      {
        "doc_count" : 2825,
        "avg_amount" : {
          "value" : 5620.347256637168
        }
      },
      {
        "doc_count" : 1017,
        "avg_amount" : {
          "value" : 3247.0963618485744
        }
      }
    ]
  }
 }
}
```

## global

The `global` aggregations lets you break out of the aggregation context of a filter aggregation. Even if you have included a filter query that narrows down a set of documents, the `global` aggregation aggregates on all documents as if the filter query wasn't there. It ignores the `filter` aggregation and implicitly assumes the `match_all` query.

The following example returns the `avg` value of the `taxful_total_price` field from all documents in the index:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "range": {
      "taxful_total_price": {
        "lte": 50
      }
    }
  },
  "aggs": {
    "total_avg_amount": {
      "global": {},
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "total_avg_amount" : {
    "doc_count" : 4675,
    "avg_price" : {
      "value" : 75.05542864304813
    }
  }
 }
}
```

You can see that the average value for the `taxful_total_price` field is 75.05 and not the 38.36 as seen in the `filter` example when the query matched.

## geo_distance, geohash_grid

The `geo_distance` aggregation groups documents into concentric circles based on distances from an origin `geo_point` field.
It's the same as the `range` aggregation, except that it works on geo locations.

For example, you can use the `geo_distance` aggregation to find all pizza places within 1 km of you. The search results are limited to the 1 km radius specified by you, but you can add another result found within 2 km.

You can only use the `geo_distance` aggregation on fields mapped as `geo_point`.

A point is a single geographical coordinate, such as your current location shown by your smart-phone. A point in OpenSearch is represented as follows:

```json
{
  "location": {
    "type": "point",
    "coordinates": {
      "lat": 83.76,
      "lon": -81.2
    }
  }
}
```

You can also specify the latitude and longitude as an array `[-81.20, 83.76]` or as a string `"83.76, -81.20"`

This table lists the relevant fields of a `geo_distance` aggregation:

Field | Description | Required
:--- | :--- |:---
`field` |  Specify the geo point field that you want to work on. | Yes
`origin` |  Specify the geo point that's used to compute the distances from. | Yes
`ranges`  |  Specify a list of ranges to collect documents based on their distance from the target point. | Yes
`unit` |  Define the units used in the `ranges` array. The `unit` defaults to `m` (meters), but you can switch to other units like `km` (kilometers), `mi` (miles), `in` (inches), `yd` (yards), `cm` (centimeters), and `mm` (millimeters).  | No
`distance_type` | Specify how OpenSearch calculates the distance. The default is `sloppy_arc` (faster but less accurate), but can also be set to `arc` (slower but most accurate) or `plane` (fastest but least accurate). Because of high error margins, use `plane` only for small geographic areas. | No

The syntax is as follows:

```json
{
  "aggs": {
    "aggregation_name": {
      "geo_distance": {
        "field": "field_1",
        "origin": "x, y",
        "ranges": [
          {
            "to": "value_1"
          },
          {
            "from": "value_2",
            "to": "value_3"
          },
          {
            "from": "value_4"
          }
        ]
      }
    }
  }
}
```

This example forms buckets from the following distances from a `geo-point` field:

- Fewer than 10 km
- From 10 to 20 km
- From 20 to 50 km
- From 50 to 100 km
- Above 100 km

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "position": {
      "geo_distance": {
        "field": "geo.coordinates",
        "origin": {
          "lat": 83.76,
          "lon": -81.2
        },
        "ranges": [
          {
            "to": 10
          },
          {
            "from": 10,
            "to": 20
          },
          {
            "from": 20,
            "to": 50
          },
          {
            "from": 50,
            "to": 100
          },
          {
            "from": 100
          }
        ]
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "position" : {
    "buckets" : [
      {
        "key" : "*-10.0",
        "from" : 0.0,
        "to" : 10.0,
        "doc_count" : 0
      },
      {
        "key" : "10.0-20.0",
        "from" : 10.0,
        "to" : 20.0,
        "doc_count" : 0
      },
      {
        "key" : "20.0-50.0",
        "from" : 20.0,
        "to" : 50.0,
        "doc_count" : 0
      },
      {
        "key" : "50.0-100.0",
        "from" : 50.0,
        "to" : 100.0,
        "doc_count" : 0
      },
      {
        "key" : "100.0-*",
        "from" : 100.0,
        "doc_count" : 14074
      }
    ]
  }
 }
}
```

The `geohash_grid` aggregation buckets documents for geographical analysis. It organizes a geographical region into a grid of smaller regions of different sizes or precisions. Lower values of precision represent larger geographical areas and higher values represent smaller, more precise geographical areas.

The number of results returned by a query might be far too many to display each geo point individually on a map. The `geohash_grid` aggregation buckets nearby geo points together by calculating the Geohash for each point, at the level of precision that you define (between 1 to 12; the default is 5). To learn more about Geohash, see [Wikipedia](https://en.wikipedia.org/wiki/Geohash).

The web logs example data is spread over a large geographical area, so you can use a lower precision value. You can zoom in on this map by increasing the precision value:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "geo_hash": {
      "geohash_grid": {
        "field": "geo.coordinates",
        "precision": 4
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "geo_hash" : {
    "buckets" : [
      {
        "key" : "c1cg",
        "doc_count" : 104
      },
      {
        "key" : "dr5r",
        "doc_count" : 26
      },
      {
        "key" : "9q5b",
        "doc_count" : 20
      },
      {
        "key" : "c20g",
        "doc_count" : 19
      },
      {
        "key" : "dr70",
        "doc_count" : 18
      }
      ...
    ]
  }
 }
}
```

You can visualize the aggregated response on a map using OpenSearch Dashboards.

The more accurate you want the aggregation to be, the more resources OpenSearch consumes, because of the number of buckets that the aggregation has to calculate. By default, OpenSearch does not generate more than 10,000 buckets. You can change this behavior by using the `size` attribute, but keep in mind that the performance might suffer for very wide queries consisting of thousands of buckets.

## adjacency_matrix

The `adjacency_matrix` aggregation lets you define filter expressions and returns a matrix of the intersecting filters where each non-empty cell in the matrix represents a bucket. You can find how many documents fall within any combination of filters.

Use the `adjacency_matrix` aggregation to discover how concepts are related by visualizing the data as graphs.

For example, in the sample eCommerce dataset, to analyze how the different manufacturing companies are related:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "interactions": {
      "adjacency_matrix": {
        "filters": {
          "grpA": {
            "match": {
              "manufacturer.keyword": "Low Tide Media"
            }
          },
          "grpB": {
            "match": {
              "manufacturer.keyword": "Elitelligence"
            }
          },
          "grpC": {
            "match": {
              "manufacturer.keyword": "Oceanavigations"
            }
          }
        }
      }
    }
  }
}
```

#### Example response

 ```json
 {
   ...
   "aggregations" : {
     "interactions" : {
       "buckets" : [
         {
           "key" : "grpA",
           "doc_count" : 1553
         },
         {
           "key" : "grpA&grpB",
           "doc_count" : 590
         },
         {
           "key" : "grpA&grpC",
           "doc_count" : 329
         },
         {
           "key" : "grpB",
           "doc_count" : 1370
         },
         {
           "key" : "grpB&grpC",
           "doc_count" : 299
         },
         {
           "key" : "grpC",
           "doc_count" : 1218
         }
       ]
     }
   }
 }
```

 Let’s take a closer look at the result:

 ```json
 {
    "key" : "grpA&grpB",
    "doc_count" : 590
 }
 ```

- `grpA`: Products manufactured by Low Tide Media.
- `grpB`: Products manufactured by Elitelligence.
- `590`: Number of products that are manufactured by both.

You can use OpenSearch Dashboards to represent this data with a network graph.

## nested, reverse_nested

The `nested` aggregation lets you aggregate on fields inside a nested object. The `nested` type is a specialized version of the object data type that allows arrays of objects to be indexed in a way that they can be queried independently of each other

With the `object` type, all the data is stored in the same document, so matches for a search can go across sub documents. For example, imagine a `logs` index with `pages` mapped as an `object` datatype:

```json
PUT logs/_doc/0
{
  "response": "200",
  "pages": [
    {
      "page": "landing",
      "load_time": 200
    },
    {
      "page": "blog",
      "load_time": 500
    }
  ]
}
```

OpenSearch merges all sub-properties of the entity relations that looks something like this:

```json
{
  "logs": {
    "pages": ["landing", "blog"],
    "load_time": ["200", "500"]
  }
}
```

So, if you wanted to search this index with `pages=landing` and `load_time=500`, this document matches the criteria even though the `load_time` value for landing is 200.

If you want to make sure such cross-object matches don’t happen, map the field as a `nested` type:

```json
PUT logs
{
  "mappings": {
    "properties": {
      "pages": {
        "type": "nested",
        "properties": {
          "page": { "type": "text" },
          "load_time": { "type": "double" }
        }
      }
    }
  }
}
```

Nested documents allow you to index the same JSON document but will keep your pages in separate Lucene documents, making only searches like `pages=landing` and `load_time=200` return the expected result. Internally, nested objects index each object in the array as a separate hidden document, meaning that each nested object can be queried independently of the others.

You have to specify a nested path relative to parent that contains the nested documents:


```json
GET logs/_search
{
  "query": {
    "match": { "response": "200" }
  },
  "aggs": {
    "pages": {
      "nested": {
        "path": "pages"
      },
      "aggs": {
        "min_load_time": { "min": { "field": "pages.load_time" } }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "pages" : {
    "doc_count" : 2,
    "min_price" : {
      "value" : 200.0
    }
  }
 }
}
```

You can also aggregate values from nested documents to their parent; this aggregation is called `reverse_nested`.
You can use `reverse_nested` to aggregate a field from the parent document after grouping by the field from the nested object. The `reverse_nested` aggregation "joins back" the root page and gets the `load_time` for each for your variations.

The `reverse_nested` aggregation is a sub-aggregation inside a nested aggregation. It accepts a single option named `path`. This option defines how many steps backwards in the document hierarchy OpenSearch takes to calculate the aggregations.

```json
GET logs/_search
{
  "query": {
    "match": { "response": "200" }
  },
  "aggs": {
    "pages": {
      "nested": {
        "path": "pages"
      },
      "aggs": {
        "top_pages_per_load_time": {
          "terms": {
            "field": "pages.load_time"
          },
          "aggs": {
            "comment_to_logs": {
              "reverse_nested": {},
              "aggs": {
                "min_load_time": {
                  "min": {
                    "field": "pages.load_time"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "pages" : {
    "doc_count" : 2,
    "top_pages_per_load_time" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 200.0,
          "doc_count" : 1,
          "comment_to_logs" : {
            "doc_count" : 1,
            "min_load_time" : {
              "value" : null
            }
          }
        },
        {
          "key" : 500.0,
          "doc_count" : 1,
          "comment_to_logs" : {
            "doc_count" : 1,
            "min_load_time" : {
              "value" : null
            }
          }
        }
      ]
    }
  }
 }
}
```

The response shows the logs index has one page with a `load_time` of 200 and one with a `load_time` of 500.
