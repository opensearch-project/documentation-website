---
layout: default
title: Search templates
nav_order: 82
---

# Render Template API

The Render Template API renders a [search template]({{site.url}}{{site.baseurl}}/search-plugins/search-template/) as a search query.

## Paths and HTTP Methods

```
GET /_render/template
POST /_render/template
GET /_render/template/<id>
POST /_render/template/<id>
```

## Path parameters

The Render Template API supports the following path parameter. All path parameters are optional.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | String | The ID of search template to render. |

## Request options

The following options are supported in the request body of the Render Template API.

| Parameter | Required | Type | Description | 
| :--- | :--- | :--- | :--- |
| `id` | Conditional | String | The ID of the search template to render. Is not required if the ID is provided in the path or if an inline template is specified by the `source`. | 
| `params` | No | Object | A list of key value pairs which replace Mustache variables found in the search template. The key value pairs must exist inside the documents being searched. |
| `source` | Conditional | Object | An inline search template to render if a search template is not specified. Supports the same parameters as a [Search]({{site.url}}{{site.baseurl}}/api-reference/search/) API request, as well as [Mustache](https://mustache.github.io/mustache.5.html) variables. | 




