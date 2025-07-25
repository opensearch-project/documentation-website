---
layout: default
title: Using Vega
parent: Building data visualizations
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/dashboards/visualize/vega/
---

# Using Vega

[Vega](https://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) are open-source, declarative language visualization tools that you can use to create custom data visualizations with your OpenSearch data and [Vega Data](https://vega.github.io/vega/docs/data/). These tools are ideal for advanced users comfortable with writing OpenSearch queries directly. Enable the `vis_type_vega` plugin in your `opensearch_dashboards.yml` file to write your [Vega specifications](https://vega.github.io/vega/docs/specification/) in either JSON or [HJSON](https://hjson.github.io/) format or to specify one or more OpenSearch queries within your Vega specification. By default, the plugin is set to `true`. The configuration is shown in the following example. For configuration details, refer to the `vis_type_vega` [README](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/vis_type_vega/README.md).

```
vis_type_vega.enabled: true
```

The following image shows a custom Vega map created in OpenSearch.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vega-2.png" alt="Map created using Vega visualization in OpenSearch Dashboards">

## Querying from multiple data sources

If you have configured [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) in OpenSearch Dashboards, you can use Vega to query those data sources. Within your Vega specification, add the `data_source_name` field under the `url` property to target a specific data source by name. By default, queries use data from the local cluster. You can assign individual `data_source_name` values to each OpenSearch query within your Vega specification. This allows you to query multiple indexes across different data sources in a single visualization.

The following is an example Vega specification with `Demo US Cluster` as the specified `data_source_name`:

```
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
