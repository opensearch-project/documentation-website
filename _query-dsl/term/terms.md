---
layout: default
title: Terms
parent: Term-level queries
nav_order: 20
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

For better query performance, pass long arrays containing terms in sorted order (ordered by UTF-8 byte values, ascending).
{: .tip}


The ability to [highlight results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/) for terms queries may not be guaranteed, depending on the highlighter type and the number of terms in the query.
{: .note}

## Parameters

The query accepts the following parameters. All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`<field>` | String | The field in which to search. A document is returned in the results only if its field value exactly matches at least one term, with the correct spacing and capitalization.
`boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field’s relevance. Values between 0.0 and 1.0 decrease the field’s relevance. Default is 1.0.
`_name` | String | The name of the query for query tagging. Optional.
`value_type` | String | Specifies the types of values used for filtering. Valid values are `default` and `bitmap`. If omitted, the value defaults to `default`.

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
GET students/_search
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
`query` | Object | A query object to select multiple documents from which to fetch field values. Required if `id` is not supplied.
`path` | String | The name of the field from which to fetch field values. Specify nested fields using dot path notation. Required.
`routing` | String | Custom routing value of the document from which to fetch field values. Optional. Required if a custom routing value was provided when the document was indexed.
`store` | Boolean | Whether to perform the lookup on the stored field instead of `_source`. Optional.

## Terms lookup by query
**Introduced 3.2**
{: .label .label-purple}

You can use a query to dynamically extract values from multiple documents and use them in a `terms` query. Instead of specifying a document ID, the `query` parameter lets you match documents and collect all values for a specified field across those matches.

This is useful when you want to search one index based on field values from documents in another index.

For a list of supported parameters, see [terms lookup parameters](#parameters-1). To use terms lookup by query, you must provide the `query` parameter instead of `id` in the terms lookup object.  

### How values are collected

The behavior of the terms lookup depends on how the target field appears in the matched documents:

- If a document matching the query does not contain the specified field, the document is ignored for terms extraction.
- If the field is a list, all its items are collected.
- If the field is a scalar, its value is collected.
- If the same field is a single value or a list for different documents, all values are flattened into a single list and deduplicated.
- Multiple lists are flattened into a single list.
- If the field is missing, `null`, or an empty list, it is skipped.
- Duplicates from multiple documents are deduplicated.
- If no documents match the query, the `terms` query acts as if no values were specified (typically, matches nothing).
- If none of the matched documents contain the field, the query does not match anything.

### Example

First, create an index named `users`, which contains user information:

```json
PUT /users
{
  "mappings": {
    "properties": {
      "username": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Add user data to the index:

```json
PUT users/_doc/u1
{ "username": "alice" }
```
{% include copy-curl.html %}

```json
PUT users/_doc/u2
{ "username": "bob" }
```
{% include copy-curl.html %}

```json
PUT users/_doc/u3
{ "username": "carol" }
```
{% include copy-curl.html %}

```json
PUT users/_doc/u4
{ "username": "dave" }
```
{% include copy-curl.html %}

Next, create an index containing group memberships:

```json
PUT groups
{
  "mappings": {
    "properties": {
      "group": { "type": "keyword" },
      "members": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Add group membership data to the index:

```json
PUT groups/_doc/1
{
  "group": "g1",
  "members": ["alice", "bob"]
}
```
{% include copy-curl.html %}

```json
PUT groups/_doc/2
{
  "group": "g1",
  "members": "carol"
}
```
{% include copy-curl.html %}

```json
PUT groups/_doc/3
{
  "group": "g1"
}
```
{% include copy-curl.html %}

```json
PUT groups/_doc/4
{
  "group": "g1",
  "members": []
}
```
{% include copy-curl.html %}

```json
PUT groups/_doc/5
{
  "group": "g1",
  "members": null
}
```
{% include copy-curl.html %}

```json
PUT groups/_doc/6
{
  "group": "g2",
  "members": "carol"
}
```
{% include copy-curl.html %}

To search the `users` index for all users who are members of the `g1` group, use the following request:

```json
GET /users/_search
{
  "query": {
    "terms": {
      "username": {
        "index": "groups",
        "path": "members",
        "query": {
          "term": { "group": "g1" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This query collects all values from the `members` field of documents in `groups` whose `group` is set to `g1`, and uses them as terms for the `username` field in the `users` index:

```json
{
  "hits": {
    "total": { "value": 3, "relation": "eq" },
    "hits": [
      { "_index": "users", "_id": "u1", "_score": 1.0, "_source": { "username": "alice" } },
      { "_index": "users", "_id": "u2", "_score": 1.0, "_source": { "username": "bob" } },
      { "_index": "users", "_id": "u3", "_score": 1.0, "_source": { "username": "carol" } }
    ]
  }
}
```

This query processes matching documents as follows:

- The lookup query matches documents 1, 2, 3, 4, and 5 (all specify group `g1`).
- Doc 6 (using a different group `g2`) is ignored by the query.
- The `members` field for each matching document is processed as follows:
    - Doc 1: `["alice", "bob"]` (list) → both `alice` and `bob` are collected.
    - Doc 2: `"carol"` (scalar) → `carol` is collected.
    - Doc 3: missing `members` field → ignored.
    - Doc 4: empty list → ignored.
    - Doc 5: null → ignored.
- All collected values are flattened and deduplicated, so the final result is `["alice", "bob", "carol"]`.

## Bitmap filtering
**Introduced 2.17**
{: .label .label-purple }

The `terms` query can filter for multiple terms simultaneously. However, when the number of terms in the input filter increases to a large value (around 10,000), the resulting network and memory overhead can become significant, making the query inefficient. In such cases, consider encoding your large terms filter using a [roaring bitmap](https://github.com/RoaringBitmap/RoaringBitmap) for more efficient filtering.

The following example assumes that you have two indexes: a `products` index, which contains all the products sold by a company, and a `customers` index, which stores filters representing customers who own specific products.

First, create a `products` index and map `product_id` as an integer:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "product_id": { "type": "integer" }
    }
  }
}
```
{% include copy-curl.html %}

Next, index three documents that correspond to products:

```json
PUT /products/_doc/1
{
  "name": "Product 1",
  "product_id" : 111
}
```
{% include copy-curl.html %}

```json
PUT /products/_doc/2
{
  "name": "Product 2",
  "product_id" : 222
}
```
{% include copy-curl.html %}

```json
PUT /products/_doc/3
{
  "name": "Product 3",
  "product_id" : 333
}
```
{% include copy-curl.html %}

To store customer bitmap filters, you'll create a `customer_filter` [binary field]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/binary/) in the `customers` index. Specify `store` as `true` to store the field:

```json
PUT /customers
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
```
{% include copy-curl.html %}

For each customer, you need to generate a bitmap that represents the product IDs of the products the customer owns. This bitmap effectively encodes the filter criteria for that customer. In this example, you'll create a `terms` filter for a customer whose ID is `customer123` and who owns products `111`, `222`, and `333`.

To encode a `terms` filter for the customer, first create a roaring bitmap for the filter. This example creates a bitmap using the [PyRoaringBitMap] library, so first run `pip install pyroaring` to install the library. Then serialize the bitmap and encode it using a [Base64](https://en.wikipedia.org/wiki/Base64) encoding scheme:

```py
from pyroaring import BitMap
import base64

# Create a bitmap, serialize it into a byte string, and encode into Base64
bm = BitMap([111, 222, 333]) # product ids owned by a customer
encoded = base64.b64encode(BitMap.serialize(bm))

# Convert the Base64-encoded bytes to a string for storage or transmission
encoded_bm_str = encoded.decode('utf-8')

# Print the encoded bitmap
print(f"Encoded Bitmap: {encoded_bm_str}")
```
{% include copy.html %}

Next, index the customer filter into the `customers` index. The document ID for the filter is the same as the ID for the corresponding customer (in this example, `customer123`). The `customer_filter` field contains the bitmap you generated for this customer:

```json
POST customers/_doc/customer123
{
  "customer_filter": "OjAAAAEAAAAAAAIAEAAAAG8A3gBNAQ=="
}
```
{% include copy-curl.html %}

Now you can run a `terms` query on the `products` index to look up a specific customer in the `customers` index. Because you're looking up a stored field instead of `_source`, set `store` to `true`. In the `value_type` field, specify the data type of the `terms` input as `bitmap`:

```json
POST /products/_search
{
  "query": {
    "terms": {
      "product_id": {
        "index": "customers",
        "id": "customer123",
        "path": "customer_filter",
        "store": true               
      },
      "value_type": "bitmap"      
    }
  }
}
```
{% include copy-curl.html %}

You can also directly pass the bitmap to the `terms` query. In this example, the `product_id` field contains the customer filter bitmap for the customer whose ID is `customer123`:

```json
POST /products/_search
{
  "query": {
    "terms": {
      "product_id": [
        "OjAAAAEAAAAAAAIAEAAAAG8A3gBNAQ=="
      ],
      "value_type": "bitmap"
    }
  }
}
```
{% include copy-curl.html %}
