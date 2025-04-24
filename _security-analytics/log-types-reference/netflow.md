---
layout: default
title: NetFlow
parent: Supported log types
nav_order: 60
canonical_url: https://docs.opensearch.org/docs/latest/security-analytics/log-types-reference/netflow/
---

# NetFlow

The `netflow` log type records NetFlow events used during integration testing.

The following code snippet contains all the `raw_field` and `ecs` mappings for this log type:

```json
"mappings": [
    {
      "raw_field":"netflow.source_ipv4_address",
      "ecs":"source.ip"
    },
    {
      "raw_field":"netflow.source_transport_port",
      "ecs":"source.port"
    },
    {
      "raw_field":"netflow.destination_ipv4_address",
      "ecs":"destination.ip"
    },
    {
      "raw_field":"netflow.destination_transport_port",
      "ecs":"destination.port"
    },
    {
      "raw_field":"http.request.method",
      "ecs":"http.request.method"
    },
    {
      "raw_field":"http.response.status_code",
      "ecs":"http.response.status_code"
    },
    {
      "raw_field":"timestamp",
      "ecs":"timestamp"
    }
  ]
```