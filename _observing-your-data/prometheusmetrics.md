---
layout: default
title: Prometheus SQL and Metrics Analytics Observability plugin
nav_order: 40
redirect_from:
  - /observing-your-data/prometheusmetrics/
---

# Prometheus SQL and Metrics Analytics Observability plugin
Introduced 2.4
{: .label .label-purple }

Starting with OpenSearch 2.4, you can use two new additional features within the **Observability** application in OpenSearch Dashboards: the Metrics UI for visualization, and connecting to Prometheus to gather metrics.

![Prometheus and Metrics]({{site.url}}{{site.baseurl}}/images/metrics/metricsgif.gif)

## Metrics Analytics UI

The Metrics Analytics UI is a new component in the **Observability** application for OpenSearch Dashboards, as seen in the following image.

![Metrics UI example 1]({{site.url}}{{site.baseurl}}/images/metrics/metrics1.png)

You can view visualizations from created metrics in the **Metrics analytics** section of the **Observability** application as seen in the following image.

![Metrics UI example 2]({{site.url}}{{site.baseurl}}/images/metrics/metrics2.png)

Additionally, you can save a visualization created with [Event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics/) as seen in the following image.

Only queries that include a Time Series visualization and stats/span can be saved as a metric.
{: .note }

![Metrics UI example 3]({{site.url}}{{site.baseurl}}/images/metrics/metrics3.png)

## Prometheus connection

You can create a connection from [Prometheus](https://prometheus.io/) to OpenSearch via the SQL plugin in order to view metrics collected from Prometheus in OpenSearch Dashboards.

![Prometheus example 1]({{site.url}}{{site.baseurl}}/images/metrics/metrics4.png)

Upon selection of a metric, the **Metrics explorer** will create a visualization for the selected metric to be displayed, as seen in the following image.

![Prometheus example 2]({{site.url}}{{site.baseurl}}/images/metrics/metrics5.png)

### Configuring a Prometheus data source connection to OpenSearch

In order to configure a connection to Prometheus for metrics in OpenSearch Dashboards, you will need to create a file on your OpenSearch nodes named `datasources.json` containing the Prometheus data source settings. The following examples demonstrate the various Prometheus data source configurations using different authentication methods:

- No authentication:

   ```json
   [{
       "name" : "my_prometheus",
       "connector": "prometheus",
       "properties" : {
           "prometheus.uri" : "http://localhost:9090"
       }
   }]
   ```

- Basic authentication:

   ```json
   [{
       "name" : "my_prometheus",
       "connector": "prometheus",
       "properties" : {
           "prometheus.uri" : "http://localhost:9090",
           "prometheus.auth.type" : "basicauth",
           "prometheus.auth.username" : "admin",
           "prometheus.auth.password" : "admin"
      }
   }]
   ```

- AWSSigV4 authentication:

   ```json
   [{
       "name" : "my_prometheus",
       "connector": "prometheus",
       "properties" : {
           "prometheus.uri" : "http://localhost:8080",
           "prometheus.auth.type" : "awssigv4",
           "prometheus.auth.region" : "us-east-1",
           "prometheus.auth.access_key" : "{{accessKey}}"
           "prometheus.auth.secret_key" : "{{secretKey}}"
       }
   }]
   ```

After entering your Prometheus configuration into the `datasources.json` file, run the following command to load the configuration into the OpenSearch keystore. This is securely stored as is contains credential information.

```
bin/opensearch-keystore add-file plugins.query.federation.datasources.config datasources.json
```

If you are updating the keystore during runtime, refresh the keystore with the following API command:

```bash
POST /_nodes/reload_secure_settings
{
  "secure_settings_password":""
  
}
```
{% include copy-curl.html %}

Metrics collected from Prometheus will now be displayed in the **Observability** application under **Metrics analytics**. For further information, see the [Prometheus Connector](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/prometheus_connector.rst) GitHub page.

### Prometheus PPL queries

Below is an example of a [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) (PPL) query using a Prometheus connection in OpenSearch. This example demonstrates a metric selecting query with specific dimensions:

```
source = my_prometheus.prometheus_http_requests_total | stats avg(@value) by span(@timestamp,15s), handler, code
```
