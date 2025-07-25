---
layout: default
title: Pipelines
has_children: true
nav_order: 10
redirect_from:
  - /data-prepper/pipelines/
  - /clients/data-prepper/pipelines/
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/pipelines/
---

# Pipelines

Pipelines are critical components that streamline the process of acquiring, transforming, and loading data from various sources into a centralized data repository or processing system. The following diagram illustrates how Data Prepper ingests data into OpenSearch.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper-pipeline.png" alt="Data Prepper pipeline">{: .img-fluid}

## Configuring Data Prepper pipelines

Pipelines are defined in the configuration YAML file. Starting with Data Prepper 2.0, you can define pipelines across multiple YAML configuration files, with each file containing the configuration for one or more pipelines. This gives you flexibility to organize and chain together complex pipeline configurations. To ensure proper loading of your pipeline configurations, place the YAML configuration files in the `pipelines` folder in your application's home directory, for example, `/usr/share/data-prepper`.

The following is an example configuration:

```yml
simple-sample-pipeline:
  workers: 2 # the number of workers
  delay: 5000 # in milliseconds, how long workers wait between read attempts
  source:
    random:
  buffer:
    bounded_blocking:
      buffer_size: 1024 # max number of records the buffer accepts
      batch_size: 256 # max number of records the buffer drains after each read
  processor:
    - string_converter:
        upper_case: true
  sink:
    - stdout:
```
{% include copy-curl.html %}

### Pipeline components

The following table describes the components used in the given pipeline.

Option | Required | Type        | Description
:--- | :--- |:------------| :---
`workers` | No | Integer | The number of application threads. Set to the number of CPU cores. Default is `1`. 
`delay` | No | Integer | The number of milliseconds that `workers` wait between buffer read attempts. Default is `3000`.
`source` | Yes | String list | `random` generates random numbers by using a Universally Unique Identifier (UUID) generator. 
`bounded_blocking` | No | String list | The default buffer in Data Prepper.
`processor` | No | String list | A `string_converter` with an `upper_case` processor that converts strings to uppercase.
`sink` | Yes | `stdout` outputs to standard output. 	

## Pipeline concepts

The following are fundamental concepts relating to Data Prepper pipelines.

### End-to-end acknowledgments

Data Prepper ensures reliable and durable data delivery from sources to sinks through end-to-end (E2E) acknowledgments. The E2E acknowledgment process begins at the source, which monitors event batches within pipelines and waits for a positive acknowledgment upon successful delivery to the sinks. In pipelines with multiple sinks, including nested Data Prepper pipelines, the E2E acknowledgment is sent when events reach the final sink in the pipeline chain. Conversely, the source sends a negative acknowledgment if an event cannot be delivered to a sink for any reason.

If a pipeline component fails to process and send an event, then the source receives no acknowledgment. In the case of a failure, the pipeline's source times out, allowing you to take necessary actions, such as rerunning the pipeline or logging the failure.

### Conditional routing

Pipelines also support conditional routing, which enables the routing of events to different sinks based on specific conditions. To add conditional routing, specify a list of named routes using the `route` component and assign specific routes to sinks using the `routes` property. Any sink with the `routes` property will only accept events matching at least one of the routing conditions.

In the following example pipeline, `application-logs` is a named route with a condition set to `/log_type == "application"`. The route uses [Data Prepper expressions](https://github.com/opensearch-project/data-prepper/tree/main/examples) to define the condition. Data Prepper routes events satisfying this condition to the first OpenSearch sink. By default, Data Prepper routes all events to sinks without a defined route, as shown in the third OpenSearch sink of the given pipeline:

```yml
conditional-routing-sample-pipeline:
  source:
    http:
  processor:
  route:
    - application-logs: '/log_type == "application"'
    - http-logs: '/log_type == "apache"'
  sink:
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index: application_logs
        routes: [application-logs]
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index: http_logs
        routes: [http-logs]
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index: all_logs
```
{% include copy-curl.html %}

## Next steps

- See [Common uses cases]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/common-use-cases/) for example configurations.
