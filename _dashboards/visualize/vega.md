---
layout: default
title: Vega
parent: Building data visualizations
nav_order: 50
---

# Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization tools that you can use to create custom data visualizations with your OpenSearch data and [Vega Data](https://vega.github.io/vega/docs/data/). These tools are ideal for advanced users comfortable with writing OpenSearch queries directly. Enable the `vis_type_vega` plugin in your `opensearch_dashboards.yml` file to write your [Vega specifications](https://vega.github.io/vega/docs/specification/) in either JSON or [HJSON](https://hjson.github.io/) format or to specify one or more OpenSearch queries within your Vega specification. By default, the plugin is set to `true`. 

Enable the following configuration to use Vega visualizations in OpenSearch Dashboards. For configuration details, refer to the `vis_type_vega` [README](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/vis_type_vega/README.md).

```
vis_type_vega.enabled: true
```

The following image shows a custom Vega map created in OpenSearch.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vega-2.png" alt="Map created using Vega visualization in OpenSearch Dashboards">

## Visualizing data from multiple data sources
Introduced 2.13
{: .label .label-purple }

If you have configured [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) in OpenSearch Dashboards, you can use Vega to query those data sources. Within your Vega specification, add the `data_source_name` field under the `url` property to target a specific data source by name. By default, queries use data from the local cluster. You can assign individual `data_source_name` values to each OpenSearch query within your Vega specification. This allows you to query multiple indexes across different data sources in a single visualization.

The following is an example Vega specification with `Demo US Cluster` as the specified `data_source_name`:

```json
{
  $schema: https://vega.github.io/schema/vega/v5.json
  config: {
    kibana: {type: "map", latitude: 25, longitude: -70, zoom: 3}
  }
  data: [
    {
      name: table
      url: {
        index: opensearch_dashboards_sample_data_flights
        // This OpenSearchQuery will query from the Demo US Cluster datasource
        data_source_name: Demo US Cluster
        %context%: true
        // Uncomment to enable time filtering
        // %timefield%: timestamp
        body: {
          size: 0
          aggs: {
            origins: {
              terms: {field: "OriginAirportID", size: 10000}
              aggs: {
                originLocation: {
                  top_hits: {
                    size: 1
                    _source: {
                      includes: ["OriginLocation", "Origin"]
                    }
                  }
                }
                distinations: {
                  terms: {field: "DestAirportID", size: 10000}
                  aggs: {
                    destLocation: {
                      top_hits: {
                        size: 1
                        _source: {
                          includes: ["DestLocation"]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      format: {property: "aggregations.origins.buckets"}
      transform: [
        {
          type: geopoint
          projection: projection
          fields: [
            originLocation.hits.hits[0]._source.OriginLocation.lon
            originLocation.hits.hits[0]._source.OriginLocation.lat
          ]
        }
      ]
    }
    {
      name: selectedDatum
      on: [
        {trigger: "!selected", remove: true}
        {trigger: "selected", insert: "selected"}
      ]
    }
  ]
  signals: [
    {
      name: selected
      value: null
      on: [
        {events: "@airport:mouseover", update: "datum"}
        {events: "@airport:mouseout", update: "null"}
      ]
    }
  ]
  scales: [
    {
      name: airportSize
      type: linear
      domain: {data: "table", field: "doc_count"}
      range: [
        {signal: "zoom*zoom*0.2+1"}
        {signal: "zoom*zoom*10+1"}
      ]
    }
  ]
  marks: [
    {
      type: group
      from: {
        facet: {
          name: facetedDatum
          data: selectedDatum
          field: distinations.buckets
        }
      }
      data: [
        {
          name: facetDatumElems
          source: facetedDatum
          transform: [
            {
              type: geopoint
              projection: projection
              fields: [
                destLocation.hits.hits[0]._source.DestLocation.lon
                destLocation.hits.hits[0]._source.DestLocation.lat
              ]
            }
            {type: "formula", expr: "{x:parent.x, y:parent.y}", as: "source"}
            {type: "formula", expr: "{x:datum.x, y:datum.y}", as: "target"}
            {type: "linkpath", shape: "diagonal"}
          ]
        }
      ]
      scales: [
        {
          name: lineThickness
          type: log
          clamp: true
          range: [1, 8]
        }
        {
          name: lineOpacity
          type: log
          clamp: true
          range: [0.2, 0.8]
        }
      ]
      marks: [
        {
          from: {data: "facetDatumElems"}
          type: path
          interactive: false
          encode: {
            update: {
              path: {field: "path"}
              stroke: {value: "black"}
              strokeWidth: {scale: "lineThickness", field: "doc_count"}
              strokeOpacity: {scale: "lineOpacity", field: "doc_count"}
            }
          }
        }
      ]
    }
    {
      name: airport
      type: symbol
      from: {data: "table"}
      encode: {
        update: {
          size: {scale: "airportSize", field: "doc_count"}
          xc: {signal: "datum.x"}
          yc: {signal: "datum.y"}
          tooltip: {
            signal: "{title: datum.originLocation.hits.hits[0]._source.Origin + ' (' + datum.key + ')', connnections: length(datum.distinations.buckets), flights: datum.doc_count}"
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Creating Vega visualizations using multiple data sources with OpenSearch Dashboards

Before proceeding, ensure that the following configuration is enabled in your `opensearch_dashboards.yml` file:

```yml
vis_type_vega.enabled: true
```

### Step 1: Set up and connect data sources

Open OpenSearch Dashboards and follow these steps:

1. From the left-side menu, navigate to **Dashboards Management** and select **Data sources**. 
2. Select **Create data source connection** and then add your data source.
3. From the **Data source** dropdown menu, select the data source you created.
4. From the **Home** page, select **Add sample data**. For this tutorial, select **Sample web logs**.

### Step 2: Create the visualization

1. From the left-side menu, select **Visualize**.
2. From the **Visualizations** page, select **Create Visualization** and then select **Vega** from the pop-up window, as shown in the following images.

    <img src="{{site.url}}{{site.baseurl}}/images/vega.png" alt="Visualizations selection menu" width="700">

### Step 3: Add the Vega specification

1. Verify that the data source you created is specified under `data_source_name`.
2. Copy the following Vega specification.

```json
{
  $schema: https://vega.github.io/schema/vega-lite/v5.json
  data: {
    url: {
      %context%: true
      %timefield%: @timestamp
      index: opensearch_dashboards_sample_data_logs
      data_source_name: YOUR_DATA_SOURCE_TITLE
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
    format: {
      property: aggregations.1.buckets
    }
  }
  transform: [
    {
      calculate: datum.key
      as: timestamp
    }
    {
      calculate: datum[2].value
      as: bytes
    }
  ]
  layer: [
    {
      mark: {
        type: line
      }
    }
    {
      mark: {
        type: circle
        tooltip: true
      }
    }
  ]
  encoding: {
    x: {
      field: timestamp
      type: temporal
      axis: {
        title: @timestamp
      }
    }
    y: {
      field: bytes
      type: quantitative
      axis: {
        title: Average bytes
      }
    }
    color: {
      datum: Average bytes
      type: nominal
    }
  }
}
```

3. Select the **Update** button in the lower-right corner to visualize your data, as shown in the following GIF.

    <img src="{{site.url}}{{site.baseurl}}images/make_vega.gif" alt="Visualizations selection menu">

## Resources

The following resources provide additional information about Vega visualizations in OpenSearch Dashboards:

- [Improving ease of use in OpenSearch Dashboards with Vega visualizations](https://opensearch.org/blog/Improving-Dashboards-usability-with-Vega/)
