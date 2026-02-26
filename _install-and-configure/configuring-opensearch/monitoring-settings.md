---
layout: default
title: Monitoring settings
parent: Configuring OpenSearch
nav_order: 75
---

# Monitoring settings

OpenSearch provides settings to monitor various aspects of cluster health and performance, including file system operations, JVM garbage collection, operating system metrics, and process statistics.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## File system health monitoring settings

OpenSearch supports the following file system health monitoring settings:

- `monitor.fs.health.enabled` (Dynamic, Boolean): Enables file system health monitoring to detect slow or unresponsive file system operations. Default is `true`.

- `monitor.fs.health.healthy_timeout_threshold` (Dynamic, time unit): The threshold for considering a file system operation as healthy. Operations taking longer are flagged as slow. Default is `60s`. Minimum enforced is `1ms`.

- `monitor.fs.health.slow_path_logging_threshold` (Dynamic, time unit): The threshold for logging slow file system path operations. Default is `5s`. Minimum enforced is `1ms`.

- `monitor.fs.health.refresh_interval` (Static, time unit): The refresh interval for file system health monitoring. Default is `60s`. Minimum is `1ms`.

- `monitor.fs.refresh_interval` (Static, time unit): The refresh interval for file system statistics monitoring. Default is `1s`. Minimum is `1s`.

## JVM monitoring settings

OpenSearch supports the following JVM monitoring settings:

- `monitor.jvm.gc.enabled` (Static, Boolean): Enables JVM garbage collection monitoring. Default is `true`.

- `monitor.jvm.gc.overhead.debug` (Static, integer): The GC overhead percentage threshold for debug logging. Default is `10`. Range is `0-100`.

- `monitor.jvm.gc.overhead.info` (Static, integer): The GC overhead percentage threshold for info logging. Default is `25`. Range is `0-100`.

- `monitor.jvm.gc.overhead.warn` (Static, integer): The GC overhead percentage threshold for warning logging. Default is `50`. Range is `0-100`.

- `monitor.jvm.gc.refresh_interval` (Static, time unit): The refresh interval for JVM GC monitoring. Default is `1s`. Minimum is `1s`.

- `monitor.jvm.refresh_interval` (Static, time unit): The refresh interval for JVM statistics monitoring. Default is `1s`. Minimum is `1s`.

## Operating system and process monitoring settings

OpenSearch supports the following operating system and process monitoring settings:

- `monitor.os.refresh_interval` (Static, time unit): The refresh interval for operating system statistics monitoring. Default is `1s`. Minimum is `1s`.

- `monitor.process.refresh_interval` (Static, time unit): The refresh interval for process statistics monitoring. Default is `1s`. Minimum is `1s`.
