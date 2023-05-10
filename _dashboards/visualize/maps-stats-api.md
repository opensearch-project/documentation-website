---
layout: default
title: Maps Stats API
nav_order: 20
grand_parent: Building data visualizations
parent: Using coordinate and region maps 
has_children: false
---

# Maps Stats API
Introduced 2.7
{: .label .label-purple }

When you create and save a [map]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/) in OpenSearch Dashboards, the map becomes a saved object of type `map`. The Maps Stats API provides information about such saved objects in OpenSearch Dashboards. 

#### Example request

You can access the Maps Stats API by providing its URL address in the following format:

```
<opensearch-dashboards-endpoint-address>/api/maps-dashboards/stats
```

The OpenSearch Dashboards endpoint address may contain a port number if it is specified in the OpenSearch configuration file. The specific URL format depends on the type of OpenSearch deployment and the network environment in which it is hosted.
{: .note}  

You can query the endpoint in two ways:
  
  - By accessing the endpoint address (for example, `http://localhost:5601/api/maps-dashboards/stats`) in a browser

  - By using the `curl` command in the terminal:
    ```bash
    curl -X GET http://localhost:5601/api/maps-dashboards/stats
    ```
    {% include copy.html %}

#### Example response

The following is the response for the preceding request:

```json
{
   "maps_total":4,  
   "layers_filters_total":4, 
   "layers_total":{ 
      "opensearch_vector_tile_map":2, 
      "documents":7, 
      "wms":1, 
      "tms":2 
   },
   "maps_list":[
      {
         "id":"88a24e6c-0216-4f76-8bc7-c8db6c8705da", 
         "layers_filters_total":4,
         "layers_total":{
            "opensearch_vector_tile_map":1,
            "documents":3,
            "wms":0,
            "tms":0
         }
      },
      {
         "id":"4ce3fe50-d309-11ed-a958-770756e00bcd",
         "layers_filters_total":0,
         "layers_total":{
            "opensearch_vector_tile_map":0,
            "documents":2,
            "wms":0,
            "tms":1
         }
      },
      {
         "id":"af5d3b90-d30a-11ed-a605-f7ad7bc98642",
         "layers_filters_total":0,
         "layers_total":{
            "opensearch_vector_tile_map":1,
            "documents":1,
            "wms":0,
            "tms":1
         }
      },
      {
         "id":"5ca1ec10-d30b-11ed-a042-93d8ff0f09ee",
         "layers_filters_total":0,
         "layers_total":{
            "opensearch_vector_tile_map":0,
            "documents":1,
            "wms":1,
            "tms":0
         }
      }
   ]
}
```

## Response fields

The response contains statistics for the following layer types:

- Basemaps: Either a default OpenSearch map or custom base layer maps.

- WMS layers: Custom WMS base layer maps.

- TMS layers: Custom TMS base layer maps.

- Document layers: The map's data layers.

For more information about the layer types, see [Adding layers]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/#adding-layers).

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- | 
| `maps_total` | Integer | The total number of maps registered as saved objects with the Maps plugin. |
| `layers_filters_total` | Integer | The total number of filters for all layers in all maps. This includes [layer-level filters]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/#filtering-data-at-the-layer-level) but excludes global filters like [shape filters]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/#drawing-shapes-to-filter-data). |
| `layers_total` | Object | Totals statistics for all layers in all maps. |
| `layers_total.opensearch_vector_tile_map` | Integer | The total number of OpenSearch basemaps in all maps. |
| `layers_total.documents` | Integer | The total number of document layers in all maps. |
| `layers_total.wms` | Integer | The total number of WMS layers in all maps. |
| `layers_total.tms` | Integer | The total number of TMS layers in all maps. |
| `maps_list` | Array | A list of all maps saved in OpenSearch Dashboards. |

Each map in the `map_list` contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- | 
| `id` | String | The map's saved object ID. |
| `layers_filters_total` | Integer | The total number of filters for all layers in the map. This includes [layer-level filters]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/#filtering-data-at-the-layer-level) but excludes global filters like [shape filters]({{site.url}}{{site.baseurl}}/dashboards/visualize/maps/#drawing-shapes-to-filter-data) . |
| `layers_total` | Object | Totals statistics for all layers in the map. |
| `layers_total.opensearch_vector_tile_map` | Integer | The total number of OpenSearch basemaps in the map. |
| `layers_total.documents` | Integer | The total number of document layers in the map. |
| `layers_total.wms` | Integer | The total number of WMS layers in the map. |
| `layers_total.tms` | Integer | The total number of TMS layers in the map. |

The saved object ID helps you navigate to a particular map because the ID is the last part of the map's URL. For example, in OpenSearch Playground, the address of the `[Flights] Flights Status on Maps Destination Location` map is `https://playground.opensearch.org/app/maps-dashboards/88a24e6c-0216-4f76-8bc7-c8db6c8705da`, where `88a24e6c-0216-4f76-8bc7-c8db6c8705da` is the saved object ID for this map.
{: .tip}
