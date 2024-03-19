---
layout: default
title: Using Vega
parent: Building data visualizations
nav_order: 45
---

# Using Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization tools that you can use to create custom data visualizations from your OpenSearch data and  [Vega Data](https://vega.github.io/vega/docs/data/). These tools are ideal for advanced users comfortable writing OpenSearch queries directly. Enable the Vega plugin in your `opensearch_dsahboards.yml` file to write your [Vega specifications](https://vega.github.io/vega/docs/specification/) in either JSON or [HJSON](https://hjson.github.io/) format or to specify one or more OpenSearch queries within your Vega specification. The configuration is shown in the following example. For configuration details, go to the `vis_type_vega` [README](insert-link-to-plugin-config-file).

```
vis_type_vega.enabled: true
```

The following image shows a custom Vega map created in OpenSearch. 

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vega-2.png" alt="Map created using Vega visualization in OpenSearch Dashboards">

## Querying from multiple data sources

If you have configured [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) in OpenSearch Dashboards, you can use Vega to query those data sources. Within your Vega specification, add the `data_source_name` field under the `url` property to target a specific data source by name. By default, queries use data from the local cluster. You can assign individual `data_source_name` values to each OpenSearch query within your Vega specification. This allow you to query multiple indexes across different data sources in a single visualization.

The following is an example Vega specification:

```
url: {
    %context%: true
    %timefield%: @timestamp
    index: opensearch_dashboards_sample_data_logs
    // This OpenSearchQuery will query from the Demo US Cluster datasource
    data_source_name: Demo US Cluster
    body: {
    aggs: {
        1: {
        date_histogram: {
            field: @timestamp
            fixed_interval: 3h
            time_zone: America/Los_Angeles
            min_doc_count: 1
        }
        aggs: {
            2: {
            avg: {
                field: bytes
            }
            }
        }
        }
    }
    size: 0
    }
}
```
{% include copy-curl.html %}
