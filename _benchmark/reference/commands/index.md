---
layout: default
title: Command reference
nav_order: 50
has_children: true
has_toc: false
parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/commands/index/
---

# OpenSearch Benchmark command reference

OpenSearch Benchmark supports the following commands:

- [aggregate]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/aggregate/)
- [compare]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/compare/)
- [download]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/download/)
- [execute-test]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/execute-test/)
- [generate-data]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/generate-data/)
- [info]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/info/)
- [list]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/list/)
- [redline-test]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/redline-test/)

## List of common options

All OpenSearch Benchmark commands support the following options:

- `--h` or `--help`: Provides options and other useful information about each command.
- `--quiet`: Hides as much of the results output as possible. Default is `false`.
- `--offline`: Indicates whether OpenSearch Benchmark has a connection to the internet. Default is `false`.

For more information about command options, see [Command flags]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/command-flags/).