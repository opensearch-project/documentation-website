---
layout: default
title: Self-host maps server
nav_order: 6
---

# Self-host maps server

The self-host maps server for OpenSearch Dashboards allows users to access the default maps service on air-gapped environments. The server provides a map manifest with map tiles and vectors URL, map tiles URL, and map vectors URL that are compatible with OpenSearch.

The following steps walk through setting up and using the self-host maps server with OpenSearch Dashboards.

You can access the `maps-server` image via the OpenSearch official [Docker Hub repository](https://hub.docker.com/u/opensearchproject).
{: .note}

## Pull Docker image

Open your terminal and run the following command:

`docker pull opensearch/opensearch-maps-server`

## Set up the server

You must set up the map tiles before running the server. You have two setup options: 

### Option 1: Use the OpenSearch-provided maps service tiles set

Create a Docker volume to hold the tiles set:

`docker volume create tiles-data`

Download the tiles set from the OpenSearch maps service. Planet tiles sets are available for up to 8 zoom levels `https://maps.opensearch.org/offline/planet-osm-default-z0-z8.tar.gz` and up to 10 zoom levels `https://maps.opensearch.org/offline/planet-osm-default-z0-z10.tar.gz`.

```
docker run \
    -e DOWNLOAD_TILES=https://maps.opensearch.org/offline/planet-osm-default-z0-z8.tar.gz \
    -v tiles-data:/usr/src/app/public/tiles/data/ \
    opensearch/opensearch-maps-server \
    import
```

### Option 2: Generate the raster tile set

To generate the raster tiles images set, use the [raster tile generation pipeline](https://github.com/opensearch-project/maps/tree/main/tiles-generation/cdk) and then use the tile set absolute path to create a volume to start the server.

## Start the server

Use the following command to start the server using the Docker volume `tiles-data`. The command below is an example using host URL "localhost" and port "8080".  

```
docker run \
    -v tiles-data:/usr/src/app/public/tiles/data/ \
    -e HOST_URL='http://localhost' \
    -p 8080:8080 \
    opensearch/opensearch-maps-server \
    run
```

Or, if you generated raster tiles images, run the server using that tiles set. 

```
docker run \
    -v /absolute/path/to/tiles/:/usr/src/app/dist/public/tiles/data/ \
    -p 8080:8080 \
    opensearch/opensearch-maps-server \
    run
```
To access the images, open those URLs in a browser on the host or use curl `curl http://localhost:8080/manifest.json`. 


To confirm the server is running, you can access the following files on your localhost. To access the file, open the URLs in a browser on the host or use `curl http://localhost:8080/manifest.json`.

* Map manifest URL: `http://localhost:8080/manifest.json`
* Map tiles URL: `http://localhost:8080/tiles/data/{z}/{x}/{y}.png`
* Map tiles demo URL: `http://localhost:8080/`

## Use the self-host maps server with OpenSearch Dashboards

You can use the self-host maps server with OpenSearch Dashboards by either adding the parameter to `opensearch_dashboards.yml` or configuring the default WMS properties in OpenSearch Dashboards.

### Option 1: Configure opensearch_dashboards.yml

Configure the manifest URL in `opensearch_dashboards.yml`:

`map.opensearchManifestServiceUrl: "http://localhost:8080/manifest.json"`

### Option 2: Configure Default WMS properties in OpenSearch Dashboards

1. On the OpenSearch Dashboards console, select **Stack Management > Advanced Settings**. 
2. Locate `visualization:tileMap:WMSdefaults` under **Default WMS properties**. 
3. Change `"enabled": false` to `"enabled": true` and add the URL for the valid map server.

## Licenses

Tiles are generated per [Terms of Use for Natural Earth vector map data](https://www.naturalearthdata.com/about/terms-of-use/) and [Copyright and License for OpenStreetMap](https://www.openstreetmap.org/copyright).

## Related links

* [Configure WMS map server]({{site.url}}{{site.baseurl}}/dashboards/maptiles/)
* [Region map visualizations]({{site.url}}{{site.baseurl}}/dashboards/geojson-regionmaps/)