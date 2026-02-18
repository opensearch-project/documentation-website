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
  - heading: "Security and event information management"
    description: "Centralize logs to enable real-time security monitoring and forensic analysis"
    link: "/security/"
    image: "/images/icons/Icon_Security_Analytics-150x150.avif"
    image_alt: "Security analytics icon"
features:
  - heading: "Vector search"
    description: "Build AI/ML-powered vector search applications"
    link: "/vector-search/"
    image: "/images/icons/Vector-search-icon.avif"
    image_alt: "Vector search icon"
  - heading: "Machine learning"
    description: "Integrate machine learning models into your workloads"
    link: "/ml-commons-plugin/"
    image: "/images/icons/OpenSearch-AI-1.png"
    image_alt: "Machine learning icon"
  - heading: "Customizing your search"
    description: "From optimizing performance to improving relevance, customize your search experience"
    link: "/search-plugins/"
    image: "/images/icons/OpenSearch-Search.png"
    image_alt: "Search customization icon"
  - heading: "Workflow automation"
    description: "Automate complex OpenSearch setup and preprocessing tasks"
    link: "/automating-configurations/"
    image: "/images/icons/Workflow-Icon.avif"
    image_alt: "Workflow automation icon"
  - heading: "Anomaly detection"
    description: "Identify atypical data and receive automatic notifications"
    link: "/monitoring-plugins/ad/"
    image: "/images/icons/OpenSearch-Observability.png"
    image_alt: "Observability and anomaly detection icon"
  - heading: "Building visualizations"
    description: "Visualize your data in OpenSearch Dashboards"
    link: "/dashboards/"
    image: "/images/icons/OpenSearch-Dashboards-Square.png"
    image_alt: "OpenSearch Dashboards icon"
getting_started:
  - heading: "Get started with OpenSearch"
    description: "Learn about OpenSearch and start ingesting and searching data"
    link: "/getting-started/"
    image: "/images/icons/OpenSearch-Core.png"
    image_alt: "OpenSearch Core icon"
  - heading: "Get started with OpenSearch Dashboards"
    description: "Learn about OpenSearch Dashboards applications and tools used to visualize data"
    link: "/dashboards/quickstart/"
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

## Why use OpenSearch?

{% include cards.html cards=page.why_use documentation_link=true %}

## Key features

{% include cards.html cards=page.features%}


## Get involved

[OpenSearch](https://opensearch.org) is supported by the OpenSearch Software Foundation. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).
The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://github.com/opensearch-project/.github/blob/main/CONTRIBUTING.md).

---

<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>
