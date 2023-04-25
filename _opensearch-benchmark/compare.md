---
layout: default
title: compare
nav_order: 60
has_children: false
---

# compare

usage: opensearch-benchmark compare [-h] --baseline BASELINE --contender CONTENDER [--results-format {markdown,csv}] [--results-numbers-align {right,center,left,decimal}] [--results-file RESULTS_FILE] [--show-in-results SHOW_IN_RESULTS]
                                    [--quiet] [--offline]

optional arguments:
  -h, --help            show this help message and exit
  --baseline BASELINE   TestExecution ID of the baseline (see opensearch-benchmark list test_executions).
  --contender CONTENDER
                        TestExecution ID of the contender (see opensearch-benchmark list test_executions).
  --results-format {markdown,csv}
                        Define the output format for the command line results (default: markdown).
  --results-numbers-align {right,center,left,decimal}
                        Define the output column number alignment for the command line results (default: right).
  --results-file RESULTS_FILE
                        Write the command line results also to the provided file.
  --show-in-results SHOW_IN_RESULTS
                        Whether to include the comparison in the results file.
  --quiet               Suppress as much as output as possible (default: false).
  --offline             Assume that Benchmark has no connection to the Internet (default: false).