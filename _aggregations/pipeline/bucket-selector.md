---
layout: default
title: Bucket selector
parent: Pipeline aggregations
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/bucket-selector/
---

# Bucket selector aggregations

The `bucket_selector` aggregation is a parent pipeline aggregation that evaluates a script to determine whether buckets returned by a `histogram` (or `date_histogram`) aggregation should be included in the final result. 

Unlike pipeline aggregations that create new values, the `bucket_selector` aggregation acts as a filter, keeping or removing entire buckets based on the specified criteria. Use this aggregation to filter buckets based on the computed metrics of a bucket. 

## Parameters

The `bucket_selector` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | Object          | A map of variable names to bucketed metrics that identify the metrics to be used in the script. The metrics must be numeric. See [Script variables]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-script#script-variables). |
| `script`              | Required          | String or Object | The script to execute. Can be an inline script, stored script, or script file. The script has access to the variable names defined in the `buckets_path` parameter. Must return a Boolean value. Buckets returning `false` are removed from the final output. |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps).  |


## Example

The following example creates a date histogram with a one-week interval from the OpenSearch Dashboards e-commerce sample data. The `sum` subaggregation calculates the sum of all sales for each week. Finally, the `bucket_selector` aggregation filters the resulting weekly buckets, removing all the buckets that do not have a sum of more than $75,000:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "sales_per_week": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "week"
      },
      "aggs": {
        "weekly_sales": {
          "sum": {
            "field": "taxful_total_price",
            "format": "$#,###.00"
          }
        },
        "avg_vendor_spend": {
          "bucket_selector": {
            "buckets_path": {
              "weekly_sales": "weekly_sales"
            },
            "script": "params.weekly_sales > 75000"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The aggregation returns the `sales_per_week` buckets that meet the scripted criterion:

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
    "sales_per_week": {
      "buckets": [
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1048,
          "weekly_sales": {
            "value": 79448.60546875,
            "value_as_string": "$79,448.61"
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1048,
          "weekly_sales": {
            "value": 78208.4296875,
            "value_as_string": "$78,208.43"
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1073,
          "weekly_sales": {
            "value": 81277.296875,
            "value_as_string": "$81,277.30"
          }
        }
      ]
    }
  }
}
```

Because it returns a Boolean rather than a numeric value, the `buckets_selector` aggregation does not take a `format` parameter. In this example, the formatted metrics are returned in the `value_as_string` result by the `sum` subaggregation. Contrast this with the [example in the `bucket_script` aggregation]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-script/#example).
{: .note}