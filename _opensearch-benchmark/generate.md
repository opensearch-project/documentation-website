---
layout: default
title: generate
nav_order: 58
has_children: false
---

# generate

usage: opensearch-benchmark generate [-h] --chart-spec-path CHART_SPEC_PATH [--chart-type {time-series,bar}] [--output-path OUTPUT_PATH] [--quiet] [--offline] artifact

positional arguments:
  artifact              The artifact to create. Possible values are: charts

optional arguments:
  -h, --help            show this help message and exit
  --chart-spec-path CHART_SPEC_PATH
                        Path to a JSON file(s) containing all combinations of charts to generate. Wildcard patterns can be used to specify multiple files.
  --chart-type {time-series,bar}
                        Chart type to generate (default: time-series).
  --output-path OUTPUT_PATH
                        Output file name (default: stdout).
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).