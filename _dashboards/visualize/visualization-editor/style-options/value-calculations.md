---
layout: default
title: Value calculations
parent: Style Options
grand_parent: Visualization editor
nav_order: 110
---

# Value calculations

When a visualization receives a numeric field, the data often contains a series of values rather than a single number. The **Calculation** setting lets you choose a reducer function that aggregates the series into one representative value for display.

## Handling missing values

A data series may contain `NaN` or `null` entries. Calculation methods marked with an asterisk (\*) skip these invalid entries and operate only on valid numeric values. Methods without an asterisk use raw positional values regardless of whether they are valid numbers.

## Available calculations

The following table lists all available calculation methods.

| Calculation | Description | Requires valid values |
| --- | --- | --- |
| **First** | First value in the field. | No |
| **First \*** | First valid (non-null, non-NaN) value in the field. | Yes |
| **Last** | Last value in the field. | No |
| **Last \*** | Last valid (non-null, non-NaN) value in the field. | Yes |
| **Min** | Minimum value among all valid values. | Yes |
| **Max** | Maximum value among all valid values. | Yes |
| **Mean** | Arithmetic average of all valid values. | Yes |
| **Median** | Middle value when all valid values are sorted. | Yes |
| **Total** | Sum of all valid values. | Yes |
| **Count** | Total number of values in the field (including null/NaN). | No |
| **Distinct count** | Number of unique values in the field (including null/NaN). | No |
| **Variance** | Statistical variance of all valid values. | Yes |

## Supported visualizations

The value calculation setting is available in the following chart types:

- Metric
- Gauge
- Bar gauge
