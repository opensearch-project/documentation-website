---
layout: default
title: Sort results
parent: Customizing search results
nav_order: 30
redirect_from:
  - /opensearch/search/sort/
---

# Sort results

Sorting allows your users to sort results in a way that’s most meaningful to them.

By default, full-text queries sort results by the relevance score.
You can choose to sort the results by any field value in either ascending or descending order by setting the `order` parameter to `asc` or `desc`. If you don't specify `order`, results are sorted in descending order when you sort by `_score` and in ascending order when you sort by any other field.

For example, to sort results by descending order of a `line_id` value, use the following query:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The results are sorted by `line_id` in descending order:

```json
{
  "took" : 24,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3205,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "3204",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3205,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Exeunt"
        },
        "sort" : [
          3205
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3203",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3204,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.45",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Let us not leave till all our own be won."
        },
        "sort" : [
          3204
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3202",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3203,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.44",
          "speaker" : "KING HENRY IV",
          "text_entry" : "And since this business so fair is done,"
        },
        "sort" : [
          3203
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3201",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3202,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.43",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Meeting the cheque of such another day:"
        },
        "sort" : [
          3202
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3200",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3201,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.42",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Rebellion in this land shall lose his sway,"
        },
        "sort" : [
          3201
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3199",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3200,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.41",
          "speaker" : "KING HENRY IV",
          "text_entry" : "To fight with Glendower and the Earl of March."
        },
        "sort" : [
          3200
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3198",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3199,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.40",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Myself and you, son Harry, will towards Wales,"
        },
        "sort" : [
          3199
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3197",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3198,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.39",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Who, as we hear, are busily in arms:"
        },
        "sort" : [
          3198
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3196",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3197,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.38",
          "speaker" : "KING HENRY IV",
          "text_entry" : "To meet Northumberland and the prelate Scroop,"
        },
        "sort" : [
          3197
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "3195",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 3196,
          "play_name" : "Henry IV",
          "speech_number" : 8,
          "line_number" : "5.5.37",
          "speaker" : "KING HENRY IV",
          "text_entry" : "Towards York shall bend you with your dearest speed,"
        },
        "sort" : [
          3196
        ]
      }
    ]
  }
}
```

The `sort` parameter is an array, so you can specify multiple field values in the order of their priority.

