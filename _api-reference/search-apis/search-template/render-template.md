---
layout: default
title: Render template
parent: Search templates
grand_parent: Search APIs
nav_order: 10
redirect_from:
  - /api-reference/render-template/
  - /api-reference/search-apis/render-template/
---

# Render Template API

The Render Template API previews the final query generated from a [search template]({{site.url}}{{site.baseurl}}/search-plugins/search-template/) by substituting parameters without executing the search.

## Endpoints

```json
GET /_render/template
POST /_render/template
GET /_render/template/<id>
POST /_render/template/<id>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `id` | String | The ID of the search template to render. |

## Request body fields

The following table lists the available request body fields.

| Parameter | Required | Data type | Description | 
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
{% include copy.html %}

### Render template using template ID

The following example request validates a search template with the ID `play_search_template`:

<!-- spec_insert_start
component: example_code
rest: POST /_render/template
body: |
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV"
  }
}
-->
{% capture step1_rest %}
POST /_render/template
{
  "id": "play_search_template",
  "params": {
    "play_name": "Henry IV"
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.render_search_template(
  body =   {
    "id": "play_search_template",
    "params": {
      "play_name": "Henry IV"
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Render template using `_source`

If you don't want to use a saved template, or want to test a template before saving, you can test a template with the `_source` parameter using [Mustache](https://mustache.github.io/mustache.5.html) variables, as shown in the following example:

```json
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