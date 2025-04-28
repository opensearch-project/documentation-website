---
layout: default
title: More like this
parent: Specialized queries
nav_order: 45
has_math: false
---

# More like this

`more_like_this` query is used to find documents that are similar to one or more given documents. This is useful for recommendation engines, content discovery, and identifying related items in a dataset.

The `more_like_this` query analyzes the input documents or texts and selects terms that best characterize them. It then searches for other documents that contain those significant terms.

## Prerequisites

Before you use a `more_like_this` query, make sure the fields you target are indexed, and their data type is either [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) or [`keyword`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/). 

If you reference documents in the `like` section, OpenSearch needs access to their content. By default, this is done through the `_source` field. If `_source` is disabled, you must either store the fields individually or configure them to save [`term_vector`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/term-vector/) data. 

Saving [`term_vector`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/term-vector/) information when indexing documents can greatly accelerate `more_like_this` queries, because the engine can directly retrieve the important terms without re-analyzing the field text at query time.
{: .note}

## Example without term vector optimization

Create index named `articles-basic` using the basic mapping:

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

The terms that get queried by `more_like_this` are `jungle` and `wildlife`, which match only one document using `content` field:

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

## Example with term vector optimization

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
{ "index": { "_id": 1 }}
{ "title": "Sahara Desert Expeditions", "content": "An ocean of golden sand and hidden oases." }
{ "index": { "_id": 2 }}
{ "title": "Wildlife in the Amazon", "content": "Exotic birds and dense rainforest." }
{ "index": { "_id": 3 }}
{ "title": "Himalayan Treks", "content": "High-altitude adventure and monasteries." }
```
{% include copy-curl.html %}

Find similar document using following request:

```json
GET /articles-optimized/_search
{
  "query": {
    "more_like_this": {
      "fields": ["content"],
      "like": "sand dunes hidden oases",
      "min_term_freq": 1,
      "min_doc_freq": 1
    }
  }
}
```
{% include copy-curl.html %}

The terms that get selected by `more_like_this` are: `sand`, `dunes`, `hidden`, and `oases`, which match one document:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 2.5893893,
    "hits": [
      {
        "_index": "articles-optimized",
        "_id": "1",
        "_score": 2.5893893,
        "_source": {
          "title": "Sahara Desert Expeditions",
          "content": "An ocean of golden sand and hidden oases."
        }
      }
    ]
  }
}
```

## Example using multiple documents and text input in `like`

The `more_like_this` query allows you to provide multiple sources in the `like` parameter. You can combine free text with documents from the index. This is useful if you want the search to combine relevance signals from several examples.

In the following example:
- A new artificial document is provided directly.
- An existing document with ID `5` from the `heroes` index is included.

```json
GET /_search
{
  "query": {
    "more_like_this": {
      "fields": ["character.name", "character.alias"],
      "like": [
        {
          "_index": "heroes",
          "doc": {
            "character": {
              "name": "Diana",
              "alias": "Wonder Woman"
            },
            "quote": "Courage is not the absence of fear, but the triumph over it."
          }
        },
        {
          "_index": "heroes",
          "_id": "5"
        }
      ],
      "min_term_freq": 1,
      "max_query_terms": 10
    }
  }
}
```
{% include copy-curl.html %}

Use this pattern when you want to boost results based on a new concept that is not yet fully indexed, but also want to combine it with knowledge from existing indexed documents.
{: .note}

# Parameters

The only required parameter for a `more_like_this` query is `like`. The rest of the parameters have default values but allow fine-tuning. Parameters fall into three main categories:

## Document Input Parameters

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| `like` | Required | Defines the text or documents to find similar documents for. You can input free text, real documents from the index, or even artificial documents. The analyzer associated with the field will process the text unless you override it. |
| `unlike` | Optional | Provides text or documents whose terms should be *excluded* from influencing the query. Useful for specifying negative examples. |
| `fields` | Optional | Lists fields to use when analyzing text. If not specified, all fields are used.

## Term Selection Parameters

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| `max_query_terms` | Optional | Sets the maximum number of terms to select from the input. A higher value increases precision but slows down execution. Default is `25`. |
| `min_term_freq` | Optional | Terms appearing fewer times than this in the input will be ignored. Default is `2`. |
| `min_doc_freq` | Optional | Terms that appear in fewer documents than this value will be ignored. Default is `5`. |
| `max_doc_freq` | Optional | Terms appearing in more documents than this limit are ignored. Useful for avoiding very common words. Default is unlimited (`2147483647`). |
| `min_word_length` | Optional | Ignore words shorter than this value. Default is `0`. |
| `max_word_length` | Optional | Ignore words longer than this value. Default is unlimited. |
| `stop_words` | Optional | Defines a list of words that are ignored completely when selecting terms. |
| `analyzer` | Optional | The custom analyzer to use for processing input text. Defaults to the analyzer of the first field listed in `fields`. |

## Query Formation Parameters

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| `minimum_should_match` | Optional | Sets the minimum percentage or number of terms that must match for a document to be considered a match. Default is `30%`. |
| `fail_on_unsupported_field` | Optional | If true, the query fails when it encounters unsupported field types. Setting it to false allows it to skip such fields. Default is `true`. |
| `boost_terms` | Optional | Boosts significant terms based on their TF-IDF score. Set a positive number to enable boosting. Default is `0` (disabled). |
| `include` | Optional | Whether to include the input documents in the search results. Default is `false`. |
| `boost` | Optional | Multiplies the relevance score of the whole query. Default is `1.0`. |

