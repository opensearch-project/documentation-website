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

The plugin has a concept of a "store", which is a logical collection of the events and queries. A store consists of two indexes. One
index is used to store events, and the other index is for storing queries.

### OpenSearch data mappings
UBI has 2 primary indexes:
- **UBI Queries** stores all queries and results.
- **UBI Events** store that the UBI client writes events to.
*Follow the [schema deep dive]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/) to understand how these two indexes make UBI into a causal framework for search.*

## Plugin API

The plugin exposes a REST API for managing UBI stores and persisting events.

| Method | Endpoint                                                  | Purpose                                                                                                                                                                                                                                   |
|--------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PUT`    | `/_plugins/ubi/{store}?index={index}&object_id={object_id}` | <p id="object_id">Initialize a new UBI store for the given index. The `object_id` is optional and allows for providing the name of a field in the `index`'s schema to be used as the unique result/item ID for each search result. If not provided, the `_id` field is used. </p>|
| `DELETE` | `/_plugins/ubi/{store}`                                   | Delete a UBI store                                                                                                                                                                                                                        |
| `GET` | `/_plugins/ubi`                                           | Get a list of all UBI stores                                                                                                                                                                                                              |
| `POST` | `/_plugins/ubi/{store}`                                   | Index an event into the UBI store                                                                                                                                                                                                         |
| `TRACE` | `/_plugins/ubi`                                           | For temporary developer debugging                                                                                                                                                                                                         |

### Creating a UBI store

To create a UBI store to contain events and queries, send a `PUT` request:

```
PUT http://localhost:9200/_plugins/ubi/mystore?index=ecommerce
```
{% include copy-curl.html %}

### Deleting a UBI store

To delete a store, send a `DELETE` request:

```
DELETE http://localhost:9200/_plugins/ubi/mystore
```
{% include copy-curl.html %}

This will delete the UBI store and all contained events and queries. Use this with caution.

### Get a list of UBI stores

To get a list of stores, send a `GET` request:

```
GET http://localhost:9200/_plugins/ubi
```
{% include copy-curl.html %}

### Persist a client-side event into a UBI store

To persist a client-side event into a store, send a `POST` request where the body of the request is the event:

```
http://localhost:9200/_plugins/ubi/mystore -H "Content-Type: application/json" -d '
{
  "action_name": "search",
  "user_id": "98fcf189-4fa8-4322-b6f5-63fbb6b556c9",
  "timestamp": 1705596607509
}'
```
{% include copy-curl.html %}

## Capturing queries with UBI

You enable the UBI data capture for a query on a query by query basis by adding the parameter `"ubi":true` to your query.

### Associating a query with client-side events

The plugin passively listens to query requests passing through OpenSearch. Without any extra information,
the plugin cannot associate a query with the client-side events associated with the query. (What user clicked on what to make this query?)

To make this association, queries need to have a header value that indicates the user ID.


### Example queries

[Sample SQL queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/sql-queries/)

[Sample OpenSearch queries]({{site.url}}{{site.baseurl}}/search-plugins/ubi/dsl-queries/)
