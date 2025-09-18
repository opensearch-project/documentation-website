---
layout: default
title: Analyzer
parent: Mapping parameters
nav_order: 5
has_children: false
has_toc: false
---

# Analyzer

The `analyzer` parameter specifies the analyzer to use for text analysis when indexing or searching a `text` field. Unless overridden by the `search_analyzer` mapping parameter, this analyzer handles both index-time and search-time analysis. For more information about analyzers, see [Text analysis]({{site.url}}{{site.baseurl}}/analyzers/).

Only `text` fields support the `analyzer` mapping parameter.
{: .important}

The `analyzer` parameter cannot be updated on existing fields using the Update Mapping API. To change the analyzer for an existing field, you must reindex your data.
{: .warning}

We recommend testing analyzers before deploying them to production environments.
{: .tip}

## Search quote analyzer

The `search_quote_analyzer` parameter allows you to specify a different analyzer specifically for phrase queries. This proves especially valuable when you need to handle stop words differently for phrase searches versus regular term searches.

For effective phrase query handling with stop words, configure three analyzer settings:

1. An `analyzer` for indexing that preserves all terms, including stop words.
2. A `search_analyzer` for regular queries that filters out stop words.
3. A `search_quote_analyzer` for phrase queries that retains stop words.

## Example

The following example demonstrates how to use the `search_quote_analyzer` to handle stop words differently in phrase queries versus term queries.

First, create an index with all three analyzer types. The `index_analyzer` preserves all terms during indexing, including stop words like "the" and "a". The `search_analyzer` removes stop words from regular term queries. The `search_quote_analyzer` uses the same analyzer as indexing for phrase queries, ensuring exact phrase matching works correctly:

```json
PUT /product_catalog
{
  "settings": {
    "analysis": {
      "analyzer": {
        "index_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase"
          ]
        },
        "search_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "english_stop"
          ]
        }
      },
      "filter": {
        "english_stop": {
          "type": "stop",
          "stopwords": "_english_"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "product_name": {
        "type": "text",
        "analyzer": "index_analyzer",
        "search_analyzer": "search_analyzer",
        "search_quote_analyzer": "index_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, add sample documents to the index:

```json
PUT /product_catalog/_doc/1
{
  "product_name": "The Smart Watch Pro"
}
```
{% include copy-curl.html %}

```json
PUT /product_catalog/_doc/2
{
  "product_name": "A Smart Watch Ultra"
}
```
{% include copy-curl.html %}

Search your index for the phrase "the smart watch" (in quotation marks):

```json
GET /product_catalog/_search
{
  "query": {
    "query_string": {
      "query": "\"the smart watch\"",
      "default_field": "product_name"
    }
  }
}
```
{% include copy-curl.html %}

Because the query is enclosed in quotation marks, it becomes a phrase query. Phrase queries use the `search_quote_analyzer`, which preserves stop words. As a result, the query "the smart watch" matches only documents containing that exact phrase, so the response includes only the first document:

```json
{
  "took": 263,
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
    "max_score": 0.48081374,
    "hits": [
      {
        "_index": "product_catalog",
        "_id": "1",
        "_score": 0.48081374,
        "_source": {
          "product_name": "The Smart Watch Pro"
        }
      }
    ]
  }
}
```

Now, search for the text matching "the smart watch" (without quotation marks):

```json
GET /product_catalog/_search
{
  "query": {
    "query_string": {
      "query": "the smart watch",
      "default_field": "product_name"
    }
  }
}
```
{% include copy-curl.html %}

Because the query is not enclosed in quotation marks, it is a term query. Term queries use the `search_analyzer`, which tokenizes the text and removes stop words. As a result, the query the smart watch is analyzed into the tokens `[smart, watch]` and matches both documents:

```json
{
  "took": 38,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.16574687,
    "hits": [
      {
        "_index": "product_catalog",
        "_id": "1",
        "_score": 0.16574687,
        "_source": {
          "product_name": "The Smart Watch Pro"
        }
      },
      {
        "_index": "product_catalog",
        "_id": "2",
        "_score": 0.16574687,
        "_source": {
          "product_name": "A Smart Watch Ultra"
        }
      }
    ]
  }
}
```


## Related articles

- [Text analysis]({{site.url}}{{site.baseurl}}/analyzers/)
- [Search analyzers]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/)
- [Query string queries]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/)