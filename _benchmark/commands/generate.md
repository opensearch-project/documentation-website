---
layout: default
title: generate
nav_order: 70
parent: Command reference
---

The `generate` command generates visualization based on benchmark results.

## Usage

The following example generates a time-series chart, which outputs into the `.benchmark` directory.

```
opensearch-benchmark generate --chart-type="time-series"
```

## Options

The following options customize the visualization produced by the `generate` command:

- `--chart-spec-path`: Sets the path to the JSON files containing chart specifications that can be used to generate charts.
- `--chart-type`: Generates the indicated chart type, either `time-series` or `bar`. Default is `time-series`.
- `--output-path`: The path and name where the chart outputs. Default is `stdout`.
