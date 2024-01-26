---
layout: default
title: Match-only text
nav_order: 61
has_children: false
parent: String field types
grand_parent: Supported field types
---

# Match-only text field type

A `match_only_text` field is a variant of a text field designed for full-text search when scoring and positional information of terms within a document are not critical.

A `match_only_text` field is different from a `text` field in the following ways:

 - Omits storing positions, frequencies, and norms, reducing storage.
 - Disables scoring so all matching documents receive a constant score of 1.0.
 - Supports all query types except interval and span queries.

Choose the `match_only_text` field type to prioritize efficient full-text search over complex ranking and positional queries while optimizing storage costs. Using `match_only_text` creates significantly smaller indexes, which translates to lower storage costs, especially for large datasets. 

Use a `match_only_text` field when you need to quickly find documents containing specific terms without the overhead of storing frequencies and positions. The `match_only_text` field type is not the best choice for ranking results based on relevance or for queries that rely on term proximity or order, like interval or span queries. While this field type does support phrase queries, their performance isn't as efficient as with the `text` field type. If identifying exact phrases or their locations within documents is essential, use the `text` field type instead.

## Example

Create a mapping with a `match_only_text` field:

```json
PUT movies
{
  "mappings" : {
    "properties" : {
      "title" : {
        "type" :  "match_only_text"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

While `match_only_text` supports most parameters available for text fields, modifying most of them can be counterproductive. This field type thrives on simplicity and efficiency, minimizing data stored in the index to optimize storage costs. Therefore, keeping the default settings is generally the best approach. Any adjustments beyond analyzer settings can reintroduce overhead and negate the efficiency benefits of `match_only_text`.

The following table lists all parameters available for `match_text_only` fields.

Parameter | Description
:--- | :---
`analyzer` | The analyzer to be used for this field. By default, it will be used at index time and at search time. To override it at search time, set the `search_analyzer` parameter. Default is the `standard` analyzer, which uses grammar-based tokenization and is based on the [Unicode Text Segmentation](https://unicode.org/reports/tr29/) algorithm.
`boost` |  All hits are assigned a score of 1 and are multiplied by `boost` to produce the final score for the query clause.
`eager_global_ordinals` | Specifies whether global ordinals should be loaded eagerly on refresh. If the field is often used for aggregations, this parameter should be set to `true`. Default is `false`.
`fielddata` | A Boolean value that specifies whether to access analyzed tokens for this field for sorting, aggregation, and scripting. Default is `false`.
`fielddata_frequency_filter` | A JSON object that specifies to load into memory only those analyzed tokens whose document frequency is between the `min` and `max` values (provided as either an absolute number or a percentage). Frequency is computed per segment. Parameters: `min`, `max`, `min_segment_size`. Default is to load all analyzed tokens.
`fields` | To index the same string in several ways (for example, as a keyword and text), provide the fields parameter. You can specify one version of the field to be used for search and another to be used for sorting and aggregations.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`.
`index_options` | You cannot modify this parameter.
`index_phrases` | Not supported.
`index_prefixes` | Not supported.
`meta` | Accepts metadata for this field.
`norms` | Norms are disabled and cannot be enabled.
`position_increment_gap` | Although positions are disabled, `position_increment_gap` behaves similarly to the text field for phrase queries. Such queries may be slower but are still functional.
`similarity` | Setting similarity has no impact. The `match_only_text` field type doesn't support queries like `more_like_this`, which rely on similarity. Use a `keyword` or `text` field for queries that rely on similarity.
`term_vector` | Term vectors are supported but using them is discouraged because it contradicts the primary purpose of this field---storage optimization.

## Migrating a field from `text` to `match_only_text`

You can use the [Reindex API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) to migrate from text field to `match_only_text` by updating the correct mapping in the destination index.

In the following example, the `source` index has a `title` field of type `text`.

Create a destination index with the `title` field mapped as `text`:

```json
PUT destination
{
  "mappings" : {
    "properties" : {
      "title" : {
        "type" :  "match_only_text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Reindex the data:

```json
POST _reindex
{
   "source": {
      "index":"source"
   },
   "dest": {
      "index":"destination"
   }
}
```
{% include copy-curl.html %}
