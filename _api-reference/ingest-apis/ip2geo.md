---
layout: default
title: IP2Geo
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 130
---

# IP2Geo
Introduced 2.10
{: .label .label-purple }

The `ip2geo` processor adds information about the geographical location of an IPv4 or IPv6 address. The `ip2geo` processor uses IP geolocation (GeoIP) data from an external endpoint and therefore requires an additional component, `datasource`, that defines from where to download GeoIP data and how frequently to update the data.

The `ip2geo` processor maintains the GeoIP data mapping in system indexes. The GeoIP mapping is retrieved from these indexes during data ingestion to perform the IP-to-geolocation conversion on the incoming data. For optimal performance, it is preferable to have a node with both ingest and data roles. This configuration avoids internode calls, reducing latency. Also, as the `ip2geo` processor searches GeoIP mapping data from the indexes, search performance is impacted.
{: .note}

## Getting started

To get started with the `ip2geo` processor, the `opensearch-geospatial` plugin must be installed. See [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) to learn more.

## Cluster settings

The IP2Geo data source and `ip2geo` processor node settings are listed in the following table.

| Key | Description | Default |
|--------------------|-------------|---------|
| plugins.geospatial.ip2geo.datasource.endpoint | Default endpoint for creating the data source API. | Defaults to https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json. |
| plugins.geospatial.ip2geo.datasource.update_interval_in_days | Default update interval for creating the data source API. | Defaults to 3. |
| plugins.geospatial.ip2geo.datasource.batch_size | Maximum number of documents to ingest in a bulk request during the IP2Geo data source creation process. | Defaults to 10,000. |
| plugins.geospatial.ip2geo.processor.cache_size | Maximum number of results that can be cached. There is only single cache used for all IP2Geo processors in each node | Defaults to 1,000. |
|-------------------|-------------|---------|

## Creating the IP2Geo data source

Before creating the pipeline that uses the `ip2geo` processor, create the IP2Geo data source. The data source defines the endpoint value to download GeoIP data and specifies the update interval.

OpenSearch provides the following endpoints for GeoLite2 City, GeoLite2 Country, and GeoLite2 ASN databases from [MaxMind](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data), which is shared under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license:

* GeoLite2 City: https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json
* GeoLite2 Country: https://geoip.maps.opensearch.org/v1/geolite2-country/manifest.json
* GeoLite2 ASN: https://geoip.maps.opensearch.org/v1/geolite2-asn/manifest.json

If an OpenSearch cluster cannot update a data source from the endpoints in 30 days, the cluster does not add GeoIP data to the documents, instead it adds `"error":"ip2geo_data_expired"`.

### Data source options

The following table lists the data source options for the `ip2geo` processor.   

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `endpoint` | Optional | https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json | The endpoint for downloading the GeoIP data. |
| `update_interval_in_days` | Optional | 3 | The frequency in days for updating the GeoIP data. The minimum value is 1. |

The following example creates an IP2Geo data source:

```json
PUT /_plugins/geospatial/ip2geo/datasource/my-datasource
{
    "endpoint" : "https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json",
    "update_interval_in_days" : 3
}
```
{% include copy-curl.html %}

A `true` response means the request was successful and the server was able to process the request. A `false` reponse means check the request to make sure it is valid, check the URL to make sure it is correct, or try again.
{. :tip}

### Sending a GET request

To get information about one or more IP2Geo data sources, send a GET request:  

```json
GET /_plugins/geospatial/ip2geo/datasource/my-datasource
```
{% include copy-curl.html %}

You'll get the following response:

```json
{
  "datasources": [
    {
      "name": "my-datasource",
      "state": "AVAILABLE",
      "endpoint": "https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json",
      "update_interval_in_days": 3,
      "next_update_at_in_epoch_millis": 1685125612373,
      "database": {
        "provider": "maxmind",
        "sha256_hash": "0SmTZgtTRjWa5lXR+XFCqrZcT495jL5XUcJlpMj0uEA=",
        "updated_at_in_epoch_millis": 1684429230000,
        "valid_for_in_days": 30,
        "fields": [
          "country_iso_code",
          "country_name",
          "continent_name",
          "region_iso_code",
          "region_name",
          "city_name",
          "time_zone",
          "location"
        ]
      },
      "update_stats": {
        "last_succeeded_at_in_epoch_millis": 1684866730192,
        "last_processing_time_in_millis": 317640,
        "last_failed_at_in_epoch_millis": 1684866730492,
        "last_skipped_at_in_epoch_millis": 1684866730292
      }
    }
  ]
}
```

### Updating an IP2Geo data source

See [Creating the IP2Geo data source]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-pipelines/ip2geo/#creating-the-ip2geo-data-source) for endpoints and request field descriptions. 

The following example updates the data source:

```json
PUT /_plugins/geospatial/ip2geo/datasource/my-datasource/_settings
{
    "endpoint": https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json,
    "update_interval_in_days": 10
}
```
{% include copy-curl.html %}

### Deleting the IP2Geo data source

 To delete the IP2Geo data source, you must first delete all processors associated with the data source. Otherwise, the request fails. 

The following example deletes the data source:

```json
DELETE /_plugins/geospatial/ip2geo/datasource/my-datasource
```
{% include copy-curl.html %}

## Creating the pipeline

Once the data source is created, you can create the pipeline. The syntax for the `ip2geo` processor is:

```json 
{
  "ip2geo": {
    "field":"ip",
    "datasource":"my-datasource"
  }
}
```
{% include copy-curl.html %}

### Configuration parameters

The following table lists the required and optional parameters for the `ip2geo` processor.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `field` | Required | - | The field that contains the IP address for geographical lookup. |
| `datasource` | Required | - | The data source name to use to look up geographical information. |
| `properties` | Optional |  All fields in `datasource`. | The field that controls what properties are added to `target_field` from `datasource`. |
| `target_field` | Optional | ip2geo | The field that holds the geographical information looked up from the data source. |
| `ignore_missing` | Optional | false | If `true` and `field` does not exist, the processor quietly exits without modifying the document. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create pipeline.**

The following query creates a pipeline, named `my-pipeline`, that converts the IP address to geographical information:

```json
PUT /_ingest/pipeline/my-pipeline
{
   "description":"convert ip to geo",
   "processors":[
    {
        "ip2geo":{
            "field":"ip",
            "datasource":"my-datasource"
        }
    }
   ] 
}
```
{% include copy-curl.html %}

**Step 2: Ingest a document into the index.**

The following query ingests a document into the index named `my-index`:

```json
PUT /my-index/_doc/my-id?pipeline=ip2geo
{
  "ip": "172.0.0.1"
}
```
{% include copy-curl.html %}

**Step 3: View the ingested document.** 

To view the ingested document, run the following query:

```json
GET /my-index/_doc/my-id
```
{% include copy-curl.html %}

**Step 4: Test the pipeline.** 

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/my-id/_simulate
{
  "docs": [
    {
      "_index":"my-index",
      "_id":"my-id",
      "_source":{
        "my_ip_field":"172.0.0.1",
        "ip2geo":{
         "continent_name":"North America",
         "region_iso_code":"AL",
         "city_name":"Calera",
         "country_iso_code":"US",
         "country_name":"United States",
         "region_name":"Alabama",
         "location":"33.1063,-86.7583",
         "time_zone":"America/Chicago"
         }
      }
    }
  ]
}
```
{% include copy-curl.html %}

You'll get the following response, which confirms the pipeline is working correctly and producing the expected output: 

<insert response following code freeze>
