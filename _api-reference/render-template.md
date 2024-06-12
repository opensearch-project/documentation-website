---
layout: default
title: Render Template
nav_order: 82
---

# Render Template 

The Render Template API renders a [search template]({{site.url}}{{site.baseurl}}/search-plugins/search-template/) as a search query.

## Paths and HTTP methods

```
GET /_render/template
POST /_render/template
GET /_render/template/<id>
POST /_render/template/<id>
```

## Path parameters

The Render Template API supports the following optional path parameter. 

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

## Example request

The following example request validates a search template with the ID `play_search_template`:

```json
POST _render/template
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV"
  }
}
```
{% include copy.html %}

## Example response

OpenSearch responds with information about the template's output:

```json
{
  "template_output": {
    "from": "0",
    "size": "10",
    "query": {
      "match": {
        "play_name": "Henry IV"
      }
    }
  }
}
```




