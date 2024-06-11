---
layout: default
title: OpenSearch Dashboards plugin
parent: Trace Analytics
nav_order: 50
redirect_from:
  - /observability-plugin/trace/ta-dashboards/
  - /monitoring-plugins/trace/ta-dashboards/
---

# Trace Analytics OpenSearch Dashboards plugin
Introduced 2.15
{: .label .label-purple }

OpenSearch Observability Trace Analytics offers an improved user experience (UX) with OpenTelemetry (OTel) protocol analytics, providing comprehensive distributed systems insights. The improved UX enables you to correlate signals, aiding in identifying relationships and root causes of issues.
[OTel](https://opentelemetry.io/), an open-source observability framework, offers standardized instrumentation for collecting telemetry data from cloud-native software.
## Trace analytics capabilities

This improved trace-analytics experience enables you to analyze and visualize services, traces, and rate, error and duration (RED) metrics.

- [Services](https://opentelemetry.io/docs/specs/semconv/resource/#service) represent the different components of a distributed application, they are a significant logical term which is used to measure and monitor the application's building blocks to validate the health of the entire system.
- [Traces](https://opentelemetry.io/docs/concepts/signals/traces/) follow the end-to-end journey of requests as they travel through these services, offering deep insights into latency and performance issues.
- [RED metrics](https://opentelemetry.io/docs/specs/otel/metrics/api/) help monitor the health and performance of services by focusing on three critical areas: rate (requests per second), errors (number of failed requests), and duration (time taken to process requests). 

Additionally, we've added a new UX flyout allowing for correlation analysis, enabling users to identify relationships between different signals and understand the root causes of issues more effectively.

---

The Trace Analytics plugin for OpenSearch Dashboards provides at-a-glance visibility into your application performance as it is projected by the OpenTelemetry protocol.
The Trace Analytics shows multiple service-visualizations (table and map) - which allow a logical analysis of the service's behavior and correctness. 

The following visualizations represent various ways that will assist the user to quickly identify anomalies and errors

1) In the **Services table** each column shows one of the RED indicators (Requests, Errors, Duration ) in addition to the connected up/down stream services and other actions
![Services Table]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-table.png)

1.2) The Service table allows filtering the shown services using a general purpose filter selection which supports any field to use as a filter or a filter composition. 
![Services Filter selection]({{site.url}}{{site.baseurl}}/images/trace-analytics/services-filter-selection.png)

1.3) The Service throughput tooltip shows a service's throughput in a glans to allow quick and simple analysis of the amount of incoming requests during the past 24 hours
![Services throughput tooltip ]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-throughput-tooltip.png)

1.4) The Service correlation dialog shows an overview of the selected service (including the above 24 hours throughput trend) and allows the user to deep dive into the correlated logs or traces which are using the `servicName` field as a correlation dimension.
![Services service-correlation dialog ]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-correlation-dialog.png)

1.5) The Service RED metrics dialog shows an overview of the selected service's RED metrics indicators including the 24 hours error, duration and throughput rate for that selected service
![Service RED metrics]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-RED-metrics.png)

1.6) The Service's span dialog allows to dive even further and analyze a specific trace down to its composing elements including the attributes and associated logs. 
![Service's Spans dialog]({{site.url}}{{site.baseurl}}/images/trace-analytics/span-details-fly-out.png)

2) In the **Services Map** each node represents the service and has a color schema that indicates the severity of the associated RED indicator (shown above as 3 selection buttons). The selected service can be opened in a detailed dialog.
This interactive map shows how the various services connect to each other, In contrast to the dashboard, which helps identify problems by operation, the service map helps identify problems by service. Try sorting by error rate or latency to get a sense of potential problem areas of your application.

3) ![Services map tooltip]({{site.url}}{{site.baseurl}}/images/trace-analytics/service-details-tooltip.png)

2.1) In the Single **Services Map** flyout each node represents the connected services downstream from the selected service and has a color schema that indicates the severity of the associated RED indicator including the connected downstream depended services 
![Services Map single flyout]({{site.url}}{{site.baseurl}}/images/trace-analytics/single-service-fly-out.png)

3) In the **Trace Group Dialog** traces are grouped according to their http API name which allows the clustering of different traces with accordance to their business functional unit.
The **Trace Group Dialog** view groups traces together by HTTP method and path so that you can see the average latency, error rate, and trends associated with a particular operation. For a more focused view, try filtering by trace group name.
![Services Map single flyout]({{site.url}}{{site.baseurl}}/images/trace-analytics/trace-group-RED-metrics.png)

