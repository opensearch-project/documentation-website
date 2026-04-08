---
layout: default
title: geoip_service
nav_order: 5
parent: Extensions
grand_parent: Managing OpenSearch Data Prepper
canonical_url: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/extensions/geoip-service/
---

# geoip_service

The `geoip_service` extension configures all [`geoip`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/geoip) processors in OpenSearch Data Prepper.

## Usage

You can configure the GeoIP service that Data Prepper uses for the `geoip` processor.
By default, the GeoIP service comes with the [`maxmind`](#maxmind) option configured.

The following example shows how to configure the `geoip_service` in the `data-prepper-config.yaml` file:

```
extensions:
  geoip_service:
    maxmind:
      database_refresh_interval: PT1H
      cache_count: 16_384
```

## maxmind

The GeoIP service supports the MaxMind [GeoIP and GeoLite](https://dev.maxmind.com/geoip) databases.
By default, Data Prepper will use all three of the following [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) databases:

* City
* Country
* ASN

The service also downloads databases automatically to keep Data Prepper up to date with changes from MaxMind.

You can use the following options to configure the `maxmind` extension.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`databases` | No | [database](#database) | The database configuration.
`database_refresh_interval` | No | Duration | How frequently to check for updates from MaxMind. This can be any duration in the range of 15 minutes to 30 days. Default is `PT7D`.
`cache_count` | No | Integer | The maximum cache count by number of items in the cache, with a range of 100--100,000. Default is `4096`.
`database_destination` | No | String | The name of the directory in which to store downloaded databases. Default is `{data-prepper.dir}/data/geoip`.
`aws` | No | [aws](#aws) | Configures the AWS credentials for downloading the database from Amazon Simple Storage Service (Amazon S3).
`insecure` | No | Boolean | When `true`, this options allows you to download database files over HTTP. Default is `false`.

## database

Option | Required | Type | Description
:--- | :--- | :--- | :---
`city` | No | String | The URL of the city in which the database resides. Can be an HTTP URL for a manifest file, an MMDB file, or an S3 URL.
`country` | No | String | The URL of the country in which the database resides. Can be an HTTP URL for a manifest file, an MMDB file, or an S3 URL.
`asn` | No | String | The URL of the Autonomous System Number (ASN) of where the database resides. Can be an HTTP URL for a manifest file, an MMDB file, or an S3 URL.
`enterprise` | No | String | The URL of the enterprise in which the database resides. Can be an HTTP URL for a manifest file, an MMDB file, or an S3 URL.


## aws

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for the credentials. Default is the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon S3. Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | A map of header overrides that the AWS Identity and Access Management (IAM) role assumes when downloading from Amazon S3.
`sts_external_id` | No | String | An STS external ID used when Data Prepper assumes the STS role. For more information, see the `ExternalID` documentation in the [STS AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) API reference.
