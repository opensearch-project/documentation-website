---
layout: default
title: geoip_service
nav_order: 5
parent: Extensions
grand_parent: Managing Data Prepper
---

# geoip_service

The `geoip_service` extension configures all [`geoip`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/geoip) processors in Data Prepper.

## Usage

You can configure the GeoIP service that Data Prepper uses for the `geoip` processor.
By default, the [`maxmind`](#maxmind) GeoIP service is configured.

The following is an example of how to configure the `geoip_service` in the `data-prepper-config.yaml` file:

```
extensions:
  geoip_service:
    maxmind:
      database_refresh_interval: PT1H
      cache_count: 16_384
```

## maxmind

The `maxmind` GeoIP service supports the MaxMind [GeoIP and GeoLite](https://dev.maxmind.com/geoip) databases.
By default, Data Prepper will use all three [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) databases:

* City
* Country
* ASN

The service also downloads databases automatically to keep Data Prepper up-to-date with changes.

You can use the following options to configure the `maxmind` extension.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`databases` | No | [database](#database) | The database configuration.
`database_refresh_interval` | No | Duration | The frequency for checking for updates. Defaults to `PT7D`. This can be any duration in the range of 15 minutes to 30 days.
`cache_count` | No | Integer | The maximum cache count by number of items in the cache. Defaults to `4096`. The value can be in the range from 100-100,000.
`database_destination` | No | String | The directory name for where to store downloaded databases. Defaults to `{data-prepper.dir}/data/geoip`.
`aws` | No | [aws](#aws) | Configures AWS credentials for downloading the database from S3.
`insecure` | No | Boolean | If enabled, then allow downloading the file over HTTP. Defaults to `false`.

## database

Option | Required | Type | Description
:--- | :--- | :--- | :---
`city` | No | String | The URL where the city database resides. Maybe an HTTP URL for a manifest file, an MMDB file, or an S3 URL.
`country` | No | String | The URL where the country database resides. Maybe an HTTP URL for a manifest file, an MMDB file, or an S3 URL.
`asn` | No | String | The URL where the ASN database resides. Maybe an HTTP URL for a manifest file, an MMDB file, or an S3 URL.
`enterprise` | No | String | The URL where the enterprise database resides. Maybe an HTTP URL for a manifest file, an MMDB file, or an S3 URL.


## aws

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon S3. Defaults to `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | A map of header overrides that the IAM role assumes for downloading from Amazon S3.
`sts_external_id` | No | String | An STS external ID used when Data Prepper assumes the STS role. For more information, see the `ExternalID` documentation in the [STS AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) API reference.
