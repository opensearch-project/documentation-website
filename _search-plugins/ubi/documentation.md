---
layout: default
title: Ubi plugin management
parent: User behavior insights
has_children: false
nav_order: 2
---


# OpenSearch User Behavior Insights

This *repository* contains the OpenSearch plugin for the User Behavior Insights (UBI) capability. This plugin
facilitates persisting client-side events (e.g. item clicks, scroll depth) and OpenSearch queries for the purpose of analyzing the data
to improve search relevance and user experience.

## Quick start

Build the plugin. Note that you will have to match up the JDK 11 on your system to java home in the `gradle.properties` file:
```bash
./gradlew build
```
{% include copy.html %}

Build the OpenSearch Docker image and add the plugin, then start the containers:

```bash
docker compose build
docker compose up
```
{% include copy.html %}

Or to start a three-node OpenSearch cluster:

```bash
docker compose build
docker compose -f docker-compose-cluster.yaml up
```
{% include copy.html %}

Initialize the `awesome` UBI store:

```bash
curl -X PUT "http://localhost:9200/_plugins/ubi/awesome?index=ecommerce&object_id=id"
```
{% include copy-curl.html %}

Send an event to the `awesome` store:

```bash
curl -X POST http://localhost:9200/_plugins/ubi/mystore -H "Content-Type: application/json" -d '
{
  "action_name": "search",
  "user_id": "98fcf189-4fa8-4322-b6f5-63fbb6b556c9",
  "timestamp": 1705596607509
}'
```
{% include copy-curl.html %}

Get events:

```bash
curl -s http://localhost:9200/.awesome_events/_search | jq
```
{% include copy-curl.html %}

Do a search of the `ecommerce` index:

```bash
curl -s http://localhost:9200/ecommerce/_search -H "X-ubi-store: awesome" | jq
```
{% include copy-curl.html %}

Get queries:

```bash
curl -s http://localhost:9200/.awesome_queries/_search | jq
```
{% include copy-curl.html %}

Delete the store:

```bash
curl -X DELETE http://localhost:9200/_plugins/ubi/awesome
```
{% include copy-curl.html %}

## UBI store

The plugin has a concept of a "store", which is a logical collection of the events and queries. A store consists of two indexes. One
index is used to store events, and the other index is for storing queries.

### OpenSearch data mappings
UBI has 2 primary indexes:
- **UBI Queries** stores all queries and results.
- **UBI Events** store that the Ubi client writes events to.
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

The following query tells the plugin that the query being run should be persisted to the store `mystore` and be associated with user ID `john`:

```
http://localhost:9200/ecommerce/_search -H "X-ubi-store: mystore" -H "X-ubi-user-id: 12345"
```
{% include copy-curl.html %}

With this query, when the plugin sees a query, the plugin will be able to associate the query with an individual user and know to persist the query in the UBI store `mystore`.

[Sample SQL queries](documentation\queries\sql_queries.md)
[Sample OpenSearch queries](documentation\queries\dsl_queries.md)
