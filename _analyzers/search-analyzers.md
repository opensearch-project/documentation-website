---
layout: default
title: Search analyzers
nav_order: 30
---

# Search analyzers

Search analyzers are specified at query time and are used to analyze the query string when you run a full-text query on a [text]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field.

## Determining which search analyzer to use

To determine which analyzer to use for a query string at query time, OpenSearch examines the following parameters in order:

1. The `analyzer` parameter of the query
1. The `search_analyzer` mapping parameter of the field
1. The `analysis.analyzer.default_search` index setting
1. The `analyzer` mapping parameter of the field
1. The `standard` analyzer (default)

In most cases, specifying a search analyzer that is different from the index analyzer is not necessary and could negatively impact search result relevance or lead to unexpected search results.
{: .warning}

For information about verifying which analyzer is associated with which field, see [Verifying analyzer settings]({{site.url}}{{site.baseurl}}/analyzers/index/#verifying-analyzer-settings).

## Specifying a search analyzer for a query string

Specify the name of the analyzer you want to use at query time in the `analyzer` field:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "speak the truth",
        "analyzer": "english"
      }
    }
  }
}
```
{% include copy-curl.html %}

Valid values for [built-in analyzers]({{site.url}}{{site.baseurl}}/analyzers/index#built-in-analyzers) are `standard`, `simple`, `whitespace`, `stop`, `keyword`, `pattern`, `fingerprint`, or any supported [language analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/).

## Specifying a search analyzer for a field

When creating index mappings, you can provide the `search_analyzer` parameter for each [text]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field. When providing the `search_analyzer`, you must also provide the `analyzer` parameter, which specifies the [index analyzer]({{site.url}}{{site.baseurl}}/analyzers/index-analyzers/) to be used at indexing time.

For example, the following request specifies the `simple` analyzer as the index analyzer and the `whitespace` analyzer as the search analyzer for the `text_entry` field:

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text",
        "analyzer": "simple",
        "search_analyzer": "whitespace"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Specifying the default search analyzer for an index

If you want to analyze all query strings at search time with the same analyzer, you can specify the search analyzer in the `analysis.analyzer.default_search` setting. When providing the `analysis.analyzer.default_search`, you must also provide the `analysis.analyzer.default` parameter, which specifies the [index analyzer]({{site.url}}{{site.baseurl}}/analyzers/index-analyzers/) to be used at indexing time.

For example, the following request specifies the `simple` analyzer as the index analyzer and the `whitespace` analyzer as the search analyzer for the `testindex` index:

```json
PUT testindex
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "simple"
        },
        "default_search": {
          "type": "whitespace"
        }
      }
    }
  }
}

```
{% include copy-curl.html %}
