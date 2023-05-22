---
layout: default
title: Automate IP geolocation databases
parent: Ingest APIs
nav_order: 30
---

# Automate IP geolocation databases 
Introduced 2.8
{: .label .label-purple }

Information about the geolocation of an IP address can be used for a variety of purposes:

-   Content personalization: You cna use GeoIP to personalize content for your users based on their location. For example, you could show different versions of your website to users from different countries. 
-   Security: You can use GeoIP to block access to your website from certain countries. This can be helpful to protect your website from attacks or to comply with regulations.
-   Analytics: You can use GeoIP to track the geographic location of your website visitors. This information can be used to learn more about your audience and to improve your marketing campaigns. 

The OpenSearch  `IP2geo` processor adds geographical information about IP addresses based on data from the [MaxMind GeoIP2 databases](https://www.maxmind.com/en/geoip2-databases). The processor adds this information by default under the `<field_name>` and auto-updates the databases based on a set interval. 

## Using the IP2geo processor in a pipeline

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


## Automating updates for MaxMind databases

The `IP2geo` processor auto-updates the MaxMind databases based on the specified interval. 