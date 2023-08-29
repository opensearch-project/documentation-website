---
layout: default
title: Sinks
parent: Pipelines
has_children: true
nav_order: 30
---

# Sinks

Sinks define where Data Prepper writes your data to.

## General options for all sink types

The following table describes options you can use to configure the `sinks` sink.

Option | Required | Type        | Description
:--- | :--- |:------------| :---
routes | No | String list | A list of routes for which this sink applies. If not provided, this sink receives all events. See [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional-routing) for more information.
tags_target_key | No | String   | When specified, includes event tags in the output of the provided key.
include_keys | No | String list | When specified, provides the keys in this list in the data sent to the sink. Some codecs and sinks do not allow use of this field. 
exclude_keys | No | String list | When specified, excludes the keys given from the data sent to the sink. Some codecs and sinks do not allow use of this field.
