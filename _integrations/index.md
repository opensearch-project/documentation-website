---
layout: default
title: Integrations in OpenSearch Dashboards
nav_order: 1
has_children: false
nav_exclude: true
permalink: /integrations/
redirect_from:
  - /integrations/index/
---

# Integrations in OpenSearch Dashboards
Introduced 2.9
{: .label .label-purple }

The **Integrations** application in OpenSearch Dashboards provides a user-friendly platform for data visualization, querying, and projection of your resource data, such as flow logs. An _integration tool_, such NGINX or Amazon VPC, contains a bundle of metadata, data mappings, and visualizations, streamlining the monitoring of resource data without redundant configuration steps. 

## Use cases

**Integrations** considers established data schemas across multiple domains to give you seamless data mapping and integration for various use cases, such as e-commerce product search, observability monitoring (for example, tracing and metrics analysis), and security monitoring and threat analysis. 

## OpenTelemetry protocol for observability

A consistent telemetry data schema is crucial for effective observability, enabling data correlation and analysis across applications, services, and infrastructure components to provide a holistic view of system behavior and performance.

OpenSearch adopted the [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol as the foundation for its observability solution. OTel is a community-driven standard that defines a consistent schema and data collection approach for metrics, logs, and traces. It is widely supported by APIs, SDKs, and telemetry collectors, enabling features like auto-instrumentation for seamless observability integration. This shared schema allows cross-correlation and analysis across different data sources. To this end, OpenSearch derived the [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability), which encodes the OTel standard as OpenSearch mappings. OpenSearch also supports the [Piped Processing Language (PPL)](https://opensearch.org/docs/latest/search-plugins/sql/ppl/index/), which is designed for high-dimensionality querying in observability use cases.

---

## Ingesting data

Data ingested into OpenSearch must conform to the supported schemas for data integrations and their associated dashboards. Compatible data pipelines are required, such as the following:

- [Data Prepper](https://github.com/opensearch-project/data-prepper)
- [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)
- [Fluent Bit for OpenSearch](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch)

These pipelines use the OTel schema (or a simple schema) to index signal documents into the correct index representing the observed resource signals. See [Naming Convention](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/Naming-convention.md) for index naming conventions. 

### Ingestion structure

Each integration tool contains the following metadata and assets:

* Name and description
* Source URL and license
* Schema specification, for example, mapping or component mapping
* Sample data for testing the feature
* Assets such as dashboards, index patterns, queries, or alerts

---

## Using Integrations

**Integrations** can be installed directly from the [default catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) shipped with every OpenSearch release. Alternatively, **Integrations** can be manually loaded and updated through the **Dashboards Management** console.

### Installing Integrations 

If no integration tool is installed, then you are prompted to install one. Several integration tools are available in OpenSearch Dashboards.

1. Go to **Integrations** > **Available** to view the available options. The available integation tools are shown in the following image. 

  ![integrations-observability-catalog.png](/images/integrations/integrations-observability-catalog.png)
   
2. Select an integration tool, such as **Nginx** or **Amazon VPC**. You can choose **Add** to add or configure a new data integration by selecting a prepackaged integration asset. You can choose **Try it** to to test or explore the integration before fully adding it.
3. On the **Available** page, select the **Categories** dropdown menu to filter the list of integrations.

To try out a prepackaged integration tool, follow these steps:

1. On the **Integrations** page, select **Nginx**.
2. Select the **Try it** button. _The Try it flow automatically creates a sample index template, adds sample data to the template, and then creates the integration based on that data._
3. Select an asset from the **Asset List**. Assets include dashboards, index patterns, and visualizations.
4. Preview the data visualizations and sample data details. An example is shown in the following image.

  ![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration-dashboard.png)

### Loading custom integrations

To load a custom integration, follow these steps: 

1. Download an integration artifact from the [catalog repository](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md).
2. Go to **Dashboards Management** > **Saved objects**.
3. Select **Import** on the upper-right toolbar menu and navigate to the folder where you saved the integration artifact and the choose choose the file (a file with an .ndjson extension). An example of this step is shown in the following image.
   
  ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-import-file.png)

4. Select the saved object you uploaded to confirm it is uploaded to **Saved objects**. An example of this step is shown in the following image.
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

The OpenSearch Project seeks your feedback on this feature. Post on the [OpenSearch forum](https://forum.opensearch.org/) to let us know how OpenSearch Integrations works for you or how it can be improved.
 
Contribute to the project by submitting an [integration request](https://github.com/opensearch-project/dashboards-observability/issues/new?assignees=&labels=integration%2C+untriaged&projects=&template=integration_request.md&title=%5BIntegration%5D).
