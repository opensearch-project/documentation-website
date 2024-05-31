---
layout: default
title: UBI plugin management
parent: User behavior insights
has_children: false
nav_order: 2
---


# OpenSearch User Behavior Insights

This *repository* contains the OpenSearch plugin for the User Behavior Insights (UBI) capability. This plugin
facilitates persisting client-side events (e.g. item clicks, scroll depth) and OpenSearch queries for the purpose of analyzing the data
to improve search relevance and user experience.

## Quick start


## UBI store

The plugin has a concept of a "store", which is a logical collection of the events and queries. A store consists of two indexes. 
One index is used to store events, and the other index is for storing queries.

### OpenSearch data mappings
UBI has 2 primary indexes:
- **UBI Queries** stores all queries and results.
- **UBI Events** store that the UBI client writes events to.
*Follow the [schema deep dive]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/) to understand how these two indexes make UBI into a causal framework for search.*

## Plugin API


### Associating a query with client-side events

The plugin passively listens to query requests passing through OpenSearch. Without any extra information,
the plugin cannot associate a query with the client-side events associated with the query. (What user clicked on what to make this query?)

To make this association, queries need to have a header value that indicates the user ID.


### Example queries

[Sample SQL queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/)

[Sample OpenSearch queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/dsl-queries/)
