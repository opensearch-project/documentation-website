---
layout: default
title: create-workload
nav_order: 56
has_children: false
---

# create-workload

usage: opensearch-benchmark create-workload [-h] --workload WORKLOAD --indices INDICES --target-hosts TARGET_HOSTS [--client-options CLIENT_OPTIONS] [--output-path OUTPUT_PATH] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --workload WORKLOAD   Name of the generated workload
  --indices INDICES     Comma-separated list of indices to include in the workload
  --target-hosts TARGET_HOSTS
                        Comma-separated list of host:port pairs which should be targeted
  --client-options CLIENT_OPTIONS
                        Comma-separated list of client options to use. (default: timeout:60)
  --output-path OUTPUT_PATH
                        Workload output directory (default: workloads/)
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).