3.1) The **Trace Group Dialog** allows filtering according to the group's name and additional filters as well, it also allows to dive into the traces table associated with that group.
To drill down on the traces that make up a trace group, choose the number of traces in the column on the right. Then choose an individual trace for a detailed summary.
![Trace Group view]({{site.url}}{{site.baseurl}}/images/ta-dashboard.png)

4) **Trace Details View** shows a single trace breakdown in terms of its composing spans and their associated serviceName, a water-fall chart of the spans time and duration interactions.  
![Detailed trace view]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

### Installing the OpenSearch Dashboards plugin  
[Standalone OpenSearch Dashboards plugin install]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/).

### Schema dependencies and assumptions

The Trace Analytics plugin requires several schema dependencies and assumptions to effectively process and visualize OpenTelemetry (OTEL) data.
In addition, the plugin requires [**Data-Prepper**](https://opensearch.org/docs/latest/data-prepper/) to be used in conjunction with this plugin to provide all the OTEL based correlations and service-map calculations using the next pipelines
- [Trace Analytics Pipeline](https://opensearch.org/docs/latest/data-prepper/common-use-cases/trace-analytics/)
- [Service Map Pipeline](https://opensearch.org/docs/latest/data-prepper/pipelines/configuration/processors/service-map-stateful/)

**Standardized Telemetry Data:** 
- The plugin requires telemetry data to adhere to the OpenTelemetry schema conventions. This includes the structure and naming of spans, traces, and metrics as defined by the OpenTelemetry specifications and implemented using the [simple schema for observability](https://opensearch.org/docs/latest/observing-your-data/ss4o/).

**Service Names & Dependency Map:**
- Service names should be unique and consistently used across different components of the application to ensure accurate service mapping and correlation analysis - serviceName are populated using data-prepper pipeline
- Services must be ingested with per-defined upstream and downstream dependencies, which are necessary for constructing accurate service maps and understanding service relationships.

**Trace and Span IDs**:
- Unique identifiers for traces and spans must be consistently generated and maintained across distributed systems to enable end-to-end tracing and accurate performance insights.

**RED Metrics Adherence:**
- The plugin expects metrics data to include RED indicators (Rate, Error, Duration) for each service ( pre-aggregated using data-prepper's pipeline OR calculated on the fly based on the spans) allowing to compute and display key performance indicators effectively.

**Correlation Fields:** 
- Certain fields, such as **serviceName**, are assumed to be present and used for correlation analysis. These fields enable the plugin to link related telemetry data and provide a holistic view of service interactions and dependencies.

### Training using OpenTelemetry Demo
To get started with the OpenSearch Dashboards Trace Analytics plugin, we recommend using the[ OpenSearch OpenTelemetry Demo](https://github.com/opensearch-project/opentelemetry-demo). 
The OpenTelemetry Demo is a comprehensive, open-source example that simulates a distributed web astronomy shop application, generating real-time telemetry data. This demo provides an ideal environment to explore and understand the features of the Trace Analytics plugin.

1. **Setup OpenTelemetry Demo**:
    - Clone the OpenTelemetry Demo repository from GitHub: [OpenSearch OpenTelemetry Demo](https://github.com/opensearch-project/opentelemetry-demo).
    - Follow the [Getting Started](https://github.com/opensearch-project/opentelemetry-demo/blob/main/tutorial/GettingStarted.md) setup instructions provided in the repository to deploy the demo application. This typically involves using Docker to run multiple microservices that generate telemetry data.

2. **Ingest Telemetry Data**:
    - Configure the OpenTelemetry collectors in the demo to send telemetry data to your OpenSearch cluster. This [pre-existing setup](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/otelcollector) ensures that the generated traces, metrics, and logs are ingested into OpenSearch for analysis.
    - Ensure that [Data Prepper](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/dataprepper) is set up to process the incoming data. Data Prepper will handle the trace analytics and service map pipelines, submitting the data according to the required indices and performing the pre-aggregated calculations.

3. **Explore Trace Analytics Features**:
    - **Services Table**: Navigate to the Services table to see an overview of the services in your application. Use the filters to drill down into specific services and analyze their performance using RED metrics.
    - **Services Map**: Examine the Services Map to understand the relationships between different services. This visual representation helps identify potential problem areas based on error rates and latency.
    - **Trace Group Dialog**: Use the Trace Group Dialog to group traces by their HTTP method, allowing to analyze performance trends and error rates for specific operations.
    - **Trace Details View**: Select an individual trace ( with high duration) to view its breakdown in the Trace Details View. This view provides a detailed analysis of each span, including their attributes and associated logs.

4. **Perform Correlation Analysis**:
    - Utilize the Service Correlation dialog to identify relationships between different telemetry signals. This feature helps in drilling down from the logical service layer down to the actual metrics and logs associated with that service.
