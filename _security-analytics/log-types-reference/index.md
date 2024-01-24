---
layout: default
title: Supported log types
has_children: yes
nav_order: 16
redirect_from:
   - /security-analytics/sec-analytics-config/log-types/
---

# Supported log types

Logs contain raw data about events that happen throughout a system and in its separate parts. This reference describes each standard log type supported by Security Analytics and their mapping information.

## Log type categories

As of OpenSearch 2.11, log types are grouped by the following categories to help select, filter, and search the log types:

- **Access Management** includes [AD/LDAP]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/ad-ldap/) , [Apache Access]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/apache-access/), and [Okta](({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/okta/).
- **Applications** includes [GitHub]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/github/), [Google Workspace]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/gworkspace/), and [Microsoft 365]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/m365/).
- **Cloud Services** includes [Azure]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/azure/), [AWS CloudTrail]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/cloudtrail/), and [Amazon S3]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/s3/)
- **Network Activity** includes [DNS]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/dns/), [Network]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/network/), [NetFlow]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/netflow/) and [VPC Flow]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/vpc/).
- **Security** includes [WAF]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/waf/).
- **System Activity** includes [Linux]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/linux/) and [Windows]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/windows/).
- **Other** accounts for log types that don't fit into a specific category. For more information see [Other log types]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/other/).

Mappings for each log type contain following fields:

- `raw_field`: How the data appears in the log source.
- `ecs`: The Elastic Common Schema (ECS) field that the `raw_field` maps to.

To map each log type to the correct field from your data source, find the data source in this reference then use the [Create Mappings APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/mappings-api/) to map the field based on your log type.

