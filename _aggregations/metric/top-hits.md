---
layout: default
title: Top hits
parent: Metric aggregations
nav_order: 130
redirect_from:
  - /query-dsl/aggregations/metric/top-hits/
---

# Top hits aggregations

The `top_hits` aggregation is a multi-value metric aggregation that retrieves the highest-scoring documents within each aggregation bucket. Use it inside a bucket aggregation to return representative or top-ranked documents per group.

When combined with a bucket aggregation, such as [`terms`]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/), the `top_hits` aggregation groups the result set by specified properties and retrieves the highest-scoring or most recently updated documents from each group. This is useful in the following scenarios:

- Displaying the most recent transaction in each product category.
- Showing the highest-scoring search result from each manufacturer.
- Retrieving representative documents from grouped results without returning every match.

## Parameters

The following table lists the parameters accepted by the `top_hits` aggregation.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `from` | Integer | The offset from the first result to fetch. Default is `0`. |
| `size` | Integer | The maximum number of top matching hits to return per bucket. Default is `3`. |
| `sort` | Object or Array | Defines how the top matching hits are sorted. By default, hits are sorted by the score of the main query. |

## Supported per-hit features

Because the `top_hits` aggregation returns standard search hits, the following per-hit features are supported:

- [Highlighting]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/)
- [Explain]({{site.url}}{{site.baseurl}}/api-reference/search-apis/explain/)
- [Source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering)
- [Stored fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-stored_fields)
- [Script fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields)
- [Doc value fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-docvalue_fields)
- [Include versions]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#query-parameters)
- Include sequence numbers and primary terms

## Example: Grouping results by category

