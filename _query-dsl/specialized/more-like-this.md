---
layout: default
title: More like this
parent: Specialized queries
nav_order: 45
has_math: false
---

# More like this

Use a `more_like_this` query to find documents that are similar to one or more given documents. This is useful for recommendation engines, content discovery, and identifying related items in a dataset.

The `more_like_this` query analyzes the input documents or texts and selects terms that best characterize them. It then searches for other documents that contain those significant terms.

## Prerequisites

Before you use a `more_like_this` query, ensure that the fields you target are indexed and their data type is either [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) or [`keyword`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/). 

If you reference documents in the `like` section, OpenSearch needs access to their content. This is typically done through the `_source` field, which is enabled by default. If `_source` is disabled, you must either store the fields individually or configure them to save [`term_vector`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/term-vector/) data. 

Saving [`term_vector`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/term-vector/) information when indexing documents can greatly accelerate `more_like_this` queries, because the engine can directly retrieve the important terms without re-analyzing the field text at query time.
{: .note}

## Example: No term vector optimization

Create an index named `articles-basic` using the following mapping:

```json
PUT /articles-basic
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "content": { "type": "text" }
    }
  }
}
```
{% include copy-curl.html %}

Add sample documents:

```json
POST /articles-basic/_bulk
{ "index": { "_id": 1 }}
{ "title": "Exploring the Sahara Desert", "content": "Sand dunes and vast landscapes." }
{ "index": { "_id": 2 }}
{ "title": "Amazon Rainforest Tour", "content": "Dense jungle and exotic wildlife." }
{ "index": { "_id": 3 }}
{ "title": "Mountain Adventures", "content": "Snowy peaks and hiking trails." }
```
{% include copy-curl.html %}

Query using the following request:

```json
GET /articles-basic/_search
{
  "query": {
    "more_like_this": {
      "fields": ["content"],
      "like": "jungle wildlife",
      "min_term_freq": 1,
      "min_doc_freq": 1
    }
  }
}
```
{% include copy-curl.html %}

The `more_like_this` query searches for the terms `jungle` and `wildlife` in the `content` field, which matches only one document:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.9616582,
    "hits": [
      {
        "_index": "articles-basic",
        "_id": "2",
        "_score": 1.9616582,
        "_source": {
          "title": "Amazon Rainforest Tour",
          "content": "Dense jungle and exotic wildlife."
        }
      }
    ]
  }
}
```

## Example: Term vector optimization

Create an index named `articles-optimized` using the following mapping:

```json
PUT /articles-optimized
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "term_vector": "with_positions_offsets"
      },
      "content": {
        "type": "text",
        "term_vector": "with_positions_offsets"
      }
    }
  }
}
```
{% include copy-curl.html %}

Insert sample documents into the optimized index:

```json
POST /articles-optimized/_bulk
{ "index": { "_id": "a1" } }
{ "name": "Diana", "alias": "Wonder Woman", "quote": "Justice will come when it is deserved." }
{ "index": { "_id": "a2" } }
{ "name": "Clark", "alias": "Superman", "quote": "Even in the darkest times, hope cuts through." }
{ "index": { "_id": "a3" } }
{ "name": "Bruce", "alias": "Batman", "quote": "I am vengeance. I am the night. I am Batman!" }
```
{% include copy-curl.html %}

Find documents similar to `dark night` using the following request:

```json
GET /articles-optimized/_search
{
  "query": {
    "more_like_this": {
      "fields": ["quote"],
      "like": "dark night",
      "min_term_freq": 1,
      "min_doc_freq": 1
    }
  }
}
```
{% include copy-curl.html %}

The `more_like_this` query searches for the terms `dark` and `night` and returns the following hit:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.2363393,
    "hits": [
      {
        "_index": "articles-optimized",
        "_id": "a3",
        "_score": 1.2363393,
        "_source": {
          "name": "Bruce",
          "alias": "Batman",
          "quote": "I am vengeance. I am the night. I am Batman!"
        }
      }
    ]
  }
}
```

## Example: Using multiple documents and text input

The `more_like_this` query allows you to provide multiple sources in the `like` parameter. You can combine free text with documents from the index. This is useful if you want the search to combine relevance signals from several examples.

In the following example, a custom document is provided directly. Additionally, an existing document with the ID `5` from the `heroes` index is included:

