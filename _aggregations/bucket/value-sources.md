---
layout: default
title: Value sources
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 5
---

# Value sources 

The `sources` parameter defines the source fields to use when building composite buckets. The order in which the sources are defined controls the order in which the keys are returned in the composite buckets. You must use a unique name when defining sources for the composite aggregation.

The `sources` parameter can be any of the following: terms, histogram, date histogram, or geotile grid.

## Terms

The `terms` value source functions similarly to a regular `terms` aggregation. It extracts values from a document or a script, and each unique value becomes a bucket in the `composite` aggregation. For example, the following request uses the single value source `product` to create a bucket for each unique value of the `product` field in your dataset:

```json
GET /test_index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "product": { "terms": { "field": "product.keyword" } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

#### Example response
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
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "after_key": {
        "product": "T-Shirt"
      },
      "buckets": [
        {
          "key": {
            "product": "Jeans"
          },
          "doc_count": 1
        },
        {
          "key": {
            "product": "Sneakers"
          },
          "doc_count": 1
        },
        {
          "key": {
            "product": "T-Shirt"
          },
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>


Similar to the regular `terms` aggregation, the composite aggregation allows you to generate bucket values using a script. For example, in the following request, instead of directly referencing the `product` field in the `terms` aggregation, the script is used to retrieve the field value:

```json
GET /test_index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          {
            "product": {
              "terms": {
                "script": {
                  "source": "doc['product.keyword'].value",
                  "lang": "painless"
                }
              }
            }
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "took": 47,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "after_key": {
        "product": "T-Shirt"
      },
      "buckets": [
        {
          "key": {
            "product": "Jeans"
          },
          "doc_count": 1
        },
        {
          "key": {
            "product": "Sneakers"
          },
          "doc_count": 1
        },
        {
          "key": {
            "product": "T-Shirt"
          },
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>


---

## Histogram

The `histogram` value source feature enables you to create fixed-size intervals for numeric data. The interval parameter determines how the numeric values will be grouped. For example, if you set the interval to `5`, any numeric value will be assigned to the closest interval range. So, a value of `101` would be placed in the interval range of `100` to `105`, with `100` serving as the key for that range. For example, the following query performs a composite aggregation using a `histogram` value source on the `price` field. 

```json
GET /test_index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "histo": { "histogram": { "field": "price", "interval": 5 } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "took": 8,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "after_key": {
        "histo": 75
      },
      "buckets": [
        {
          "key": {
            "histo": 15
          },
          "doc_count": 1
        },
        {
          "key": {
            "histo": 45
          },
          "doc_count": 1
        },
        {
          "key": {
            "histo": 75
          },
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>


You can use a numeric field from your data or implement a script that calculates and returns numerical values to populate the values. For example, the following query buckets all documents into histogram ranges of the `price` field with an interval of `5`, allowing you to analyze the distribution and count of documents across different price ranges.

```json
GET /_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          {
            "histo": {
              "histogram": {
                "interval": 5,
                "script": {
                  "source": "doc['price'].value",
                  "lang": "painless"
                }
              }
            }
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

#### Example response
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
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "after_key": {
        "histo": 75
      },
      "buckets": [
        {
          "key": {
            "histo": 15
          },
          "doc_count": 1
        },
        {
          "key": {
            "histo": 45
          },
          "doc_count": 1
        },
        {
          "key": {
            "histo": 75
          },
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

---

## Date histogram

The `date_histogram` value source functions similarly to the `histogram` value source, but instead of using a numeric interval, it employs a date/time expression to define the interval for grouping date/time values. For example, the following query performs a composite aggregation on a date field (`timestamp`) using the `date_histogram` value source:

```json
GET /test_index/_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "date": { "date_histogram": { "field": "timestamp", "calendar_interval": "1d" } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "took": 56,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "buckets": []
    }
  }
}
```

</details>

---

### Geotile grid

For `geo_point` data, the `geotile_grid` value source provides a way to aggregate points into buckets that correspond to cells in a grid. Each cell is labeled with a `"{zoom}/{x}/{y}"` format, where zoom is set to the specified precision value. For example, the following query performs a composite aggregation on a `date` field called `timestamp`. It groups the documents based on the day (`calendar_interval` of `1d`) using the `date_histogram` source.

```json
GET /_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": [
          { "date": { "date_histogram": { "field": "timestamp", "calendar_interval": "1d" } } }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "took": 34,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_buckets": {
      "buckets": []
    }
  }
}
```

</details>