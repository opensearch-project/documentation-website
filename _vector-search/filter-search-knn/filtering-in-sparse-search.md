---
layout: default
title: Filtering in neural sparse ANN search
parent: Filtering data
nav_order: 40
---

# Filtering in neural sparse ANN search

You can run neural sparse approximate nearest neighbor (ANN) search queries with filtering in the following ways:

- Provide a `filter` in the `method_parameters` of the `neural_sparse` query. The filter is evaluated by the engine that is configured for the `sparse_vector` field, so the filtering behavior depends on that engine.
- Wrap the `neural_sparse` query in a [Boolean filter](#using-a-boolean-filter-with-neural-sparse-ann-search). The filter is evaluated outside the engine, after the query returns its top `k` results, and behaves the same way on both engines.

## Filtering behavior by engine
**Introduced 3.9**
{: .label .label-purple }

Neural sparse ANN search supports two engines, selected by the `method.engine` mapping parameter of a `sparse_vector` field. Both engines fall back to exact search when a filter is highly selective, but when they do run approximate search, they differ in whether the filter is applied before or after retrieval. The query syntax is identical for both engines. For more information about engines, see [Engines]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#engines).

The algorithm uses the following variables to decide how to apply a filter:

- N: The number of documents in the index.
- P: The number of documents in the document subset after the filter is applied (P <= N).
- k: The maximum number of vectors to return in the response.

When P is less than k, both engines run an exact search over the P filtered documents rather than the approximate algorithm, which would otherwise return substantially fewer than k results. When P is greater than k, the engines behave as follows.

| Engine | Approximate search behavior | Number of results |
|:--- |:--- |:--- |
| `lucene` (default) | Post-filtering. The algorithm runs on the N documents, and the filter is applied to the results, so the results are the intersection of the top matches and the filter. | A selective filter can return fewer than `k` results. |
| `native` | Pre-filtering. The filter is pushed down into the engine as a candidate set, so retrieval runs within the filtered set. | Returns up to a full `k` results. |

### Post-filtering on the Lucene engine

When P is greater than k on the Lucene engine, the neural sparse ANN search algorithm runs on the N documents and the filter is applied to the results. Because the filter is applied to the approximate results, a selective filter can return fewer than k results.

### Pre-filtering on the native engine

When P is greater than k on the native engine, the filter is pushed down into the engine as a candidate set before retrieval begins. Approximate retrieval then runs within the filtered set, so a selective filter doesn't reduce the number of results, and the query returns up to a full `k` results.

To use the native engine for a field, set `method.engine` to `native` in the field mapping. The following request creates an index equivalent to the `hotels-index` index used in the following example, with the `name_embedding` field configured to use the native engine:

```json
PUT /hotels-index-native
{
  "settings": {
    "index": {
      "sparse": true
    }
  },
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "rating": {
        "type": "integer"
      },
      "parking": {
        "type": "boolean"
      },
      "name_embedding":{
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "engine": "native",
          "parameters": {
            "quantization_ceiling_ingest": 16,
            "n_postings": 4000,
            "cluster_ratio": 0.1,
            "summary_prune_ratio": 0.4,
            "approximate_threshold": 1000000,
            "forward_index": "per_block"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The native engine is opt-in and requires additional node settings. For more information, see [Enabling the native engine]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#enabling-the-native-engine).
{: .note}

## Using a neural sparse ANN search filter

In this example, you will create an index and search for the three hotels with high ratings, parking, and a name matching your search criteria. The index uses the default Lucene engine, so the filter is applied after approximate retrieval. To run the same query with pre-filtering, map the field to the native engine, as described in [Pre-filtering on the native engine](#pre-filtering-on-the-native-engine).

### Step 1: Create a new index

Before you can run a neural sparse ANN search with a filter, you need to create an index with a `sparse_vector` field.

The following request creates a new index called `hotels-index`:

```json
PUT /hotels-index
{
  "settings": {
    "index": {
      "sparse": true
    }
  },
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "rating": {
        "type": "integer"
      },
      "parking": {
        "type": "boolean"
      },
      "name_embedding":{
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "parameters": {
            "quantization_ceiling_ingest": 16,
            "n_postings": 4000,
            "cluster_ratio": 0.1,
            "summary_prune_ratio": 0.4,
            "approximate_threshold": 1000000
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 2: Add data to your index

Next, add data to your index.

The following request adds 10 documents that contain hotel name embeddings, ratings, and parking information:  

```json
POST /_bulk
{ "index": { "_index": "hotels-index", "_id": "1" } }
{"parking":true, "name":"Grand Plaza Hotel", "rating":10, "name_embedding":{"8232":7.7817574, "2882":5.847375, "3309":5.575121}}
{ "index": { "_index": "hotels-index", "_id": "2" } }
{"parking":true, "name":"Azure Beach Hotel", "rating":7, "name_embedding":{"24296":8.380939, "3509":5.5722017, "3309":5.575121}}
{ "index": { "_index": "hotels-index", "_id": "3" } }
{"parking":false, "name":"Mountain Lodge", "rating":9, "name_embedding":{"3137":5.615391, "7410":7.636689}}
{ "index": { "_index": "hotels-index", "_id": "4" } }
{"parking":true, "name":"Tropical Beach Resort", "rating":4, "name_embedding":{"7001":6.25483, "5133":6.2035937, "3509":5.5722017}}
{ "index": { "_index": "hotels-index", "_id": "5" } }
{"parking":false, "name":"Coastal Retreat", "rating":5, "name_embedding":{"5780":6.767954, "7822":7.8309207}}
{ "index": { "_index": "hotels-index", "_id": "6" } }
{"parking":true, "name":"Sunset Resort", "rating":2, "name_embedding":{"7001":6.25483, "10434":7.0848904}}
{ "index": { "_index": "hotels-index", "_id": "7" } }
{"parking":true, "name":"Crystal Beach Resort", "rating":1, "name_embedding":{"6121":6.5081306, "7001":6.25483, "3509":5.5722017}}
{ "index": { "_index": "hotels-index", "_id": "8" } }
{"parking":true, "name":"Crystal Beach Resort", "rating":9, "name_embedding":{"6121":6.5081306, "7001":6.25483, "3509":5.5722017}}
{ "index": { "_index": "hotels-index", "_id": "9" } }
{"parking":true, "name":"Azure Beach Hotel", "rating":6, "name_embedding":{"24296":8.380939, "3509":5.5722017, "3309":5.575121}}
{ "index": { "_index": "hotels-index", "_id": "10" } }
{"parking":true, "name":"Garden Court Hotel", "rating":9, "name_embedding":{"2457":4.862541, "3871":5.785374, "3309":5.575121}}
```
{% include copy-curl.html %}

### Step 3: Search your data with a filter

Now you can create a neural sparse ANN search with filters. In the `method_parameters` field of the `neural_sparse` query clause, include the point of interest that is used to search for nearest neighbors, the number of nearest neighbors to return (`k`), and a filter with the restriction criteria. Depending on how restrictive you want your filter to be, you can add multiple query clauses to a single request.

The following request creates a neural sparse ANN search query that searches for the top three hotels with names matching the text "beach resort", that are rated between 8 and 10, inclusive, and that provide parking:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "neural_sparse": {
      "name_embedding": {
        "query_text": "beach resort",
        "method_parameters": {
          "k": 3,
          "filter": {
            "bool": {
              "must": [
                {
                  "range": {
                    "rating": {
                      "gte": 8,
                      "lte": 10
                    }
                  }
                },
                {
                  "term": {
                    "parking": "true"
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns the three hotels that are nearest to the search point and meet the filter criteria:

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 70.08806,
    "hits": [
      {
        "_index": "hotels-index",
        "_id": "8",
        "_score": 70.08806,
        "_source": {
          "parking": true,
          "name": "Crystal Beach Resort",
          "rating": 9,
          "name_embedding": {
            "3509": 5.5722017,
            "6121": 6.5081306,
            "7001": 6.25483
          }
        }
      },
      {
        "_index": "hotels-index",
        "_id": "1",
        "_score": 0,
        "_source": {
          "parking": true,
          "name": "Grand Plaza Hotel",
          "rating": 10,
          "name_embedding": {
            "2882": 5.847375,
            "3309": 5.575121,
            "8232": 7.7817574
          }
        }
      },
      {
        "_index": "hotels-index",
        "_id": "10",
        "_score": 0,
        "_source": {
          "parking": true,
          "name": "Garden Court Hotel",
          "rating": 9,
          "name_embedding": {
            "2457": 4.862541,
            "3309": 5.575121,
            "3871": 5.785374
          }
        }
      }
    ]
  }
}
```

## Post-filtering outside the query

Instead of providing a filter in `method_parameters`, you can apply post-filtering using a [Boolean filter](#using-a-boolean-filter-with-neural-sparse-ann-search). In this case the filter is evaluated outside the engine, so the behavior is the same on both the Lucene engine and the native engine. Because filtering occurs after the neural sparse ANN search retrieves its top k results, the final number of returned results may be significantly smaller than k.

### Using a Boolean filter with neural sparse ANN search

A Boolean filter consists of a `bool` query that contains a `neural_sparse` query and a filter. For example, the following query searches for hotels with names matching the text "beach resort" and then filters the results to return hotels with a rating between 8 and 10, inclusive, and that provide parking:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "bool": {
      "filter": {
        "bool": {
          "must": [
            {
              "range": {
                "rating": {
                  "gte": 8,
                  "lte": 10
                }
              }
            },
            {
              "term": {
                "parking": "true"
              }
            }
          ]
        }
      },
      "must": [
        {
          "neural_sparse": {
            "name_embedding": {
              "query_text": "beach resort",
              "method_parameters": {
                "top_n": 3,
                "heap_factor": 1.0,
                "k": 20
              }
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response includes documents containing the matching hotels:

```json
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 70.08806,
    "hits": [
      {
        "_index": "hotels-index",
        "_id": "8",
        "_score": 70.08806,
        "_source": {
          "parking": true,
          "name": "Crystal Beach Resort",
          "rating": 9,
          "name_embedding": {
            "3509": 5.5722017,
            "6121": 6.5081306,
            "7001": 6.25483
          }
        }
      }
    ]
  }
}
```

## Next steps

- For more information about neural sparse ANN search, see [Neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/).
- For more information about the Lucene engine and the native engine, see [Engines]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann/#engines).