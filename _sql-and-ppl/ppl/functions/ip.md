---
layout: default
title: IP address functions
parent: Functions
grand_parent: PPL
nav_order: 8
canonical_url: https://docs.opensearch.org/latest/sql-and-ppl/ppl/functions/ip/
---

# IP address functions

The following IP address functions are supported in PPL.

## CIDRMATCH

**Usage**: `CIDRMATCH(ip, cidr)`

Checks whether an IP address is within the specified CIDR range.

**Parameters**:

- `ip` (Required): The IP address to check, as a string or IP value. Supports both IPv4 and IPv6.
- `cidr` (Required): The CIDR range to check against, as a string. Supports both IPv4 and IPv6 blocks.

**Return type**: `BOOLEAN`

### Example
  
```sql
source=weblogs
| where cidrmatch(host, '1.2.3.0/24')
| fields host, url
```
{% include copy.html %}
  
The query returns the following results:
  
| host | url |
| --- | --- |
| 1.2.3.4 | /history/voyager1/ |
| 1.2.3.5 | /history/voyager2/ |

## GEOIP

**Usage**: `GEOIP(dataSourceName, ipAddress[, options])`

Retrieves location information for IP addresses using the OpenSearch Geospatial plugin API.

**Parameters**:

- `dataSourceName` (Required): The name of an established data source on the OpenSearch Geospatial plugin. For configuration details, see the [IP2Geo processor documentation]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ip2geo/).
- `ipAddress` (Required): The IP address to look up, as a string or IP value. Supports both IPv4 and IPv6.
- `options` (Optional): A comma-separated string of fields to output. The available fields depend on the data source provider's schema. For example, the `geolite2-city` dataset includes fields like `country_iso_code`, `country_name`, `continent_name`, `region_iso_code`, `region_name`, `city_name`, `time_zone`, and `location`.

**Return type**: `OBJECT`

### Example
  
```sql
source=weblogs
| eval LookupResult = geoip("dataSourceName", "50.68.18.229", "country_iso_code,city_name")
```
{% include copy.html %}

The query returns the following results:

| LookupResult |
| --- |
| {'city_name': 'Vancouver', 'country_iso_code': 'CA'} | 