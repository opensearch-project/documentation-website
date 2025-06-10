---
layout: default
title: redline-test
nav_order: 85
parent: Command reference
grand_parent: OpenSearch Benchmark Reference
---

# Redline testing

The `--redline-test` command enables OpenSearch Benchmark to automatically determine the maximum request throughput your OpenSearch cluster can handle under increasing load. It dynamically adjusts the number of active clients based on real-time cluster performance, helping with capacity planning and identifying performance regressions.

When the `--redline-test` flag is used, OpenSearch Benchmark performs the following steps:

1. **Client initialization**: OpenSearch Benchmark initializes a large number of clients (default: 1,000). You can override this with `--redline-test=<int>`.
2. **Feedback mechanism**: OpenSearch Benchmark ramps up the number of active clients. A FeedbackActor monitors real-time request failures and adjusts the client count accordingly.
3. **Shared state coordination**: OpenSearch Benchmark uses Python's multiprocessing library to manage shared dictionaries and queues for inter-process communication:
   - **Workers** create and share client state maps with the WorkerCoordinatorActor.
   - The **WorkerCoordinatorActor** aggregates client state and forwards it to the FeedbackActor.
   - The **FeedbackActor** increases the number of clients until it detects request errors, then pauses clients, waits 30 seconds, and resumes testing.
  
The following images provides a visual overview of the redline testing architecture.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/osb-actor-system.png" alt="Redline Overview" width="600">


## Usage

To perform a redline test, use the `execute-test` command with the `--redline-test` flag and a timed test procedure.

This test procedure defines a timed workload using the keyword-terms operation. It runs in two phases:

- **Warmup phase**: The test begins with a warmup period (`warmup-time-period`) to stabilize performance metrics before measurement begins. This helps avoid skewing results with cold-start effects.
- **Measurement phase**: During the `time-period`, OpenSearch Benchmark sends requests at a `target-throughput` (requests per second) using a specified number of clients. The redline test logic will scale the number of active clients from this baseline to determine the cluster's maximum sustainable load.

The following example timed test procedure is used as input to a redline test, which then dynamically adjusts the client load to find the maximum request throughput your cluster can handle without errors:

```json
{
  "name": "timed-mode-test-procedure",
  "schedule": [
    {
       "operation": "keyword-terms",
       "warmup-time-period": {% raw %}{{ warmup_time | default(300) | tojson }}{% endraw %},
       "time-period": {% raw %}{{ time_period | default(900) | tojson }}{% endraw %},
       "target-throughput": {% raw %}{{ target_throughput | default(20) | tojson }}{% endraw %},
       "clients": {% raw %}{{ search_clients | default(20) }}{% endraw %}
    }
  ]
}
```
{% include copy.html %}

Run the following command to start a redline test using a timed test procedure against your OpenSearch cluster:

```bash
opensearch-benchmark execute-test \
  --pipeline=benchmark-only \
  --target-hosts=<your-opensearch-cluster> \
  --workload=<workload> \
  --test-procedure=timed-mode-test-procedure \
  --redline-test
```
{% include copy.html %}

## Results

During a redline test, OpenSearch Benchmark provides detailed logs with scaling decisions and request failures during the test. At the end of a redline test, OpenSearch Benchmark logs the maximum number of clients that your cluster supported without request errors.

The following example log output indicates that the redline test detected a `15%` error rate for the keyword-terms operation and determined that the cluster's maximum stable client load before errors occurred was `410`:

```
[WARNING] Error rate is 15.0 for operation 'keyword-terms'. Please check the logs.
Redline test finished. Maximum stable client number reached: 410
```

## Configuration tips and test behavior

Use the following options and behaviors to better understand and customize redline test execution:

- `--redline-scale-step`: Specifies the number of clients to unpause in each scaling iteration.
- `--redline-scaledown-percentage`: Specifies the percentage of clients to pause when an error occurs.
- `--redline-post-scaledown-sleep`: Specifies the number of seconds the feedback actor waits before initiating a scale-up after scaling down.
- `--redline-max-clients`: Specifies the maximum number of clients allowed during redline testing. If unset, OpenSearch Benchmark defaults to the number of clients defined in the test procedure.