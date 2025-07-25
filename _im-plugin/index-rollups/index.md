---
layout: default
title: Index rollups
nav_order: 35
has_children: true
redirect_from: /im-plugin/index-rollups/
has_toc: false
canonical_url: https://docs.opensearch.org/latest/im-plugin/index-rollups/index/
---

# Index rollups

Time series data increases storage costs, strains cluster health, and slows down aggregations over time. Index rollup lets you periodically reduce data granularity by rolling up old data into summarized indexes.

You pick the fields that interest you and use index rollup to create a new index with only those fields aggregated into coarser time buckets. You can store months or years of historical data at a fraction of the cost with the same query performance.

For example, say you collect CPU consumption data every five seconds and store it on a hot node. Instead of moving older data to a read-only warm node, you can roll up or compress this data with only the average CPU consumption per day or with a 10% decrease in its interval every week.

You can use index rollup in three ways:

1. Use the index rollup API for an on-demand index rollup job that operates on an index that's not being actively ingested such as a rolled-over index. For example, you can perform an index rollup operation to reduce data collected at a five minute interval to a weekly average for trend analysis.
2. Use the OpenSearch Dashboards UI to create an index rollup job that runs on a defined schedule. You can also set it up to roll up your indexes as it’s being actively ingested. For example, you can continuously roll up Logstash indexes from a five second interval to a one hour interval.
3. Specify the index rollup job as an ISM action for complete index management. This allows you to roll up an index after a certain event such as a rollover, index age reaching a certain point, index becoming read-only, and so on. You can also have rollover and index rollup jobs running in sequence, where the rollover first moves the current index to a warm node and then the index rollup job creates a new index with the minimized data on the hot node.

## Create an Index Rollup Job

To get started, choose **Index Management** in OpenSearch Dashboards.
Select **Rollup Jobs** and choose **Create rollup job**.

### Step 1: Set up indexes

1. In the **Job name and description** section, specify a unique name and an optional description for the index rollup job.
2. In the **Indices** section, select the source and target index. The source index is the one that you want to roll up. The source index remains as is, the index rollup job creates a new index referred to as a target index. The target index is where the index rollup results are saved. For target index, you can either type in a name for a new index or you select an existing index.
5. Choose **Next**

After you create an index rollup job, you can't change your index selections.

### Step 2: Define aggregations and metrics

Select the attributes with the aggregations (terms and histograms) and metrics (avg, sum, max, min, and value count) that you want to roll up. Make sure you don’t add a lot of highly granular attributes, because you won’t save much space.

For example, consider a dataset of cities and demographics within those cities. You can aggregate based on cities and specify demographics within a city as metrics.
The order in which you select attributes is critical. A city followed by a demographic is different from a demographic followed by a city.

1. In the **Time aggregation** section, select a timestamp field. Choose between a **Fixed** or **Calendar** interval type and specify the interval and timezone. The index rollup job uses this information to create a date histogram for the timestamp field.
2. (Optional) Add additional aggregations for each field. You can choose terms aggregation for all field types and histogram aggregation only for numeric fields.
3. (Optional) Add additional metrics for each field. You can choose between **All**, **Min**, **Max**, **Sum**, **Avg**, or **Value Count**.
4. Choose **Next**.

### Step 3: Specify schedule

Specify a schedule to roll up your indexes as it’s being ingested. The index rollup job is enabled by default.

1. Specify if the data is continuous or not.
3. For roll up execution frequency, select **Define by fixed interval** and specify the **Rollup interval** and the time unit or **Define by cron expression** and add in a cron expression to select the interval. To learn how to define a cron expression, see [Alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/).
4. Specify the number of pages per execution process. A larger number means faster execution and more cost for memory.
5. (Optional) Add a delay to the roll up executions. This is the amount of time the job waits for data ingestion to accommodate any processing time. For example, if you set this value to 10 minutes, an index rollup that executes at 2 PM to roll up 1 PM to 2 PM of data starts at 2:10 PM.
6. Choose **Next**.

