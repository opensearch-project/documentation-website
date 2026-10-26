---
layout: default
title: Connecting Prometheus to OpenSearch
parent: Connecting data sources
nav_order: 60
---

# Connecting Prometheus to OpenSearch
Introduced 2.16
{: .label .label-purple }

You can connect OpenSearch to a Prometheus server and query its metrics in OpenSearch Dashboards. OpenSearch doesn't copy the metrics. Instead, the SQL plugin sends each query to Prometheus when you run it, so the Prometheus URI must be reachable from the OpenSearch nodes.

## Prerequisites

Before you create a connection, make sure that you have completed the following prerequisites:

- Set the `plugins.query.datasources.encryption.masterkey` setting on all OpenSearch nodes. OpenSearch uses this key to encrypt the stored connection credentials and rejects requests to create or update a connection if the key is not set. For more information, see [Prerequisites]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/#prerequisites).
- Confirm that you have the required [Permissions]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/#permissions).

## Creating a Prometheus connection

To create a Prometheus connection, follow these steps:

1. On the main menu, go to **Management** > **Dashboards Management** > **Data sources**.
1. Select **Create direct query connection** > **Prometheus**.
1. In the **Data source details** section, enter a **Data source name** and, optionally, a description. You use this name to refer to the connection in queries, for example, `source = my_prometheus.prometheus_http_requests_total`.
1. In the **Prometheus data location** section, enter the **Prometheus URI**, for example, `http://prometheus.example.com:9090`.
1. In the **Authentication details** section, select an **Authentication method**:
    - **No authentication**: OpenSearch connects to Prometheus without credentials.
    - **Basic authentication**: Enter a **Username** and **Password**.
    - **AWS Signature Version 4**: Enter the **Auth Region**, **Access Key**, and **Secret Key**. Use this method for Amazon Managed Service for Prometheus.
1. In the **Query permissions** section, select a **Query access level**:
    - **Admin only**: Only the admin user can query the connection. This is the default.
    - **Restricted**: Users with the OpenSearch roles that you select can query the connection. This option is available only when the Security plugin is installed.
1. Select **Connect to Prometheus**.

The new connection appears in the list of data sources.

You can also create a connection using the `_plugins/_query/_datasources` API. For an example, see [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/#configuring-a-prometheus-connection-using-the-api).

## Querying Prometheus metrics

To query the metrics, select the connection on the **Data sources** page and then select **Query data**. The **Metrics** page in Observability opens, where you can visualize Prometheus metrics. You can also query them using Piped Processing Language (PPL). For more information, see [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/).

## Changing access to a connection

To change which users can query a connection, select the connection on the **Data sources** page. On the **Access control** tab, select **Edit**, update the **Query access level**, and save your changes.

## Updating a connection

OpenSearch Dashboards doesn't support editing the Prometheus URI or the credentials of an existing connection. To update them, send a request to the `_plugins/_query/_datasources` API. The following request changes the Prometheus URI of the `my_prometheus` connection:

```json
PATCH _plugins/_query/_datasources
{
  "name": "my_prometheus",
  "properties": {
    "prometheus.uri": "http://prometheus.example.com:9090"
  }
}
```
{% include copy-curl.html %}

## Deleting a connection

If [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) are enabled in OpenSearch Dashboards, you can delete a connection on the **Data sources** page. On the **Direct query connections** tab, select the connection, select **Delete 1 connection**, and then confirm the deletion. This tab lists only connections created in OpenSearch Dashboards.

Otherwise, delete the connection using the API:

```json
DELETE _plugins/_query/_datasources/my_prometheus
```
{% include copy-curl.html %}

## Related documentation

- [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/)
