---
layout: default
title: Get index template
parent: Index APIs
nav_order: 85
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

<!-- spec_insert_start
component: example_code
rest: GET /_index_template/h*
-->
{% capture step1_rest %}
GET /_index_template/h*
{% endcapture %}

{% capture step1_python %}


response = client.indices.get_index_template(
  name = "h*"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The following example request gets information about all index templates:

<!-- spec_insert_start
component: example_code
rest: GET /_index_template
-->
{% capture step1_rest %}
GET /_index_template
{% endcapture %}

{% capture step1_python %}

response = client.indices.get_index_template()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
