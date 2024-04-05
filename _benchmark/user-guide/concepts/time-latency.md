---
layout: default
title: Throughput, latency, and service time
nav_order: 10
parent: Concepts
grand_parent: User Guide
---

# Throughput, latency, and service time

At the end of each test, OpenSearch Benchmark produces a table that summarizes the following: 

- [Took time](#took-time)
- [Service time](#service-time) 
- Throughput
- [Latency](#latency)
- [Processing time]
- The error rate for each completed task or OpenSearch operation.

The following diagram illustrates how each component of the table is measured during the life cycle of a request from an OpenSearch cluster to the OpenSearch client:

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/concepts-diagram.png" alt="">

## Differences between OpenSearch Benchmark and a traditional client-server system

While the definition for _throughput_ remains consistent with other client-server systems, the definitions for `service time` and `latency` differ from most client-server systems in the context of OpenSearch Benchmark. The following table compares the OpenSearch Benchmark definition of service time and latency versus the common definitions for a client-server system.

| Metric | Common definition | **OpenSearch Benchmark definition**	|
| :--- | :--- |:--- |
| **Throughput** | The number of operations completed in a given period of time.	| The number of operations completed in a given period of time. |
| **Service time**	| The amount of time that the server takes to process a request, from the point it receives the request to the point the response is returned. </br></br> It includes the time spent waiting in server-side queues but _excludes_ network latency, load balancer overhead, and deserialization/serialization. | The amount of time that it takes for `opensearch-py` to send a request and receive a response from the OpenSearch cluster. </br> </br> It includes the amount of time that it takes for the server to process a request and also _includes_ network latency, load balancer overhead, and deserialization/serialization.  |
| **Latency** | The total amount of time, including the service time and the amount of time that the request waited before responding. | Based on the `target-throughput` set by the user, the total amount of time that the request waited before receiving the response, in addition to any other delays that occured before the request is sent. |

For more information about service time and latency in OpenSearch Benchmark, see the [Service time](#service-time) and [Latency](#latency) sections.

## Took time

**Took time** measures the amount of time the cluster spends processing a request on the server-side. The does not include the time it took for the request to reach the cluster from the client, or the time it took for the response to get back from the client to the cluster.

## Service time

OpenSearch Benchmark does not have insight into how long OpenSearch takes to process a request, apart from extracting the [took time](#took-time) time for the request. In OpenSearch, **service time** tracks the amount of time between when OpenSearch issues a request and receives a response.

OpenSearch Benchmark makes function calls to `opensearch-py` to communicate with an OpenSearch cluster. OpenSearch Benchmark tracks the amount of time between when the `opensearch-py` client sends a request and receives a response from the OpenSearch cluster and considers this to be the service time. Unlike the traditional definition of service time, the OpenSearch Benchmark definition of service time includes overhead, such as network latency, load balancer overhead, or deserialization/serialization. The following image highlights the differences between the traditional definition of service time and the OpenSearch Benchmark definition of service time.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/service-time.png" alt="">

## Latency

There are two types of testing modes when using OpenSearch Benchmark, which affects the definition of latency:

- [Benchmarking mode](#benchmarking-mode): Latency is measured the same as service time.
- [Throughput-throttled mode](#throughput-throttled-mode): Latency is service-time plus the time a request spends waiting in the queue.

### Throughput-throttled mode


Target throughput is key to understanding the OpenSearch Benchmark definition of **latency**. Target throughput is the rate at which OpenSearch Benchmark issues requests, assuming that responses will be returned instantaneously. `target-throughput` is one of the common workload parameters that can be set for each test and is measured in operations per second. 

OpenSearch Benchmark always issues one request at a time for a single client thread, specified as `search-clients` in the workload parameters. If `target-throughput` is set to `0`, OpenSearch Benchmark issues a request immediately after it receives the response from the previous request. If the `target-throughput` is not set to `0`, OpenSearch Benchmark issues the next request to match the `target-throughput`, assuming that responses are returned instantaneously.

When you want to simulate the type traffic you might encounter when deploying a production cluster, set the `target-throughput` in your benchmark test to match to the rate of requests you think the production cluster might receive.


#### Example A

The following diagrams illustrate how latency is calculated with an expected request response time of 200ms and the following settings: 

- `search-clients` is set to `1`. 
- `target-throughput` is set to `1` operation per second.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-1.png" alt="">

When a request takes longer than 200ms, such as when a request takes 1110ms instead of 400ms, OpenSearch Benchmark sends the next request that was supposed to occur at 4.00s based on the `target-throughput` at 4.10s. All subsequent requests after the 4.10s request attempt to resynchronize with the `target-throughput` setting.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-2.png" alt="">

When measuring the overall latency, OpenSearch Benchmark includes all performed requests. All requests have a latency of 200ms, except for the following two requests:

- The request that lasted 1100ms. 
- The subsquent request that was supposed to start at 4:00s. This request was delayed by 100ms, denoted by the orange area in the following diagram, and had a response time of 200ms. When calculating the latency for this request, OpenSearch Benchmark will account for the delayed start time and combine it with the response time. Thus, the latency for this request is **300ms**.

<img src="{{site.url}}{{site.baseurl}}/images/benchmark/latency-explanation-3.png" alt="">

#### Example B

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

#### Recommendation

As shown by the preceding examples, you should be aware of the average service time of each task and provide a `target-throughput` that accounts for the service time. The OpenSearch Benchmark latency is calculated based on the `target-throughput` set by the user, that is, the latency could be redefined as "throughput-based latency."

### Benchmarking mode

When you do not specify a `target-throughput`, OpenSearch Benchmark latency tests are performed in **Benchmarking mode**. In **Benchmarking mode**, the OpenSearch client sends requests to the OpenSearch cluster as fast as possible. After the cluster it receives a response from the prior request sent, Benchmark sends the next request immediately to the OpenSearch client without waiting. In this testing mode, latency is identical to service time.

## Processing time

**Processing time** accounts for any extra overhead tasks that OpenSearch Benchmark performs during the life cycle of a request, such as setting up a request context manager and calling a method to pass the request off to the OpenSearch client. This is in contrast to **service time**, which only accounts for the different from when a request was sent and when the response is received by the OpenSearch client.