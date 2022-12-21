---
layout: default
title: Sinks
has_children: true
nav_order: 44
---

# Sinks

Sinks define where Data Prepper writes your data to.

## General options for all sink types

Option | Required | Type | Description
:--- | :--- | :--- | :---
routes | No | List | List of routes that the sink accepts. If not specified, the sink accepts all upstream events.