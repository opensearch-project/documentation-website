---
layout: default
title: Plugin settings
parent: Configuring OpenSearch
nav_order: 100
---

# Plugin settings

The following settings are related to OpenSearch plugins.

## Alerting plugin settings

For information about alerting settings, see [Alerting settings]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/#alerting-settings).

## Anomaly Detection plugin settings

For information about anomaly detection settings, see [Anomaly Detection settings]({{site.url}}{{site.baseurl}}/observing-your-data/ad/settings/).

## Asynchronous Search plugin settings

For information about asynchronous search settings, see [Asynchronous Search settings]({{site.url}}{{site.baseurl}}/search-plugins/async/settings/).

## Cross-Cluster Replication plugin settings

For information about cross-cluster replication settings, see [Replication settings]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/settings/).

## Geospatial plugin settings

For information about the Geospatial plugin's IP2Geo processor settings, see [Cluster settings]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ip2geo/#cluster-settings).

## Index Management plugin settings

For information about index state management (ISM) settings, see [ISM settings]({{site.url}}{{site.baseurl}}/im-plugin/ism/settings/).

### Index rollup settings

For information about index rollup settings, see [Index rollup settings]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/settings/).

## Job Scheduler plugin settings

For information about the Job Scheduler plugin settings, see [Job Scheduler cluster settings]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/job-scheduler/index/#job-scheduler-cluster-settings).

## k-NN plugin settings

For information about k-NN settings, see [k-NN settings]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings/).

## ML Commons plugin settings

For information about machine learning settings, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

## Neural Search plugin settings

The Security Analytics plugin supports the following settings:

- `plugins.neural_search.hybrid_search_disabled` (Dynamic, Boolean): Disables hybrid search. Default is `false`.

## Notifications plugin settings

The Notifications plugin supports the following settings. All settings in this list are dynamic:

- `opensearch.notifications.core.allowed_config_types` (List): The allowed configuration types of the Notifications plugin. Use the `GET /_plugins/_notifications/features` API to retrieve the value of this setting. Configuration types include `slack`, `chime`, `microsoft_teams`, `webhook`, `email`, `sns`, `ses_account`, `smtp_account`, and `email_group`.

- `opensearch.notifications.core.email.minimum_header_length` (Integer): The minimum email header length. Used for email message total length validation. Default is `160`.

- `opensearch.notifications.core.email.size_limit` (Integer): The email size limit. Used for email message total length validation. Default is `10000000`.

- `opensearch.notifications.core.http.connection_timeout` (Integer): The internal HTTP client connection timeout. The client is used for webhook-based notification channels. Default is `5000`.

- `opensearch.notifications.core.http.host_deny_list` (List): A list of denied hosts. The HTTP client does not send notifications to webhook URLs in this list.

- `opensearch.notifications.core.http.max_connection_per_route` (Integer): The maximum number of HTTP connections per route of the internal HTTP client. The client is used for webhook-based notification channels. Default is `20`.

- `opensearch.notifications.core.http.max_connections` (Integer): The maximum number of HTTP connections of the internal HTTP client. The client is used for webhook-based notification channels. Default is `60`.

- `opensearch.notifications.core.http.socket_timeout` (Integer): The socket timeout configuration of the internal HTTP client. The client is used for webhook-based notification channels. Default is `50000`.

- `opensearch.notifications.core.tooltip_support` (Boolean): Enables tooltip support for the Notifications plugin. Use the `GET /_plugins/_notifications/features` API to retrieve the value of this setting. Default is `true`.

- `opensearch.notifications.general.filter_by_backend_roles` (Boolean): Enables filtering by backend roles (role-based access control for the notification channels). Default is `false`.

## Security plugin settings

For information about the Security plugin settings, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).

## Security Analytics plugin settings

For information about security analytics settings, see [Security Analytics settings]({{site.url}}{{site.baseurl}}/security-analytics/settings/).

## SQL plugin settings

For information about settings related to SQL and PPL, see [SQL settings]({{site.url}}{{site.baseurl}}/search-plugins/sql/settings/).