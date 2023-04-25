---
layout: default
title: stop
nav_order: 68
has_children: false
---

# stop

usage: opensearch-benchmark stop [-h] --installation-id INSTALLATION_ID [--preserve-install] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --installation-id INSTALLATION_ID
                        The id of the installation to stop
  --preserve-install    Keep the benchmark candidate and its index. (default: false).
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).