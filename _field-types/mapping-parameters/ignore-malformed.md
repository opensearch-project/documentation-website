---
layout: default
title: Ignore_malformed
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 45
has_children: false
has_toc: false
---

# ignore_malformed

The `ignore_malformed` mapping parameter instructs the indexing engine to ignore values that do not match the field’s expected format. When enabled, malformed values are not indexed, preventing entire document rejection due to data format issues. This ensures that documents are still stored even if one or more fields contain data that cannot be parsed.

By default, `ignore_malformed` is disabled, which means that if a value cannot be parsed according to the field type, the entire document indexing will fail.

## Example: Without ignore_malformed

Use the following command to create an index named `people_no_ignore` with an `age` field of type `integer` and `ignore_malformed` set to `false` (default):

```json
PUT /people_no_ignore
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer",
        "ignore_malformed": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a malformed value using the following command:

```json
PUT /people_no_ignore/_doc/1
{
  "age": "twenty"
}
```
{% include copy-curl.html %}

Expected result:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "mapper_parsing_exception",
        "reason": "failed to parse field [age] of type [integer] in document with id '1'. Preview of field's value: 'twenty'"
      }
    ],
    "type": "mapper_parsing_exception",
    "reason": "failed to parse field [age] of type [integer] in document with id '1'. Preview of field's value: 'twenty'",
    "caused_by": {
      "type": "number_format_exception",
      "reason": "For input string: \"twenty\""
    }
  },
  "status": 400
}
```

## Example: With ignore_malformed

Use the following command to create an index named `people_ignore` where the `age` field uses `ignore_malformed` set to `true`.

```json
PUT /people_ignore
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer",
        "ignore_malformed": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a malformed value using the following command:

```json
PUT /people_ignore/_doc/1
{
  "age": "twenty"
}
```
{% include copy-curl.html %}

Retrieve the document using the following command:

```json
GET /people_ignore/_doc/1
```
{% include copy-curl.html %}

Expected result:

```json
{
  "_index": "people_ignore",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "age": "twenty"
  }
}
```


