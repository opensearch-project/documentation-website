---
layout: default
title: Value calculations
parent: Building visualizations using queries
grand_parent: Building data visualizations
nav_order: 110
---

# Value calculations

When a visualization receives a numeric field, the data often contains a series of values rather than a single number. Use the **Calculation** setting to select a reducer function that aggregates the series into one representative value for display.

## Supported chart types

The value calculation setting is available in the following chart types. These are the only chart types that display a single aggregated value per series.

- Bar gauge
- Gauge
- Metric

## Missing values

A data series may contain `NaN` or `null` entries. Calculation methods marked with an asterisk (\*) skip these invalid entries and operate only on valid numeric values. Methods without an asterisk use raw positional values regardless of whether they are valid numbers.

## Available calculations

The following table lists all available calculation methods.

| Calculation | Description | Requires valid values |
| --- | --- | --- |
| **First** | The first value in the field. | No |
| **First \*** | The first valid (non-`null`, non-`NaN`) value in the field. | Yes |
| **Last** | The last value in the field. | No |
| **Last \*** | The last valid (non-`null`, non-`NaN`) value in the field. | Yes |
| **Min** | The minimum value among all valid values. | Yes |
| **Max** | The maximum value among all valid values. | Yes |
| **Mean** | The arithmetic average of all valid values. | Yes |
| **Median** | The middle value when all valid values are sorted. | Yes |
| **Total** | The sum of all valid values. | Yes |
| **Count** | The total number of values in the field (including `null`/`NaN`). | No |
| **Distinct count** | The number of unique values in the field (including `null`/`NaN`). | No |
| **Variance** | The statistical variance of all valid values. | Yes |

