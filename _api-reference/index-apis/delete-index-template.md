---
layout: default
title: Delete Index Template
parent: Index APIs
nav_order: 27
---

# Delete Index Template

The Delete Index Template API deletes one of more index templates.

## Path and HTTP Methods

```
DELETE /_index_template/<template-name>
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`template-name` | String | Name of the index template. You can delete multiple template in one request names by seperating the template names with a comma. When multiple template names are used in the request, wildcards are not supported.

## Query parameters

The following optional query parameters are supported:

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | How long the operation should wait for a response. Default is `30s`.