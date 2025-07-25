---
layout: default
title: Sinks
parent: Pipelines
has_children: true
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/sinks/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/sinks/
---

# Sinks

Sinks define where Data Prepper writes your data to.

## General options for all sink types

The following table describes options you can use to configure the `sinks` sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
routes | No | List | List of routes that the sink accepts. If not specified, the sink accepts all upstream events.