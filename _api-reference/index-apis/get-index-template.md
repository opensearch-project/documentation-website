---
layout: default
title: Get index template
parent: Index APIs
nav_order: 27
---

# Get Index Template API

The Get Index Template API returns information about one or more index templates.

## Endpoints

```json
GET /_index_template/<template-name>
```

## Query parameters

The following optional query parameters are supported.

Parameter | Type | Description
:--- | :--- | :---
`create` | Boolean | When true, the API cannot replace or update any existing index templates. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`flat_settings` | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of "index": { "creation_date": "123456789" } is "index.creation_date": "123456789".

## Example requests

The following example request gets information about an index template by using a wildcard expression:

```json
GET /_index_template/h*
```
{% include copy-curl.html %}

The following example request gets information about all index templates:

```json
GET /_index_template
```
{% include copy-curl.html %}
