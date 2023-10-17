---
layout: default
title: Text
nav_order: 47
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/text/
  - /field-types/text/
---

# Text field type

A text field type contains a string that is analyzed. It is used for full-text search because it allows partial matches. Searches with multiple terms can match some but not all of them. Depending on the analyzer, results can be case insensitive, stemmed, stopwords removed, synonyms applied, etc.


If you need to use a field for exact-value search, map it as a [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) instead.
{: .note }

## Example

Create a mapping with a text field:

```json
PUT movies
{
  "mappings" : {
    "properties" : {
      "title" : {
        "type" :  "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by text field types. All parameters are optional.

Parameter | Description 
:--- | :---
`analyzer` | The analyzer to be used for this field. By default, it will be used at index time and at search time. To override it at search time, set the `search_analyzer` parameter. Default is the `standard` analyzer, which uses grammar-based tokenization and is based on the [Unicode Text Segmentation](https://unicode.org/reports/tr29/) algorithm.
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`eager_global_ordinals` | Specifies whether global ordinals should be loaded eagerly on refresh. If the field is often used for aggregations, this parameter should be set to `true`. Default is `false`.
`fielddata` | A Boolean value that specifies whether to access analyzed tokens for this field for sorting, aggregation, and scripting. Default is `false`.
`fielddata_frequency_filter` | A JSON object that specifies to load into memory only those analyzed tokens whose document frequency is between the `min` and `max` values (provided as either an absolute number or a percentage). Frequency is computed per segment. Parameters: `min`, `max`, `min_segment_size`. Default is to load all analyzed tokens.
`fields` | To index the same string in several ways (for example, as a keyword and text), provide the fields parameter. You can specify one version of the field to be used for search and another to be used for sorting and aggregations.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`.
`index_options` | Specifies the information to be stored in the index for search and highlighting. Valid values: `docs` (doc number only), `freqs` (doc number and term frequencies), `positions` (doc number, term frequencies, and term positions), `offsets` (doc number, term frequencies, term positions, and start and end character offsets). Default is `positions`.
`index_phrases` | A Boolean value that specifies to index 2-grams separately. 2-grams are combinations of two consecutive words in this field's string. Leads to faster exact phrase queries with no slop but a larger index. Works best when stopwords are not removed. Default is `false`.
`index_prefixes` | A JSON object that specifies to index term prefixes separately. The number of characters in the prefix is between `min_chars` and `max_chars`, inclusive. Leads to faster prefix searches but a larger index. Optional parameters: `min_chars`, `max_chars`. Default `min_chars` is 2, `max_chars` is 5.
`meta` | Accepts metadata for this field.
`norms` | A Boolean value that specifies whether the field length should be used when calculating relevance scores. Default is `false`.
`position_increment_gap` | When text fields are analyzed, they are assigned positions. If a field contained an array of strings, and these positions were consecutive, this would lead to potentially matching across different array elements. To prevent this, an artificial gap is inserted between consecutive array elements. You can change this gap by specifying an integer `position_increment_gap`. Note: If `slop` is greater than `position_element_gap`, matching across different array elements may occur. Default is 100.
`similarity` | The ranking algorithm for calculating relevance scores. Default is `BM25`. 
[`term_vector`](#term-vector-parameter) | A Boolean value that specifies whether a term vector for this field should be stored. Default is `no`.

## Term vector parameter

A term vector is produced during analysis. It contains:
- A list of terms.
- The ordinal position of each term.
- The start and end character offsets of the search string within the field.
- Payloads (if available). Each term can have custom binary data associated with the term's position.

The `term_vector` field contains a JSON object that accepts the following parameters:

Parameter | Stored values
:--- | :---
`no` | None. This is the default.
`yes` | Terms in the field.
`with_offsets` | Terms and character offsets.
`with_positions_offsets` | Terms, positions, and character offsets.
`with_positions_offsets_payloads` | Terms, positions, character offsets, and payloads.
`with_positions` | Terms and positions.
`with_positions_payloads` | Terms, positions, and payloads.

Storing positions is useful for proximity queries. Storing character offsets is useful for highlighting.
{: .tip }

### Term vector parameter example

Create a mapping with a text field that stores character offsets in a term vector:

```json
PUT testindex
{
  "mappings" : {
    "properties" : {
      "dob" : {
        "type" :  "text",
        "term_vector": "with_positions_offsets"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a text field:

```json
PUT testindex/_doc/1
{
    "dob" : "The patient's date of birth."
}
```
{% include copy-curl.html %}

Query for "date of birth" and highlight it in the original field:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "text": "date of birth"
    }
  },
  "highlight": {
    "fields": {
      "text": {} 
    }
  }
}
```
{% include copy-curl.html %}

The words "date of birth" are highlighted in the response:

```json
{
  "took" : 854,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.8630463,
    "hits" : [
      {
        "_index" : "testindex",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.8630463,
        "_source" : {
          "text" : "The patient's date of birth."
        },
        "highlight" : {
          "text" : [
            "The patient's <em>date</em> <em>of</em> <em>birth</em>."
          ]
        }
      }
    ]
  }
}
```