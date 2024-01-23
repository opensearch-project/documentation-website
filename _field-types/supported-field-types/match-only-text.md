---
layout: default
title: Match only text
nav_order: 61
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/match-only-text/
  - /field-types/match-only-text/
---

# Match only text field type

A variant of text field designed for full-text search when scoring and positional information of terms within a document are not critical.

Key features:
 - Omits positions, frequencies, and norms reducing storage.
 - Disables scoring, resulting in all matching documents receiving a constant score of 1.0.
 - Supports most query types, but not interval/span queries.


Choosing `match_only_text` means prioritizing efficient full-text search over complex ranking and positional queries, while also optimizing storage costs. It excels when you need to quickly find documents containing specific terms without the overhead of storing frequencies and positions, leading to significantly smaller indexes. This translates to lower storage costs, especially for large datasets. However, it's not the best choice for ranking results based on relevance or for queries that hinge on term proximity or order, like interval/span queries.
While it does support phrase queries, their performance isn't as efficient as with text field type. So, if pinpointing exact phrases or their locations within documents is essential, use the text field type instead.

## Example

Create a mapping with a text field:

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

While `match_only_text` supports most parameters available for text fields, modifying most of them can actually be counterproductive. This field type thrives on simplicity and efficiency, minimizing data stored in the index to optimize storage costs. Therefore, sticking with the default settings is generally the best approach. Any adjustments beyond analyzer settings could reintroduce overhead and negate the efficiency benefits of `match_only_text`.

Parameter | Description
:--- | :---
`analyzer` | Behavior mirrors that of the text field.
`boost` |  Hits will all have score of 1, so boost will multiply those hits score for the query clause.
`eager_global_ordinals` | Behavior mirrors that of the text field.
`fielddata` | Behavior mirrors that of the text field.
`fielddata_frequency_filter` | Behavior mirrors that of the text field.
`fields` | Behavior mirrors that of the text field.
`index` | Behavior mirrors that of the text field.
`index_options` | It cannot be changed.
`index_phrases` | Not supported.
`index_prefixes` | Not supported.
`meta` | Behavior mirrors that of the text field.
`norms` | Norms are disabled and cannot be enabled.
`position_increment_gap` | Although positions are disabled, `position_increment_gap` behaves similarly to the text field for phrase queries. Such queries may be slower but are still functional.
`similarity` | Setting similarity has no impact, and this field type doesn't support queries like `more_like_this`, which relies on similarity. Use a keyword/text field for such purposes.
`term_vector` | Supports term vectors, but using them is discouraged as it contradicts the primary purpose of this field — storage optimization.

## Migrating from text field

Reindex API can be used to migrate from text field to `match_only_text` by updating the right mapping in the destination index.

Assuming `source` index has a `title` field of type `text` -

Create destination index with desired mappings:
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

Reindex: 
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
