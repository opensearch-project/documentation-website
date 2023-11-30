---
layout: default
title: Security Analytics settings
nav_order: 100
has_children: false
---

# Security Analytics settings

The Security Analytics plugin supports the following settings. All settings in this list are dynamic:

`plugins.security_analytics.index_timeout` (Time value): The timeout for creating detectors, findings, rules, and custom log types using the REST APIs. Default is 60 seconds.

`plugins.security_analytics.alert_history_enabled` (Boolean): Specifies whether to create `.opensearch-sap-<detector_type>-alerts-history-<date>` indexes. Default is `true`.

`plugins.security_analytics.alert_finding_enabled` (Boolean): Specifies whether to create `.opensearch-sap-<detector_type>-findings-<date>` indexes. Default is `true`.

`plugins.security_analytics.alert_history_rollover_period` (Time value): Specifies how frequently to roll over and delete alert history indexes. Default is 12 hours.

`plugins.security_analytics.alert_finding_rollover_period` (Time value): Specifies how frequently to roll over and delete finding history indexes. Default is 12 hours.

`plugins.security_analytics.correlation_history_rollover_period` (Time value): Specifies how frequently to roll over and delete correlation history indexes. Default is 12 hours.

`plugins.security_analytics.alert_history_max_age` (Time value): The oldest document to store in the alert history index before creating a new index. If the number of alerts in this time period does not exceed `alert_history_max_docs`, a new alert history index is created per period (for example, one index every 30 days). Default is 30 days.

`plugins.security_analytics.finding_history_max_age` (Time value): The oldest document to store in the finding history index before creating a new index. If the number of findings in this time period does not exceed `finding_history_max_docs`, a new finding history index is created per period (for example, one index every 30 days). Default is 30 days.

`plugins.security_analytics.correlation_history_max_age` (Time value): The oldest document to store in the correlation history index before creating a new index. If the number of correlations in this time period does not exceed `correlation_history_max_docs`, a new correlation history index is created per period (for example, one index every 30 days). Default is 30 days.

`plugins.security_analytics.alert_history_max_docs` (Integer): The maximum number of alerts to store in the alert history index before creating a new index. Default is 1,000.

`plugins.security_analytics.alert_finding_max_docs` (Integer): The maximum number of findings to store in the findings history index before creating a new index. Default is 1,000.

`plugins.security_analytics.correlation_history_max_docs` (Integer): The maximum number of correlations to store in the correlation history index before creating a new index. Default is 1,000.

`plugins.security_analytics.alert_history_retention_period` (Time value): The amount of time to keep alert history indexes before automatically deleting them. Default is 60 days.

`plugins.security_analytics.finding_history_retention_period` (Time value): The amount of time to keep finding history indexes before automatically deleting them. Default is 60 days.

`plugins.security_analytics.correlation_history_retention_period` (Time value): The amount of time to keep correlation history indexes before automatically deleting them. Default is 60 days.

`plugins.security_analytics.request_timeout` (Time value): The timeout for all requests the Security Analytics plugin sends to other parts of OpenSearch. Default is 10 seconds.

`plugins.security_analytics.action_throttle_max_value` (Time value): The maximum amount of time you can set for action throttling. Default is 24 hours. (This value displays as 1440 minutes in OpenSearch Dashboards.)

`plugins.security_analytics.filter_by_backend_roles` (Boolean): When set to `true`, restricts access to detectors, alerts, findings, and custom log types by backend role when enabled. Default is `false`.

`plugins.security_analytics.enable_workflow_usage` (Boolean): Supports the Alerting plugin workflow integration with Security Analytics. Determines whether composite monitor workflows are generated for the Alerting plugin after creating a new threat detector in Security Analytics. When set to `true`, composite monitor workflows based on an associated threat detector's configuration are enabled. When set to `false`, composite monitor workflows based on an associated threat detector's configuration are disabled. Default is `true`. For more information about Alerting plugin workflow integration with Security Analytics, see [Integrated Alerting plugin workflows]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/#integrated-alerting-plugin-workflows). 

`plugins.security_analytics.correlation_time_window` (Time value): Security Analytics generates correlations within a time window. This setting specifies the time window within which documents must be indexed into the index in order to be included in the same correlation. Default is 5 minutes.

`plugins.security_analytics.mappings.default_schema` (String): The default mapping schema used for configuring a field mapping for a security analytics detector. Default is `ecs`.

`plugins.security_analytics.threatintel.tifjob.update_interval` (Time value): The threat intelligence feature uses a job runner to periodically fetch new feeds. This setting is the rate at which the runner fetches and updates these new feeds. Default is 1440 minutes.

`plugins.security_analytics.threatintel.tifjob.batch_size` (Integer): The maximum number of documents to ingest in a bulk request during the threat intelligence feed data creation process. Default is 10,000.

`plugins.security_analytics.threat_intel_timeout` (Time value): The timeout value for creating and deleting threat intelligence feed data. Default is 30 seconds.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).