---
layout: default
title: Span queries
has_children: true
has_toc: false
nav_order: 60
redirect_from: 
  - /opensearch/query-dsl/span-query/
  - /query-dsl/query-dsl/span-query/
  - /query-dsl/span-query/
  - /query-dsl/span/
canonical_url: https://docs.opensearch.org/latest/query-dsl/span/index/
---

# Span queries

You can use span queries to perform precise positional searches. Span queries are low-level, specific queries that provide control over the order and proximity of specified query terms. They are primarily used to search legal documents and patents. 

Span queries include the following query types:

- [**Span containing**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-containing/): Returns larger spans that contain smaller spans within them. Useful for finding specific terms or phrases within a broader context. The opposite of `span_within` query.

- [**Span field masking**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-field-masking/): Allows span queries to work across different fields by making one field appear as another. Particularly useful when the same text is indexed using different analyzers.

- [**Span first**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-first/): Matches terms or phrases that appear within a specified number of positions from the start of a field. Useful for finding content at the beginning of text.

- [**Span multi-term**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-multi-term/): Enables multi-term queries (like `prefix`, `wildcard`, or `fuzzy`) to work within span queries. Allows for more flexible matching patterns in span searches.

- [**Span near**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-near/): Finds terms or phrases that appear within a specified distance of each other. You can require matches to appear in a specific order and control how many words can appear between them.

- [**Span not**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-not/): Excludes matches that overlap with another span query. Useful for finding terms when they do not appear in specific phrases or contexts.

- [**Span or**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-or/): Matches documents that satisfy any of the provided span queries. Combines multiple span patterns with OR logic.

- [**Span term**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-term/): The basic building block for span queries. Matches a single term while maintaining position information for use in other span queries.

- [**Span within**]({{site.url}}{{site.baseurl}}/query-dsl/span/span-within/): Returns smaller spans that are enclosed by larger spans. The opposite of the `span_containing` query.

## Setup

To try the examples in this section, use the following steps to configure an example index.

### Step 1: Create an index

First, create an index for an e-commerce clothing website. The `description` field uses the default `standard` analyzer, while the `description.stemmed` subfield applies the `english` analyzer to enable stemming:

```json
PUT /clothing
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "stemmed": {
            "type": "text",
            "analyzer": "english"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 2: Index data

Index sample documents into the index:

```json
POST /clothing/_doc/1
{
  "description": "Long-sleeved dress shirt with a formal collar and button cuffs. "
}

```
{% include copy-curl.html %}

```json
POST /clothing/_doc/2
{
  "description": "Beautiful long dress in red silk, perfect for formal events."
}
```
{% include copy-curl.html %}

```json
POST /clothing/_doc/3
{
  "description": "Short-sleeved shirt with a button-down collar, can be dressed up or down."
}
```
{% include copy-curl.html %}

```json
POST /clothing/_doc/4
{
  "description": "A set of two midi silk shirt dresses with long sleeves in black. "
}
```
{% include copy-curl.html %}