### Step 4: Review and create

Review your configuration and select **Create**.

### Step 5: Search the target index

You can use the standard `_search` API to search the target index. Make sure that the query matches the constraints of the target index. For example, if you don’t set up terms aggregations on a field, you don’t receive results for terms aggregations. If you don’t set up the maximum aggregations, you don’t receive results for maximum aggregations.

You can’t access the internal structure of the data in the target index because the plugin automatically rewrites the query in the background to suit the target index. This is to make sure you can use the same query for the source and target index.

To query the target index, set `size` to 0:

```json
GET target_index/_search
{
  "size": 0,
  "query": {
    "match_all": {}
  },
  "aggs": {
    "avg_cpu": {
      "avg": {
        "field": "cpu_usage"
      }
    }
  }
}
```

Consider a scenario where you collect rolled up data from 1 PM to 9 PM in hourly intervals and live data from 7 PM to 11 PM in minutely intervals. If you execute an aggregation over these in the same query, for 7 PM to 9 PM, you see an overlap of both rolled up data and live data because they get counted twice in the aggregations.

## Sample Walkthrough

This walkthrough uses the OpenSearch Dashboards sample e-commerce data. To add that sample data, log in to OpenSearch Dashboards, choose **Home** and **Try our sample data**. For **Sample eCommerce orders**, choose **Add data**.