If you have two fields with the same value for `line_id`, OpenSearch uses `speech_number`, which is the second option for sorting:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    },
    {
      "speech_number": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can continue to sort by any number of field values to get the results in the right order. It doesn’t have to be a numerical value&mdash;you can also sort by date or timestamp fields:

```json
"sort": [
    {
      "date": {
        "order": "desc"
      }
    }
  ]
```
{% include copy-curl.html %}

A text field that is analyzed cannot be used to sort documents, because the inverted index only contains the individual tokenized terms and not the entire string. So you cannot sort by the `play_name`, for example.

To bypass this limitation, you can use a raw version of the text field mapped as a keyword type. In the following example, `play_name.keyword` is not analyzed and you have a copy of the full original version for sorting purposes:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "play_name.keyword": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The results are sorted by the `play_name` field in alphabetical order.

Use `sort` with the [`search_after` parameter]({{site.url}}{{site.baseurl}}/opensearch/search/paginate#the-search_after-parameter) for more efficient scrolling.
The results start with the document that comes after the sort values you specify in the `search_after` array.

Make sure you have the same number of values in the `search_after` array as in the `sort` array, also ordered in the same way.
In this case, you are requesting results starting with the document that comes after `line_id = 3202` and `speech_number = 8`:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    },
    {
      "speech_number": {
        "order": "desc"
      }
    }
  ],
  "search_after": [
    "3202",
    "8"
  ]
}
```
{% include copy-curl.html %}

## Sort mode

The sort mode is applicable to sorting by array or multivalued fields. It specifies what array value should be chosen for sorting the document. For numeric fields that contain an array of numbers, you can sort by the `avg`, `sum`, or `median` modes. To sort by the minimum or maximum values, use the `min` or `max` modes that work for both numeric and string data types.

The default mode is `min` for ascending sort order and `max` for descending sort order.

The following example illustrates sorting by an array field using the sort mode.

Consider an index that holds student grades. Index two documents into the index:

```json
PUT students/_doc/1
{
   "name": "John Doe",
   "grades": [70, 90]
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/2
{
   "name": "Mary Major",
   "grades": [80, 100]
}
```
{% include copy-curl.html %}

Sort all students by highest grade average using the `avg` mode:

```json
GET students/_search
{
   "query" : {
      "match_all": {}
   },
   "sort" : [
      {"grades" : {"order" : "desc", "mode" : "avg"}}
   ]
}
```
{% include copy-curl.html %}

The response contains students sorted by `grades` in descending order:

```json
{
  "took" : 1,
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
    "max_score" : null,
    "hits" : [
      {
        "_index" : "students",
        "_id" : "2",
        "_score" : null,
        "_source" : {
          "name" : "Mary Major",
          "grades" : [
            80,
            100
          ]
        },
        "sort" : [
          90
        ]
      },
      {
        "_index" : "students",
        "_id" : "1",
        "_score" : null,
        "_source" : {
          "name" : "John Doe",
          "grades" : [
            70,
            90
          ]
        },
        "sort" : [
          80
        ]
      }
    ]
  }
}
```

## Sorting numeric fields across indexes

When you search several indexes, the same field can be mapped as a different numeric or date type in each index. Use the `numeric_type` option to convert the sort values from all indexes to one type. Valid values are `double`, `long`, `date`, and `date_nanos`.

For example, the `prices-eu` index maps `price` as `double`, and the `prices-us` index maps it as `long`:

```json
PUT /prices-eu
{
  "mappings": {
    "properties": {
      "product": { "type": "keyword" },
      "price": { "type": "double" }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /prices-us
{
  "mappings": {
    "properties": {
      "product": { "type": "keyword" },
      "price": { "type": "long" }
    }
  }
}
```
{% include copy-curl.html %}

Index documents into both indexes:

```json
POST /_bulk?refresh=true
{ "index": { "_index": "prices-eu", "_id": "1" } }
{ "product": "tent", "price": 129.5 }
{ "index": { "_index": "prices-eu", "_id": "2" } }
{ "product": "lantern", "price": 24.99 }
{ "index": { "_index": "prices-us", "_id": "1" } }
{ "product": "stove", "price": 60 }
{ "index": { "_index": "prices-us", "_id": "2" } }
{ "product": "backpack", "price": 95 }
```
{% include copy-curl.html %}

Without `numeric_type`, each hit's sort value keeps the type of its index, for example, `24.99` from `prices-eu` and `60` from `prices-us`. The following request converts all sort values to `double`:

```json
GET /prices-eu,prices-us/_search
{
  "sort": [
    {
      "price": {
        "order": "asc",
        "numeric_type": "double"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The sort values of the `prices-us` documents are returned as `60.0` and `95.0`:

```json
{
  ...
  "hits": {
    ...
    "hits": [
      {
        "_index": "prices-eu",
        "_id": "2",
        "_score": null,
        "_source": {
          "product": "lantern",
          "price": 24.99
        },
        "sort": [
          24.99
        ]
      },
      {
        "_index": "prices-us",
        "_id": "1",
        "_score": null,
        "_source": {
          "product": "stove",
          "price": 60
        },
        "sort": [
          60.0
        ]
      },
      {
        "_index": "prices-us",
        "_id": "2",
        "_score": null,
        "_source": {
          "product": "backpack",
          "price": 95
        },
        "sort": [
          95.0
        ]
      },
      {
        "_index": "prices-eu",
        "_id": "1",
        "_score": null,
        "_source": {
          "product": "tent",
          "price": 129.5
        },
        "sort": [
          129.5
        ]
      }
    ]
  }
}
```

If you specify `long`, decimal values are truncated. For example, `129.5` and `24.99` are returned as `129` and `24`, and documents that differ only in their decimal part sort as equal.

### Sorting date and date nanosecond fields

A `date` field stores values in milliseconds, while a `date_nanos` field stores values in nanoseconds. If the sort field is mapped as `date` in one index and as `date_nanos` in another, OpenSearch compares the raw values without converting them to the same resolution. As a result, documents from the `date_nanos` index sort after all documents from the `date` index in ascending order, regardless of their timestamps.

For example, create an `events-ms` index that maps `ts` as `date` and an `events-ns` index that maps it as `date_nanos`:

```json
PUT /events-ms
{
  "mappings": {
    "properties": {
      "ts": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /events-ns
{
  "mappings": {
    "properties": {
      "ts": { "type": "date_nanos" }
    }
  }
}
```
{% include copy-curl.html %}

Index three events. The `upload` event in `events-ns` occurred at 11:00, between the `login` (10:00) and `logout` (12:00) events in `events-ms`:

```json
POST /_bulk?refresh=true
{ "index": { "_index": "events-ms", "_id": "1" } }
{ "event": "login", "ts": "2026-10-13T10:00:00Z" }
{ "index": { "_index": "events-ms", "_id": "2" } }
{ "event": "logout", "ts": "2026-10-13T12:00:00Z" }
{ "index": { "_index": "events-ns", "_id": "1" } }
{ "event": "upload", "ts": "2026-10-13T11:00:00.123456789Z" }
```
{% include copy-curl.html %}

A default ascending sort on `ts` returns `login`, `logout`, and then `upload`.

To sort the events in chronological order, set `numeric_type` to `date` or `date_nanos`. The `date` value converts all values to milliseconds, and `date_nanos` converts them to nanoseconds:

```json
GET /events-ms,events-ns/_search
{
  "_source": ["event"],
  "sort": [
    {
      "ts": {
        "order": "asc",
        "numeric_type": "date_nanos"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response returns the events in chronological order:

```json
{
  ...
  "hits": {
    ...
    "hits": [
      {
        "_index": "events-ms",
        "_id": "1",
        "_score": null,
        "_source": {
          "event": "login"
        },
        "sort": [
          1791885600000000000
        ]
      },
      {
        "_index": "events-ns",
        "_id": "1",
        "_score": null,
        "_source": {
          "event": "upload"
        },
        "sort": [
          1791889200123456789
        ]
      },
      {
        "_index": "events-ms",
        "_id": "2",
        "_score": null,
        "_source": {
          "event": "logout"
        },
        "sort": [
          1791892800000000000
        ]
      }
    ]
  }
}
```

Nanosecond values can represent only dates between 1970 and 2262. If a `date` field contains a value outside this range, converting it using `date_nanos` fails for the shard containing that document. The search then returns partial results, and the failure is reported in the `_shards.failures` array of the response. To sort data containing such dates, use `"numeric_type": "date"`.
{: .warning}

## Sorting nested objects

When sorting [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) objects, provide the `path` parameter specifying the path to the field on which to sort. 

For example, in the index `students`, map the variable `first_sem` as `nested`:

```json
PUT students
{
  "mappings" : {
    "properties": {
      "first_sem": { 
        "type" : "nested"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index two documents with nested fields:

```json
PUT students/_doc/1
{
   "name": "John Doe",
   "first_sem" : {
     "grades": [70, 90]
   }
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/2
{
  "name": "Mary Major",
  "first_sem": {
    "grades": [80, 100]
  }
}
```
{% include copy-curl.html %}

When sorting by grade average, provide the path to the nested field:

```json
GET students/_search
{
 "query" : {
    "match_all": {}
 },
 "sort" : [
    {"first_sem.grades": {
      "order" : "desc", 
      "mode" : "avg",
      "nested": {
        "path": "first_sem"
     }
    }
    }
 ]
}
```
{% include copy-curl.html %}

The `nested` object accepts the following parameters.

Parameter | Description
:--- | :---
`path` | The path to the nested object that contains the sort field. Required.
`filter` | A query that selects the nested objects whose values are used for sorting. Nested objects that don't match the filter are ignored. Typically, you repeat the nested condition of the search query here so that documents are sorted by the values of the matching nested objects only.
`max_children` | The maximum number of nested objects per document to consider when calculating the sort value. By default, all nested objects are considered.
`nested` | A `nested` object for sorting on a field inside a nested object that is itself inside a nested object. Specify the inner `path` and, optionally, its own `filter` and `max_children`.

For example, in the following index, each product contains a nested `offers` object with a region and price, and each offer contains a nested `discounts` object:

```json
PUT sort-offers
{
  "mappings": {
    "properties": {
      "product": { "type": "keyword" },
      "offers": {
        "type": "nested",
        "properties": {
          "region": { "type": "keyword" },
          "price": { "type": "double" },
          "discounts": {
            "type": "nested",
            "properties": {
              "percent": { "type": "integer" }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index two products:

```json
POST _bulk?refresh=true
{ "index": { "_index": "sort-offers", "_id": "1" } }
{ "product": "tent", "offers": [ { "region": "eu", "price": 120, "discounts": [ { "percent": 5 }, { "percent": 15 } ] }, { "region": "us", "price": 90, "discounts": [ { "percent": 10 } ] } ] }
{ "index": { "_index": "sort-offers", "_id": "2" } }
{ "product": "stove", "offers": [ { "region": "eu", "price": 100, "discounts": [ { "percent": 20 } ] }, { "region": "us", "price": 140, "discounts": [ { "percent": 0 } ] } ] }
```
{% include copy-curl.html %}

The following request sorts the products by their lowest price in the `eu` region. The `filter` excludes the `us` offers, so the `tent` is sorted by its `eu` price of 120, not by its lower `us` price of 90:

```json
GET sort-offers/_search
{
  "_source": ["product"],
  "sort": [
    {
      "offers.price": {
        "order": "asc",
        "mode": "min",
        "nested": {
          "path": "offers",
          "filter": {
            "term": { "offers.region": "eu" }
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The `stove` is returned first, with a sort value of `100.0`, followed by the `tent`, with a sort value of `120.0`.

To sort on a field in a multi-level nested object, specify a `nested` object inside the outer `nested` object. The following request sorts the products by their highest discount in any offer:

```json
GET sort-offers/_search
{
  "_source": ["product"],
  "sort": [
    {
      "offers.discounts.percent": {
        "order": "desc",
        "mode": "max",
        "nested": {
          "path": "offers",
          "nested": {
            "path": "offers.discounts"
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The `stove` is returned first, with a sort value of `20`, followed by the `tent`, with a sort value of `15`.

## Handling missing values

The `missing` parameter specifies the handling of missing values. The built-in valid values are `_last` (list the documents with the missing value last) and `_first` (list the documents with the missing value first). The default value is `_last`. You can also specify a custom value to be used for missing documents as the sort value. 

For example, you can index a document with an `average` field and another document without an `average` field:

```json
PUT students/_doc/1
{
   "name": "John Doe",
   "average": 80
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/2
{
   "name": "Mary Major"
}
```
{% include copy-curl.html %}

Sort the documents, ordering the document with a missing field first:

```json
GET students/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "average": {
        "order": "desc",
        "missing": "_first"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response lists document 2 first:

```json
{
  "took" : 1,
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
    "max_score" : null,
    "hits" : [
      {
        "_index" : "students",
        "_id" : "2",
        "_score" : null,
        "_source" : {
          "name" : "Mary Major"
        },
        "sort" : [
          9223372036854775807
        ]
      },
      {
        "_index" : "students",
        "_id" : "1",
        "_score" : null,
        "_source" : {
          "name" : "John Doe",
          "average" : 80
        },
        "sort" : [
          80
        ]
      }
    ]
  }
}
```

## Ignoring unmapped fields

If a field is not mapped, a search request that sorts by this field fails by default. To avoid this, you can use the `unmapped_type` parameter, which signals to OpenSearch to ignore the field. For example, if you set `unmapped_type` to `long`, the field is treated as if it were mapped as type `long`. Additionally, all documents in the index that have an `unmapped_type` field are treated as if they had no value in this field, so they are not sorted by it.

For example, consider two indexes. Index a document that contains an `average` field in the first index:

```json
PUT students/_doc/1
{
   "name": "John Doe",
   "average": 80
}
```
{% include copy-curl.html %}

Index a document that does not contain an `average` field in the second index:

```json
PUT students_no_map/_doc/2
{
   "name": "Mary Major"
}
```
{% include copy-curl.html %}

Search for all documents in both indexes and sort them by the `average` field:

```json
GET students*/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "average": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

By default, the second index produces an error because the `average` field is not mapped:

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 1,
    "failures" : [
      {
        "shard" : 0,
        "index" : "students_no_map",
        "node" : "cam9NWqVSV-jUIkQ3tRubw",
        "reason" : {
          "type" : "query_shard_exception",
          "reason" : "No mapping found for [average] in order to sort on",
          "index" : "students_no_map",
          "index_uuid" : "JgfRkypKSUSpyU-ZXr9kKA"
        }
      }
    ]
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : "students",
        "_id" : "1",
        "_score" : null,
        "_source" : {
          "name" : "John Doe",
          "average" : 80
        },
        "sort" : [
          80
        ]
      }
    ]
  }
}
```

You can specify the `unmapped_type` parameter so that the unmapped field is ignored:

```json
GET students*/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "average": {
        "order": "desc",
        "unmapped_type": "long"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains both documents:

```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : "students",
        "_id" : "1",
        "_score" : null,
        "_source" : {
          "name" : "John Doe",
          "average" : 80
        },
        "sort" : [
          80
        ]
      },
      {
        "_index" : "students_no_map",
        "_id" : "2",
        "_score" : null,
        "_source" : {
          "name" : "Mary Major"
        },
        "sort" : [
          -9223372036854775808
        ]
      }
    ]
  }
}
```

## Sorting using a script

To sort by a value that is not stored in a single field, calculate the value using a script. In the `sort` array, specify a `_script` object. The `_script` object accepts the following parameters.

Parameter | Description
:--- | :---
`type` | The type of the value returned by the script. Valid values are `number` and `string`. Required.
`script` | The script that calculates the sort value. For more information, see [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/).
`order` | The sort order. Valid values are `asc` and `desc`. Default is `asc`.
`mode` | The value to use for sorting if the script returns multiple values. For more information, see [Sort mode](#sort-mode).
`nested` | The nested object in which to run the script when the script reads fields of [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) objects. Specify the path to the nested object in `nested.path`. For more information, see [Sorting nested objects](#sorting-nested-objects).

The following request sorts products by price converted to another currency using an exchange rate passed in `params`:

```json
GET /prices-eu,prices-us/_search
{
  "_source": ["product", "price"],
  "sort": {
    "_script": {
      "type": "number",
      "script": {
        "source": "doc['price'].value * params.exchange_rate",
        "params": {
          "exchange_rate": 0.92
        }
      },
      "order": "desc"
    }
  }
}
```
{% include copy-curl.html %}

The `sort` array of each hit contains the value calculated by the script:

```json
{
  ...
  "hits": {
    ...
    "hits": [
      {
        "_index": "prices-eu",
        "_id": "1",
        "_score": null,
        "_source": {
          "product": "tent",
          "price": 129.5
        },
        "sort": [
          119.14
        ]
      },
      {
        "_index": "prices-us",
        "_id": "2",
        "_score": null,
        "_source": {
          "product": "backpack",
          "price": 95
        },
        "sort": [
          87.4
        ]
      },
      {
        "_index": "prices-us",
        "_id": "1",
        "_score": null,
        "_source": {
          "product": "stove",
          "price": 60
        },
        "sort": [
          55.2
        ]
      },
      {
        "_index": "prices-eu",
        "_id": "2",
        "_score": null,
        "_source": {
          "product": "lantern",
          "price": 24.99
        },
        "sort": [
          22.9908
        ]
      }
    ]
  }
}
```

Script-based sorting runs the script for every matching document, so it is slower than sorting by a field. If you sort by the same calculated value often, consider calculating it at index time and storing it in a field.

## Tracking scores

By default, scores are not computed when sorting on a field. You can set `track_scores` to `true` to compute and track scores:

```json
GET students/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "average": {
        "order": "desc"
      }
    }
  ],
  "track_scores": true
}
```
{% include copy-curl.html %}

## Sorting by geodistance

You can sort documents by `_geo_distance`. The following parameters are supported.

Parameter | Description
:--- | :---
`distance_type` | Specifies the method of computing the distance. Valid values are `arc` and `plane`. The `plane` method is faster but less accurate for long distances or close to the poles. Default is `arc`.
`mode` | Specifies how to handle a field with several geopoints. By default, documents are sorted by the shortest distance when the sort order is ascending and by the longest distance when the sort order is descending. Valid values are `min`, `max`, `median`, and `avg`.
`unit` | Specifies the units used to compute sort values. Default is meters (`m`).
`ignore_unmapped` | Specifies how to treat an unmapped field. Set `ignore_unmapped` to `true` to ignore unmapped fields, which has the same effect as setting `unmapped_type` in a field sort. Default is `false` (produce an error when encountering an unmapped field). For more information, see [Ignoring unmapped fields](#ignoring-unmapped-fields).

You can specify the reference point in any [geopoint format]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/#formats), for example, as an object containing `lat` and `lon`, a `"lat,lon"` string, a geohash, or a `[lon, lat]` array.

The `_geo_distance` parameter does not support `missing_values`. The distance is always considered to be `infinity` when a document does not contain the field used for computing distance.
{: .note}

For example, create an index and map the `point` field as a `geo_point`:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "point": {
        "type": "geo_point"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index two documents containing geopoints:

```json
PUT testindex1/_doc/1
{
  "point": [74.00, 40.71] 
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/2
{
  "point": [73.77, -69.63] 
}
```
{% include copy-curl.html %}

Search for all documents and sort them by the distance from the provided point:

```json
GET testindex1/_search
{
  "sort": [
    {
      "_geo_distance": {
        "point": [59, -54],
        "order": "asc",
        "unit": "km",
        "distance_type": "arc",
        "mode": "min",
        "ignore_unmapped": true
      }
    }
  ],
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

The response contains the sorted documents:

```json
{
  "took" : 864,
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
    "max_score" : null,
    "hits" : [
      {
        "_index" : "testindex1",
        "_id" : "2",
        "_score" : null,
        "_source" : {
          "point" : [
            73.77,
            -69.63
          ]
        },
        "sort" : [
          1891.2667493895767
        ]
      },
      {
        "_index" : "testindex1",
        "_id" : "1",
        "_score" : null,
        "_source" : {
          "point" : [
            74.0,
            40.71
          ]
        },
        "sort" : [
          10628.402240213345
        ]
      }
    ]
  }
}
```

You can provide coordinates in any format supported by the geopoint field type. For a description of all formats, see the [geopoint field type documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point/).
{: .note}

To pass multiple geopoints to `_geo_distance`, use an array:

```json
GET testindex1/_search
{
  "sort": [
    {
      "_geo_distance": {
        "point": [[59, -54], [60, -53]],
        "order": "asc",
        "unit": "km",
        "distance_type": "arc",
        "mode": "min",
        "ignore_unmapped": true
      }
    }
  ],
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

For each document, the sorting distance is calculated as the minimum, maximum, or average (as specified by the `mode`) of the distances from all points provided in the search to all points in the document.

## Performance considerations

Sorted field values are loaded into memory for sorting. Therefore, for minimum overhead we recommend mapping [numeric types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) to the smallest acceptable types, like `short`, `integer`, and `float`. [String types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/string/) should not have the sorted field analyzed or tokenized.

The `_id` field is restricted from use in sorting operations. If you need to sort by document ID, consider duplicating the ID value into another field with `doc_values` enabled. For more information about `_id` field limitations, see [ID field type]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/id/).
{: .note}