---
layout: default
title: Plugin settings
parent: Configuring OpenSearch
nav_order: 50
---

# Plugin settings

The following settings are related to OpenSearch plugins.

## Security analytics settings

The Security Analytics plugin supports the following settings:

- `plugins.security_analytics.enable_workflow_usage` (Boolean): Supports Alerting plugin workflow integration with Security Analytics. Determines whether composite monitor workflows are generated for the Alerting plugin after creating a new threat detector in Security Analytics. By default, the setting is `true`. 

    When set to `true`, composite monitor workflows based on an associated threat detector's configuration are enabled. When set to `false`, composite monitor workflows based on an associated threat detector's configuration are disabled. 
    
    For more information about Alerting plugin workflow integration with Security Analytics, see [Integrated Alerting plugin workflows]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/#integrated-alerting-plugin-workflows). 

## Snapshot settings

The following table describes snapshot settings.

| Setting | Data type | Description |
| :--- | :--- | :--- |
| `snapshot.max_concurrent_operations` | Integer | The maximum number of concurrent snapshot operations. Default is `1000`. |
| `slm.health.failed_snapshot_warn_threshold` | String | The number of failed invocations since the last successful snapshot that will indicate a problem as per the health API profile. Default is five repeated failures: `5L`. |

## Machine learning settings

The following table describes machine learning settings.

| Setting | Data type | Description |
| :--- | :--- | :--- |
| `breaker.model_inference.limit` | String | The limit for the trained model circuit breaker. Default is `50%` of the JVM heap. |
|` breaker.model_inference.overhead` | Integer | The constant that all trained model estimations are multiplied by to determine a final estimation. Default is `1`. |