Then run a search:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
```

#### Example response

```json
{
  "took": 23,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "opensearch_dashboards_sample_data_ecommerce",
        "_type": "_doc",
        "_id": "jlMlwXcBQVLeQPrkC_kQ",
        "_score": 1,
        "_source": {
          "category": [
            "Women's Clothing",
            "Women's Accessories"
          ],
          "currency": "EUR",
          "customer_first_name": "Selena",
          "customer_full_name": "Selena Mullins",
          "customer_gender": "FEMALE",
          "customer_id": 42,
          "customer_last_name": "Mullins",
          "customer_phone": "",
          "day_of_week": "Saturday",
          "day_of_week_i": 5,
          "email": "selena@mullins-family.zzz",
          "manufacturer": [
            "Tigress Enterprises"
          ],
          "order_date": "2021-02-27T03:56:10+00:00",
          "order_id": 581553,
          "products": [
            {
              "base_price": 24.99,
              "discount_percentage": 0,
              "quantity": 1,
              "manufacturer": "Tigress Enterprises",
              "tax_amount": 0,
              "product_id": 19240,
              "category": "Women's Clothing",
              "sku": "ZO0064500645",
              "taxless_price": 24.99,
              "unit_discount_amount": 0,
              "min_price": 12.99,
              "_id": "sold_product_581553_19240",
              "discount_amount": 0,
              "created_on": "2016-12-24T03:56:10+00:00",
              "product_name": "Blouse - port royal",
              "price": 24.99,
              "taxful_price": 24.99,
              "base_unit_price": 24.99
            },
            {
              "base_price": 10.99,
              "discount_percentage": 0,
              "quantity": 1,
              "manufacturer": "Tigress Enterprises",
              "tax_amount": 0,
              "product_id": 17221,
              "category": "Women's Accessories",
              "sku": "ZO0085200852",
              "taxless_price": 10.99,
              "unit_discount_amount": 0,
              "min_price": 5.06,
              "_id": "sold_product_581553_17221",
              "discount_amount": 0,
              "created_on": "2016-12-24T03:56:10+00:00",
              "product_name": "Snood - rose",
              "price": 10.99,
              "taxful_price": 10.99,
              "base_unit_price": 10.99
            }
          ],
          "sku": [
            "ZO0064500645",
            "ZO0085200852"
          ],
          "taxful_total_price": 35.98,
          "taxless_total_price": 35.98,
          "total_quantity": 2,
          "total_unique_products": 2,
          "type": "order",
          "user": "selena",
          "geoip": {
            "country_iso_code": "MA",
            "location": {
              "lon": -8,
              "lat": 31.6
            },
            "region_name": "Marrakech-Tensift-Al Haouz",
            "continent_name": "Africa",
            "city_name": "Marrakesh"
          },
          "event": {
            "dataset": "sample_ecommerce"
          }
        }
      }
    ]
  }
}
...
```

Create an index rollup job.
This example picks the `order_date`, `customer_gender`, `geoip.city_name`, `geoip.region_name`, and `day_of_week` fields and rolls them into an `example_rollup` target index:

```json
PUT _plugins/_rollup/jobs/example
{
  "rollup": {
    "enabled": true,
    "schedule": {
      "interval": {
        "period": 1,
        "unit": "Minutes",
        "start_time": 1602100553
      }
    },
    "last_updated_time": 1602100553,
    "description": "An example policy that rolls up the sample ecommerce data",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "target_index": "example_rollup",
    "page_size": 1000,
    "delay": 0,
    "continuous": false,
    "dimensions": [
      {
        "date_histogram": {
          "source_field": "order_date",
          "fixed_interval": "60m",
          "timezone": "America/Los_Angeles"
        }
      },
      {
        "terms": {
          "source_field": "customer_gender"
        }
      },
      {
        "terms": {
          "source_field": "geoip.city_name"
        }
      },
      {
        "terms": {
          "source_field": "geoip.region_name"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week"
        }
      }
    ],
    "metrics": [
      {
        "source_field": "taxless_total_price",
        "metrics": [
          {
            "avg": {}
          },
          {
            "sum": {}
          },
          {
            "max": {}
          },
          {
            "min": {}
          },
          {
            "value_count": {}
          }
        ]
      },
      {
        "source_field": "total_quantity",
        "metrics": [
          {
            "avg": {}
          },
          {
            "max": {}
          }
        ]
      }
    ]
  }
}
```

You can query the `example_rollup` index for the terms aggregations on the fields set up in the rollup job.
You get back the same response that you would on the original `opensearch_dashboards_sample_data_ecommerce` source index:

```json
POST example_rollup/_search
{
  "size": 0,
  "query": {
    "bool": {
      "must": {"term": { "geoip.region_name": "California" } }
    }
  },
  "aggregations": {
    "daily_numbers": {
      "terms": {
        "field": "day_of_week"
      },
      "aggs": {
        "per_city": {
          "terms": {
            "field": "geoip.city_name"
          },
          "aggregations": {
            "average quantity": {
               "avg": {
                  "field": "total_quantity"
                }
              }
            }
          },
          "total_revenue": {
            "sum": {
              "field": "taxless_total_price"
          }
        }
      }
    }
  }
}
```

#### Sample Response

```json
{
  "took": 476,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 281,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "daily_numbers": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Friday",
          "doc_count": 53,
          "total_revenue": {
            "value": 4858.84375
          },
          "per_city": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "Los Angeles",
                "doc_count": 53,
                "average quantity": {
                  "value": 2.305084745762712
                }
              }
            ]
          }
        },
        {
          "key": "Saturday",
          "doc_count": 43,
          "total_revenue": {
            "value": 3547.203125
          },
          "per_city": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "Los Angeles",
                "doc_count": 43,
                "average quantity": {
                  "value": 2.260869565217391
                }
              }
            ]
          }
        },
        {
          "key": "Tuesday",
          "doc_count": 42,
          "total_revenue": {
            "value": 3983.28125
          },
          "per_city": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "Los Angeles",
                "doc_count": 42,
                "average quantity": {
                  "value": 2.2888888888888888
                }
              }
            ]
          }
        },
        {
          "key": "Sunday",
          "doc_count": 40,
          "total_revenue": {
            "value": 3308.1640625
          },
          "per_city": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "Los Angeles",
                "doc_count": 40,
                "average quantity": {
                  "value": 2.090909090909091
                }
              }
            ]
          }
        }
        ...
      ]
    }
  }
}
```
