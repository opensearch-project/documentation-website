---
layout: default
title: Enabled
parent: Mapping parameters

nav_order: 40
has_children: false
has_toc: false
---

# Enabled

OpenSearch tries to index all fields you provide, but sometimes you may want to store a field without making it searchable. For example, if you use OpenSearch as a web session store, you might index the session ID and last update time but store the session data itself without indexing it, since you don’t need to search or aggregate  this data.

Setting the `enabled` parameter to `false` causes OpenSearch to skip parsing of the field contents entirely. OpenSearch still stores the field's value in the `_source` field but does not index or parse its contents, so the field is not searchable. This parameter can be applied only to the top-level mapping definition and to object fields. 

The `enabled` parameter accepts the following values. 

Parameter | Description
:--- | :---
`true` (Default) | The field is parsed and indexed.
`false` | The field is not parsed or indexed but is still retrievable from the `_source` field. 

The `enabled` parameter for existing fields and the top-level mapping definition cannot be updated.
{: .warning}

## Disabling object fields

Create an index with a disabled `session_data` object field. OpenSearch stores its contents in the `_source` field but does not index or parse them:

```json
PUT /session_store
{
  "mappings": {
    "properties": {
      "user_id": {
        "type": "keyword"
      },
      "last_updated": {
        "type": "date"
      },
      "session_data": {
        "type": "object",
        "enabled": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Index documents with different types of data in the disabled field:

```json
PUT /session_store/_doc/session_1
{
  "user_id": "johndoe",
  "session_data": {
    "user_preferences": {
      "theme_settings": ["dark_mode", "compact_layout", {"font_size": 14}]
    }
  },
  "last_updated": "2025-02-10T07:10:53"
}
```
{% include copy-curl.html %}

```json
PUT /session_store/_doc/session_2
{
  "user_id": "janedoe",
  "session_data": "none",
  "last_updated": "2025-02-10T07:12:48"
}
```
{% include copy-curl.html %}

The `session_data` field accepts any arbitrary data because OpenSearch completely skips parsing its contents. Both object and non-object data are accepted.

## Disabling entire mappings

Disable the entire mapping to store documents without indexing any fields:

```json
PUT /raw_storage
{
  "mappings": {
    "enabled": false
  }
}
```
{% include copy-curl.html %}

Index a document in the disabled mapping:

```json
PUT /raw_storage/_doc/doc_1
{
  "user_id": "janedoe",
  "session_data": {
    "user_preferences": {
      "theme_settings": ["dark_mode", "compact_layout", {"font_size": 14}]
    }
  },
  "last_updated": "2025-12-10T07:10:53"
}
```
{% include copy-curl.html %}

To verify that the document was stored, retrieve the document:

```json
GET /raw_storage/_doc/doc_1
```
{% include copy-curl.html %}

The response shows that the document was successfully stored and can be retrieved from the `_source` field:

```json
{
  "_index": "raw_storage",
  "_id": "doc_1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "user_id": "janedoe",
    "session_data": {
      "user_preferences": {
        "theme_settings": [
          "dark_mode",
          "compact_layout",
          {
            "font_size": 14
          }
        ]
      }
    },
    "last_updated": "2025-12-10T07:10:53"
  }
}
```

Verify the mapping to confirm that no fields were added:

```json
GET /raw_storage/_mapping
```
{% include copy-curl.html %}

The document can be retrieved from `_source`, but none of its contents are indexed, so no fields appear in the mapping and the document cannot be searched:

```json
{
  "raw_storage": {
    "mappings": {
      "enabled": false
    }
  }
}
```
