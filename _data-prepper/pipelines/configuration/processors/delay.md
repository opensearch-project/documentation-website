---
layout: default
title: Delay
parent: Processors
grand_parent: Pipelines
nav_order: 100
---

# Delay processor

This processor will add a delay into the processor chain. Typically, you should use this only for testing, experimenting, and debugging.

## Configuration

Option | Required | Type | Description
:--- | :--- | :--- | :---
`for` | No | Duration | The duration of time to delay. Defaults to `1s`.

## Usage

The following example shows using the `delay` processor to delay for 2 seconds.

```yaml
processor:
  - delay:
      for: 2s
```
