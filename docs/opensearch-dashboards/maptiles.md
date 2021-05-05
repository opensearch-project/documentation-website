---
layout: default
title: WMS Map Server
parent: OpenSearch Dashboards
nav_order: 5
---

# Configure WMS map server

Due to licensing restrictions, the default installation of OpenSearch Dashboards does in OpenSearch doesn't include a map server for tile map visualizations. To configure OpenSearch Dashboards to use a WMS map server:

1. Open OpenSearch Dashboards at `https://<host>:<port>`. For example, [https://localhost:5601](https://localhost:5601).
1. If necessary, log in.
1. **Management**.
1. **Advanced Settings**.
1. Locate `visualization:tileMap:WMSdefaults`.
1. Change `enabled` to true, and add the URL of a valid WMS map server.

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

Map services often have licensing fees or restrictions. You are responsible for all such considerations on any map server that you specify.
{: .note }
