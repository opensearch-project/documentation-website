---
layout: default
title: Composite
parent: Bucket aggregations
nav_order: 17
redirect_from:
  - /query-dsl/aggregations/bucket/composite/
---

# Composite aggregations

The `composite` aggregation creates buckets based on one or more document fields, or sources. The `composite` aggregation creates a bucket for every combination of individual source values. By default, combinations with a missing value in one or more individual fields are omitted from the result.

Each source has one of four types of aggregation:

- The `terms` type groups by unique (usually `String`) value.
- The `histogram` type groups numerically in buckets of a specified width.
- The `date_histogram` type groups by date or time ranges of a specified width.
- The `geotile_grid` type groups geopoints into a grid with a specified resolution.

The `composite` aggregation works by combining its source keys into buckets. The resulting buckets are ordered, both across and within the sources:

- **Across**: Buckets are nested in the order that the sources are ordered in the aggregation request.
- **Within**: The order of values in each source determines the bucket order for that source. Ordering is alphabetical, numeric, date-time, or geo-tile as appropriate to the source type.

Consider these fields from an index of marathon participants:

```json
{... "city": "Albuquerque", "place": "Bronze" ...}
{... "city": "Boston",  ...}
{... "city": "Chicago", "place": "Bronze" ...}
{... "city": "Albuquerque", "place": "Gold" ...}
{... "city": "Chicago", "place": "Silver" ...}
{... "city": "Boston", "place": "Bronze" ...}
{... "city": "Chicago", "place": "Gold" ...}
```

Assume the request specifies the sources as follows:

```json
    ...
    "sources": [
        { "marathon_city": { "terms": { "field": "city" }}},
        { "participant_medal": { "terms": { "field": "place" }}}
    ],
    ...
```

You must assign a unique key name to each source.
{: .important}

The resulting `composite` contains the following buckets, in order:

```json
{ "city": "Albuquerque", "place": "Bronze" }
{ "city": "Albuquerque", "place": "Gold" }
{ "city": "Boston", "place": "Bronze" }
{ "city": "Boston", "place": "Silver" }
{ "city": "Chicago", "place": "Bronze" }
{ "city": "Chicago", "place": "Gold" }
{ "city": "Chicago", "place": "Silver" }
```

Note that the `city` and `place` fields are both ordered alphabetically.

## Parameters

