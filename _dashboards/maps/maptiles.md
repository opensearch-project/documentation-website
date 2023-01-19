---
layout: default
title: Configuring the Web Map Service
parent: Creating maps in OpenSearch Dashboards
nav_order: 10
redirect_from:
  - /docs/opensearch-dashboards/maptiles/
---

{%- comment -%}The `/docs/opensearch-dashboards/maptiles/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Configuring the Web Map Service

OpenSearch Dashboards includes default map tiles. If you need specialized maps, you can use the [Web Map Service (WMS)](https://www.ogc.org/standards/wms). 

Some map services have licensing fees or restrictions. You're responsible for all such considerations on any map server that you specify.
{: .note }

## Try it: Configuring your Dashboards and WMS

Follow these steps to configure your Dashboards and WMS. 

1. Open OpenSearch Dashboards at `https://<host>:<port>`. For example, [https://localhost:5601](https://localhost:5601).
2. If necessary, log in.
3. Choose **Management** and **Advanced Settings**.
4. Locate `visualization:tileMap:WMSdefaults`.
5. Change `enabled` to true, and add the URL of a valid WMS map server:

   ```json
   {
     "enabled": true,
     "url": "<wms-map-server-url>",
     "options": {
       "format": "image/png",
       "transparent": true
     }
   }
   ```
