---
layout: default
title: Logstash execution model
parent: Logstash
nav_order: 210
redirect_from:
 - /clients/logstash/execution-model/
---

# Logstash execution model

Here's a brief introduction to how Logstash processes events internally.

## Handling events concurrently

You can configure Logstash to have a number of inputs listening for events. Each input runs in its own thread to avoid inputs blocking each other. If you have two incoming events at the same time, Logstash handles both events concurrently.

After receiving an event and possibly applying an input codec, Logstash sends the event to a work queue. Pipeline workers or batchers perform the rest of the work involving filters and outputs along with any codec used at the output. Each pipeline worker also runs within its own thread meaning that Logstash processes multiple events simultaneously.

## Processing events in batches

A pipeline worker consumes events from the work queue in batches to optimize the throughput of the pipeline as a whole.

One reason why Logstash works in batches is that some code needs to be executed regardless of how many events are processed at a time within the pipeline worker. Instead of executing that code 100 times for 100 events, it’s more efficient to run it once for a batch of 100 events.

Another reason is that a few output plugins group together events as batches. For example, if you send 100 requests to OpenSearch, the OpenSearch output plugin uses the bulk API to send a single request that groups together the 100 requests.

Logstash determines the batch size by two configuration options⁠---a number representing the maximum batch size and the batch delay. The batch delay is how long Logstash waits before processing the unprocessed batch of events.
If you set the maximum batch size to 50 and the batch delay to 100 ms, Logstash processes a batch if they're either 50 unprocessed events in the work queue or if one hundred milliseconds have elapsed.

The reason that a batch is processed, even if the maximum batch size isn’t reached, is to reduce the delay in processing and to continue to process events in a timely manner. This works well for pipelines that process a low volume of events.

Imagine that you’ve a pipeline that processes error logs from web servers and pushes them to OpenSearch. You’re using OpenSearch Dashboards to analyze the error logs. Because you’re possibly dealing with a fairly low number of events, it might take a long time to reach 50 events. Logstash processes the events before reaching this threshold because otherwise there would be a long delay before we see the errors appear in OpenSearch Dashboards.

The default batch size and batch delay work for most cases. You don’t need to change the default values unless you need to minutely optimize the performance.

## Optimizing based on CPU cores

The number of pipeline workers are proportional to the number of CPU cores on the nodes.
If you have 5 workers running on a server with 2 CPU cores, the 5 workers won't be able to process events concurrently. On the other hand, running 5 workers on a server running 10 CPU cores limits the throughput of a Logstash instance.

Instead of running a fixed number of workers, which results in poor performance in some cases, Logstash examines the number of CPU cores of the instance and selects the number of pipeline workers to optimize its performance for the platform on which its running. For instance, your local development machine might not have the same processing power as a production server. So you don't need to manually configure Logstash for different machines.
