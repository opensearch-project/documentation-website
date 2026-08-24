---
layout: default
title: Concepts
parent: Getting started
nav_order: 60
---

# OpenSearch Dashboards concepts

This page defines key terms used throughout the OpenSearch Dashboards documentation.

## OpenSearch Dashboards terminology

- **_OpenSearch Dashboards_**: The web UI for OpenSearch. This is the application you access in your browser.
- **Dashboards** application: The application within OpenSearch Dashboards for assembling visualizations into a single page. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
- _dashboard_ (lowercase): An individual page of data visualizations created in the **Dashboards** application.
- **Visualize** application: The application within OpenSearch Dashboards for creating individual charts, maps, and tables. See [Creating visualizations in the Visualize application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/).
- _visualization_: A single panel containing a graph, chart, map, or other visual representation of data.
- **Discover** application: The application within OpenSearch Dashboards for searching, filtering, and examining data. See [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
- [**OpenSearch Playground**](https://playground.opensearch.org/app/home#/): A read-only, web-based OpenSearch Dashboards instance with preloaded sample data. Use it to explore OpenSearch Dashboards without installing anything.

## Data concepts

- _index_: A collection of related documents stored in OpenSearch. See [Indexes]({{site.url}}{{site.baseurl}}/getting-started/intro/#index).
- _document_: The basic unit of information in OpenSearch, stored as a JSON object. See [Documents]({{site.url}}{{site.baseurl}}/getting-started/intro/#document).
- _index pattern_: A view into one or more indexes that you use as a data source in OpenSearch Dashboards. Also called a _data source_ in some contexts. See [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).
- _field_: A single named value within a document, equivalent to a column in a relational database table.
- _bucket_: A grouping of field values based on an aggregation. Buckets can be categorical (based on text values), range-based (user-defined numeric ranges), histogram-based (automatically sized numeric intervals), or time-based (segments of a timestamp field).
- _aggregation_: A computation that summarizes data across documents, such as calculating counts, averages, sums, or grouping documents into buckets. See [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).
- _saved object_: Any item you save in OpenSearch Dashboards, including visualizations, dashboards, index patterns, and saved searches.

## Workspaces

A _workspace_ is an isolated environment in OpenSearch Dashboards that organizes applications and saved objects by use case (for example, Analytics or Observability). See [Workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/).

## Query languages

OpenSearch Dashboards supports several query languages:

- [**Dashboards Query Language (DQL)**]({{site.url}}{{site.baseurl}}/dashboards/dql/): A simple text-based language for filtering data in the Discover and Dashboards search bars.
- [**Piped Processing Language (PPL)**]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/): A pipe-based language for data processing and analysis. Used in the Query Workbench and the visualization editor.
- [**Query DSL**]({{site.url}}{{site.baseurl}}/query-dsl/): The full OpenSearch query language, used in the Dev Tools console and API requests.
- [**SQL**]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql/): Standard SQL syntax for querying OpenSearch data. Used in the Query Workbench.

## Next steps

Explore the full documentation for each application:

- [Exploring data with Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/)
- [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/)
- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/)
