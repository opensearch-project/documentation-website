---
layout: default
title: Using Vega
parent: Building data visualizations
nav_order: 45
---

# Using Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization grammars for creating and interacting with custom-made data visualizations. These visualizations enable advanced users comfortable with writing manual OpenSearch queries the ability to render custom visualizations and [Vega Data](https://vega.github.io/vega/docs/data/). In addition to supporting most of Vega and Vega-Lite features, the Vega plugin supports the following:
- Write the [Vega specification](https://vega.github.io/vega/docs/specification/) in either JSON or [HJSON](https://hjson.github.io/) formats
- Specify one or multiple OpenSearch queries to use as your named data

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vega-2.png" alt="Vega maps visualization">

## Querying from Multiple Data Sources
If you have configured multiple data sources in your OpenSearch Dashboards, you can optionally write queries to specific data sources. In your Vega specification, you can add the field `data_source_name` under the `url` body and specify a data source name. If `data_source_name` is not provided, the query will search data in the local cluster. You can specify individual `data_source_name` fields to each OpenSearch query too to enable queries on multiple indexes on multiple data sources.

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
