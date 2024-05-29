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

These options provide flexibility and allow you to tailor the boxplot aggregation to your specific use case and data characteristics.

<Developer: Please provide query examples for scripting, compression, and missing value handling>