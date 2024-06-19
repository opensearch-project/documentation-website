---
layout: default
title: Integrations
nav_order: 1
has_children: false
nav_exclude: true
permalink: /integrations/
redirect_from:
  - /integrations/index/
---

# Integrations
Introduced 2.9
{: .label .label-purple }

You can use **Integrations** to visualize and understand log and metric data for a particular resource in OpenSearch or OpenSearch Dashboards, such as NGINX or Amazon Virtual Private Cloud (Amazon VPC) flow logs. An _integration_ contains a bundle of metadata, data mappings, and visualizations that make it simple to monitor data from the resource.

The OpenSearch Project seeks your feedback on this feature. Post on the [OpenSearch forum](https://forum.opensearch.org/) to let us know how OpenSearch Integrations works for you or how it can be improved.
{: .label-yellow}

## Integrations for OpenSearch Dashboards

**Integrations** provides a user-friendly and robust platform for data visualization, querying, and projection, eliminating the need for the multiple redundant steps previously required to configure dashboards.

### Use cases

**Integrations** aligns with established data schemas across multiple domains, enabling seamless data mapping and integration for various use cases, such as e-commerce product search, observability monitoring (for example, tracing and metrics analysis), and security monitoring and threat analysis.

### OpenTelemetry protocol for observability

A consistent telemetry data schema is crucial for effective observability, enabling data correlation and analysis across applications, services, and infrastructure components to provide a holistic view of system behavior and performance.

OpenSearch adopted the [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol as the foundation for its observability solution. OTel is a community-driven standard that defines a consistent schema and data collection approach for metrics, logs, and traces. It is widely supported by APIs, SDKs, and telemetry collectors, enabling features like auto-instrumentation for seamless observability integration.

Adopting the OTel schema and leveraging its ecosystem enables **Integrations** to take a standardized approach to observability, providing you with comprehensive system insights. This shared schema allows cross-correlation and analysis across different data sources, enabling deeper insight into application and infrastructure performance. To this end, OpenSearch derived the [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability), which encodes the OTel standard as OpenSearch mappings.

Additionally, OpenSearch supports the [Piped Processing Language (PPL)](https://opensearch.org/docs/latest/search-plugins/sql/ppl/index/), which is designed for high-dimensionality querying in observability contexts.

### Ingesting data

Data ingested into OpenSearch must conform to the supported schemas for data integrations and associated dashboards. Compatible data pipelines are required, such as the following:

- [Data Prepper](https://github.com/opensearch-project/data-prepper)
- [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)
- [Fluent Bit for OpenSearch](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch)

These pipelines use the OTel schema (or a simple schema) to index signal documents into the correct index representing the observed resource signals. See [Naming Convention](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/Naming-convention.md) for index naming conventions. 

### Applying the ingestion structure

Each integration contains the following metadata and assets:

* Name and description
* Source URL and license
* Schema specification, for example, mapping or component mapping
* Sample data for testing the feature
* Assets such as dashboards, index patterns, queries, or alerts

---

## Using Integrations

**Integrations** can be installed directly from the [default catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) shipped with every OpenSearch release. Additionally, **Integrations** can be manually loaded and updated using the **Dashboards Management** console.

### Installing integrations 

If no integration is installed, then you are prompted to install one. Go to **Integrations** > **Available** to view the supported integrations available from the default catalog. This feature is shown in the following image.
 
![]({{site.url}}{{site.baseurl}}/images/integrations/empty-installed-integrations.png)

To add an integration, select the desired prepackaged asset. **Integrations** offers the following options: **Add** or **Try it**. You can choose **Add** to add or configure a new data integration by selecting a prepackaged integration asset. You can choose **Try it** to to test or explore the integration before fully adding it. This feature is shown in the following image.

![integrations-observability-catalog.png](/images/integrations/integrations-observability-catalog.png)

On the **Available** page, select the **Categories** dropdown menu to filter the list of integrations. This feature is shown in the following image.

![cloud-integrations-filter.png]({{site.url}}{{site.baseurl}}/images/integrations/cloud-integrations-filter.png)

To try out the prepackaged integration assets, follow these steps:

1. On the **Integrations** page, select **Nginx**.
  ![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration.png)

2. Select the **Try it** button. _The Try it flow automatically creates a sample index template, adds sample data to the template, and then creates the integration based on that data._

3. Select an asset from the **Asset List**. Assets include dashboards, index patterns, and visualizations.
  ![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-installed-integration-assets.png)

4. Preview the data visualizations and sample data details.  
  ![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration-dashboard.png)

### Loading custom integrations

To load a custom integration, follow these steps: 

1. Download an integration artifact from the [catalog repository](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md). An example of this step is shown in the following image.
   ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-catalog-release-page.png)

2. Go to **Dashboards Management** > **Saved objects**. An example of this step is shown in the following image.
  ![]({{site.url}}{{site.baseurl}}/images/integrations/import-saved-objects.png)

3. Select **Import** on the upper-right toolbar menu and navigate to the folder where you saved the integration artifact. The file explorer window should open automatically. Choose the file (a file with an .ndjson extension). An example of this step is shown in the following image.
  ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-import-file.png)

4. Select the object you uploaded. An example of this step is shown in the following image.
  ![]({{site.url}}{{site.baseurl}}/images/integrations/select-uploaded-integration.png)

---

## Developer resources

See the following developer resources for sample code, articles, tutorials, and an API reference:

- [OpenSearch Integrations repository](https://github.com/opensearch-project/opensearch-catalog)
- [OpenSearch Integrations reference documentation](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/integrations)
- [OpenSearch Observability Catalog](https://htmlpreview.github.io/?https://github.com/opensearch-project/opensearch-catalog/blob/main/integrations/observability/catalog.html)
- [OpenSearch Observability Catalog release page](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md)
- [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability)

---

## Community contribution

Contribute to the project by submitting an [integration request](https://github.com/opensearch-project/dashboards-observability/issues/new?assignees=&labels=integration%2C+untriaged&projects=&template=integration_request.md&title=%5BIntegration%5D).
