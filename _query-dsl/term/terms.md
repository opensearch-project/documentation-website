---
layout: default
title: Terms
parent: Term-level queries
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
`boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field’s relevance. Values between 0.0 and 1.0 decrease the field’s relevance. Default is 1.0.

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
`boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field’s relevance. Values between 0.0 and 1.0 decrease the field’s relevance. Default is 1.0.

## Bitmap filtering

Terms query can filter for multiple terms at the same time, however, when the size of the input filter become huge like 10k+ terms, the associated network and memory overhead can become too large to make it barely usable. For such case, you may consider encode your large terms filter into a [RoaringBitmap](https://github.com/RoaringBitmap/RoaringBitmap), and use that to do the filtering.

### Example

In this example, we have a main index `products` which contains all the products a company owned. And a separate index `customers` which saves the filters that each represents a customer who owns certain products.

First, we create a RoaringBitmap for the filter on the client side, serialize and encode it using base64.

```py
bm = BitMap([111, 222, 333]) # product ids owned by a customer
encoded = base64.b64encode(BitMap.serialize(bm))
```

Then we can index this bitmap filter into a [binary field](https://opensearch.org/docs/latest/field-types/supported-field-types/binary/).
Here `customer_filter` is the binary field of the index (`customers`).

```sh
# index mapping using binary field with stored field enabled
{
    "mappings": {
        "properties": {
            "customer_filter": {
                "type": "binary",
                "store": true
            }
        }
    }
}

# The id of the document is the identifier of the customer
POST customers/_doc/customer123
{
  "customer_filter": "OjAAAAEAAAAAAAEAEAAAAG8A3gA=" <-- base64 encoded bitmap
}
```

Now we can do a terms lookup query on the products index (`products`) with a lookup on `customers` of certain customer id.

```sh
POST products/_search
{
  "query": {
    "terms": {
      "product_id": {
        "index": "customers",
        "id": "customer123",
        "path": "customer_filter",
        "store": true               <-- lookup on the stored field, instead of _source
      },
      "value_type": "bitmap"        <-- specify the data type of the terms values input
    }
  }
}
```

We can also directly pass the bitmap to the terms query.

```sh
POST products/_search
{
  "query": {
    "terms": {
      "product_id": "<customer_filter_bitmap>",
      "value_type": "bitmap"
    }
  }
}
```
