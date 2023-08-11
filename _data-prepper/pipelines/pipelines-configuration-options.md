---
layout: default
title: Pipeline options
parent: Pipelines
nav_order: 11
---

# Pipeline options

This page provides information about pipeline configuration options in Data Prepper. 

## General pipeline options

Option | Required | Type | Description
:--- | :--- | :--- | :---
workers | No | Integer | Essentially the number of application threads. As a starting point for your use case, try setting this value to the number of CPU cores on the machine. Default is 1.
delay | No | Integer | Amount of time in milliseconds workers wait between buffer read attempts. Default is 3,000.


## General sink options

The following options are available for all sinks.

Option | Required | Type        | Description
:--- | :--- |:------------| :---
routes | No | String list | A list of routes for which this sink applies. If not provided, this sink receives all events. See [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional_routing) for more information.
tags_target_key | No | String      | If supplied, then the event tags will be included in the output in the provided key.
include_keys | No | String list | If specified, only the keys provided in this list will be included in the data sent to the sink.
exclude_keys | No | String list | If specified, the following keys will be excluded from the data sent to the sink.

