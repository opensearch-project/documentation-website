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
delay | No | Integer | Amount of time in milliseconds workers wait between buffer read attempts. Default is `3000`.


## General sink options

The following options are available for all sinks.

Option | Required | Type        | Description
:--- | :--- |:------------| :---
routes | No | String list | A list of routes for which this sink applies. If not provided, this sink receives all events. See [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional-routing) for more information.
tags_target_key | No | String   | When specified, includes event tags in the output of the provided key.
include_keys | No | String list | When specified, provides the keys in this list in the data sent to the sink.
exclude_keys | No | String list | When specified, excludes the keys given from the data sent to the sink.

