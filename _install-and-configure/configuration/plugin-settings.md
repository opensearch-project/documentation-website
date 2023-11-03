---
layout: default
title: Plugin settings
parent: Configuring OpenSearch
nav_order: 50
---

# Plugin settings

The following settings are related to OpenSearch plugins.

## Alerting settings

For information about alerting settings, see [Alerting settings]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/#alerting-settings).

## Anomaly detection settings

For information about anomaly detection settings, see [Settings]({{site.url}}{{site.baseurl}}/observing-your-data/ad/settings/).

## Machine learning settings

For information about machine learning settings, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

## Security analytics settings

The Security Analytics plugin supports the following settings:

- `plugins.security_analytics.enable_workflow_usage` (Boolean): Supports Alerting plugin workflow integration with Security Analytics. Determines whether composite monitor workflows are generated for the Alerting plugin after creating a new threat detector in Security Analytics. By default, the setting is `true`. 

    When set to `true`, composite monitor workflows based on an associated threat detector's configuration are enabled. When set to `false`, composite monitor workflows based on an associated threat detector's configuration are disabled. 
    
    For more information about Alerting plugin workflow integration with Security Analytics, see [Integrated Alerting plugin workflows]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/#integrated-alerting-plugin-workflows). 

