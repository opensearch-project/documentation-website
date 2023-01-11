---
layout: default
title: Analyze Jaeger trace data 
parent: Trace analytics
nav_order: 55
---

# Analyze Jaeger trace data

Introduced 2.5
{: .label .label-purple }

Trace analytics now supports Jaeger trace data. Jaeger can store its trace data in OpenSearch, but users that use OpenSearch as their backend for Jaeger data can now benefit from trace analytics capability.

When you perform trace analytics, you can select from two data sources:

- **Data Prepper** – Data ingested into OpenSearch through Data Prepper. This data source requires OpenTelemetry (OTEL) index type.
- **Jaeger** – Trace data stored within OpenSearch as its backend. This data source requires the Jaeger index type.

If you currently store your Jaeger trace data in OpenSearch, you can now use the trace analytics capability. When you ingest Jaeger data into OpenSearch, it gets stored in a different index than the OTA-generated index that gets created when you run data through the Data Prepper. You can indicate which data source on which you want to perform trace analytics with the data source selector in the Dashboards.

Jaeger trace data that you can analyze includes span data, service dependency data, and service and operation endpoint data. Jaeger span data analysis requires some configuration.

Each time you ingest data for Jaeger, it creates a separate index for that day. The Dashboards will show the current index that has a mapping.

To learn more about Jaeger data tracing, see the Jaeger open source documentation [Jaeger](https://www.jaegertracing.io/).

<!-- need more details from engineer or PM for how they would be able to switch from different indexes to display in the Dashboards Data selector menu.-->

### About Data ingestion with Jaeger indexes

Trace analytics for non-Jaeger data use OTEL indexes with the naming conventions `otel-v1-apm-span-*` or `otel-v1-apm-service-map*`.

Jaeger indexes follow the naming conventions `jaeger-span-*` or `jaeger-service-*`.

Jaeger and OTEL indexes have different field names. Therefore when you run trace analytics, you'll need to create different queries and components depending on which index type you are using.
{:.note}

<!-- Need info to confirm usage of query or aggregations on nested objects. can they also enable them with --es.tags-as-fields.all=true ?
-->


## Use trace analytics in OpenSearch Dashboards

To analyze your Jaeger trace data in the Dashboards, you need to set up Trace Analytics first. To get started, see [Get started with Trace Analytics]({{site.url}}{{site.baseurl}}/observability-plugin/trace/get-started/).

### Data sources

You can specify either Data Prepper or Jaeger as your data source when you perform trace analytics.
From the OpenSearch Dashboards, go to **Observability > Trace Analytics** and select Jaeger.

![Select data source]({{site.url}}{{site.baseurl}}/images/trace-analytics/select-data.png)

## Dashboards views

After you select Jaeger for the data source, you can view all of your indexed data in the Dashboards, including Error rate, Throughput, and Services.
### Error rate

You can view the Trace error rate over time in the Dashboard, and also view the combination of services and operations that have a non-zero operation rate.

![Error rate]({{site.url}}{{site.baseurl}}/images/trace-analytics/error-rate.png)

### Throughput

With **Throughput** selected, you can select an individual Trace from **Top 5 Service and Operation Latency** list and view the detailed trace data.

You can view throughput of Jaeger indexes that are being added as a function of time.

![Throughput]({{site.url}}{{site.baseurl}}/images/trace-analytics/throughput.png)

You can also see the combinations of services and operations that have the highest latency.

If you select one of the entries for Service and Operation Name and go to the **Traces** column to select a trace, it will add the service and operation as filters for you.

In **Traces**, you can see the latency and errors for the filtered service and operation for each individual Trace ID in the list.

![Select data source]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-trace-data.png)

Next, you can select an individual Trace ID to view more detailed information including all of the spans for the service and operations.

![Select data source]({{site.url}}{{site.baseurl}}/images/trace-analytics/trace-details.png)

### Services

You can also look at individual error rates and latency for each individual service. Go to **Observability > Trace Analytics > Services**. In **Services**, you can see the average latency, error rate, throughput and trace for each service in the list.

![Services list]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-jaeger.png)
