---
layout: default
title: Target throughput
nav_order: 150
---

# Target throughput

Target throughput is key to understanding the OpenSearch Benchmark definition of **latency**. Target throughput is the rate at which OpenSearch Benchmark issues requests, assuming that responses will be returned instantaneously. `target-throughput` is one of the common workload parameters that can be set for each test and is measured in operations per second.

There are two types of testing modes when using OpenSearch Benchmark, both of which are related to throughput, latency, and service time:

- [Benchmarking mode](#benchmarking-mode): Latency is measured the same as service time.
- [Throughput-throttled mode](#throughput-throttled-mode): Latency is service-time plus the time a request spends waiting in the queue.

## Benchmarking mode

When you do not specify a `target-throughput`, OpenSearch Benchmark latency tests are performed in **Benchmarking mode**. In **Benchmarking mode**, the OpenSearch client sends requests to the OpenSearch cluster as fast as possible. After the cluster it receives a response from the prior request sent, Benchmark sends the next request immediately to the OpenSearch client without waiting. In this testing mode, latency is identical to service time.

## Throughput-throttled mode

**Throughput** measures the rate at which OpenSearch Benchmark issues requests, assuming that responses will be returned instantaneously. However, users can set a `target-throughput` is one of the common workload parameters that can be set for each test and is measured in operations per second.

OpenSearch Benchmark always issues one request at a time for a single client thread, specified as `search-clients` in the workload parameters. If `target-throughput` is set to `0`, OpenSearch Benchmark issues a request immediately after it receives the response from the previous request. If the `target-throughput` is not set to `0`, OpenSearch Benchmark issues the next request to match the `target-throughput`, assuming that responses are returned instantaneously.

When you want to simulate the type traffic you might encounter when deploying a production cluster, set the `target-throughput` in your benchmark test to match to the rate of requests you think the production cluster might receive. The following examples illustrate how the set `target-throughput` affects the latency measurement.


### Example A

The following diagrams illustrate how latency is calculated with an expected request response time of 200ms and the following settings: 

- `search-clients` is set to `1`. 
- `target-throughput` is set to `1` operation per second.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-1.png" alt="">

When a request takes longer than 200ms, such as when a request takes 1110ms instead of 400ms, OpenSearch Benchmark sends the next request that was supposed to occur at 4.00s based on the `target-throughput` at 4.10s. All subsequent requests after the 4.10s request attempt to resynchronize with the `target-throughput` setting.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-2.png" alt="">

When measuring the overall latency, OpenSearch Benchmark includes all performed requests. All requests have a latency of 200ms, except for the following two requests:

- The request that lasted 1100ms. 
- The subsequent request that was supposed to start at 4:00s. This request was delayed by 100ms, denoted by the orange area in the following diagram, and had a response time of 200ms. When calculating the latency for this request, OpenSearch Benchmark will account for the delayed start time and combine it with the response time. Thus, the latency for this request is **300ms**.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-3.png" alt="">

### Example B

In this example, OpenSearch Benchmark assumes a latency of 200ms and uses the following latency settings:

- `search_clients` is set to `1`.
- `target-throughput` is set to `10` operations per second.

The following diagram shows the schedule built by OpenSearch Benchmark with the expected response times.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/b-latency-explanation-1.png" alt="">

However, if the assumption is that all responses will take 200ms, 10 operations per second won't be possible. Therefore, the highest throughput OpenSearch Benchmark can reach is 5 operations per second, as shown in the following diagram.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/b-latency-explanation-2.png" alt="">

OpenSearch Benchmark does not account for this and continues to try to achieve the `target-throughput` of 10 operations per second. Because of this, delays for each request begin to cascade, as illustrated in the following diagram.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/b-latency-explanation-3.png" alt="">

Combining the service time with the delay for each operation provides the following latency measurements for each operation: 

- 200 ms for operation 1
- 300 ms for operation 2
- 400 ms for operation 3
- 500 ms for operation 4 
- 600 ms for operation 5

This latency cascade continues, increasing latency by 100ms for each subsequent request.

### Recommendation

As shown by the preceding examples, you should be aware of the average service time of each task and provide a `target-throughput` that accounts for the service time. The OpenSearch Benchmark latency is calculated based on the `target-throughput` set by the user, that is, the latency could be redefined as "throughput-based latency."


