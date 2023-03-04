---
layout: default
title: Sort results
parent: Searching data
nav_order: 22
redirect_from:
  - /opensearch/search/sort/
---

## Sort results

Sorting allows your users to sort results in a way that’s most meaningful to them.

By default, full-text queries sort results by the relevance score.
You can choose to sort the results by any field value in either ascending or descending order by setting the `order` parameter to `asc` or `desc`.

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

You can continue to sort by any number of field values to get the results in just the right order. It doesn’t have to be a numerical value&mdash;you can also sort by date or timestamp fields:

```json
"sort": [
    {
      "date": {
        "order": "desc"
      }
    }
  ]
```

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

PUT students/_doc/2
{
   "name": "Mary Major",
   "grades": [80, 100]
}
```

Sort all students by highest grade average using the `avg` mode:

```
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

## Sorting nested objects

When sorting [nested]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/nested) objects, provide the `path` parameter specifying the path to the field on which to sort. 

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

Index two documents with nested fields:

```json
PUT students/_doc/1
{
   "name": "John Doe",
   "first_sem" : {
     "grades": [70, 90]
   }
}

PUT students/_doc/2
{
  "name": "Mary Major",
  "first_sem": {
    "grades": [80, 100]
  }
}
```

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

## Handling missing values

The `missing` parameter specifies the handling of missing values. The built-in valid values are `_last` (list the documents with the missing value last) and `_first` (list the documents with the missing value first). The default value is `_last`. You can also specify a custom value to be used for missing documents as the sort value. 

For example, you can index a document with an `average` field and another document without an `average` field:

```json
PUT students/_doc/1
{
   "name": "John Doe",
   "average": 80
}

PUT students/_doc/2
{
   "name": "Mary Major"
}
```

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

Index a document that does not contain an `average` field in the second index:

```json
PUT students_no_map/_doc/2
{
   "name": "Mary Major"
}
```

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

## Sorting by geo distance

You can sort documents by `_geo_distance`. The following parameters are supported.

Parameter | Description
:--- | :---
distance_type | Specifies the method of computing the distance. Valid values are `arc` and `plane`. The `plane` method is faster but less accurate for long distances or close to the poles. Default is `arc`.
mode | Specifies how to handle a field with several geopoints. By default, documents are sorted by the shortest distance when the sort order is ascending and by the longest distance when the sort order is descending. Valid values are `min`, `max`, `median`, and `avg`.
unit | Specifies the units used to compute sort values. Default is meters (`m`).
ignore_unmapped | Specifies how to treat an unmapped field. Set `ignore_unmapped` to `true` to ignore unmapped fields. Default is `false` (produce an error when encountering an unmapped field).

The `_geo_distance` parameter does not support `missing_values`. The distance is always considered to be `infinity` when a document does not contain the field used for computing distance.
{: .note}

For example, index two documents with geopoints:

```json
PUT testindex1/_doc/1
{
  "point": [74.00, 40.71] 
}

PUT testindex1/_doc/2
{
  "point": [73.77, -69.63] 
}
```

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

You can provide coordinates in any format supported by the geopoint field type. For a description of all formats, see the [geopoint field type documentation]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/geo-point).
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

For each document, the sorting distance is calculated as the minimum, maximum, or average (as specified by the `mode`) of the distances from all points provided in the search to all points in the document.

## Performance considerations

Sorted field values are loaded into memory for sorting. Therefore, for minimum overhead we recommend mapping [numeric types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric) to the smallest acceptable types, like `short`, `integer`, and `float`. [String types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/string) should not have the sorted field analyzed or tokenized.