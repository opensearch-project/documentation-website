---
layout: default
title: Average
parent: Metric aggregations
nav_order: 10
redirect_from:
  - /query-dsl/aggregations/metric/average/
canonical_url: https://docs.opensearch.org/docs/latest/aggregations/metric/average/
---

# Average aggregations

The `avg` metric is a single-value metric that returns the average value of a field.

## Parameters

The `avg` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type       | Description |
| :--       | :--               | :--            | :--         |
| `field`   | Required          | String         | The field for which the average is computed.    |
| `missing` | Optional          | Float         | The value to assign to missing instances of the field. By default, `avg` omits missing values from the calculation. |

## Example

 The following example request calculates the average of the `taxful_total_price` field in the OpenSearch Dashboards e-commerce sample data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "avg_taxful_total_price": {
      "avg": {
        "field": "taxful_total_price"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response contains the average of the `taxful_total_price`:

```json
{
  "took": 85,
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
    "avg_taxful_total_price": {
      "value": 75.05542864304813
    }
  }
}
```

You can use the aggregation name (`avg_taxful_total_price`) as a key to retrieve the aggregation from the response.

## Missing values

You can assign a value to missing instances of the aggregated field. See [Missing aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/missing/) for more information.

Prepare an example index by ingesting the following documents. Note that the second document is missing a `gpa` value:

```json
POST _bulk
{ "create": { "_index": "students", "_id": "1" } }
{ "name": "John Doe", "gpa": 3.89, "grad_year": 2022}
{ "create": { "_index": "students", "_id": "2" } }
{ "name": "Jonathan Powers", "grad_year": 2025 }
{ "create": { "_index": "students", "_id": "3" } }
{ "name": "Jane Doe", "gpa": 3.52, "grad_year": 2024 }
```
{% include copy-curl.html %}

### Example: Replacing a missing value

Take the average, replacing the missing GPA field with `0`:

```json
GET students/_search
{
  "size": 0,
  "aggs": {
    "avg_gpa": {
      "avg": {
        "field": "gpa",
        "missing": 0
      }
    }
  }
}
```
{% include copy-curl.html %}

The response is as follows. Compare to the next example, where missing values are ignored:

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
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "avg_gpa": {
      "value": 2.4700000286102295
    }
  }
}
```

### Example: Ignoring a missing value

Take the average but without assigning the `missing` parameter:

```json
GET students/_search
{
  "size": 0,
  "aggs": {
    "avg_gpa": {
      "avg": {
        "field": "gpa"
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregator calculates the average, omitting documents containing missing field values (the default behavior):

```json
{
  "took": 255,
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
    "avg_gpa": {
      "value": 3.7050000429153442
    }
  }
}
```