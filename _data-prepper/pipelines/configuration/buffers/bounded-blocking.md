---
layout: default
title: Bounded blocking
parent: Buffers
grand_parent: Pipelines
nav_order: 50
---

# Bounded blocking

## Overview

The default buffer. Memory-based.

Option | Required | Type | Description
:--- | :--- | :--- | :---
buffer_size | No | Integer | The maximum number of records the buffer accepts. Default value is `512`.
batch_size | No | Integer | The maximum number of records the buffer drains after each read. Default value is `8`.

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->