The `composite` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type  | Description |
| :--       | :--               | :--        | :--         |
| `sources` | Required          | Array      | An array of source objects. Valid types are [`terms`](#terms), [`histogram`](#histogram), [`date_histogram`](#date-histogram), and [`geotile_grid`](#geotile-grid). |
| `size`    | Optional          | Numeric    | The number of `composite` buckets to return in the result. The default value is `10`. See [Paginating composite results](#paginating-composite-results). |
| `after` | Optional | String | A key that specifies where to resume displaying paginated `composite` buckets. See [Paginating composite results](#paginating-composite-results). |
| `order`   | Optional          | String     | For each source, whether to order the values ascending or descending. Valid values are `asc` and `desc`. The default is `asc`. |
| `missing_bucket` | Optional    | Boolean   | For each source, whether to include documents with a missing value. The default value is `false`. If set to `true`, OpenSearch includes the documents, supplying `null` as the field's key. Null values rank first in ascending order. |

For aggregation-specific parameters, see the corresponding aggregation documentation.
{: .note}

## Terms

Use a `terms` aggregation for aggregating string or Boolean data. For more information, see [Terms aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/).

You can use `terms` sources to create composite buckets for any type of data. However, since `terms` sources create buckets for every unique value, you'll normally use `histogram` sources instead for numerical data.
{: .note}

The following example request returns the first `4` composite buckets for day-of-week and customer gender in the OpenSearch Dashboards sample e-commerce data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "day": { "terms": { "field": "day_of_week" }}},
          { "gender": { "terms": { "field": "customer_gender" }}}
        ],
        "size": 4
      }
    }
  }
}
```
{% include copy-curl.html %}

Since the dataset for this example contains valid data for every bucket, the aggregation generates a bucket for every combination of gender and day-of-week, 14 in total.

Because the request specifies a `size` of `4`, the response contains the first four composite buckets. Since the sources are `terms`, the buckets are ordered in ascending alphabetical order, both across and within the sources:

```json
{
  "took": 51,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "day": "Monday",
        "gender": "MALE"
      },
      "buckets": [
        {
          "key": {
            "day": "Friday",
            "gender": "FEMALE"
          },
          "doc_count": 399
        },
        {
          "key": {
            "day": "Friday",
            "gender": "MALE"
          },
          "doc_count": 371
        },
        {
          "key": {
            "day": "Monday",
            "gender": "FEMALE"
          },
          "doc_count": 320
        },
        {
          "key": {
            "day": "Monday",
            "gender": "MALE"
          },
          "doc_count": 259
        }
      ]
    }
  }
}
```

You can use the `after_key` returned in the response to view more results. See the example is in the next section.

## Histogram

Use `histogram` sources to create composite aggregations of numerical data. For more information, see [Histogram aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/histogram/).

For `histogram` sources, the name used in each `composite` bucket key is the lowest value in the key's histogram interval. Each source histogram interval contains the values in the `[lower_bound, lower_bound + interval)` range. The name of the first interval is the lowest value in the source field (for ascending-value sources). 

The following example request returns the first `6` composite buckets for quantity and base unit price in the OpenSearch Dashboards sample e-commerce data based on bucket widths of `1` and `50` respectively:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "quantity": { "histogram": { "field": "products.quantity", "interval": 1 }}},
          { "unit_price": { "histogram": { "field": "products.base_unit_price", "interval": 50 }}}
        ],
        "size": 6
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregation returns the first `6` bucket keys and document counts for the two `histogram` sources. As in the `terms` example, the buckets are ordered across and within the source fields. In this case, however, the order is numerical and is based on the inclusive lower bound of each histogram width:

```json
{
  "took": 11,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "quantity": 2,
        "unit_price": 150
      },
      "buckets": [
        {
          "key": {
            "quantity": 1,
            "unit_price": 0
          },
          "doc_count": 17691
        },
        {
          "key": {
            "quantity": 1,
            "unit_price": 50
          },
          "doc_count": 5014
        },
        {
          "key": {
            "quantity": 1,
            "unit_price": 100
          },
          "doc_count": 482
        },
        {
          "key": {
            "quantity": 1,
            "unit_price": 150
          },
          "doc_count": 148
        },
        {
          "key": {
            "quantity": 1,
            "unit_price": 200
          },
          "doc_count": 32
        },
        {
          "key": {
            "quantity": 2,
            "unit_price": 150
          },
          "doc_count": 4
        }
      ]
    }
  }
}
```

The bucket key for each field is the lower bound of the field interval. For example, the `unit_price` key for the first `composite` bucket is `0`.

To retrieve the next `6` buckets, supply the `after` parameter with the `after_key` object from the response as follows:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "quantity": { "histogram": { "field": "products.quantity", "interval": 1 }}},
          { "unit_price": { "histogram": { "field": "products.base_unit_price", "interval": 50 }}}
        ],
        "size": 6,
        "after": {
            "quantity": 2,
            "unit_price": 150
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

There are only two buckets left:

```json
{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "quantity": 2,
        "unit_price": 500
      },
      "buckets": [
        {
          "key": {
            "quantity": 2,
            "unit_price": 200
          },
          "doc_count": 8
        },
        {
          "key": {
            "quantity": 2,
            "unit_price": 500
          },
          "doc_count": 4
        }
      ]
    }
  }
}
```

## Date histogram

To create composite aggregations of date ranges, use the `date_histogram` aggregation. For more information, see [Date histogram aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/date-histogram/).

OpenSearch represents dates, including `date_interval` bucket keys, as `long` integers representing [milliseconds since epoch](https://en.wikipedia.org/wiki/Unix_time). You can format the date output using the `format` parameter. This does not change the key order.

OpenSearch stores date-times in UTC. You can display output results in a different time zone using the `time_zone` parameter.

The following example request returns the first `4` composite buckets for the year each sold product was created and the date it was sold in the OpenSearch Dashboards sample e-commerce data, based on bucket widths of one year and one day respectively:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "product_creation_date": { "date_histogram": { "field": "products.created_on", "calendar_interval": "1y", "format": "yyyy" }}},
          { "order_date": { "date_histogram": { "field": "order_date", "calendar_interval": "1d", "format": "yyyy-MM-dd" }}}
        ],
        "size": 4
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregation returns the formatted date-based bucket keys and counts. For `date_interval` composite aggregation, field ordering is by date:

```json
{
  "took": 21,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "product_creation_date": "2016",
        "order_date": "2025-02-23"
      },
      "buckets": [
        {
          "key": {
            "product_creation_date": "2016",
            "order_date": "2025-02-20"
          },
          "doc_count": 146
        },
        {
          "key": {
            "product_creation_date": "2016",
            "order_date": "2025-02-21"
          },
          "doc_count": 153
        },
        {
          "key": {
            "product_creation_date": "2016",
            "order_date": "2025-02-22"
          },
          "doc_count": 143
        },
        {
          "key": {
            "product_creation_date": "2016",
            "order_date": "2025-02-23"
          },
          "doc_count": 140
        }
      ]
    }
  }
}
```

## Geotile grid

Use `geotile_grid` sources to aggregate `geo_point` values into buckets representing map tiles. As with the other composite aggregation `sources`, by default results include only buckets that contain data. For more information, see [Geotile grid aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/geotile-grid/).

Each cell corresponds to a [map tile](https://en.wikipedia.org/wiki/Tiled_web_map). Cell labels use a "{zoom}/{x}/{y}" format.

The following example request returns the first `6` tiles containing locations from the `geoip.location` field at a precision of `8`:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "tile": { "geotile_grid": { "field": "geoip.location", "precision": 8 } } }
        ],
        "size": 6
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregation returns the specified `geo_tilees` and point counts:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "tile": "8/122/104"
      },
      "buckets": [
        {
          "key": {
            "tile": "8/43/102"
          },
          "doc_count": 310
        },
        {
          "key": {
            "tile": "8/75/96"
          },
          "doc_count": 896
        },
        {
          "key": {
            "tile": "8/75/124"
          },
          "doc_count": 178
        },
        {
          "key": {
            "tile": "8/122/104"
          },
          "doc_count": 408
        }
      ]
    }
  }
}
```

