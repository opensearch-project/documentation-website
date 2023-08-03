---
layout: default
title: IP2Geo
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 130
---

# IP2Geo
Introduced 2.9
{: .label .label-purple }

The `ip2geo` processor adds information about the geographical location of an IPv4 or IPv6 address. The `ip2geo` processor uses IP geolocation (GeoIP) data from an external endpoint and therefore requires an additional component, `datasource`, that defines from where to download GeoIP data and how frequently to update the data.

## Getting started

To get started with using the `ip2geo` processor, the `opensearch-geospatial` plugin must be installed. Learn more at [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Creating the IP2Geo data source

Create the IP2Geo data source by defining the endpoint value to download GeoIP data and specify the update interval.

OpenSearch provides the following endpoints for GeoLite2 City, GeoLite2 Country, and GeoLite2 ASN databases from [MaxMind](http://dev.maxmind.com/geoip/geoip2/geolite2/), shared under the CC BY-SA 4.0 license:

* GeoLite2 City: https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json
* GeoLite2 Country: https://geoip.maps.opensearch.org/v1/geolite2-country/manifest.json
* GeoLite2 ASN: https://geoip.maps.opensearch.org/v1/geolite2-asn/manifest.json

If a OpenSearch cluster cannot update a data source from the endpoints in 30 days, the cluster does not add GeoIP data to the documents, instead it adds `"error":"ip2geo_data_expired"`.

The following table lists the IP2Geo data source options.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| endpoint | no | https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json | The endpoint for downloading the GeoIP data. |
| update_interval_in_days | no | 3 | The frequency in days for updating the GeoIP data; minimum value is 1. |

The following code example shows how to create an IP2Geo data source.

#### Example: PUT request

```json
PUT /_plugins/geospatial/ip2geo/datasource/my-datasource
{
    "endpoint" : "https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json",
    "update_interval_in_days" : 3
}
```

The following code example shows the reponse to the preceding request. A true response means the request was successful and the server was able to process the request. A false reponse means check the request to make sure it is valid, check the URL to make sure it is correct, or try again.

#### Example: Successful response

```json
{
    "acknowledged":true
}
```

## Sending a GET request

To get information about one or more IP2Geo data sources, send a GET request.  

#### Example: GET request

```json
GET /_plugins/geospatial/ip2geo/datasource/my-datasource
```

#### Example: Response

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

## Updating an IP2Geo data source

To update an IP2Geo data source successfully, the GeoIP database from the new database's endpoint must contain all fields that the current database has. Otherwise, the update fails. 

#### Example: Update request

```json
{
    "endpoint": https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json,
    "update_interval_in_days": 10
}
```

#### Example: Response

```json
{
    "acknowledged":true
}
```

## Deleting the IP2Geo data source

 To delete the IP2Geo data source, you must delete all processors associated with the data source first. Otherwise, the DELETE request fails. 

#### Example: DELETE request

```json
DELETE /_plugins/geospatial/ip2geo/datasource/my-datasource
```

#### Example: Response

```json
{
  "acknowledged": true
}
```

## Creating the processor

Once the IP2Geo data source is created, you can create the `ip2geo` processor. 

#### Example: Create processor request

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

#### Example: Response

```json
{
	"acknowledged": true
}
```

## Creating the IP2Geo pipeline

The following table lists the `ip2geo` fields options for creating an IP2Geo pipeline.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| field | yes | - | The field to get the ip address for the geographical lookup. |
| datasource | yes | - | The data source name to look up geographical information. |
| properties | no |  All fields in `datasource`. | The field that controls what properties are added to `target_field` from `datasource`. |
| target_field | no | ip2geo | The field that holds the geographical information looked up from the data source. |
| ignore_missing | no | false | If `true` and `field` does not exist, the processor quietly exits without modifying the document. |

The following code is an example of using the `ip2geo` processor to add the geographical information to the `ip2geo` field based on the `ip` field.

```json
PUT /_ingest/pipeline/ip2geo
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

PUT /my-index/_doc/my-id?pipeline=ip2geo
{
  "ip": "172.0.0.1"
}

GET /my-index/_doc/my-id
{
   "_index":"my-index",
   "_id":"my-id",
   "_version":1,
   "_seq_no":0,
   "_primary_term":1,
   "found":true,
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
```

## Cluster settings

The IP2Geo data source and `ip2geo` processor node settings are listed in the following table.

| Key | Description | Default |
|--------------------|-------------|---------|
| plugins.geospatial.ip2geo.datasource.endpoint | Default endpoint for creating the data source API. | Defaults to https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json. |
| plugins.geospatial.ip2geo.datasource.update_interval_in_days | Default update interval for creating the data source API. | Defaults to 3. |
| plugins.geospatial.ip2geo.datasource.indexing_bulk_size | Maximum number of documents to ingest in a bulk request during the IP2Geo data source creation process. | Defaults to 10,000. |

 `ip2geo` processor | Description | Setting |
|-------------------|-------------|---------|
| plugins.geospatial.ip2geo.processor.max_bundle_size | Maximum number of searches to include in a multi-search request when enriching documents. | Defaults to 100.
| plugins.geospatial.ip2geo.processor.max_concurrent_searches | Maximum number of concurrent multi-search requests to run when enriching documents. | The default depends on your node count and search thread pool size. Higher values can improve performance, but risk overloading the cluster.
