---
layout: default
title: OpenSearch Integrations
nav_order: 1
has_children: false
nav_exclude: true
permalink: /integrations/
redirect_from:
  - /integrations/index/
---
# OpenSearch Integrations
Introduced 2.9
{: .label .label-purple }

OpenSearch Integrations is a straightforward starting point that OpenSearch and OpenSearch Dashboards users can use to visualize and understand log and metric data for a particular resource, such as NGINX or Amazon VPC flow logs. An _integration_ contains a bundle of metadata, data mappings, and visualizations that make it simple to monitor data from the Integrations resource.

The OpenSearch Project seeks your feedback on this feature. Let us know on the [OpenSearch forum](https://forum.opensearch.org/) how OpenSearch Integrations works for you or how it can be improved.
{: .label-yellow}

## Introducing OpenSearch Integrations

The Integrations initiative aimed to provide a simple and powerful way for users to view, query, and project their data. Before the initiative, users had to follow these steps each time to configure their dashboards:

* Explore the raw data content and extract the mapping structure.
* Transform and ingest the data using the extracted mapping structure. 
* Assemble the index pattern based on this mapping, adding possible dynamic fields. 
* Compose the entire dashboard using visualizations for different parts of the data schema.
* Share dashboards for others to explore, expecting a consistent format based on the input pipeline version used.

This repeated bootstrapping process for every data type was manual, error-prone, and time-consuming. It also required knowledge of both the data and the OpenSearch API.

### Unlocking diverse use cases

OpenSearch Integrations aims to simplify and automate the manual steps, reducing the required domain knowledge to a minimum.


OpenSearch supports a range of use cases for different user types, such as the following:
- Search-related domain use cases, for example, e-commerce products search
- Observability monitoring and provisioning, such as trace or metrics analytics
- Security monitoring and threat analysis

For each of these use cases, a strong and mature community has contributed substantial resources and knowledge to their respective domains. The Integrations framework is closely aligned with these established schemas, enabling out-of-the-box data mapping tailored to these domains.

### Using the Observability schema

A consistent telemetry data schema is crucial for effective observability, enabling data correlation and analysis across applications, services, and infrastructure components to provide a holistic view of system behavior and performance.

OpenSearch adopted the [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol as the foundation for its observability solution. OTel is a community-driven standard defining a consistent schema and data collection approach for metrics, logs, and traces. It is widely supported by APIs, software development kits (SDKs), and telemetry collectors, enabling features like auto-instrumentation for seamless observability integration.

Unifying the integrations around the OTel schema provides a consistent experience for users. This shared schema allows cross-correlation and analysis across different data sources, enabling deeper insights into application and infrastructure performance. To this end, OpenSearch derived the [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability), which encodes the OTel standard as OpenSearch mappings.

Additionally, OpenSearch supports the [Piped Processing Language (PPL)](https://opensearch.org/docs/latest/search-plugins/sql/ppl/index/), designed for high-dimensionality querying in observability contexts, empowering you with advanced analysis and troubleshooting capabilities beyond traditional dashboarding.

Adopting the OTel schema and leveraging its ecosystem enables OpenSearch Integrations to take a powerful, standardized approach to observability, providing you with comprehensive system insights.

### Ingesting data

Integrations and their dashboards rely on data ingested into OpenSearch conforming to the supported schemas. Compatible data pipelines are required, such as the following:

- [Data Prepper](https://github.com/opensearch-project/data-prepper)
- [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)
- [Fluent Bit OpenSearch](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch)

These pipelines support the OTel schema (or a simple schema) to index signal documents into the correct index representing the observed resource signals. See [Naming Convention](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/Naming-convention.md) for index naming standards. 

### Applying the ingestion structure

Each integration contains the following metadata and assets:

* Name and description
* Source URL and license
* Schema specification, for example, mapping or components mapping
* Sample data to test the feature
* Assets such as dashboards, index patterns, queries, and alerts

---
## Using Integrations
Integrations can be installed directly from the [default catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) shipped with every OpenSearch release. Additionally, they can be manually loaded and updated using the **Dashboards Management** console to reflect the latest versions or new releases.


### Installing an integration 

If no integrations are installed, you are prompted to install them from the Integrations interface. The **Available** window lists supported integrations from the default catalog.
 
![]({{site.url}}{{site.baseurl}}/images/integrations/empty-installed-integrations.png)

To add an integration, select the desired prepackaged assets. OpenSearch Integrations offers the following options: **Add** or **Try it**. The following image shows the **Try it** flow:
![integrations-observability-catalog.png](/images/integrations/integrations-observability-catalog.png)

The **Available** dialog window allows filtering the list of integrations using the **Categories** dropdown menu, as shown in the following image:

![cloud-integrations-filter.png]({{site.url}}{{site.baseurl}}/images/integrations/cloud-integrations-filter.png)

This example shows how you can navigate and explore the [default catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) bundled with the OpenSearch release and select the appropriate resources for your system.

1. On the **Integrations** page, select **NginX Dashboard**.
![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration.png)

2. Select the **Try it** button. _The Try it flow automatically creates a sample index template, adds sample data to the template, and then creates the integration based on that data._

3. View the asset list and select a dashboard asset.
![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-installed-integration-assets.png)

4. Preview the data visualizations and sample data details.  
![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration-dashboard.png)


### Loading new integrations

To load a new integration not included in the OpenSearch release, download it from the [catalog repository](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md), navigate to **Dashboards Management**, and import the new integration.

The following tutorial shows how to download and install a new release or updated integration version from the catalog page to the OpenSearch available integration.

1. Download a new integration artifact from the [catalog repository](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md).
   ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-catalog-release-page.png)

2. Go to **Dashboards Management** > **Saved objects**.
   ![]({{site.url}}{{site.baseurl}}/images/integrations/import-saved-objects.png)

3. Select **Import** in the upper-right corner to load your new integration artifact (a file with .ndjson extension).
   ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-import-file.png)

4. Open the loaded integration template.
   ![]({{site.url}}{{site.baseurl}}/images/integrations/select-uploaded-integration.png)


***

## Additional information

For the latest developer information, including sample code, articles, tutorials, and an API reference, see the following resources:

- [Integrations repository](https://github.com/opensearch-project/opensearch-catalog)
- [Integration Documentation Reference](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/integrations)
- [Integration Catalog Page](https://htmlpreview.github.io/?https://github.com/opensearch-project/opensearch-catalog/blob/main/integrations/observability/catalog.html)
- [Integration Release Page](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md)
- [Integration Observability Catalog](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability)


### Community
Please feel free to [participate and contribute](https://github.com/opensearch-project/dashboards-observability/issues/new?assignees=&labels=integration%2C+untriaged&projects=&template=integration_request.md&title=%5BIntegration%5D) so that the next integration will help your organization reach productivity faster and easier .
