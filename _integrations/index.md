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

**The Observability Schema**

Having a consistent schema for telemetry data is crucial for effective observability. It enables correlating and analyzing data across applications, services, and infrastructure components, providing a holistic view of system behavior and performance.

At OpenSearch, we adopted the [OpenTelemetry (OTel)](https://opentelemetry.io/) protocol as the foundation for our observability solution. OTel is a community-driven standard that defines a consistent schema and data collection approach for metrics, logs, and traces. It is widely supported by various APIs, SDKs, and telemetry collectors, enabling features like auto-instrumentation for easy observability integration.

By unifying our integrations around the OTel schema, we provide a consistent experience for users. This shared schema allows cross-correlation and analysis across different data sources, enabling deeper insights into application and infrastructure performance. For this purpose, we derived the [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability) that encodes the OTel standard as OpenSearch mappings.

Additionally, OpenSearch supports the [Piped Processing Language](https://opensearch.org/docs/latest/search-plugins/sql/ppl/index/), designed for high-dimensionality querying in observability contexts. PPL empowers users with advanced analysis and troubleshooting capabilities beyond traditional dashboarding.

Adopting the OTel schema and leveraging its ecosystem enables our integrations to take a powerful and standardized approach to observability, helping users gain a comprehensive understanding of their systems.

#### Data Ingestion for Integrations

Integrations and its dashboards depend on data ingested into OpenSearch which corresponds with the supported schema, such data pipeline that are compatible:

- [OpenSearch Data-Prepper](https://github.com/opensearch-project/data-prepper)
- [OTEL collector](https://github.com/open-telemetry/opentelemetry-collector)
- [Fluent-Bit](https://docs.fluentbit.io/manual/pipeline/outputs/opensearch)

Each one of these pipelines support the OTEL schema (or directly using the simple schema ) so that they index the signal documents into the [correct index](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/Naming-convention.md) which represents the Observed resource signals.

#### Ingestion structure

Each integration contains the following metadata and assets:

* Name & description
* Source url & License
* Schema spec (mapping or or components mapping)
* Sample data (for try-out experience)
* Assets (Dashboards, Index-Patterns , Queries, Alerts )

---
## Using Integrations
Integrations can be installed directly from the default catalog which is deployed in every OpenSearch release. In addition, integrations can be manually loaded using the standard Dashboard Management console and updated to reflect the most up-to-date version or new integrations releases.

- [Observability Release catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) 

## Installing An Integration 

If you have not installed any integrations, you'll be prompted to install them from the Integrations interface. Supported integrations are listed in the **Available** window and present the default Integration release catalog.  
![]({{site.url}}{{site.baseurl}}/images/integrations/empty-installed-integrations.png)

To add an integration, select the desired prepackaged assets. Currently, OpenSearch Integrations has two flows: Add or Try it. The following example uses the "Try it" flow:
![integrations-observability-catalog.png](/images/integrations/integrations-observability-catalog.png)

Integration **"Available"** dialog also allows filtering the list of integrations using the filter `Categories` drop down:
![cloud-integrations-filter.png]({{site.url}}{{site.baseurl}}/images/integrations/cloud-integrations-filter.png)

1. On the **Integrations** page, select **NginX Dashboard**.
![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration.png)

2. Select the **Try it** button. _The Try it flow automatically creates a sample index template, adds sample data to the template, and then creates the integration based on that data._

4. View the asset list and select a dashboard asset.
![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-installed-integration-assets.png)

4. Preview the data visualizations and sample data details.  
![]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration-dashboard.png)

This sample showed how the user can navigate and explore the existing default Integration release catalog that are bundled with OpenSearch release and select the appropriate resource that are part of its system.

### Loading a new integration using the Dashboard Management console :

To load a new Integration which was not deployed as part of the OpenSearch release, you need to download a new integration from the [catalog repository](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md) and navigate to the _DashboardManagement_ and import the new integration.

1) Download a new integration artifact (see the [catalog page](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/Release.md))
   ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-catalog-release-page.png)

2) Go to the DashboardManagement -> savedObjects
   ![]({{site.url}}{{site.baseurl}}/images/integrations/import-saved-objects.png)

3) Once there select import to load the recently downloaded integration artifact ( a file with `*.ndjson` suffix)
   ![]({{site.url}}{{site.baseurl}}/images/integrations/integration-import-file.png)

4) Select and open the loaded integration template
   ![]({{site.url}}{{site.baseurl}}/images/integrations/select-uploaded-integration.png)

This sample showed how a user can download a new release or updated integration version from the catalog page and load it to OpenSearch available integration to install.

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
