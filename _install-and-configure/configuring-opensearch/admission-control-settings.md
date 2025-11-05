---
layout: default
title: Admission control settings
parent: Configuring OpenSearch
nav_order: 105
---

# Admission control settings

OpenSearch provides admission control settings to help prevent cluster overload by limiting resource usage for different types of operations. Admission control monitors CPU and I/O usage and can reject requests when resource utilization exceeds configured thresholds.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Transport layer settings

OpenSearch supports the following transport layer admission control settings:

- `admission_control.transport.mode` (Dynamic, string): Controls the overall admission control mode for the transport layer. Valid values are:
  - `disabled` (default): Admission control is disabled.
  - `shadow`: Admission control runs in monitoring mode only, collecting metrics without rejecting requests.
  - `enforced`: Admission control actively rejects requests when thresholds are exceeded.

## CPU-based admission control settings

CPU-based admission control monitors CPU usage and applies limits to different types of operations. All CPU limits are specified as percentages (0-100).

OpenSearch supports the following dynamic CPU-based admission control settings:

- `admission_control.cluster.admin.cpu_usage.limit` (Dynamic, long): The CPU usage threshold for cluster administration operations. When CPU usage exceeds this limit, cluster admin requests may be rejected to preserve cluster stability. Default is `95`.

- `admission_control.search.cpu_usage.limit` (Dynamic, long): The CPU usage threshold for search operations. When CPU usage exceeds this limit, new search requests may be rejected to prevent cluster overload. Default is `95`.

- `admission_control.indexing.cpu_usage.limit` (Dynamic, long): The CPU usage threshold for indexing operations. When CPU usage exceeds this limit, indexing requests may be rejected to maintain cluster performance. Default is `95`.

- `admission_control.transport.cpu_usage.mode_override` (Dynamic, string): Overrides the global transport mode specifically for CPU-based admission control. Accepts the same values as `admission_control.transport.mode`: `disabled`, `shadow`, or `enforced`. If not specified, uses the global transport mode setting.

## I/O-based admission control settings

I/O-based admission control monitors disk I/O usage and applies limits to different types of operations. All I/O limits are specified as percentages (0--100).

OpenSearch supports the following I/O-based admission control settings:

- `admission_control.search.io_usage.limit` (Dynamic, long): The I/O usage threshold for search operations. When I/O usage exceeds this limit, search requests may be rejected. Default is `95`.

- `admission_control.indexing.io_usage.limit` (Dynamic, long): The I/O usage threshold for indexing operations. When I/O usage exceeds this limit, indexing requests may be rejected. Default is `95`.

- `admission_control.cluster_admin.io_usage.limit` (Static, long): The I/O usage threshold for cluster administration operations. This is a static setting that requires a cluster restart to modify. Default is `100`.

- `admission_control.transport.io_usage.mode_override` (Dynamic, string): Overrides the global transport mode specifically for I/O-based admission control. Accepts the same values as `admission_control.transport.mode`: `disabled`, `shadow`, or `enforced`. If not specified, uses the global transport mode setting.