## Combining sources

You can combine two or more sources of any different type.

The following example request returns buckets composed of three different types of sources:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "order_date": { "date_histogram": { "field": "order_date", "calendar_interval": "1M", "format": "yyyy-MM" }}},
          { "gender": { "terms": { "field": "customer_gender" }}},          
          { "unit_price": { "histogram": { "field": "products.base_unit_price", "interval": 200 }}}
        ],
        "size": 10
      }
    }
  }
}
```

The aggregation returns the mixed-type `composite` buckets and document counts:

```json
{
  "took": 11,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "order_date": "2025-03",
        "gender": "MALE",
        "unit_price": 200
      },
      "buckets": [
        {
          "key": {
            "order_date": "2025-02",
            "gender": "FEMALE",
            "unit_price": 0
          },
          "doc_count": 1517
        },
        {
          "key": {
            "order_date": "2025-02",
            "gender": "MALE",
            "unit_price": 0
          },
          "doc_count": 1369
        },
        {
          "key": {
            "order_date": "2025-02",
            "gender": "MALE",
            "unit_price": 200
          },
          "doc_count": 6
        },
        {
          "key": {
            "order_date": "2025-02",
            "gender": "MALE",
            "unit_price": 400
          },
          "doc_count": 1
        },
        {
          "key": {
            "order_date": "2025-03",
            "gender": "FEMALE",
            "unit_price": 0
          },
          "doc_count": 3656
        },
        {
          "key": {
            "order_date": "2025-03",
            "gender": "FEMALE",
            "unit_price": 200
          },
          "doc_count": 1
        },
        {
          "key": {
            "order_date": "2025-03",
            "gender": "MALE",
            "unit_price": 0
          },
          "doc_count": 3530
        },
        {
          "key": {
            "order_date": "2025-03",
            "gender": "MALE",
            "unit_price": 200
          },
          "doc_count": 7
        }
      ]
    }
  }
}
```

## Subaggregations

Composite aggregations are most useful when combined with subaggregations that reveal information about the documents in the `composite` buckets.

The following example request compares average spending based on gender for each day of the week in the OpenSearch Dashboards sample e-commerce data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "composite_buckets": {
      "composite": {
        "sources": [
          { "weekday": { "terms": { "field": "day_of_week" }}},
          { "gender": { "terms": { "field": "customer_gender" }}}          
        ],
        "size": 6
      },
      "aggs": {
        "avg_spend": {
          "avg": { "field": "taxful_total_price" }
        }
      }
    }
  }
}
```

