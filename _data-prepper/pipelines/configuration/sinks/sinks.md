---
layout: default
title: Sinks
parent: Pipelines
has_children: true
nav_order: 25
canonical_url: https://docs.opensearch.org/docs/latest/data-prepper/pipelines/configuration/sinks/sinks/
---

# Sinks

A `sink` is an output component that specifies the destination(s) to which an OpenSearch Data Prepper pipeline publishes events. Sink destinations can be services like OpenSearch, Amazon Simple Storage Service (Amazon S3), or even another Data Prepper pipeline, enabling chaining of multiple pipelines. The sink component has the following configurable options that you can use to customize the destination type.

## Configuration options

The following table describes options you can use to configure the `sinks` sink.

Option | Required | Type        | Description
:--- | :--- |:------------| :---
`routes` | No | String list | A list of routes to which the sink applies. If not provided, then the sink receives all events. See [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional-routing) for more information.
`tags_target_key` | No | String   | When specified, includes event tags in the output under the provided key.
`include_keys` | No | String list | When specified, provides only the listed keys in the data sent to the sink. Some codecs and sinks may not support this field. 
`exclude_keys` | No | String list | When specified, excludes the listed keys from the data sent to the sink. Some codecs and sinks may not support this field.


