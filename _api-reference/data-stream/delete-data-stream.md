---
layout: default
title: Delete data stream
parent: Data stream APIs
grand_parent: Index APIs
nav_order: 40
---

# Delete Data Stream API
**Introduced 1.0**
{: .label .label-purple }

The Delete Data Stream API deletes a data stream and its backing indexes.

<!-- spec_insert_start
api: indices.delete_data_stream
component: endpoints
-->
## Endpoints
```json
DELETE /_data_stream/{name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: indices.delete_data_stream
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | List or String | A comma-separated list of data streams to delete. Wildcard (`*`) expressions are supported. |

<!-- spec_insert_end -->

## Example request

The following example request deletes the `logs-app` data stream and its backing indexes:

<!-- spec_insert_start
component: example_code
rest: DELETE /_data_stream/logs-app
-->
{% capture step1_rest %}
DELETE /_data_stream/logs-app
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete_data_stream(
  name = "logs-app"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "acknowledged": true
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the data stream was successfully deleted. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/data_stream/delete`.

## Related documentation

- [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/)
- [Create or update a data stream]({{site.url}}{{site.baseurl}}/api-reference/data-stream/create-data-stream/)
