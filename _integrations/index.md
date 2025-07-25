---
layout: default
title: Integrations in OpenSearch Dashboards
nav_order: 1
has_children: false
nav_exclude: true
permalink: /integrations/
redirect_from:
  - /integrations/index/
canonical_url: https://docs.opensearch.org/latest/integrations/
---

# Integrations in OpenSearch Dashboards
Introduced 2.9
{: .label .label-purple }

The **Integrations** application in OpenSearch Dashboards provides a user-friendly platform for data visualization, querying, and projection of your resource data, such as flow logs. An _integration asset_, such NGINX or Amazon Virtual Private Cloud (VPC), contains a bundle of metadata, data mappings, and visualizations, streamlining the monitoring of resource data without redundant configuration steps. 

Available OpenSearch Dashboards integration assets are shown in the following image.

![Integrations assets available in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/dashboards/integrations-assets.png)

---

## Use cases

**Integrations** considers established data schemas across multiple domains to give you seamless data mapping and integration for various use cases, such as e-commerce product search, observability monitoring (for example, trace and metrics analytics), and security monitoring and threat analysis. 

## OpenTelemetry protocol for observability

A consistent telemetry data schema is crucial for effective observability, enabling data correlation and analysis across applications, services, and infrastructure components to provide a holistic view of system behavior and performance.

OpenSearch adopted the [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol as the foundation for its observability solution. OTel is a community-driven standard that defines a consistent schema and data collection approach for metrics, logs, and traces. It is widely supported by APIs, SDKs, and telemetry collectors, enabling features like auto-instrumentation for seamless observability integration. 

This shared schema allows cross-correlation and analysis across different data sources. To this end, OpenSearch derived the [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability), which encodes the OTel standard as OpenSearch mappings. OpenSearch also supports the [Piped Processing Language (PPL)](https://docs.opensearch.org/latest/search-plugins/sql/ppl/index/), which is designed for high-dimensionality querying in observability use cases.

---

## Ingesting data

Data ingested into OpenSearch must conform to the supported schemas for data integrations and their associated dashboards. Compatible data pipelines are required, such as the following:

- [Data Prepper](https://github.com/opensearch-project/data-prepper)
- [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)
- [Fluent Bit for OpenSearch](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch)

These pipelines use the OTel schema (or a simple schema) to index signal documents into the correct index representing the observed resource signals. See [Naming Convention](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/Naming-convention.md) for index naming conventions. 

### Ingestion structure

Each integration asset contains the following metadata and assets:

* Name and description
* Source URL and license
* Schema specification, for example, mapping or component mapping
* Sample data for testing the feature
* Assets such as dashboards, index patterns, queries, or alerts

---

## Installing an integration asset 

Integration assets can be installed directly from the [default catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) shipped with every OpenSearch release.

To install an asset, follow these steps:

1. Go to **Integrations** > **Available** to view the available options. 
2. Select a tool, such as **Nginx** or **Amazon VPC**. You can choose **Add** to add or configure a new data integration using a prepackaged integration asset. You can choose **Try it** to test or explore the integration before fully adding it.
3. On the **Available** page, select the **Categories** dropdown menu to filter the list of integrations.

### Try it demo

To try a prepackaged integration asset, follow these steps:

1. On the **Integrations** page, select **Nginx**.
2. Select the **Try it** button. The **Try it** option automatically creates a sample index template, adds sample data to the template, and then creates the integration based on that data.
3. Select an asset from the **Asset List**. Assets include dashboards, index patterns, and visualizations.
4. Preview the data visualizations and sample data details. An example is shown in the following image.

  ![Integrations dashboard with visualizations]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration-dashboard.png)

## Loading custom integration assets

To load a custom integration asset, follow these steps: 

1. Download an integration artifact from the [catalog repository](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md).
2. Go to **Dashboards Management** > **Saved objects**.
3. Select **Import** on the upper-right toolbar menu, navigate to the folder where you saved the integration artifact, and then choose the file (a file with an .ndjson extension). An example of this step is shown in the following image.
  ![Import folder window]({{site.url}}{{site.baseurl}}/images/integrations/integration-import-file.png)
4. Select the saved object you uploaded to confirm that it was uploaded to **Saved objects**. An example of this step is shown in the following image.
  ![List of integrations saved objects]({{site.url}}{{site.baseurl}}/images/integrations/select-uploaded-integration.png)

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

The OpenSearch Project seeks your feedback on this feature. Post on the [OpenSearch forum](https://forum.opensearch.org/) to let us know how **Integrations** works for you or how it can be improved.
 
Contribute to the project by submitting an [integration request](https://github.com/opensearch-project/dashboards-observability/issues/new?assignees=&labels=integration%2C+untriaged&projects=&template=integration_request.md&title=%5BIntegration%5D).
