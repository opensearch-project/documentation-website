---
layout: default
title: Buffers
nav_order: 30
---

# Buffers

Buffers store data as it passes through the pipeline. If you implement a custom buffer, it can be memory-based (better performance) or disk-based (larger).


## bounded_blocking

The default buffer. Memory-based.

Option | Required | Type | Description
:--- | :--- | :--- | :---
buffer_size | No | Integer | The maximum number of records the buffer accepts. Default is 512.
batch_size | No | Integer | The maximum number of records the buffer drains after each read. Default is 8.