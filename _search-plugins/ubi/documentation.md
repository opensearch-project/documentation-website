# OpenSearch User Behavior Insights

This repository contains the OpenSearch plugin for the User Behavior Insights (UBI) capability. This plugin
facilitates persisting client-side events (e.g. item clicks, scroll depth) and OpenSearch queries for the purpose of analyzing the data
to improve search relevance and user experience.

## Quick Start

Build the plugin.  Note that you will have to match up the JDK 11 on your system to java home in the `gradle.properties` file:

`./gradlew build`

Build the OpenSearch docker image and add the plugin, then start the containers:

```
docker compose build
docker compose up
```

Or to start a three-node OpenSearch cluster:

```
docker compose build
docker compose -f docker-compose-cluster.yaml up
```

Initialize the `awesome` UBI store:

```
curl -X PUT "http://localhost:9200/_plugins/ubi/awesome?index=ecommerce&object_id=id"
```

Send an event to the `awesome` store:

```
curl -X POST http://localhost:9200/_plugins/ubi/mystore -H "Content-Type: application/json" -d '
{
  "action_name": "search",
  "user_id": "98fcf189-4fa8-4322-b6f5-63fbb6b556c9",
  "timestamp": 1705596607509
}'
```

Get events:

```
curl -s http://localhost:9200/.awesome_events/_search | jq
```

Do a search of the `ecommerce` index:

```
curl -s http://localhost:9200/ecommerce/_search -H "X-ubi-store: awesome" | jq
```

Get queries:

```
curl -s http://localhost:9200/.awesome_queries/_search | jq
```

Delete the store:

```
curl -X DELETE http://localhost:9200/_plugins/ubi/awesome
```

## UBI Store

The plugin has a concept of a "store", which is a logical collection of the events and queries. A store consists of two indices. One
index is used to store events, and the other index is for storing queries.

### OpenSearch Data Mappings
Ubi has 2 primary indices:
- **UBi Queries** stores all queries and results.
- **UBi Events** store that the Ubi client writes events to.
*Please follow the [schema deep dive](./schemas.md) to understand how these two indices make Ubi into a causal framework for search.*

## Plugin API

The plugin exposes a REST API for managing UBI stores and persisting events.

| Method | Endpoint                                                  | Purpose                                                                                                                                                                                                                                   |
|--------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `PUT`    | `/_plugins/ubi/{store}?index={index}&object_id={object_id}` | <p id="object_id">Initialize a new UBI store for the given index. The `object_id` is optional and allows for providing the name of a field in the `index`'s schema to be used as the unique result/item ID for each search result. If not provided, the `_id` field is used. </p>|
| `DELETE` | `/_plugins/ubi/{store}`                                   | Delete a UBI store                                                                                                                                                                                                                        |
| `GET` | `/_plugins/ubi`                                           | Get a list of all UBI stores                                                                                                                                                                                                              |
| `POST` | `/_plugins/ubi/{store}`                                   | Index an event into the UBI store                                                                                                                                                                                                         |
| `TRACE` | `/_plugins/ubi`                                           | For temporary developer debugging                                                                                                                                                                                                         |

### Creating a UBI Store

To create a UBI store to contain events and queries, send a `PUT` request:

```
curl -X PUT http://localhost:9200/_plugins/ubi/mystore?index=ecommerce
```

### Deleting a UBI Store

To delete a store, send a `DELETE` request:

```
curl -X DELETE http://localhost:9200/_plugins/ubi/mystore
```

This will delete the UBI store and all contained events and queries. Please use this with caution.

### Get a List of UBI Stores

To get a list of stores, send a `GET` request:

```
curl -X GET http://localhost:9200/_plugins/ubi
```

### Persist a Client-Side Event into a UBI Store

To persist a client-side event into a store, send a `POST` request where the body of the request is the event:

```
curl -X POST http://localhost:9200/_plugins/ubi/mystore -H "Content-Type: application/json" -d '
{
  "action_name": "search",
  "user_id": "98fcf189-4fa8-4322-b6f5-63fbb6b556c9",
  "timestamp": 1705596607509
}'
```

## Capturing Queries with UBI

### Associating a Query with Client-Side Events

The plugin passively listens to query requests passing through OpenSearch. Without any extra information,
the plugin cannot associate a query with the client-side events associated with the query. (What user clicked on what to make this query?)

To make this association, queries need to have a header value that indicates the user ID.

#### Required Headers

|Header|Purpose|Required?|Detail|
|---|---|---|---|
|`X-ubi-store`|Tells the plugin which store this query should be persisted to.|Required||
|`X-ubi-user-id`|Allow for associating client-side user events with the query|Required||
|`X-ubi-query-id`|The client can provide a query ID. If not provided, the plugin will generate a random query ID. The purpose of the query ID is to uniquely identify the query.|No|[query_id](query_id.md)|
|`X-ubi-session-id`|A session ID to associate with the query.|No||

### Example Queries

The following query tells the plugin that the query being run should be persisted to the store `mystore` and be associated with user ID `john`:

```
curl http://localhost:9200/ecommerce/_search -H "X-ubi-store: mystore" -H "X-ubi-user-id: 12345"
```

With this query, when the plugin sees a query, the plugin will be able to associate the query with an individual user and know to persist the query in the UBI store `mystore`.

[Sample SQL queries](documentation\queries\sql_queries.md)
[Sample OpenSearch queries](documentation\queries\dsl_queries.md)
