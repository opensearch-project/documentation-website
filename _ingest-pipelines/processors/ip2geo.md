---
layout: default
title: IP2Geo
parent: Ingest processors
nav_order: 130
redirect_from:
   - /api-reference/ingest-apis/processors/ip2geo/
---

# IP2Geo
**Introduced 2.10**
{: .label .label-purple }

The `ip2geo` processor adds information about the geographical location of an IPv4 or IPv6 address. The `ip2geo` processor uses IP geolocation (GeoIP) data from an external endpoint and therefore requires an additional component, `datasource`, that defines from where to download GeoIP data and how frequently to update the data.

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/info-icon.png" class="inline-icon" alt="info icon"/>{:/} **NOTE**<br>The `ip2geo` processor maintains the GeoIP data mapping in system indexes. The GeoIP mapping is retrieved from these indexes during data ingestion to perform the IP-to-geolocation conversion on the incoming data. For optimal performance, it is preferable to have a node with both ingest and data roles, as this configuration avoids internode calls reducing latency. Also, as the `ip2geo` processor searches GeoIP mapping data from the indexes, search performance is impacted.
{: .note}

## Getting started

To get started with the `ip2geo` processor, the `opensearch-geospatial` plugin must be installed. See [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) to learn more.

## Cluster settings

The IP2Geo data source and `ip2geo` processor node settings are listed in the following table. All settings in this table are dynamic. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

| Key | Description | Default |
|--------------------|-------------|---------|
| `plugins.geospatial.ip2geo.datasource.endpoint` | Default endpoint for creating the data source API. | Default is `https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json`. |
| `plugins.geospatial.ip2geo.datasource.update_interval_in_days` | Default update interval for creating the data source API. | Default is 3. |
| `plugins.geospatial.ip2geo.datasource.batch_size` | Maximum number of documents to ingest in a bulk request during the IP2Geo data source creation process. | Default is 10,000. |
| `plugins.geospatial.ip2geo.processor.cache_size` | Maximum number of results that can be cached. Only one cache is used for all IP2Geo processors in each node. | Default is 1,000. |
| `plugins.geospatial.ip2geo.timeout` | The amount of time to wait for a response from the endpoint and the cluster. | Defaults to 30 seconds. |

## Creating the IP2Geo data source

Before creating the pipeline that uses the `ip2geo` processor, create the IP2Geo data source. The data source defines the endpoint value that will download GeoIP data and specifies the update interval.

OpenSearch provides the following endpoints for GeoLite2 City, GeoLite2 Country, and GeoLite2 ASN databases from [MaxMind](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data), which is shared under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license:

* GeoLite2 City: https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json
* GeoLite2 Country: https://geoip.maps.opensearch.org/v1/geolite2-country/manifest.json
* GeoLite2 ASN: https://geoip.maps.opensearch.org/v1/geolite2-asn/manifest.json

If an OpenSearch cluster cannot update a data source from the endpoints within 30 days, the cluster does not add GeoIP data to the documents and instead adds `"error":"ip2geo_data_expired"`.

#### Data source options

The following table lists the data source options for the `ip2geo` processor.   

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `endpoint` | Optional | https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json | The endpoint that downloads the GeoIP data. |
| `update_interval_in_days` | Optional | 3 | How frequently, in days, the GeoIP data is updated. The minimum value is 1. |

To create an IP2Geo data source, run the following query:

```json
PUT /_plugins/geospatial/ip2geo/datasource/my-datasource
{
    "endpoint" : "https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json",
    "update_interval_in_days" : 3
}
```
{% include copy-curl.html %}

A `true` response means that the request was successful and that the server was able to process the request. A `false` response indicates that you should check the request to make sure it is valid, check the URL to make sure it is correct, or try again.

#### Sending a GET request

To get information about one or more IP2Geo data sources, send a GET request:  

```json
GET /_plugins/geospatial/ip2geo/datasource/my-datasource
```
{% include copy-curl.html %}

You'll receive the following response:

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

#### Updating an IP2Geo data source

See the Creating the IP2Geo data source section for a list of endpoints and request field descriptions. 

To update the date source, run the following query:

```json
PUT /_plugins/geospatial/ip2geo/datasource/my-datasource/_settings
{
    "endpoint": https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json,
    "update_interval_in_days": 10
}
```
{% include copy-curl.html %}

#### Deleting the IP2Geo data source

To delete the IP2Geo data source, you must first delete all processors associated with the data source. Otherwise, the request fails. 

To delete the data source, run the following query:

```json
DELETE /_plugins/geospatial/ip2geo/datasource/my-datasource
```
{% include copy-curl.html %}

## Creating the pipeline

Once the data source is created, you can create the pipeline. The following is the syntax for the `ip2geo` processor:

```json 
{
  "ip2geo": {
    "field":"ip",
    "datasource":"my-datasource"
  }
}
```
{% include copy-curl.html %}

#### Configuration parameters

The following table lists the required and optional parameters for the `ip2geo` processor.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `datasource` | Required | - | The data source name to use to retrieve geographical information. |
| `field` | Required | - | The field that contains the IP address for geographical lookup. |
| `ignore_missing` | Optional | false | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
| `properties` | Optional |  All fields in `datasource` | The field that controls which properties are added to `target_field` from `datasource`. |
| `target_field` | Optional | ip2geo | The field that contains the geographical information retrieved from the data source. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

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

**Step 2 (Optional): Test the pipeline.**

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/info-icon.png" class="inline-icon" alt="info icon"/>{:/} **NOTE**<br>It is recommended that you test your pipeline before you ingest documents.
{: .note}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/my-pipeline/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "ip": "172.0.0.1",
      }
    }
  ]
}
```

#### Response

The following response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "_index":"testindex1",
      "_id":"1",
      "_source":{
        "ip":"172.0.0.1",
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

**Step 3: Ingest a document.**

The following query ingests a document into an index named `my-index`:

```json
PUT /my-index/_doc/my-id?pipeline=ip2geo
{
  "ip": "172.0.0.1"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.** 

To retrieve the document, run the following query:

```json
GET /my-index/_doc/my-id
```
{% include copy-curl.html %}
