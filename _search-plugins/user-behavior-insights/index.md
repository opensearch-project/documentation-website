---
layout: default
title: User Behavior Insights
parent: Search relevance
has_children: false
nav_order: 220
---

# User behavior insights

User Behavior Insights, or UBI, is a community plugin for capturing client-side events and queries for the purposes of improving search relevance and user experience. UBI consists of three components:

* An OpenSearch [plugin](https://github.com/o19s/opensearch-ubi) that facilitates the storage of client-side events and queries.
* A client-side JavaScript library that demonstrates how to capture events and send those events to the OpenSearch UBI plugin.
* An OpenSearch Dashboards plugin that provides access to the collected events and queries for analysis. This component is still largely in the design phase.

UBI is currently only supported in OpenSearch 2.12.0.
{: .warning }

## Installing the plugin

The User Behavior Insights plugin is available for OpenSearch 2.12.0. Run the following command to install the plugin.

````bash
./bin/opensearch-plugin install \
   "https://github.com/o19s/opensearch-ubi/releases/download/0.0.8/opensearch-ubi-0.0.8-os2.12.0.zip"
````

After installing the UBI plugin you can find [documentation](https://github.com/o19s/opensearch-ubi/blob/main/documentation.md).

## Using the plugin

The following steps outline how to get started with the UBI plugin.

### Initializing a UBI store

A "store" contains the client-side events and the queries. After installing the plugin we need to initialize a store. In the following request we are creating a store called `mystore`.

```
PUT _plugins/ubi/mystore
```

A store consists of two OpenSearch indexes whose names are based on the name of the store being created. For the `mystore` store, the names of the indexes are:

* `.mystore_events` - This index contains the client-side events sent to the plugin by the JavaScript library.
* `.mystore_queries` - This index contains the queries that the plugin passively stores.

### Sending events to the store

With the store initialized, we can now send client-side events to our `mystore` store.

```
POST /_plugins/ubi/mystore -H "Content-Type: application/json" -d '
{
  "type": "instant-search",
  "keywords": "laptop",
  "url": "my_url.html",
  "lang": "en-US",
  "session": "npckcy4",
  "channel": "demo-channel"
}'
```

### Capturing queries

The UBI plugin passively stores queries. To illustrate this, we can run a query against our index of products called `ecommerce`.

`GET /ecommerce/_search -H "X-ubi-store: awesome"`

Note that this request includes a header called `X-ubi-store`. This header allows the UBI plugin to associate this query with a UBI store.
