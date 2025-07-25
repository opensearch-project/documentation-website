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

OpenSearch provides a search language called *query domain-specific language (DSL)* that you can use to search your data. Query DSL is a flexible language with a JSON interface.

With query DSL, you need to specify a query in the `query` parameter of the search. One of the simplest searches in OpenSearch uses the `match_all` query, which matches all documents in an index:

```json
GET testindex/_search
{
  "query": {
     "match_all": { 
     }
  }
}
```

A query can consist of many query clauses. You can combine query clauses to produce complex queries. 

Broadly, you can classify queries into two categories---*leaf queries* and *compound queries*:

- **Leaf queries**: Leaf queries search for a specified value in a certain field or fields. You can use leaf queries on their own. They include the following query types:

    - **Full-text queries**: Use full-text queries to search text documents. For an analyzed text field search, full-text queries split the query string into terms with the same analyzer that was used when the field was indexed. For an exact value search, full-text queries look for the specified value without applying text analysis. To learn more, see [Full-text queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index).

    - **Term-level queries**: Use term-level queries to search documents for an exact specified term, such as an ID or value range. Term-level queries do not analyze search terms or sort results by relevance score. To learn more, see [Term-level queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/term/).

    - **Geographic and xy queries**: Use geographic queries to search documents that include geographic data. Use xy queries to search documents that include points and shapes in a two-dimensional coordinate system. To learn more, see [Geographic and xy queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/geo-and-xy/index).

    - **Joining queries**: Use joining queries to search nested fields or return parent and child documents that match a specific query. Types of joining queries include `nested`, `has_child`, `has_parent`, and `parent_id` queries.

    - **Span queries**: Use span queries to perform precise positional searches. Span queries are low-level, specific queries that provide control over the order and proximity of specified query terms. They are primarily used to search legal documents. To learn more, see [Span queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/span-query/).

    - **Specialized queries**: Specialized queries include all other query types (`distance_feature`, `more_like_this`, `percolate`, `rank_feature`, `script`, `script_score`, `wrapper`, and `pinned_query`).

- **Compound queries**: Compound queries serve as wrappers for multiple leaf or compound clauses either to combine their results or to modify their behavior. They include the Boolean, disjunction max, constant score, function score, and boosting query types. To learn more, see [Compound queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/compound/index).

## A note on Unicode special characters in text fields

Due to word boundaries associated with Unicode special characters, the Unicode standard analyzer cannot index a [text field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) value as a whole value when it includes one of these special characters. As a result, a text field value that includes a special character is parsed by the standard analyzer as multiple values separated by the special character, effectively tokenizing the different elements on either side of it. This can lead to unintentional filtering of documents and potentially compromise control over their access. 

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

To avoid this circumstance when using either query DSL or the REST API, you can use a custom analyzer or map the field as `keyword`, which performs an exact-match search. See [Keyword field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) for the latter option.

For a list of characters that should be avoided for `text` field types, see [Word Boundaries](https://unicode.org/reports/tr29/#Word_Boundaries).