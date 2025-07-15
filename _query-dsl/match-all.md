---
layout: default
title: Match all queries
nav_order: 65
---

# Match all queries

The `match_all` query returns all documents. This query can be useful in testing large document sets if you need to return the entire set.

```json
GET _search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

The `match_all` query has a `match_none` counterpart, which is rarely useful:

```json
GET _search
{
  "query": {
    "match_none": {}
  }
}
```
{% include copy-curl.html %}


## Parameters

Both the matchall and match none queries accepts the following parameters. All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field’s relevance. Values between 0.0 and 1.0 decrease the field’s relevance. Default is 1.0.
`_name` | String | The name of the query for query tagging. Optional.
