---
layout: default
title: Search analyzer
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 160
has_children: false
has_toc: false
---

# Search analyzer

The `search_analyzer` mapping parameter specifies the analyzer to be used at search time for a [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field. This allows the analyzer used for indexing to differ from the one used for search, offering greater control over how search terms are interpreted and matched.

By default, the same analyzer is used for both indexing and search. However, using a custom `search_analyzer` can be helpful when you want to apply looser or stricter matching rules during search, such as using [`stemming`]({{site.url}}{{site.baseurl}}/analyzers/stemming/) or removing stopwords only at search time. For more information and use cases, see [Search analyzers]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/).
{: .note}

## Example

The following example creates a field that uses an `edge_ngram_analyzer` configured with an [`edge_ngram_tokenizer`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/edge-n-gram/) for indexing and a [`standard` analyzer]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/standard/) for search:

```json
PUT /articles
{
  "settings": {
    "analysis": {
      "analyzer": {
        "edge_ngram_analyzer": {
          "tokenizer": "edge_ngram_tokenizer",
          "filter": ["lowercase"]
        }
      },
      "tokenizer": {
        "edge_ngram_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 10,
          "token_chars": ["letter", "digit"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "edge_ngram_analyzer",
        "search_analyzer": "standard"
      }
    }
  }
}
```
{% include copy-curl.html %}

For a full explanation of how search analyzers work as well as more examples, see [Search analyzers]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/).
