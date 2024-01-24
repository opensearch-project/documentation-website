---
layout: default
title: Supported log types
has_children: yes
nav_order: 16
redirect_from:
   - /security-analytics/sec-analytics-config/log-types/
---


# Supported log types

Logs contain raw data about events that happen throughout a system and in its separate parts. As of OpenSearch 2.11, log types are grouped by category to help select, filter, and search the log types. 

The following section lists all log types supported by Security Analytics and their mappings. Mappings for each log type contain following fields:

- `raw_field`: How the data appears in the log source.
- `ecs`: The Elastic Common Schema (ECS) field that the `raw_field` maps to.

To map each log type to the correct field from your data source, find the data source in this reference then use the [Mappings APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/mappings-api/) to map the field based on your log type.

