---
layout: default
title: IP geolocation processor
parent: Ingest APIs
nav_order: 30
---

# IP geolocation processor 
Introduced 2.8
{: .label .label-purple }

Information about the geolocation of an IP address can be used for a variety of purposes:

-   **Content personalization:** You can use IP geolocation information to personalize content for your users based on their location. For example, you could show different versions of your website to users from different countries. 
-   **Security:** You can use GeoIP to block access to your website from certain countries. This can be helpful to protect your website from attacks or to comply with regulations.
-   **Analytics:** You can use GeoIP to track the geographic location of your website visitors. This information can be used to learn more about your audience and to improve your marketing campaigns. 

The IP2geo processor adds information about the geographical location of an IPv4 or IPv6 address.

IP2geo processor uses GeoIP data from an external endpoint. Therefore, it requires an additional component `datasource` which defines where to download a GeoIP data from and how frequently we want to update the data.

## Installing the IP2geo processor

To use the `IP2geo` processor, the `opensearch-geospatial` plugin must be installed first. Learn more in the [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) documentation.

## Creating the IP2geo datasource

Create the IP2geo datasource by defining the endpoint value to download GeoIP data and specify the update interval. 

OpenSearch provides three endpoints for GeoLite2 City, GeoLite2 Country, and GeoLite2 ASN GeoIP2 databases from [MaxMind](http://dev.maxmind.com/geoip/geoip2/geolite2/), shared under the CC BY-SA 4.0 license.
* GeoLite2 City: https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json
* GeoLite2 Country: https://geoip.maps.opensearch.org/v1/geolite2-country/manifest.json
* GeoLite2 ASN: https://geoip.maps.opensearch.org/v1/geolite2-asn/manifest.json

If OpenSearch cannot update a datasource from those three endpoints above in 30 days, OpenSearch will not add GeoIP data in documents. Instead it will add `"error":"ip2geo_data_expired"`

The following table describes options of IP2geo datasource
| Name | Required | Default | Description |
|------|----------|---------|-------------|
| endpoint | no | https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json | The endpoint to download GeoIP data|
| update_interval_in_days | no | 3 | The frequency in days to update GeoIP data with minimum value as 1 |

The following code example shows how to create a Ip2Geo datasource.

#### Example: JSON POST request

````json
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

To request data from the specifed database you created, send a GET request.  

#### Example: GET request

```
GET https://<host>:<port>/_plugins/geospatial/ip2geo/datasource/_all
```

#### Example: GET response

```
<insert-response-example>
```

The reponse shows information for each field (for example, `name`, `endpoint`, `provider`) in the data source file, when the data source file last updated successfully or failed (for example, `last_succeeded_at_in_epoch_millis`), and fields (for example, `fields`) added to the file since you last updated it.

## Updating the data source

To update the data source file, send a PUT request. You can continue using the current endpoint value or change it. Note that if the new endpoint value contains fields that are not in the current data source file, the update fails. You also can change the update interval.  

#### Example: PUT request

```json
{
    "endpoint": https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json
    "update_interval_in_days": 1
}
```

#### Example: Response

```json
{
    "acknowledged":true
}
```

## Creating the IP2geo processor

Once the data source is created, you can create the `Ip2geo` processor. To create the processor, send a PUT request.

#### Example: PUT request

```json
{
   "description":"convert ip to geo",
   "processors":[
    {
        "ip2geo":{
            "field":"_ip",
            "datsource"::"test1"
        }
    }
   ] 
}


#### Example: Response

```json
<insert-example-response>
```

## Using the IP2geo processor in a pipeline

The following table describes <what>.

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
