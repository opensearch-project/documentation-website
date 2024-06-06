---
layout: default
title: Boxplot
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 15
---

# Boxplot

A boxplot aggregation calculates the statistical distribution of a numeric field. It provides summary of the data, including the following key statistics: minimum value, first quartile, median, third quartile, and maximum value.

## Syntax

The basic syntax for the boxplot aggregation is as follows:

```json
{
  "aggs": {
    "boxplot_agg_name": {
      "boxplot": {
        "field": "numeric_field"
      }
    }
  }
}
```
{% include copy-curl.html %}

Replace `boxplot_agg_name` with a descriptive name for your aggregation and `numeric_field` with the name of the numeric field you want to analyze.

## Example use case

Let's say you have a dataset of website load times, and you want to analyze their distribution using the boxplot aggregation. Here's an example query:

```json
GET website_logs/_search
{
  "size": 0,
  "aggs": {
    "load_time_boxplot": {
      "boxplot": {
        "field": "load_time_ms"
      }
    }
  }
}
```
{% include copy-curl.html %}

This query returns a response similar to the following:

```json
{
  "aggregations": {
    "load_time_boxplot": {
      "min": 100.0,
      "max": 5000.0,
      "q1": 500.0,
      "q2": 1000.0,
      "q3": 2000.0
    }
  }
}
```
{% include copy-curl.html %}

## Advanced options

The boxplot aggregation in OpenSearch offers several advanced options to customize its behavior:

- Scripting: You can use scripts to transform or calculate values on-the-fly, allowing for more complex data processing.
- Compression: By adjusting the compression parameter, you can control the trade-off between memory usage and approximation accuracy.
- Missing value handling: You can specify how to treat documents with missing values in the target field.

These advanced options provide more control over the boxplot aggregation, allowing you to handle complex scenarios and tailor the analysis to your specific requirements.

### Scripting

You can use the `script` parameter to perform custom calculations or transformations on the fly, for example, to analyze the square root of a numeric field.

#### Example request

```json
GET website_logs/_search
{
  "size": 0,
  "aggs": {
    "load_time_boxplot": {
      "boxplot": {
        "script": {
          "source": "Math.sqrt(doc['load_time_ms'].value)"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Compression

The `compression` parameter controls the memory usage and accuracy trade-off for the boxplot calculation. A lower value provides better accuracy at the cost of higher memory usage, while a higher value reduces memory usage but may result in approximations. The default value is `3000`.

#### Example request 

```
GET website_logs/_search
{
  "size": 0,
  "aggs": {
    "load_time_boxplot": {
      "boxplot": {
        "field": "load_time_ms",
        "compression": 5000
      }
    }
  }
}
```
{% include copy-curl.html %}

### Missing value handling

By default, documents with missing values in the `target_field` field are ignored. However, you can specify how to handle them using the missing parameter:

- `missing`: Treat missing values as if they were specified explicitly.
- `missing_inv`: Treat missing values as if they were infinite values.
- `missing_neg_value`: Treat missing values as if they had a specified negative value.
- `missing_pos_value`: Treat missing values as if they had a specified positive value.

#### Example request

```json
GET website_logs/_search
{
  "size": 0,
  "aggs": {
    "load_time_boxplot": {
      "boxplot": {
        "field": "load_time_ms",
        "missing": 0
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, missing values in the load_time_ms field will be treated as if they were zeros.