The aggregation returns the average `taxful_total_price` of the first `6` buckets:

```json
{
  "took": 30,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "composite_buckets": {
      "after_key": {
        "weekday": "Saturday",
        "gender": "MALE"
      },
      "buckets": [
        {
          "key": {
            "weekday": "Friday",
            "gender": "FEMALE"
          },
          "doc_count": 399,
          "avg_spend": {
            "value": 71.7733395989975
          }
        },
        {
          "key": {
            "weekday": "Friday",
            "gender": "MALE"
          },
          "doc_count": 371,
          "avg_spend": {
            "value": 79.72514108827494
          }
        },
        {
          "key": {
            "weekday": "Monday",
            "gender": "FEMALE"
          },
          "doc_count": 320,
          "avg_spend": {
            "value": 72.1588623046875
          }
        },
        {
          "key": {
            "weekday": "Monday",
            "gender": "MALE"
          },
          "doc_count": 259,
          "avg_spend": {
            "value": 86.1754946911197
          }
        },
        {
          "key": {
            "weekday": "Saturday",
            "gender": "FEMALE"
          },
          "doc_count": 365,
          "avg_spend": {
            "value": 73.53236301369863
          }
        },
        {
          "key": {
            "weekday": "Saturday",
            "gender": "MALE"
          },
          "doc_count": 371,
          "avg_spend": {
            "value": 72.78092360175202
          }
        }
      ]
    }
  }
}
```

## Paginating composite results

If a request results in more than `size` buckets, then `size` buckets are returned. In this case, the result contains an `after_key` object containing the key of the next bucket in the list. To retrieve the next `size` buckets of the request, make the request again, supplying the `after_key` in the `after` parameter. For an example, see the request in [Histogram](#histogram).

Always use the `after_key` rather than copying the last bucket to continue a paginated response. The two are sometimes not the same.
{: .important}

## Improving performance with index sorting

To speed up composite aggregations on large datasets, you can sort your index using the same fields and order as your aggregation sources. When the `index.sort.field` and `index.sort.order` match the source fields and their order in the composite aggregation, OpenSearch can return results more efficiently and with less memory usage. While index sorting adds minor overhead during indexing, the query performance gains for composite aggregations are significant.

The following example request sets sort fields and a sort order for each of the fields on the `my-sorted-index` index:

```json
PUT /my-sorted-index
{
  "settings": {
    "index": {
      "sort.field": ["customer_id", "timestamp"],
      "sort.order": ["asc", "desc"]
    }
  },
  "mappings": {
    "properties": {
      "customer_id": {
        "type": "keyword"
      },
      "timestamp": {
        "type": "date"
      },
      "price": {
        "type": "double"
      }
    }
  }
}
```
{% include copy-curl.html %}

The following request creates a composite aggregation on the `my-sorted-index` index. Because the index is sorted on `customer_id` ascending and `timestamp` descending, and the aggregation sources match that sort order, this query runs faster and with reduced memory pressure:

```json
GET /my-sorted-index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "size": 1000,
        "sources": [
          { "customer": { "terms": { "field": "customer_id", "order": "asc" } } },
          { "time": { "date_histogram": { "field": "timestamp", "calendar_interval": "1d", "order": "desc" } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}