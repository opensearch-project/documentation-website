---
layout: default
title: Terms
parent: Term-level queries
grand_parent: Query DSL
nav_order: 80
---

# Terms query

Use the `terms` query to search for multiple terms in the same field. For example, the following query searches for lines with the IDs `61809` and `61810`:

```json
GET shakespeare/_search
{
  "query": {
    "terms": {
      "line_id": [
        "61809",
        "61810"
      ]
    }
  }
}
```
{% include copy-curl.html %}

A document is returned if it matches any of the terms in the array.

By default, the maximum number of terms allowed in a `terms` query is 65,536. To change the maximum number of terms, update the `index.max_terms_count` setting.

The ability to [highlight results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/) for terms queries may not be guaranteed, depending on the highlighter type and the number of terms in the query.
{: .note}

## Parameters

The query accepts the following parameters. All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`<field>` | String | The field in which to search. A document is returned in the results only if its field value exactly matches at least one term, with the correct spacing and capitalization.
`boost` | Floating-point | Boosts the query by the given multiplier. Useful for searches that contain more than one query. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 

## Terms lookup

Terms lookup retrieves the field values of a single document and uses them as search terms. You can use terms lookup to search for a large number of terms.

To use terms lookup, you must enable the `_source` mapping field because terms lookup fetches values from a document. The `_source` field is enabled by default.

Terms lookup tries to fetch the document field values from a shard on a local data node. Thus, using an index with a single primary shard that has full replicas on all applicable data nodes reduces network traffic.

### Example

As an example, create an index that contains student data, mapping `student_id` as a `keyword`:

```json
PUT students
{
  "mappings": {
    "properties": {
      "student_id": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Next, index three documents that correspond to students:

```json
PUT students/_doc/1
{
  "name": "Jane Doe",
  "student_id" : "111"
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/2
{
  "name": "Mary Major",
  "student_id" : "222"
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/3
{
  "name": "John Doe",
  "student_id" : "333"
}
```
{% include copy-curl.html %}

Create a separate index that contains class information, including the class name and an array of student IDs corresponding to the students enrolled in the class:

```json
PUT classes/_doc/101
{
  "name": "CS101",
  "enrolled" : ["111" , "222"]
}
```
{% include copy-curl.html %}

To search for students enrolled in the `CS101` class, specify the document ID of the document that corresponds to the class, the index of that document, and the path of the field in which the terms are located:

```json
GET students/_search
{
  "query": {
    "terms": {
      "student_id": {
        "index": "classes",
        "id": "101",
        "path": "enrolled"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the documents in the `students` index for every student whose ID matches one of the values in the `enrolled` array:

```json
{
  "took": 13,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Jane Doe",
          "student_id": "111"
        }
      },
      {
        "_index": "students",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Mary Major",
          "student_id": "222"
        }
      }
    ]
  }
}
```

### Example: Nested fields

The second example demonstrates querying nested fields. Consider an index with the following document:

```json
PUT classes/_doc/102
{
  "name": "CS102",
  "enrolled_students" : {
    "id_list" : ["111" , "333"]
  }
}
```
{% include copy-curl.html %}

To search for students enrolled in `CS102`, use the dot path notation to specify the full path to the field in the `path` parameter:

```json
ET students/_search
{
  "query": {
    "terms": {
      "student_id": {
        "index": "classes",
        "id": "102",
        "path": "enrolled_students.id_list"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents:

```json
{
  "took": 18,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "students",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Jane Doe",
          "student_id": "111"
        }
      },
      {
        "_index": "students",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "John Doe",
          "student_id": "333"
        }
      }
    ]
  }
}
```

### Parameters

The following table lists the terms lookup parameters.

Parameter | Data type | Description
:--- | :--- | :---
`index` | String | The name of the index in which to fetch field values. Required.
`id` | String | The document ID of the document from which to fetch field values. Required.
`path` | String | The name of the field from which to fetch field values. Specify nested fields using dot path notation. Required.
`routing` | String | Custom routing value of the document from which to fetch field values. Optional. Required if a custom routing value was provided when the document was indexed.