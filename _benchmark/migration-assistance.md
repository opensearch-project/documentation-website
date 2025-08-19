---
layout: default
title: Migration Assistance
nav_order: 102
---

# Migrating from 1.X to 2.X

For users who already have systems that integrate with OpenSearch Benchmark, we recommend performing the following steps for a smooth transition to OpenSearch Benchmark 2.0.

## Update Benchmark.ini
OpenSearch Benchmark relies on `benchmark.ini`, which by default can be found in `~/.benchmark` directory. This configuration file provides configurations related to where metrics are reported, how workloads are fetched, and much more. OpenSearch Benchmark `2.0` renames `[results_publishing]` to `[reporting]`.

Here is an example of what that should look like:
```ini
[reporting]
datastore.type = in-memory
datastore.host = <host-url>
datastore.port = <host-port>
datastore.secure = False
datastore.ssl.verification_mode = <ssl-verification-details>
datastore.user = <username>
datastore.password = <password>
...
```

For information about how to configure OpenSearch Benchmark, see [Configuring OpenSearch Benchmark]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/).

## Update External Metrics Datastore

Many users use an external metrics datastore to store results and metrics from previous test runs.

OpenSearch Benchmark `1.X` stored test details in indexes with the `benchmark-test-executions-*` index pattern. However, in `2.X`, it stores them in indexes with the `benchmark-test-runs-*` index patttern. We recommend adding this new index pattern in your metrics datastore as well as updating dashboards that might be using the old index pattern still.

Old Index Pattern | New Index Pattern |
:--- | :--- |
benchmark-test-executions-* | benchmark-test-runs-* |

If you encounter any issues with migrating OpenSearch Benchmark from `1.X` to `2.X`, please reach out to the OpenSearch Benchmark maintainers through any of the following ways:
- [Posting a question in the OpenSearch Benchmark Slack community](https://opensearch.slack.com/archives/C082PLA3VPW)
- [Attending the Community, Triage, and Office Hours](https://www.meetup.com/opensearch/events/309982456/?eventOrigin=group_upcoming_events)
- [Open up an issue on our Github repository](https://github.com/opensearch-project/opensearch-benchmark/issues)
## Update Scripts

Some users wrap OpenSearch Benchmark with custom scripts to run nightly performance runs. These scripts might be relying on some terminologies that have been deprecated in `2.X`.

**Please see the following terms and adjust your scripts accordingly.**

1.X Term | 2.X Term |
:--- | :--- |
execute-test, test-execution-id, TestExecution | run, test-run, TestRun |
results_publishing, results_publisher | reporting, publisher |
provision-configs, provision-config-instances | cluster-configs, cluster-config-instances
load-worker-coordinator-hosts | worker-ips |

If you encounter any issues with migrating OpenSearch Benchmark from `1.X` to `2.X`, please reach out to the OpenSearch Benchmark maintainers through any of the following ways:
- [Posting a question in the OpenSearch Benchmark Slack community](https://opensearch.slack.com/archives/C082PLA3VPW)
- [Attending the Community, Triage, and Office Hours](https://www.meetup.com/opensearch/events/309982456/?eventOrigin=group_upcoming_events)
- [Open up an issue on our Github repository](https://github.com/opensearch-project/opensearch-benchmark/issues)