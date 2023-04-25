---
layout: default
title: start
nav_order: 66
has_children: false
---

# start

usage: opensearch-benchmark start [-h] --installation-id INSTALLATION_ID --test-execution-id TEST_EXECUTION_ID [--runtime-jdk RUNTIME_JDK] [--telemetry TELEMETRY] [--telemetry-params TELEMETRY_PARAMS] [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --installation-id INSTALLATION_ID
                        The id of the installation to start
  --test-execution-id TEST_EXECUTION_ID
                        Define a unique id for this test_execution.
  --runtime-jdk RUNTIME_JDK
                        The major version of the runtime JDK to use.
  --telemetry TELEMETRY
                        Enable the provided telemetry devices, provided as a comma-separated list. List possible telemetry devices with `opensearch-benchmark list telemetry`.
  --telemetry-params TELEMETRY_PARAMS
                        Define a comma-separated list of key:value pairs that are injected verbatim to the telemetry devices as parameters.
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).