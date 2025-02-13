---
layout: default
title: Limiting and paginating composite aggregation results
parent: Composite
grand_parent: Bucket aggregations
great_grand_parent: Aggregations
nav_order: 25
---

# Limiting and paginating composite aggregation results

When working with composite aggregations, you may need to limit the number of composite buckets returned or paginate through large result sets. You can achieve this by using the `size` and `after` parameters.

## Limiting the number of composite buckets with `size`

The `size` parameter defines the maximum number of composite buckets to be included in the response. Each composite bucket is treated as a single bucket, regardless of the number of value sources used to create it.

### Syntax

```json
"composite": {
  "size": NUMBER,
  "sources": [
    {
      "NAME": {
        "AGGREGATION": {
          "field": "FIELD"
        }
      }
    },
    ...
  ]
}
```
{% include copy-curl.html %}


## Paginating composite aggregation results with `after`

When handling large amounts of data or when you need to display the results in a paginated user interface, you can use the `after` parameter in combination with the `size` parameter to retrieve composite buckets in smaller chunks or pages. By combining `size` and `after`, you can efficiently control the number of composite buckets returned and paginate through large result sets.

### Syntax

```json
"composite": {
  "size": NUMBER,
  "after": ["VALUE_SOURCE_1", "VALUE_SOURCE_2", ...],
  "sources": [
    {
      "NAME": {
        "AGGREGATION": {
          "field": "FIELD"
        }
      }
    },
    ...
  ]
}
```
{% include copy-curl.html %}

---

## Example query with `size`

In the following example query, the `size` parameter is set to `5`, limiting the response to the top five composite buckets based on the specified value sources and the `total_sales` aggregation:

```json
GET /sales/_search
{
  "size": 0,
  "aggs": {
    "sales_by_day_product": {
      "composite": {
        "size": 5,
        "sources": [
          {
            "day": {
              "date_histogram": {
                "field": "timestamp",
                "calendar_interval": "1d",
                "order": "desc"
              }
            }
          },
          {
            "product": {
              "terms": {
                "field": "product.keyword",
                "order": "asc"
              }
            }
          }
        ]
      },
      "aggregations": {
        "total_sales": {
          "sum": {
            "field": "price"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 43,
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
    "sales_by_day_product": {
      "after_key": {
        "day": 1680307200000,
        "product": "Product B"
      },
      "buckets": [
        {
          "key": {
            "day": 1680393600000,
            "product": "Product A"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product A"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product B"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}


## Example query with `size` and `after`

The following example query groups and aggregates data based on multiple criteria while also paginating the results:

```json
GET /sales/_search
{
  "size": 0,
  "aggs": {
    "sales_by_day_product": {
      "composite": {
        "size": 5,
        "sources": [
          {
            "day": {
              "date_histogram": {
                "field": "timestamp",
                "calendar_interval": "1d",
                "order": "desc"
              }
            }
          },
          {
            "product": {
              "terms": {
                "field": "product.keyword",
                "order": "asc"
              }
            }
          }
        ]
      },
      "aggregations": {
        "total_sales": {
          "sum": {
            "field": "price"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example reponse

```json
{
  "took": 10,
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
    "sales_by_day_product": {
      "after_key": {
        "day": 1680307200000,
        "product": "Product B"
      },
      "buckets": [
        {
          "key": {
            "day": 1680393600000,
            "product": "Product A"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product A"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product B"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

 When dealing with large amounts of data or when you need to display the results in a paginated user interface, you can use the `after` parameter in combination with the `size` parameter to retrieve composite buckets in smaller chunks or pages. The `after` parameter expects an object with keys that match the names of the value sources defined in the `sources` array. The values in the `after` object should correspond to the last composite bucket from the previous page. See the following example query: 

```json
GET /sales/_search
{
  "size": 0,
  "aggs": {
    "sales_by_day_product": {
      "composite": {
        "size": 5,
        "after": {
          "day": 1680403200000, 
          "product": "Product B"
        },
        "sources": [
          {
            "day": {
              "date_histogram": {
                "field": "timestamp",
                "calendar_interval": "1d",
                "order": "desc"
              }
            }
          },
          {
            "product": {
              "terms": {
                "field": "product.keyword",
                "order": "asc"
              }
            }
          }
        ]
      },
      "aggregations": {
        "total_sales": {
          "sum": {
            "field": "price"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 9,
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
    "sales_by_day_product": {
      "after_key": {
        "day": 1680307200000,
        "product": "Product B"
      },
      "buckets": [
        {
          "key": {
            "day": 1680393600000,
            "product": "Product A"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product A"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        },
        {
          "key": {
            "day": 1680307200000,
            "product": "Product B"
          },
          "doc_count": 1,
          "total_sales": {
            "value": 0
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}
