---
layout: default
title: Render Template
nav_order: 82
canonical_url: https://docs.opensearch.org/latest/api-reference/render-template/
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
| `id` | String | The ID of the search template to render. |

## Request options

The following options are supported in the request body of the Render Template API.

| Parameter | Required | Type | Description | 
| :--- | :--- | :--- | :--- |
| `id` | Conditional | String | The ID of the search template to render. Is not required if the ID is provided in the path or if an inline template is specified by the `source`. | 
| `params` | No | Object | A list of key-value pairs that replace Mustache variables found in the search template. The key-value pairs must exist in the documents being searched. |
| `source` | Conditional | Object | An inline search template to render if a search template is not specified. Supports the same parameters as a [Search]({{site.url}}{{site.baseurl}}/api-reference/search/) API request and [Mustache](https://mustache.github.io/mustache.5.html) variables. | 

## Example request

Both of the following request examples use the search template with the template ID `play_search_template`:

```json
{
  "source": {
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
  "params": {
    "play_name": "Henry IV"
  }
}
```

### Render template using template ID

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

### Render template using `_source`

If you don't want to use a saved template, or want to test a template before saving, you can test a template with the `_source` parameter using [Mustache](https://mustache.github.io/mustache.5.html) variables, as shown in the following example:

```
{
  "source": {
     "from": "{% raw %}{{from}}{{^from}}0{{/from}}{% endraw %}",
     "size": "{% raw %}{{size}}{{^size}}10{{/size}}{% endraw %}",
    "query": {
      "match": {
        "play_name": "{% raw %}{{play_name}}{% endraw %}"
      }
    }
  },
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




