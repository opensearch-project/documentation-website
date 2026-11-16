---
layout: default
title: Geo IP
parent: Processors
grand_parent: Pipelines
nav_order: 150
---

# Geo IP processor

The `geoip` processor enriches events with geographic information extracted from IP addresses contained in the events.
By default, OpenSearch Data Prepper uses the [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) geolocation database.
Data Prepper administrators can configure the databases using the [`geoip_service`]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/extensions/geoip-service/) extension configuration.

## Usage

You can configure the `geoip` processor to work on entries.

The minimal configuration requires at least one entry, and each entry at least one source field.

The following configuration extracts all available geolocation data from the IP address provided in the field named `clientip`.
It will write the geolocation data to a new field named `geo`, the default source when none is configured:

```yaml
my-pipeline:
  processor:
    - geoip:
        entries:
          - source: clientip
```
{% include copy.html %}

The following example excludes Autonomous System Number (ASN) fields and puts the geolocation data into a field named `clientlocation`:

```yaml
my-pipeline:
  processor:
    - geoip:
        entries:
          - source: clientip
            target: clientlocation
            include_fields: [asn, asn_organization, network]
```
{% include copy.html %}


## Configuration

You can use the following options to configure the `geoip` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`entries` | Yes | [entry](#entry) list | The list of entries marked for enrichment.
`geoip_when` | No | String | Specifies under what condition the `geoip` processor should perform matching. Default is no condition.
`lookup_private_addresses` | No | Boolean | When `true`, the processor also looks up private and loopback IP addresses, such as `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, and `127.0.0.0/8`, in the configured databases. Use this setting with a custom database that contains locations for your internal IP ranges. When `false`, the processor treats these addresses as not valid and adds the `tags_on_no_valid_ip` tags. Default is `false`.
`tags_on_no_valid_ip` | No | List | The tags to add to the event metadata if the source field is not a valid IP address. Unless `lookup_private_addresses` is `true`, this includes private and loopback IP addresses.
`tags_on_ip_not_found` | No | List | The tags to add to the event metadata if the `geoip` processor is unable to find a location for the IP address.
`tags_on_engine_failure` | No | List | The tags to add to the event metadata if the `geoip` processor is unable to enrich an event due to an engine failure.

<!-- vale off -->
## entry
<!-- vale on -->

The following parameters allow you to configure a single geolocation entry. Each entry corresponds to a single IP address.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Yes | String | The key of the source field containing the IP address to geolocate.
`target` | No | String | The key of the target field in which to save the geolocation data. Default is `geo`.
`include_fields` | No | String list | The list of geolocation fields to include in the `target` object. By default, this is all the fields provided by the configured databases.
`exclude_fields` | No | String list | The list of geolocation fields to exclude from the `target` object.