```json
GET /articles-optimized/_search
{
  "query": {
    "more_like_this": {
      "fields": ["name", "alias"],
      "like": [
        {
          "doc": {
            "name": "Diana",
            "alias": "Wonder Woman",
            "quote": "Courage is not the absence of fear, but the triumph over it."
          }
        },
        {
          "_index": "heroes",
          "_id": "5"
        }
      ],
      "min_term_freq": 1,
      "min_doc_freq": 1,
      "max_query_terms": 25
    }
  }
}
```
{% include copy-curl.html %}

The returned results contain articles most similar to the `name` and `alias` fields provided in the query:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 2.140194,
    "hits": [
      {
        "_index": "articles-optimized",
        "_id": "a1",
        "_score": 2.140194,
        "_source": {
          "name": "Diana",
          "alias": "Wonder Woman",
          "quote": "Justice will come when it is deserved."
        }
      },
      {
        "_index": "articles-optimized",
        "_id": "a2",
        "_score": 1.1596459,
        "_source": {
          "name": "Clark",
          "alias": "Superman",
          "quote": "Even in the darkest times, hope cuts through."
        }
      }
    ]
  }
}
```

Use this pattern when you want to boost results based on a new concept that is not yet fully indexed, but also want to combine it with knowledge from existing indexed documents.
{: .note}

# Parameters

The only required parameter for a `more_like_this` query is `like`. The rest of the parameters have default values but allow fine-tuning. Parameters fall into the following main categories.

## Document input parameters

The following table specifies document input parameters.

| Parameter | Required/Optional | Data Type | Description |
| :--- |  :--- |  :--- |  :--- | 
| `like`| Required| Array of strings or objects | Defines the text or documents to find similar documents for. You can input free text, real documents from the index, or artificial documents. The analyzer associated with the field processes the text unless overridden. |
| `unlike`| Optional| Array of strings or objects | Provides text or documents whose terms should be *excluded* from influencing the query. Useful for specifying negative examples.|
| `fields`| Optional| Array of strings| Lists fields to use when analyzing text. If not specified, all fields are used. |

## Term selection parameters

| Parameter | Required/Optional | Data Type| Description|
| :--- |  :--- |  :--- |  :--- | 
| `max_query_terms` | Optional| Integer| Sets the maximum number of terms to select from the input. A higher value increases precision but slows down execution. Default is `25`. |
| `min_term_freq` | Optional| Integer| Terms appearing fewer times than this in the input will be ignored. Default is `2`.|
| `min_doc_freq`| Optional| Integer| Terms that appear in fewer documents than this value will be ignored. Default is `5`.|
| `max_doc_freq`| Optional| Integer| Terms appearing in more documents than this limit are ignored. Useful for avoiding very common words. Default is unlimited (`2147483647`). |
| `min_word_length` | Optional| Integer| Ignore words shorter than this value. Default is `0`.|
| `max_word_length` | Optional| Integer| Ignore words longer than this value. Default is unlimited. |
| `stop_words`| Optional| Array of strings | Defines a list of words that are ignored completely when selecting terms.|
| `analyzer`| Optional| String | The custom analyzer to use for processing input text. Defaults to the analyzer of the first field listed in `fields`.|

## Query formation parameters

| Parameter | Required/Optional | Data Type| Description|
| :--- |  :--- |  :--- |  :--- | 
| `max_query_terms` | Optional| Integer| Sets the maximum number of terms to select from the input. A higher value increases precision but slows down execution. Default is `25`. |
| `min_term_freq` | Optional| Integer| Terms appearing fewer times than this in the input will be ignored. Default is `2`.|
| `min_doc_freq`| Optional| Integer| Terms that appear in fewer documents than this value will be ignored. Default is `5`.|
| `max_doc_freq`| Optional| Integer| Terms appearing in more documents than this limit are ignored. Useful for avoiding very common words. Default is unlimited (`2147483647`). |
| `min_word_length` | Optional| Integer| Ignore words shorter than this value. Default is `0`.|
| `max_word_length` | Optional| Integer| Ignore words longer than this value. Default is unlimited. |
| `stop_words`| Optional| Array of strings | Defines a list of words that are ignored completely when selecting terms.|
| `analyzer`| Optional| String | The custom analyzer to use for processing input text. Defaults to the analyzer of the first field listed in `fields`.|
