---
layout: default
title: Terms set
parent: Term-level queries
grand_parent: Query DSL
nav_order: 90
---

# Terms set query

With a terms set query, you can search for documents that match a minimum number of exact terms in a specified field. A `terms_set` query is similar to a `terms` query, except that you can specify the minimum number of matching terms that are required in order to return a document. You can specify this number either in a field in the index or with a script.

As an example, consider an index that contains names of students and classes those students have taken. When setting up the mapping for this index, you need to provide a [numeric]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) field that specifies the minimum number of matching terms that are required in order to return a document:

```json
PUT students
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "classes": {
        "type": "keyword"
      },
      "min_required": {
        "type": "integer"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, index two documents that correspond to students:

```json
PUT students/_doc/1
{
  "name": "Mary Major",
  "classes": [ "CS101", "CS102", "MATH101" ],
  "min_required": 2
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/2
{
  "name": "John Doe",
  "classes": [ "CS101", "MATH101", "ENG101" ],
  "min_required": 2
}
```
{% include copy-curl.html %}

Now search for students who have taken at least two of the following classes: `CS101`, `CS102`, `MATH101`:

```json
GET students/_search
{
  "query": {
    "terms_set": {
      "classes": {
        "terms": [ "CS101", "CS102", "MATH101" ],
        "minimum_should_match_field": "min_required"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both documents:

```json
{
  "took" : 44,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.4544616,
    "hits" : [
      {
        "_index" : "students",
        "_id" : "1",
        "_score" : 1.4544616,
        "_source" : {
          "name" : "Mary Major",
          "classes" : [
            "CS101",
            "CS102",
            "MATH101"
          ],
          "min_required" : 2
        }
      },
      {
        "_index" : "students",
        "_id" : "2",
        "_score" : 0.5013843,
        "_source" : {
          "name" : "John Doe",
          "classes" : [
            "CS101",
            "MATH101",
            "ENG101"
          ],
          "min_required" : 2
        }
      }
    ]
  }
}
```

To specify the minimum number of terms a document should match with a script, provide the script in the `minimum_should_match_script` field:

```json
GET students/_search
{
  "query": {
    "terms_set": {
      "classes": {
        "terms": [ "CS101", "CS102", "MATH101" ],
        "minimum_should_match_script": {
          "source": "Math.min(params.num_terms, doc['min_required'].value)"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "terms_set": {
      "<field>": {
        "terms": [ "term1", "term2" ],
        ... 
      }
    }
  }
}
```
{% include copy-curl.html %}

The `<field>` accepts the following parameters. All parameters except `terms` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`terms` | Array of strings | The array of terms to search for in the field specified in `<field>`. A document is returned in the results only if the required number of terms matches the document's field values exactly, with the correct spacing and capitalization.
`minimum_should_match_field` | String | The name of the [numeric]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/numeric/) field that specifies the number of matching terms required in order to return a document in the results.
`minimum_should_match_script` | String | A script that returns the number of matching terms required in order to return a document in the results.