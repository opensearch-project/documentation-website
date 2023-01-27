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

OpenSearch provides a query domain-specific language (DSL) that you can use to perform customized searches on your data.

Query DSL provides several query categories. You can even perform more complicated searches by combining query fields to find more granular data that you need.

OpenSearch supports the following query DSL query type categories:

- **Compound queries** – To perform combined queries with the following query types:
    - **Boolean** `bool`queries use clause rules that act as logical operators to combine several simple query terms.
    - **Constant score** `constant_score`– Provides a `filter` query with the relevance score as a floating point number assigned by the `boost` field. Acts as a wrapper for the filter.
    - **Disjunction max** `dis_max`– Returns documents that match one or more queries that are wrapped together by clauses. If a document matches multiple query clauses, it gets the highest relevant score assigned to it.
    - **Function score** `function_score` – Modifies the score of documents that are returned by a query. You define a query and one or more functions that each compute a score for each document that matches the query.
- **Span queries** – To perform queries that provide control over the order and proximity of query terms that you specify. The primary use case is for legal documents. Span queries include the following query types:
    - **Span containing** `span_containing` – Takes a list of span queries and only returns spans that match a second span query.
    - **Span field masking** `span_field_masking` – Combines `span_near` or `span_or` across different fields.
    - **Span first** `span_first` – Combines another span query that returned matches within the first *N* positions of the field.
    - **Span multi-term** `span_multi-term`– Provides a wrapper around the following query types: `term`, `range`, `prefix`, `wildcard` `regexp` or `fuzzy`.
    - **Span near** `span_near` – Combines multiple span queries that much match documents in the same order and within the specified distance of each other.
    - **Span not** `span_not` – Provides a wrapper for another span query and functions to exclude any documents that match the internal query.
    - **Span or** `span_or` – Provides a wrapper for multiple span queries and includes any documents that match any of the specified queries.
    - **Span term** `span_term` – Functions the same as a `term` query, but is designed to be used with other span queries.
    - **Span within** `span_within` – Used with other span queries to returns a single span query result if its span is also within the spans that get returned by the list of other span queries.
- **Term-level queries** – To search documents for one or more terms, IDs, value ranges, with optional filtering by wildcard or regex. Term-level queries do not sort results by relevance score or analyze search terms.
- **Full-text queries** – To search documents for one or more terms and filter with advanced options. These queries return detailed information including relevance scores per document match, and perform text analysis.
- **Geographic queries** – To perform the following geographic queries that search for documents that include `geo_point` field data:
    - **Geo-bounding box** `geo_bounding_box`– Returns documents with `geo_point` field values that are within a bounding box.
    - **Geo distance** `geo_distance` – Returns documents that contain the geographic points within a specified distance from a central point.
    - **Geo polygon** `geo_polygon` – Returns documents that contain the specified geographic points within the specified polygon.
    - **xy point queries** – Returns documents that contain two-dimensional coordinates in `xy_point` or `xy_shape` fields.
- **Shape queries** – To perform two-dimensional geometries to map out cartesian data such as `point` fields that support x/y pairs and `shape` fields that support points, lines, circles and polygon shapes.
    - **Pre-indexed shape** `indexed_shape`– Specifies a `shape` query for a shape that has been previously been indexed. You need to specify the following pre-indexed shape fields `id`, `index` `path` and `routing`. Use the `ignore_unmapped` option set to `true` to ignore any fields not mapped to the previous index specified in the `indexed_shape` query. By default, `ignore_unmapped` is set to `false` to throw an exception if the field is not mapped.
        - **Spacial relation operators** – You can use the following spacial relation operators with Pre-indexed shape queries:
            - `intersects` – Returns all documents with intersecting values specified by the `shape` field.
            - `disjoin` – Returns all documents that do not match the `shape` field coordinates specified in the query.
            - `within` – Returns all documents that match the specified geometry for the `shape` field.
            - `contains` – Returns all documents with `shape` field values that match the geometry specified in the `shape` query.