In the following example, orders in the ecommerce dataset are grouped by product category using a `terms` aggregation, and the `top_hits` subaggregation retrieves the most recent order from each category. Only the `order_date`, `taxful_total_price`, and `customer_full_name` fields are included in the source:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category.keyword",
        "size": 3
      },
      "aggs": {
        "most_recent_sales": {
          "top_hits": {
            "sort": [
              {
                "order_date": {
                  "order": "desc"
                }
              }
            ],
            "_source": {
              "includes": ["order_date", "taxful_total_price", "customer_full_name"]
            },
            "size": 1
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 25,
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
    "top_categories": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 2346,
      "buckets": [
        {
          "key": "Men's Clothing",
          "doc_count": 2024,
          "most_recent_sales": {
            "hits": {
              "total": {
                "value": 2024,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "poN5u50BpPQaFxReh8Tz",
                  "_score": null,
                  "_source": {
                    "customer_full_name": "Youssef Jensen",
                    "order_date": "2026-05-09T23:45:36+00:00",
                    "taxful_total_price": 78.98
                  },
                  "sort": [
                    1778370336000
                  ]
                }
              ]
            }
          }
        },
        {
          "key": "Women's Clothing",
          "doc_count": 1903,
          "most_recent_sales": {
            "hits": {
              "total": {
                "value": 1903,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "6IN5u50BpPQaFxRehr5T",
                  "_score": null,
                  "_source": {
                    "customer_full_name": "Sonya Smith",
                    "order_date": "2026-05-09T23:31:12+00:00",
                    "taxful_total_price": 42.98
                  },
                  "sort": [
                    1778369472000
                  ]
                }
              ]
            }
          }
        },
        {
          "key": "Women's Shoes",
          "doc_count": 1136,
          "most_recent_sales": {
            "hits": {
              "total": {
                "value": 1136,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "3IN5u50BpPQaFxReh78O",
                  "_score": null,
                  "_source": {
                    "customer_full_name": "Brigitte Cross",
                    "order_date": "2026-05-09T23:22:34+00:00",
                    "taxful_total_price": 91.98
                  },
                  "sort": [
                    1778368954000
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
</details>

## Example: Field collapsing

Field collapsing, or result grouping, organizes a result set into logical groups and returns the top documents from each group. The groups are ordered by the relevance of their highest-scoring document.

You can implement field collapsing by wrapping a `top_hits` aggregation inside a bucket aggregation. The following example searches the ecommerce dataset for products matching `shirt` and groups the results by `manufacturer`. A `max` aggregation captures the highest score per manufacturer, and the `terms` aggregation uses that score to order the buckets by relevance:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "match": {
      "products.product_name": "shirt"
    }
  },
  "aggs": {
    "top_manufacturers": {
      "terms": {
        "field": "manufacturer.keyword",
        "size": 3,
        "order": {
          "top_score": "desc"
        }
      },
      "aggs": {
        "top_hits_per_manufacturer": {
          "top_hits": {
            "_source": {
              "includes": ["products.product_name", "manufacturer"]
            },
            "size": 1
          }
        },
        "top_score": {
          "max": {
            "script": {
              "source": "_score"
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `max` (or `min`) aggregation is required because the `top_hits` aggregation cannot be used directly in the `order` option of the `terms` aggregation.
{: .note}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 38,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1160,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "top_manufacturers": {
      "doc_count_error_upper_bound": -1,
      "sum_other_doc_count": 953,
      "buckets": [
        {
          "key": "Elitelligence",
          "doc_count": 503,
          "top_score": {
            "value": 0.9982529878616333
          },
          "top_hits_per_manufacturer": {
            "hits": {
              "total": {
                "value": 503,
                "relation": "eq"
              },
              "max_score": 0.998253,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "34N5u50BpPQaFxReicgP",
                  "_score": 0.998253,
                  "_source": {
                    "manufacturer": [
                      "Elitelligence",
                      "Low Tide Media"
                    ],
                    "products": [
                      {
                        "product_name": "Shirt - white"
                      },
                      {
                        "product_name": "Shirt - white"
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        {
          "key": "Low Tide Media",
          "doc_count": 500,
          "top_score": {
            "value": 0.9982529878616333
          },
          "top_hits_per_manufacturer": {
            "hits": {
              "total": {
                "value": 500,
                "relation": "eq"
              },
              "max_score": 0.998253,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "34N5u50BpPQaFxReicgP",
                  "_score": 0.998253,
                  "_source": {
                    "manufacturer": [
                      "Elitelligence",
                      "Low Tide Media"
                    ],
                    "products": [
                      {
                        "product_name": "Shirt - white"
                      },
                      {
                        "product_name": "Shirt - white"
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        {
          "key": "Oceanavigations",
          "doc_count": 330,
          "top_score": {
            "value": 0.9561269283294678
          },
          "top_hits_per_manufacturer": {
            "hits": {
              "total": {
                "value": 330,
                "relation": "eq"
              },
              "max_score": 0.9561269,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "VYN5u50BpPQaFxRehbyq",
                  "_score": 0.9561269,
                  "_source": {
                    "manufacturer": [
                      "Oceanavigations",
                      "Low Tide Media"
                    ],
                    "products": [
                      {
                        "product_name": "Shirt - grey"
                      },
                      {
                        "product_name": "Vibrant Patterned Shirt"
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
</details>

## Example: Using top hits aggregations with nested objects

When the `top_hits` aggregation is wrapped in a [`nested`]({{site.url}}{{site.baseurl}}/aggregations/bucket/nested/) or `reverse_nested` aggregation, it returns nested hits. Nested hits are internally stored as separate Lucene documents that share the same document ID as their parent. The `top_hits` aggregation can surface these inner documents when used within a `nested` or `reverse_nested` aggregation context.

Each nested hit includes a `_nested` field in the response that identifies the array field and the zero-based offset of the nested object within that array. This information is useful for locating the original nested object within the parent document source.

First, create an index with a `nested` field type:

```json
PUT /top-hits-products
{
  "mappings": {
    "properties": {
      "tags": { "type": "keyword" },
      "reviews": {
        "type": "nested",
        "properties": {
          "reviewer": { "type": "keyword" },
          "comment": { "type": "text" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Add a document containing a nested `reviews` field:

```json
PUT /top-hits-products/_doc/1?refresh=true
{
  "tags": ["laptop", "electronics"],
  "reviews": [
    {"reviewer": "tech_guru", "comment": "This laptop has outstanding battery life"},
    {"reviewer": "casual_user", "comment": "Great laptop for everyday tasks"},
    {"reviewer": "power_user", "comment": "This laptop handles heavy workloads easily"}
  ]
}
```
{% include copy-curl.html %}

The following request searches for products tagged `laptop`, groups the nested reviews by reviewer, and retrieves the top review per reviewer:

```json
GET /top-hits-products/_search
{
  "query": {
    "term": { "tags": "laptop" }
  },
  "aggs": {
    "by_product": {
      "nested": {
        "path": "reviews"
      },
      "aggs": {
        "by_reviewer": {
          "terms": {
            "field": "reviews.reviewer",
            "size": 1
          },
          "aggs": {
            "by_nested": {
              "top_hits": {}
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `_nested` field identifies the array field (`reviews`) and the zero-based position (`offset`) of the nested object within that array:

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 16,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "top-hits-products",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "tags": [
            "laptop",
            "electronics"
          ],
          "reviews": [
            {
              "reviewer": "tech_guru",
              "comment": "This laptop has outstanding battery life"
            },
            {
              "reviewer": "casual_user",
              "comment": "Great laptop for everyday tasks"
            },
            {
              "reviewer": "power_user",
              "comment": "This laptop handles heavy workloads easily"
            }
          ]
        }
      }
    ]
  },
  "aggregations": {
    "by_product": {
      "doc_count": 3,
      "by_reviewer": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 2,
        "buckets": [
          {
            "key": "casual_user",
            "doc_count": 1,
            "by_nested": {
              "hits": {
                "total": {
                  "value": 1,
                  "relation": "eq"
                },
                "max_score": 1.0,
                "hits": [
                  {
                    "_index": "top-hits-products",
                    "_id": "1",
                    "_nested": {
                      "field": "reviews",
                      "offset": 1
                    },
                    "_score": 1.0,
                    "_source": {
                      "comment": "Great laptop for everyday tasks",
                      "reviewer": "casual_user"
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  }
}
```
</details>

When `_source` is requested for a nested hit, only the source of the nested object is returned rather than the entire parent document source. Stored fields defined on the nested object level are also accessible through `top_hits` when it resides inside a `nested` or `reverse_nested` aggregation.

Only nested hits contain the `_nested` field. Regular (non-nested) hits do not include this field.

For mappings that contain multiple levels of nested object types, the `_nested` information can be hierarchical. The following snippet shows a nested hit that resides at the first position of `nested_grand_child_field`, which is itself within the second position of `nested_child_field`:

```json
"hits": [
  {
    "_index": "my-index",
    "_id": "1",
    "_score": 1,
    "_nested": {
      "field": "nested_child_field",
      "offset": 1,
      "_nested": {
        "field": "nested_grand_child_field",
        "offset": 0
      }
    },
    "_source": ...
  }
]
```

## Example: Highlighting matched terms

The following example searches for `shirt` across product names and uses `highlight` to wrap matched terms in `<em>` tags within each top hit:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "match": {
      "products.product_name": "shirt"
    }
  },
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category.keyword",
        "size": 2
      },
      "aggs": {
        "top_doc": {
          "top_hits": {
            "size": 1,
            "_source": {
              "includes": ["products.product_name"]
            },
            "highlight": {
              "fields": {
                "products.product_name": {}
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

```json
{
  "took": 17,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1160,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "top_categories": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 552,
      "buckets": [
        {
          "key": "Men's Clothing",
          "doc_count": 817,
          "top_doc": {
            "hits": {
              "total": {
                "value": 817,
                "relation": "eq"
              },
              "max_score": 0.998253,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "34N5u50BpPQaFxReicgP",
                  "_score": 0.998253,
                  "_source": {
                    "products": [
                      {
                        "product_name": "Shirt - white"
                      },
                      {
                        "product_name": "Shirt - white"
                      }
                    ]
                  },
                  "highlight": {
                    "products.product_name": [
                      "<em>Shirt</em> - white",
                      "<em>Shirt</em> - white"
                    ]
                  }
                }
              ]
            }
          }
        },
        {
          "key": "Women's Clothing",
          "doc_count": 343,
          "top_doc": {
            "hits": {
              "total": {
                "value": 343,
                "relation": "eq"
              },
              "max_score": 0.91741234,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "54N5u50BpPQaFxReiccP",
                  "_score": 0.91741234,
                  "_source": {
                    "products": [
                      {
                        "product_name": "Shirt - white"
                      },
                      {
                        "product_name": "Shirt - light blue denim"
                      }
                    ]
                  },
                  "highlight": {
                    "products.product_name": [
                      "<em>Shirt</em> - white",
                      "<em>Shirt</em> - light blue denim"
                    ]
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
</details>

## Example: Using script fields

The following example retrieves the highest-priced order per category and computes a 15% discount using a `script_fields` definition:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category.keyword",
        "size": 2
      },
      "aggs": {
        "top_doc": {
          "top_hits": {
            "size": 1,
            "sort": [
              {
                "taxful_total_price": {
                  "order": "desc"
                }
              }
            ],
            "_source": {
              "includes": ["customer_full_name", "taxful_total_price"]
            },
            "script_fields": {
              "price_with_tax_discount": {
                "script": {
                  "source": "doc['taxful_total_price'].value * 0.85"
                }
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Example response
  </summary>
  {: .text-delta}

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
    "top_categories": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 3482,
      "buckets": [
        {
          "key": "Men's Clothing",
          "doc_count": 2024,
          "top_doc": {
            "hits": {
              "total": {
                "value": 2024,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "LoN5u50BpPQaFxRehr9T",
                  "_score": null,
                  "_source": {
                    "customer_full_name": "Wagdi Shaw",
                    "taxful_total_price": 2249.92
                  },
                  "fields": {
                    "price_with_tax_discount": [
                      1912.5
                    ]
                  },
                  "sort": [
                    2250.0
                  ]
                }
              ]
            }
          }
        },
        {
          "key": "Women's Clothing",
          "doc_count": 1903,
          "top_doc": {
            "hits": {
              "total": {
                "value": 1903,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "opensearch_dashboards_sample_data_ecommerce",
                  "_id": "z4N5u50BpPQaFxReicuj",
                  "_score": null,
                  "_source": {
                    "customer_full_name": "Elyssa Hart",
                    "taxful_total_price": 343.96
                  },
                  "fields": {
                    "price_with_tax_discount": [
                      292.4
                    ]
                  },
                  "sort": [
                    344.0
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
</details>

## Response body fields

The following table lists the response body fields returned within each `top_hits` aggregation result.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `hits.total.value` | Integer | The total number of documents matching the aggregation within the bucket. |
| `hits.total.relation` | String | Indicates whether the total is exact (`eq`) or a lower bound (`gte`). |
| `hits.max_score` | Float or Null | The highest relevance score among the returned hits. This is `null` when hits are sorted by a field other than `_score`. |
| `hits.hits` | Array | An array of the top matching documents for the bucket. |
| `hits.hits._index` | String | The index containing the document. |
| `hits.hits._id` | String | The unique identifier of the document. |
| `hits.hits._score` | Float or Null | The relevance score of the document. This is `null` when sorting by a field other than `_score`. |
| `hits.hits._source` | Object | The original document source. When source filtering is applied, only the requested fields are returned. |
| `hits.hits.sort` | Array | The sort values used to order this hit, present only when an explicit `sort` is specified. |
| `hits.hits._nested` | Object | Present only for nested hits. Contains `field` (the nested array field name) and `offset` (the zero-based position within the array). |
