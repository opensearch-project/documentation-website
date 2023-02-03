---
layout: default
title: Configuring a web map service (WMS)
parent: Using coordinate and region maps
grand_parent: Building data visualizations with Visualize
nav_order: 5
redirect_from:
  - /docs/opensearch-dashboards/maptiles/
---

{%- comment -%}The `/docs/opensearch-dashboards/maptiles/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Configuring a web map service (WMS)

OpenSearch Dashboards includes default map tiles. To use specialized maps, you can configure a WMS by following these steps: 

1. Open and log in to OpenSearch Dashboards at `https://<host>:<port>`. Alternatively, you can connect to OpenSearch Dashboards by connecting to [https://localhost:5601](https://localhost:5601). The default username and password are `admin`. 
2. Choose **Management** > **Advanced Settings**.
3. Locate `visualization:tileMap:WMSdefaults`.
4. Change `enabled` to `true` and add the URL of a valid WMS server, as shown in the following example:

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

Web map services may have licensing fees or restrictions, and you are responsible for complying with any such fees or restrictions.
{: .note }
