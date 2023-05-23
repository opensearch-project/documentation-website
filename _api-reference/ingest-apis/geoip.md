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

The OpenSearch `Ip2geo` processor adds geographical information about IP addresses based on data from the [MaxMind GeoIP2 databases](https://www.maxmind.com/en/geoip2-databases). This processor adds the geolocation information by default under the `<field_name>` and auto-updates the GeoIP2 databases based on a set interval, keeping geolocation data up-to-date and accurate. 

## Installing the Ip2geo processor

To install the `Ip2geo` processor, the `opensearch-geospatial` plugin must be installed first. Learn more in the [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) documentation.

## Creating the data source

Once you've installed the `Ip2geo` processor, create the  IP geolocation data source by defining the endpoint value to download geolocation data and specify the data update interval. The endpoint value must contain valid data formats, for example, JSON. The minimum update interval is 1 day. The maximum is determined by the database provider. 

The following code example shows how to create a data source using the OpenSearch default endpoint value, which is used if the endpoint value is empty, and update interval of 3 days.

#### Example: JSON POST request

``json
    {
        "endpoint" : "https://geoip.maps.opensearch.org/v1/geolite2-city/manifest.json",
        "update_interval_in_days" : 3
    }
    ```

The following code example shows the JSON reponse to the preceding request. A true JSON response means the request was successful and the server was able to process the request. If you receive a false JSON reponse, check the request to make sure it is valid, check the URL to make sure it is correct, or try again.

#### Example: JSON response

`json
    {
        "acknowledged" : true
    }
    ```

## Sending a GET request

To request data from the specifed database you created, send a GET request.  

#### Example: GET request



## Using the IP2geo processor in a pipeline

The following table describes <what>.

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| field | yes | - | The field to get the ip address from for the geographical lookup. |
| target_field | no | geoip | The field that will hold the geographical information looked up from the Maxmind database. |
| database_file | no | GeoLite2-City.mmdb | The database filename referring to a database the module ships with (GeoLite2-City.mmdb, GeoLite2-Country.mmdb, or GeoLite2-ASN.mmdb) or a custom database in the ingest-geoip config directory. |
| properties | no | [continent_name, country_iso_code, country_name, region_iso_code, region_name, city_name, location] * | Controls what properties are added to the target_field based on the geoip lookup. |
| ignore_missing | no | false | If `true` and `field` does not exist, the processor quietly exits without modifying the document. |
| first_only | no | true | If `true` only first found geoip data will be returned, even if field contains array. |

* Default field depends on what is available in `database_file`.

The following code is an example of using <example_name> and adds the geographical information to the `geoip` field based on the `ip` field.

## Mapping IP geolocation data



## Automatically updating geolocation data

The `IP2geo` processor auto-updates the geolocation databases based on the specified interval. 