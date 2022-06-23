---
layout: default
title: Completion
nav_order: 51
has_children: false
parent: Autocomplete field types
grand_parent: Supported field types
---

# Completion field type

A completion field type is a completion suggester that provides auto-complete functionality. You need to upload a list of all possible completions into the index before using this feature.

## Example

Create a mapping with a completion field:

```json
PUT books
{
  "mappings": {
    "properties": {
      "suggestions": {
        "type": "completion"
      },
      "title": {
        "type": "keyword"
      }
    }
  }
}
```

Index suggestions into OpenSearch:

```json
PUT books/_doc/1
{
  "suggestions" : {
    "input": [ "A Beautiful Story", "A Beautiful Life" ],
    "weight" : 10
  }
}
```

## Parameters

The following table lists the parameters accepted by completion fields.

Parameter | Description 
:--- | :--- 
`input` | A list of possible completions as a string or array of strings. Cannot contain `\u0000` (null), `\u001f` (information separator one), or `u001e` (information separator two). Required.
`weight` | A positive integer or a positive integer string for ranking suggestions. Optional.

Multiple suggestions can be indexed as follows:

```json
PUT books/_doc/1
{
  "suggestions": [
    {
      "input": "A Beautiful Story",
      "weight": 5
    },
    {
      "input": "A Beautiful Life",
      "weight": 15
    }
  ]
}
```

As an alternative, you can use the following shorthand notation (note that you cannot provide the `weight` parameter in this notation):

```json
PUT books/_doc/1
{
  "suggestions" : [ "A Beautiful Story", "A Beautiful Life" ]
}
```