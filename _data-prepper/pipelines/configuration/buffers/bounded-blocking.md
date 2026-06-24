---
layout: default
title: Bounded blocking
parent: Buffers
grand_parent: Pipelines
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/buffers/bounded-blocking/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/buffers/bounded-blocking/
---

# Bounded blocking

## Overview

`Bounded blocking` is the default buffer and is memory based. The following table describes the `Bounded blocking` parameters.

| Option | Required | Type | Description |
| --- | --- | --- | --- |
| buffer_size | No | Integer | The maximum number of records the buffer accepts. Default value is `12800`. |
| batch_size | No | Integer | The maximum number of records the buffer drains after each read. Default value is `200`. |

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->