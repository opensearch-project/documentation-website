---
layout: default
title: Error handling
nav_order: 12
---

In Data Prepper pipeline, errors should be handled by implementation of plugin components and should not throw any unexpected runtime exceptions. If thrown, the pipeline stops immediately or halts eventually based on the component that throws the exception.

Below are two different error scenarios.

# Single pipeline
Single pipeline is a pipeline that doesn't use the pipeline connectors.

* If an exception encountered when creating a pipeline, the pipeline stops and exits using `system.exit(1)`. 
* If an exception encountered during pipeline `start()` method, the pipeline stops with appropriate logs. 
* If an exception encountered in Pipeline `processors` or `sinks` during runtime, the pipeline stops with appropriate logs.

# Connected pipelines

Connected pipelines is scenario where two or more pipelines connected using the pipeline connector.

* If an exception encountered when creating any of the connected pipelines, all the connected pipelines stop and exits using `system.exit(1)`. 
* If an exception encountered during pipeline `start()` method in any of the connected pipelines, the pipeline that encountered the exception will shutdown and other pipelines will run but not receive or process any data as a connected pipeline is unavailable.
* If an exception encountered in Pipeline `processors` or `sinks` during runtime in any of the connected pipelines, the pipeline that encountered the exception will shutdown and other pipelines will run for a while and shutdown as a connected pipeline is unavailable.

