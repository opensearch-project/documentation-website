---
layout: default
title: Using Web Map Service
parent: Creating maps in OpenSearch Dashboards
nav_order: 10
redirect_from:
  - /docs/opensearch-dashboards/maptiles/
---

{%- comment -%}The `/docs/opensearch-dashboards/maptiles/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Using Web Map Service

OpenSearch supports [Web Map Service (WMS)](https://www.ogc.org/standards/wms).  WMS is necessary for customizing region and coordinate maps in OpenSearch Dashboards.

To add a WMS custom map, perform the following steps: 

1. On the top menu bar, go to **OpenSearch Plugins > Maps**.
1. Select **Create map**. You can now see the default OpenSearch basemap.
1. In the **Layers** panel, select **Add layer**.
1. In the **Custom type** dropdown list, select **Web Map Service (WMS)**.
1. In the Data tab, enter data for the required fields:
   - WMS URL
   - WMS layers
   - WMS version
   - WMS format
1. (Optional) Enter data for the optional fields:
   - WMS CRS
   - WMS box
   - WMS attribution
   - WMS styles
1. Select the **Settings** tab to edit the layer settings.
1. Enter the layer name in Name.
1. (Optional) Enter the layer description in Description.
1. (Optional) Select the zoom levels and opacity for this layer.
1. Select **Update**.

## Related links

- [Using region maps](dashboards/visualize/geojson-regionmaps/)