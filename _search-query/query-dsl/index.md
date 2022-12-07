---
layout: default
title: Search with Query DSL
has_children: true
nav_order: 50
redirect_from:
  - /opensearch/query-dsl/
  - /docs/opensearch/query-dsl/
---

{%- comment -%}The `/docs/opensearch/query-dsl/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Search with Query DSL

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

<!-- need to include the HTTP method in example here GET _search is missing from code block 
-->
**Sample request**
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
The OpenSearch query DSL comes in three varieties: term-level queries, full-text queries, and boolean queries. You can even perform more complicated searches by using different elements from each variety to find whatever data you need.

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

