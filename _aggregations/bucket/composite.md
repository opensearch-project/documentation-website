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

Source-specific parameters types are described in the following sections.
{: .note}

## Terms

Use a `terms` soruce for `String` or `Boolean` data.

You can use `terms` sources to create composite buckets for any type of data. However, since `terms` sources create buckets for every unique value, you'll normally use `histogram` sources instead for numerical data.
{: .note}

### Parameters: Terms

| Parameter | Required/Optional | Data type  | Description |
| :--       | :--               | :--        | :--         |
| `terms` | Required            | Object     | An object specifying a document field. |

### Example: Terms

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

### Example response: Terms

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

You can use the `after_key` returned in the response to view more results. An example is shown in [Example response: Histogram](#example-response-histogram).

## Histogram

Use `histogram` sources to create composite aggregations of numerical data.

For `histogram` sourcees, the name used in each `composite` bucket key is the lowest value in the key's histogram interval. Each source histogram interval contains the values in the right-open interval [lower_bound, lower_bound + `interval`). The name of the first interval is the lowest value in the source field (for ascending-value sources). 

### Parameters: Histogram

| Parameter  | Required/Optional | Data type             | Description |
| :--        | :--               | :--                   | :--         |
| `histogram` | Required         | Object                | An object specifying a numeric document field and interval. |
| `interval`  | Required         | Numeric               | The field value width used to construct each bucket. |

### Example: Histogram

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

### Example response: Histogram

As shown in the following example response, the aggregation returns the first `6` bucket keys and document counts for the two `histogram` sources. As in the `terms` example, the buckets are ordered across and within the source fields. In this case, however, the order is numerical and is based on the inclusive lower bound of each histogram width:

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

As shown in the following example response, there are only two buckets left:

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

Use the `date_histogram` to create composite aggregations of date ranges.

OpenSearch represents dates, including `date_interval` bucket keys, as `long` integers representing [milliseconds since epoch](https://en.wikipedia.org/wiki/Unix_time). You can output a date format instead using the `format` parameter. This does not change the key order.

OpenSearch stores date-times in UTC. You can display output results in a different timezone using the `time_zone` parameter.

### Parameters: Date histogram

| Parameter           | Required/Optional  | Data type             | Description |
| :--                 | :--                | :--                   | :--         |
| `date_histogram`    | Required           | Object                | An object specifying a date-time document field, interval, and optional format and time zone. |
| `calendar_interval` | Required           | Time interval         | The field date span used to construct each bucket. |
| `format`            | Optional           | String                | A date format string. If omitted, the date is output as a 64-bit [ms-since-epoch](https://en.wikipedia.org/wiki/Unix_time) integer. |
| `time_zone`         | Optional           | String                | A string representing the time offset from UTC, either as an [ISO 8601 UTC offset](https://en.wikipedia.org/wiki/UTC_offset) ("-07:00") or as a TZ timezone database [identifier](https://en.wikipedia.org/wiki/Tz_database) ("America/Los_Angeles").|

### Example: Date interval

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

### Example response: Date interval

As shown in the following example response, the aggregation returns the formatted date-based bucket keys and counts. For `date_interval` composite aggregation, field ordering is by date:

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

Use `geotile_grid` sources to aggregate `geo_point` values into buckets representing map tiles. As with the other composite aggregation `sources`, by default results include only buckets that contain data.

Each cell corresponds to a [map tile](https://en.wikipedia.org/wiki/Tiled_web_map). Cell labels use a "{zoom}/{x}/{y}" format.

### Parameters: Geotile grid

| Parameter      | Required/Optional  | Data type             | Description |
| :--            | :--                | :--                   | :--         |
| `geotile_grid` | Required           | Object                | An object specifying a `geo_point` document field and optional precision value and bounds object. |
| `precision`    | Optional           | Integer               | A geo-cell resolution index. Valid values are `1` to `29`. Higher values indicate greater precision. |
| `bounds`       | Optional          |  [Geo-bounding box]({{site.url}}{{site.baseurl}}/query-dsl/geo-and-xy/geo-bounding-box/)  | A geo-bounding box that constrains the source values. Any point outside the box is omitted from the `composite`. |

### Example: Geotile grid

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

### Example response: Geotile grid

As shown in the following example response, the aggregation returns the specified `geo_tilees` and point counts:

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

### Example: Combining sources

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

### Example results: Combining sources

As shown in the following example response, the aggregation returns the mixed-type `composite` buckets and document counts:

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

## Requesting sub-aggregations

Composite aggregations are most useful when combined with sub-aggregations that reveal information about the documents in the `composite` buckets.

### Example: Sub-aggregations

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

### Example results: Sub-aggregations

As shown in the following example response, the aggregation returns the average `taxful_total_price` of the first `6` buckets:

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

If a request results in more than `size` buckets, then `size` buckets are returned. In this case, the result contains an `after_key` object containing the key of the next bucket in the list. To retrieve the next `size` buckets of the request, make the request again, supplying the `after_key` in the `after` parameter. For an example, see the request continuation in [Example response: Histogram](#example-histogram).

Always use the `after_key` rather than copying the last bucket to continue a paginated response. The two are sometimes not the same.
{: .important}
