---
layout: default
title: Delete index template
parent: Index APIs
nav_order: 55
---

# Delete Index Template API

The Delete Index Template API deletes one or more index templates.

## Endpoints

```json
DELETE /_index_template/<template-name>
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`template-name` | String | The name of the index template. You can delete multiple templates in one request by separating the template names with commas. When multiple template names are used in the request, wildcards are not supported.

## Query parameters

The following optional query parameters are supported.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time that the operation will wait for a response. Default is `30s`.
