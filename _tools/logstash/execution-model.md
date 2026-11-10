---
layout: default
title: Logstash execution model
parent: Logstash
nav_order: 210
redirect_from:
 - /clients/logstash/execution-model/
---

# Logstash execution model

Logstash receives events on input threads, queues them, and processes them in batches on pipeline worker threads. The number of workers and the size of each batch determine how many events Logstash processes in parallel and how quickly each event reaches its destination.

## Handling events concurrently

A Logstash pipeline can receive events from multiple inputs. Each input runs in its own thread so that inputs don't block each other. If two events arrive at the same time, Logstash receives both events concurrently.

After an input receives an event and applies its codec, if any, Logstash adds the event to a work queue. _Pipeline workers_, or _batchers_, retrieve events from the queue and run the filters, outputs, and output codecs. Each pipeline worker runs in its own thread, so Logstash processes multiple events simultaneously.

## Processing events in batches

A pipeline worker retrieves events from the work queue in batches. Batching improves throughput for the following reasons:

- Some processing must run once regardless of the number of events. Running it once for a batch of 100 events is more efficient than running it 100 times.
- Some output plugins send events in groups. For example, the OpenSearch output plugin sends each batch of events to OpenSearch in a single Bulk API request.

Two settings determine when a pipeline worker processes a batch: the maximum batch size and the batch delay. A worker processes a batch when the batch reaches the maximum size or when the batch delay has elapsed, whichever happens first. For example, if the maximum batch size is 50 and the batch delay is 100 ms, a worker processes a batch as soon as it contains 50 events or 100 ms after it starts collecting events.

The batch delay ensures that pipelines with a low volume of events process them without long delays. For example, if a pipeline sends web server error logs to OpenSearch, it might take a long time to collect 50 events. Because of the batch delay, the errors appear in OpenSearch Dashboards within milliseconds.

The default values work for most pipelines. Change them only if you need to tune pipeline performance.

## Pipeline workers and CPU cores

Pipeline workers can process events in parallel only if enough CPU cores are available. For example, if you run 5 workers on a server with 2 CPU cores, the workers compete for the cores. If you run 5 workers on a server with 10 CPU cores, half of the cores are not used for event processing.

By default, Logstash sets the number of pipeline workers to the number of CPU cores on the host. Because Logstash determines this number at startup, you don't need to configure Logstash separately for hosts with different numbers of cores, such as a development computer and a production server.

## Settings

The following table lists the settings that control pipeline workers and batching. Specify the settings in the `config/logstash.yml` file or pass them as command-line arguments when you start Logstash.

Setting | Command-line argument | Description
:--- | :--- | :---
`pipeline.workers` | `-w` | The number of pipeline workers. Default is the number of CPU cores on the host.
`pipeline.batch.size` | `-b` | The maximum number of events that a pipeline worker collects before processing them. Default is `125`.
`pipeline.batch.delay` | `-u` | The time, in milliseconds, that a pipeline worker waits for new events before processing a batch that has not reached the maximum size. Default is `50`.

For example, the following command starts Logstash with 4 pipeline workers and a maximum batch size of 250:

```bash
bin/logstash -f config/pipeline.conf -w 4 -b 250
```
{% include copy.html %}
