---
layout: default
title: Bucket script
parent: Pipeline aggregations
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/bucket-script/
---

# Bucket script aggregations

The `bucket_script` aggregation is a parent pipeline aggregation that executes a script to perform per-bucket numeric computations across a set of buckets. Use the `bucket_script` aggregation to perform custom numeric computations on multiple metrics in a bucketed aggregation. For example, you can:

- Calculate derived and composite metrics.
- Apply conditional logic using if/else statements.
- Compute business-specific KPIs, such as custom scoring metrics.

## Parameters

The `bucket_script` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | Object          | A map of variable names to bucketed metrics that identify the metrics to be used in the script. The metrics must be numeric. See [Script variables](#script-variables). |
| `script`              | Required          | String or Object | The script to execute. Can be an inline script, stored script, or script file. The script has access to the variable names defined in the `buckets_path` parameter. Must return a numeric value. |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps). |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` parameter. |

## Script variables

The `buckets_path` parameter maps script variable names to metrics from parent aggregations. These variables can then be used in the script. 

For the `bucket_script` and `bucket_selector` aggregations, the `buckets_path` parameter is an object rather than a string because it must refer to multiple bucket metrics. See the [Pipeline aggregations]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path) page for a description of the string version of `buckets_path`.
{: .note}

The following `buckets_path` maps the `sales_sum` metric to the `total_sales` script variable and the `item_count` metric to the `item_count` script variable:

```json
"buckets_path": {
  "total_sales": "sales_sum",
  "item_count": "item_count"
}
```

The mapped variables can be accessed from the `params` context. For example:

- `params.total_sales`
- `params.item_count` 

## Enabling inline scripting

Use the `script` parameter to add your script. The script can be inline, in a file, or in an index. To enable inline scripting, the `opensearch.yml` file in the `config` folder must contain the following:

```yml
script.inline: on
```

## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards e-commerce sample data. The `total_sales` subaggregation sums the taxed price of all items sold for each month. The `vendor_count` aggregation counts the total number of unique vendors for each month. Finally, the `avg_vendor_spend` aggregation uses an inline script to calculate the average amount spent per vendor each month:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "month"
      },
      "aggs": {
        "total_sales": {
          "sum": {
            "field": "taxful_total_price"
          }
        },
        "vendor_count": {
          "cardinality": {
            "field": "products.manufacturer.keyword"
          }
        },
        "avg_vendor_spend": {
          "bucket_script": {
            "buckets_path": {
              "sales": "total_sales",
              "vendors": "vendor_count"
            },
            "script": "params.sales / params.vendors",
            "format": "$#,###.00"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The aggregation returns the formatted monthly average vendor spend:

```json
{
  "took": 6,
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
    "sales_per_month": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 721,
          "vendor_count": {
            "value": 21
          },
          "total_sales": {
            "value": 53468.1484375
          },
          "avg_vendor_spend": {
            "value": 2546.1023065476193,
            "value_as_string": "$2,546.10"
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 3954,
          "vendor_count": {
            "value": 21
          },
          "total_sales": {
            "value": 297415.98046875
          },
          "avg_vendor_spend": {
            "value": 14162.665736607143,
            "value_as_string": "$14,162.67"
          }
        }
      ]
    }
  }
}
```




