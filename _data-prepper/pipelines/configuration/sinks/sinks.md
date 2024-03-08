---
layout: default
title: Sinks
parent: Pipelines
has_children: true
nav_order: 6
---

# Sinks

The `sink` is the output component that specifies the destination(s) where a Data Prepper pipeline publishes events. Sink destinations can be services like OpenSearch or Amazon S3, or even another Data Prepper pipeline, enabling chaining of multiple pipelines based on data needs. The sink component has the following configureable options to tailor the destination type. 

## Configuration options

Option | Required | Type        | Description
:--- | :--- |:------------| :---
`routes` | No | String list | A list of routes for which the sink applies. If not provided, the sink receives all events. See [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional-routing) for more details.
`tags_target_key` | No | String   | When specified, includes event tags in the output under the provided key.
`include_keys` | No | String list | When specified, provides only the listed keys in the data sent to the sink. Some codecs and sinks may not support this field. 
`exclude_keys` | No | String list | When specified, excludes the listed keys from the data sent to the sink. Some codecs and sinks may not support this field.

## Next steps

- Learn more about the sink types listed under the Related Articles section.
