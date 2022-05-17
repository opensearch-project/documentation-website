---
layout: default
title: Query DSL
nav_order: 27
has_children: true
redirect_from:
  - /opensearch/query-dsl/
  - /docs/opensearch/query-dsl/
---

{%- comment -%}The `/docs/opensearch/query-dsl/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Query DSL

OpenSearch provides a query domain-specific language (DSL) that you can use to search with more options than a simple search with an HTTP request parameter alone. The query DSL uses the HTTP request body, so you can more easily customize your queries to get the exact results that you want.

The OpenSearch query DSL provides three query options: term-level queries, full-text queries, and boolean queries. You can even perform more complicated searches by using different elements from each variety to find whatever data you need.

## DSL query types

OpenSearch supports two types of queries when you search for data: term-level queries and full-text queries.

The following table describes the differences between them.

| Metrics | Term-level queries | Full-text queries
:--- | :--- | :---
*Query results* | Term-level queries answer which documents match a query. | Full-text queries answer how well the documents match a query.
*Analyzer* | The search term isn't analyzed. This means that the term query searches for your search term as it is.  | The search term is analyzed by the same analyzer that was used for the specific field of the document at the time it was indexed. This means that your search term goes through the same analysis process as the document's field.
*Relevance* | Term-level queries simply return documents that match without sorting them based on the relevance score. They still calculate the relevance score, but this score is the same for all the documents that are returned. | Full-text queries calculate a relevance score for each match and sort the results by decreasing order of relevance.
*Use Case* | Use term-level queries when you want to match exact values, such as numbers, dates, tags, and so on, and don't need the matches to be sorted by relevance. | Use full-text queries to match text fields and sort by relevance after taking into account factors like casing and stemming variants.

OpenSearch uses a probabilistic ranking framework called Okapi BM25 to calculate relevance scores. To learn more about Okapi BM25, see [Wikipedia](https://en.wikipedia.org/wiki/Okapi_BM25).
{: .note }

The following examples show the difference between a simple HTTP search and a search with query DSL.

## Example: HTTP simple search

The following request performs a simple search for a `speaker` field that has a value of `queen`.

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

## Example: Query DSL search

With a query DSL search, you can include an HTTP request body to look for results more tailored to your needs. The following example shows how to search for `speaker` and `text_entry` fields that have a value of `QUEEN`.

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