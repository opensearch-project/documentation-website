---
layout: default
title: Query DSL
nav_order: 27
has_children: true
redirect_from:
  - /opensearch/query-dsl/
  - /docs/opensearch/query-dsl/
canonical_url: https://docs.opensearch.org/latest/query-dsl/
---

{%- comment -%}The `/docs/opensearch/query-dsl/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Query DSL

While you can use HTTP request parameters to perform simple searches, you can also use the OpenSearch query domain-specific language (DSL), which provides a wider range of search options. The query DSL uses the HTTP request body, so you can more easily customize your queries to get the exact results that you want.

For example, the following request performs a simple search to search for a `speaker` field that has a value of `queen`.

**Sample request**
```json
GET _search?q=speaker:queen
```

**Sample response**
```
{
  "took": 87,
  "timed_out": false,
  "_shards": {
  "total": 68,
  "successful": 68,
  "skipped": 0,
  "failed": 0
  },
  "hits": {
  "total": {
    "value": 4080,
    "relation": "eq"
  },
  "max_score": 4.4368687,
  "hits": [
    {
    "_index": "new_shakespeare",
    "_type": "_doc",
    "_id": "28559",
    "_score": 4.4368687,
    "_source": {
      "type": "line",
      "line_id": 28560,
      "play_name": "Cymbeline",
      "speech_number": 20,
      "line_number": "1.1.81",
      "speaker": "QUEEN",
      "text_entry": "No, be assured you shall not find me, daughter,"
    }
    }
```

With query DSL, however, you can include an HTTP request body to look for results more tailored to your needs. The following example shows how to search for `speaker` and `text_entry` fields that have a value of `QUEEN`.

**Sample request**
```json
{
  "query": {
  "multi_match": {
    "query": "QUEEN",
    "fields": ["speaker", "text_entry"]
    }
  }
}
```

**Sample Response**
```json
{
  "took": 39,
  "timed_out": false,
  "_shards": {
    "total": 68,
    "successful": 68,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5837,
      "relation": "eq"
    },
    "max_score": 7.8623476,
    "hits": [
      {
        "_index": "new_shakespeare",
        "_type": "_doc",
        "_id": "100763",
        "_score": 7.8623476,
        "_source": {
          "type": "line",
          "line_id": 100764,
          "play_name": "Troilus and Cressida",
          "speech_number": 43,
          "line_number": "3.1.68",
          "speaker": "PANDARUS",
          "text_entry": "Sweet queen, sweet queen! thats a sweet queen, i faith."
        }
      },
      {
        "_index": "shakespeare",
        "_type": "_doc",
        "_id": "28559",
        "_score": 5.8923807,
        "_source": {
          "type": "line",
          "line_id": 28560,
          "play_name": "Cymbeline",
          "speech_number": 20,
          "line_number": "1.1.81",
          "speaker": "QUEEN",
          "text_entry": "No, be assured you shall not find me, daughter,"
        }
      }
    ]
  }
}
```
The OpenSearch query DSL comes in three varieties: term-level queries, full-text queries, and boolean queries. You can even perform more complicated searches by using different elements from each variety to find whatever data you need.
