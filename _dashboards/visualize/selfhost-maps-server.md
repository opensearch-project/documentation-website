---
layout: default
title: Using the self-host maps server
grand_parent: Building data visualizations
parent: Using coordinate and region maps
nav_order: 40
redirect_from:
  - /dashboards/selfhost-maps-server/
---

# Using the self-host maps server

The self-host maps server for OpenSearch Dashboards allows users to access the default maps service in air-gapped environments. OpenSearch-compatible map URLs include a map manifest with map tiles and vectors, the map tiles, and the map vectors.

The following sections provide steps for setting up and using the self-host maps server with OpenSearch Dashboards.

You can access the `maps-server` image via the official OpenSearch [Docker Hub repository](https://hub.docker.com/u/opensearchproject).
{: .note}

## Pulling the Docker image

Open your terminal and run the following command:

`docker pull opensearchproject/opensearch-maps-server:1.0.0`

## Setting up the server

You must set up the map tiles before running the server. You have two setup options: Use the OpenSearch-provided maps service tiles set, or generate the raster tiles set.

### Option 1: Use the OpenSearch-provided maps service tiles set

Create a Docker volume to hold the tiles set:

`docker volume create tiles-data`

Download the tiles set from the OpenSearch maps service. Two planet tiles sets are available based on the desired zoom level:

- Zoom Level 8 (https://maps.opensearch.org/offline/planet-osm-default-z0-z8.tar.gz)
- Zoom level 10 (https://maps.opensearch.org/offline/planet-osm-default-z0-z10.tar.gz)

The planet tiles set for zoom level 10 (2 GB compressed/6.8 GB uncompressed) is approximately 10 times larger than the set for zoom level 8 (225 MB compressed/519 MB uncompressed).
{: .note} 

```
docker run \
    -e DOWNLOAD_TILES=https://maps.opensearch.org/offline/planet-osm-default-z0-z8.tar.gz \
    -v tiles-data:/usr/src/app/public/tiles/data/ \
    opensearch/opensearch-maps-server \
    import
```

### Option 2: Generate the raster tiles set

To generate the raster tiles set, use the [raster tile generation pipeline](https://github.com/opensearch-project/maps/tree/main/tiles-generation/cdk) and then use the tiles set absolute path to create a volume to start the server.

## Starting the server

Use the following command to start the server using the Docker volume `tiles-data`. The following command is an example using host URL "localhost" and port "8080":

```
docker run \
    -v tiles-data:/usr/src/app/public/tiles/data/ \
    -e HOST_URL='http://localhost' \
    -p 8080:8080 \
    opensearch/opensearch-maps-server \
    run
```

Or, if you generated the raster tiles set, run the server using that tiles set:

```
docker run \
    -v /absolute/path/to/tiles/:/usr/src/app/dist/public/tiles/data/ \
    -p 8080:8080 \
    opensearch/opensearch-maps-server \
    run
```
To access the tiles set, open the URLs in a browser on the host or use the `curl` command `curl http://localhost:8080/manifest.json`. 


Confirm the server is running by opening each of the following links in a browser on your host or with a `curl` command (for example, `curl http://localhost:8080/manifest.json`).

* Map manifest URL: `http://localhost:8080/manifest.json`
* Map tiles URL: `http://localhost:8080/tiles/data/{z}/{x}/{y}.png`
* Map tiles demo URL: `http://localhost:8080/`

## Using the self-host maps server with OpenSearch Dashboards

You can use the self-host maps server with OpenSearch Dashboards by either adding the parameter to `opensearch_dashboards.yml` or configuring the default WMS properties in OpenSearch Dashboards.

### Option 1: Configure opensearch_dashboards.yml

Configure the manifest URL in `opensearch_dashboards.yml`:

`map.opensearchManifestServiceUrl: "http://localhost:8080/manifest.json"`

### Option 2: Configure Default WMS properties in OpenSearch Dashboards

1. On the OpenSearch Dashboards console, select **Dashboards Management** > **Advanced Settings**. 
2. Locate `visualization:tileMap:WMSdefaults` under **Default WMS properties**. 
3. Change `"enabled": false` to `"enabled": true` and add the URL for the valid map server.

## Licenses

Tiles are generated per [Terms of Use for Natural Earth vector map data](https://www.naturalearthdata.com/about/terms-of-use/) and [Copyright and License for OpenStreetMap](https://www.openstreetmap.org/copyright).

## Related articles

* [Configuring a Web Map Service (WMS)]({{site.url}}{{site.baseurl}}/dashboards/visualize/maptiles/)
* [Using coordinate and region maps]({{site.url}}{{site.baseurl}}/dashboards/visualize/geojson-regionmaps/)
