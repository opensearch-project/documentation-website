---
layout: default
title: IP2geo processor
grand_parent: Ingest APIs
parent: Processors
nav_order: 10
---

# IP2geo processor 
Introduced 2.8
{: .label .label-purple }

The OpenSearch `IP2geo` processor adds information about the geographical location of an IPv4 or IPv6 address. The `IP2geo` processor uses GeoIP data from an external endpoint and therefore requires an additional component `datasource` that defines from where to download GeoIP data and how frequently to update the data.

## Installing the IP2geo processor

To use the `IP2geo` processor, the `opensearch-geospatial` plugin must be installed first. Learn more in the [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) documentation.

## Creating the IP2geo processor

OpenSearch provides three endpoints for GeoLite2 City, GeoLite2 Country, and GeoLite2 ASN GeoIP2 databases from [MaxMind](http://dev.maxmind.com/geoip/geoip2/geolite2/), shared under the CC BY-SA 4.0 license.

* GeoLite2 City: https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json
* GeoLite2 Country: https://geoip.maps.opensearch.org/v1/geolite2-country/manifest.json
* GeoLite2 ASN: https://geoip.maps.opensearch.org/v1/geolite2-asn/manifest.json

If OpenSearch cannot update a datasource from those three endpoints in 30 days, OpenSearch does not add GeoIP data to documents, instead it adds `"error":"ip2geo_data_expired"`.

The following table describes the IP2geo datasource options.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| endpoint | no | https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json | The endpoint to download GeoIP data|
| update_interval_in_days | no | 3 | The frequency in days to update GeoIP data with minimum value as 1 |

The following code example shows how to create a Ip2Geo datasource.

#### Example: Request

````json
PUT /_plugins/geospatial/ip2geo/datasource/my-datasource
{
    "endpoint" : "https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json",
    "update_interval_in_days" : 3
}
```

The following code example shows the JSON reponse to the preceding request. A true JSON response means the request was successful and the server was able to process the request. If you receive a false JSON reponse, check the request to make sure it is valid, check the URL to make sure it is correct, or try again.

#### Example: JSON response

```json
{
    "acknowledged":true
}
```

## Sending a GET request

To get information about one or more IP2geo datasource, send a GET request.  

#### Example: Request

```
GET /_plugins/geospatial/ip2geo/datasource/my-datasource
```

#### Example: Response

```
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

## Updating IP2geo datasource

Update IP2geo datasource. The GeoIP data from the new endpoint should contain all fields in GeoIP data from the current endpoint for the update to succeed.

#### Example: Request

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

## Creating the IP2geo processor



#### Example: Request

```json
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

#### Example: Response

```json
{
	"acknowledged": true
}
```

## Using the IP2geo processor in a pipeline

The following table describes `ip2geo` options

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| field | yes | - | The field to get the ip address from for the geographical lookup. |
| target_field | no | ip2geo | The field that will hold the geographical information looked up from the Maxmind database. |
| database | no | geoip.maps.opensearch.org/v1/geolite2-city/manifest.json | The database filename referring to a database the module ships with or a custom database in the ingest-geoip config directory. |
| properties | no |  Default field depends on what is available in `database`. | Controls what properties are added to the target_field based on the geoip lookup. |
| ignore_missing | no | false | If `true` and `field` does not exist, the processor quietly exits without modifying the document. |
| first_only | no | true | If `true` only first found geoip data will be returned, even if field contains array. |


The following code is an example of using <example_name> and adds the geographical information to the `geoip` field based on the `ip` field.

### Simulating the pipeline

To simulate the pipeline, specify the pipeline in the POST request.

#### Example: POST request

```json
<insert-example-request>
```

## Deleting the Ip2geo processor

To delete the `IP2geo` processor, send a DELETE request. 

#### Example: DELETE request

```json
{
    DELETE https://<host>:<port>/_ingest/pipeline/<processor>
}
```
## Deleting the data source

Delete GeoIP datasource. Note that if you have processors that use the datasource, the delete requests will fail. To delete the datasource, you must delete all processors associated with the datasource first. 

#### Example: DELETE request

```json
{
    DELETE https://<host>:<port>/_plugins/geospatial/ip2geo/datasource/_all
}
```

#### Example: Failed DELETE request

```json
<insert-example-failed-request>
```

## Next steps

<Do we want to link to any Data Prepper processor information?>
<What other documentation or GitHub resources should we include?>