- **Query context** – To perform `relevance_score`, `query_context` to show how well a document matches a query clause, or `filter_context` to indicate whether or not a doc matches the query clause.
- **Query string queries** – To perform complex queries for a string with multiple optional fields using `query_string` syntax.
- **Regular expression queries** – To perform all regular expression queries. 
- **Joining queries** – To perform `nested`, `has_child`, `has_parent`, and `parent_id` queries.
- **Parameter queries** – To perform `minimum_should_match` and `rewrite` queries.
- **Specialized queries** – To perform specialized queries: `distance_feature`, `more_like_this`, `percolate`, `rank_feature`, `script`, `script_score`, `wrapper`, or `pinned_query`.

## About term-level and full-text queries

Although term-level and full-text queries both search for terms, there are some differences as described in the following table:

| | Term-level queries | Full-text queries
:--- | :--- | :---
*Description* | Term-level queries answer which documents match a query. | Full-text queries answer how well the documents match a query.
*Analyzer* | The search term isn't analyzed. This means that the term query searches for your search term as it is.  | The search term is analyzed by the same analyzer that was used for the specific field of the document at the time it was indexed. This means that your search term goes through the same analysis process that the document's field did.
*Relevance* | Term-level queries simply return documents that match without sorting them based on the relevance score. They still calculate the relevance score, but this score is the same for all the documents that are returned. | Full-text queries calculate a relevance score for each match and sort the results by decreasing order of relevance.
*Use Case* | Use term-level queries when you want to match exact values such as numbers, dates, tags, and so on, and don't need the matches to be sorted by relevance. | Use full-text queries to match text fields and sort by relevance after taking into account factors like casing and stemming variants.

OpenSearch uses a probabilistic ranking framework called Okapi BM25 to calculate relevance scores. To learn more about Okapi BM25, see [Wikipedia](https://en.wikipedia.org/wiki/Okapi_BM25).
{: .note }

## Comparing a simple HTTP request to a customized query DSL request

While you can use HTTP request parameters to perform simple searches, you can also use the OpenSearch query DSL, which provides a wider range of search options. The query DSL uses the HTTP request body, so you can more easily customize your queries to get the exact results that you want.

### Performing simple searches with HTTP request parameters

The following request performs a simple search to search for a `speaker` field that has a value of `queen`:

#### Sample request

```json
GET _search?q=speaker:queen
```

#### Sample response

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

### Using query DSL to create customized searches

With query DSL you can include an HTTP request body to look for results that are better tailored to your needs. The following example shows how to search for `speaker` and `text_entry` fields that have a value of `QUEEN`:

#### Sample request

```json
GET _search
{
  "query": {
  "multi_match": {
    "query": "QUEEN",
    "fields": ["speaker", "text_entry"]
    }
  }
}
```

#### Sample Response

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

## A note on Unicode special characters in text fields

Due to word boundaries associated with Unicode special characters, the Unicode standard analyzer cannot index a [text field type](https://opensearch.org/docs/2.2/opensearch/supported-field-types/text/) value as a whole value when it includes one of these special characters. As a result, a text field value that includes a special character is parsed by the standard analyzer as multiple values separated by the special character, effectively tokenizing the different elements on either side of it. This can lead to unintentional filtering of documents and potentially compromise control over their access. 

The examples below illustrate values containing special characters that will be parsed improperly by the standard analyzer. In this example, the existence of the hyphen/minus sign in the value prevents the analyzer from distinguishing between the two different users for `user.id` and interprets them as one and the same:

```json
{
  "bool": {
    "must": {
      "match": {
        "user.id": "User-1"
      }
    }
  }
}
```

```json
{
  "bool": {
    "must": {
      "match": {
        "user.id": "User-2"
      }
    }
  }
}
```

To avoid this circumstance when using either query DSL or the REST API, you can use a custom analyzer or map the field as `keyword`, which performs an exact-match search. See [Keyword field type](https://opensearch.org/docs/2.2/opensearch/supported-field-types/keyword/) for the latter option.

For a list of characters that should be avoided when field type is `text`, see [Word Boundaries](https://unicode.org/reports/tr29/#Word_Boundaries).