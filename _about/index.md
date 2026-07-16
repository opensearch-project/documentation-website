---
layout: default
title: Getting started
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /about/
redirect_from:
  - /docs/opensearch/
  - /opensearch/
  - /opensearch/index/
why_use:
  - heading: "Vector database"
    description: "Use OpenSearch as a vector database to combine the power of traditional search, analytics, and vector search"
    link: "/vector-search/"
    image: "/images/icons/vector-search-square.png"
    image_alt: "Vector search icon"
  - heading: "Fast, scalable full-text search"
    description: "Help users find the right information in your application, website, or data lake catalog"
    link: "/search-plugins/"
    image: "/images/icons/Icon_Lexical_Search-150x150.avif"
    image_alt: "Lexical search icon"
  - heading: "Application and infrastructure monitoring"
    description: "Use observability logs, metrics, and traces to monitor your applications in real time"
    link: "/observing-your-data/"
    image: "/images/icons/Icon_Observability-150x150.avif"
    image_alt: "Observability monitoring icon"
  - heading: "Data analytics"
    description: "Analyze and visualize your data in OpenSearch Dashboards"
    link: "/dashboards/"
    image: "/images/icons/OpenSearch-Dashboards-Square.png"
    image_alt: "OpenSearch Dashboards icon"
features:
  - heading: "Install and configure"
    description: "Set up OpenSearch and OpenSearch Dashboards on your preferred platform"
    link: "/install-and-configure/"
  - heading: "Security"
    description: "Configure authentication, access control, and encryption for your cluster"
    link: "/security/"
  - heading: "Index management"
    description: "Create indexes, manage templates, and automate index lifecycle"
    link: "/im-plugin/"
  - heading: "Mappings"
    description: "Define field types to control how data is indexed"
    link: "/mappings/"
  - heading: "API reference"
    description: "Full reference for all OpenSearch REST and gRPC APIs"
    link: "/api-reference/"
  - heading: "Query DSL"
    description: "Search your data using the OpenSearch query language"
    link: "/query-dsl/"
  - heading: "Vector search"
    description: "Use vector and AI-powered search to build modern search applications"
    link: "/vector-search/"
  - heading: "Machine learning"
    description: "Deploy models, connect to AI platforms, and build AI agents and assistants"
    link: "/ml-commons-plugin/"
getting_started:
  - heading: "Get started with OpenSearch"
    description: "Learn about OpenSearch and start ingesting and searching data"
    link: "/getting-started/"
    image: "/images/icons/OpenSearch-Core.png"
    image_alt: "OpenSearch Core icon"
  - heading: "Get started with OpenSearch Dashboards"
    description: "Learn about OpenSearch Dashboards applications and tools used to visualize data"
    link: "/dashboards/getting-started/"
    image: "/images/icons/OpenSearch-Dashboards.png"
    image_alt: "OpenSearch Dashboards icon"
  - heading: "Get started with vector search"
    description: "Learn about vector search options and build your first vector search application"
    link: "/vector-search/getting-started/"
    image: "/images/icons/Vector-search-icon.avif"
    image_alt: "Vector search icon"
  - heading: "Get started with OpenSearch security"
    description: "Learn about security in OpenSearch"
    link: "/security/getting-started/"
    image: "/images/icons/OpenSearch-Security.png"
    image_alt: "OpenSearch Security icon"
---

{%- comment -%}The `/docs/opensearch/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# ![OpenSearch icon]({{site.url}}{{site.baseurl}}/images/icons/OpenSearch-Core.png){: .heading-icon} OpenSearch and OpenSearch Dashboards
**Version {{site.opensearch_major_minor_version}}**
{: .label .label-blue }

This section contains documentation for OpenSearch and OpenSearch Dashboards.

## Getting started

{% include cards.html cards=page.getting_started %}

## Use cases

{% include cards.html cards=page.why_use documentation_link=true %}

## Popular documentation

{% include cards.html cards=page.features %}


## Get involved

[OpenSearch](https://opensearch.org) is supported by the OpenSearch Software Foundation. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).
The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://github.com/opensearch-project/.github/blob/main/CONTRIBUTING.md).

---

<!-- vale off -->
<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>
<!-- vale on -->