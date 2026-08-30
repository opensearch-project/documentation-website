---
layout: default
title: LibreDB Studio
nav_order: 220
has_children: false
---

# LibreDB Studio

[LibreDB Studio](https://github.com/libredb/libredb-studio) is an open-source, web-based database editor that deploys next to the databases it connects to, as a container, a Helm chart, or an npm package. It connects to OpenSearch over the OpenSearch SQL plugin's HTTP endpoint (`POST /_plugins/_sql`), so there is no client library, driver, or install step on top of a running cluster.

To connect, open the New Connection dialog, select OpenSearch, and provide the cluster's host and port (OpenSearch defaults to port 9200):

![Selecting OpenSearch in the LibreDB Studio New Connection dialog]({{site.url}}{{site.baseurl}}/images/libredb-studio-connect.png)

Once connected, LibreDB Studio lists the cluster's indices in a schema browser and reads each index's field mappings to show the mapped fields and their OpenSearch types. The SQL editor runs OpenSearch SQL statements directly against those indices, including paginated queries with `LIMIT n OFFSET m`, which the OpenSearch SQL plugin accepts:

![Running a SELECT query against an OpenSearch index and viewing the typed results in LibreDB Studio]({{site.url}}{{site.baseurl}}/images/libredb-studio-query.png)

A monitoring view reports basic cluster information, including the OpenSearch version, total storage size, and per-index document counts and sizes:

![The LibreDB Studio monitoring overview for an OpenSearch connection]({{site.url}}{{site.baseurl}}/images/libredb-studio-monitoring.png)

For more information, see the [LibreDB Studio repository](https://github.com/libredb/libredb-studio).
