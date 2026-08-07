---
layout: default
title: Create data stream
parent: Data stream APIs
grand_parent: Index APIs
nav_order: 10
---

# Create Data Stream API
**Introduced 1.0**
{: .label .label-purple }

The Create Data Stream API creates a data stream. Before creating a data stream, you must create an index template that configures a set of indexes as a data stream. For more information, see [Index data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/).

<!-- spec_insert_start
api: indices.create_data_stream
component: endpoints
-->
## Endpoints
```json
PUT /_data_stream/{name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: indices.create_data_stream
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | Name of the data stream, which must meet the following criteria: Lowercase only; Cannot include `\`, `/`, `*`, `?`, `"`, `<`, `>`, `\|`, `,`, `#`, `:`, or a space character; Cannot start with `-`, `_`, `+`, or `.ds-`; Cannot be `.` or `..`; Cannot be longer than 255 bytes. Multi-byte characters count towards this limit faster. |

<!-- spec_insert_end -->

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `error_trace` | Boolean | Whether to include the stack trace of returned errors. | `false` |
| `filter_path` | List or String | Used to reduce the response. This parameter takes a comma-separated list of filters. It supports using wildcards to match any field or part of a field’s name. You can also exclude fields with `-`. | N/A |
| `human` | Boolean | Whether to return human-readable values for statistics. | `false` |
| `pretty` | Boolean | Whether to pretty format the returned JSON response. | `false` |
| `source` | String | The URL-encoded request definition. Useful for libraries that do not accept a request body for non-POST requests. | N/A |


## Example request

The following example request creates the `logs-app` data stream using a matching, previously created index template:

<!-- spec_insert_start
component: example_code
rest: PUT /_data_stream/logs-app
body: {}
-->
{% capture step1_rest %}
PUT /_data_stream/logs-app
{}
{% endcapture %}

{% capture step1_python %}


response = client.indices.create_data_stream(
  name = "logs-app",
  body =   {}
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
| `acknowledged` | Boolean | Whether the data stream was successfully created. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/data_stream/create`.

## Related documentation

- [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/)
- [Get data streams]({{site.url}}{{site.baseurl}}/api-reference/data-stream/data-stream-info/)
- [Delete a data stream]({{site.url}}{{site.baseurl}}/api-reference/data-stream/delete-data-stream/)
