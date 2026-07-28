---
layout: default
title: Bounded blocking
parent: Buffers
grand_parent: Pipelines
nav_order: 50
---

# Bounded blocking buffer

The `bounded_blocking` buffer is the default buffer and is memory based. The following table describes the `bounded_blocking` buffer parameters.

| Option | Required | Type | Description |
| --- | --- | --- | --- |
| buffer_size | No | Integer | The maximum number of records the buffer accepts. Default value is `12800`. |
| batch_size | No | Integer | The maximum number of records the buffer drains after each read. Default value is `200`. |

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->