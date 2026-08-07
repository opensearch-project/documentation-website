---
layout: default
title: Get data stream
parent: Data stream APIs
grand_parent: Index APIs
nav_order: 20
---

# Get Data Stream API
**Introduced 1.0**
{: .label .label-purple }

The Get Data Stream API returns information about one or more data streams, including their backing indexes, generation, and status.

<!-- spec_insert_start
api: indices.get_data_stream
component: endpoints
-->
## Endpoints
```json
GET /_data_stream
GET /_data_stream/{name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: indices.get_data_stream
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | List or String | A comma-separated list of data stream names used to limit the request. Wildcard (`*`) expressions are supported. If omitted, all data streams are returned. |

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

The following example request returns information about all data streams in the cluster:

<!-- spec_insert_start
component: example_code
rest: GET /_data_stream
-->
{% capture step1_rest %}
GET /_data_stream
{% endcapture %}

{% capture step1_python %}

response = client.indices.get_data_stream()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To return information about a specific data stream, provide its name as the `name` path parameter:

<!-- spec_insert_start
component: example_code
rest: GET /_data_stream/logs-app
-->
{% capture step1_rest %}
GET /_data_stream/logs-app
{% endcapture %}

{% capture step1_python %}


response = client.indices.get_data_stream(
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
  "data_streams": [
    {
      "name": "logs-app",
      "timestamp_field": {
        "name": "@timestamp"
      },
      "indices": [
        {
          "index_name": ".ds-logs-app-000001",
          "index_uuid": "23dD0HE5Sg2kSLLAP_YtNA"
        }
      ],
      "generation": 1,
      "status": "YELLOW",
      "template": "template-logs-app"
    }
  ]
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `data_streams` | Array | A list of objects, one for each data stream. |
| `data_streams[n].name` | String | The name of the data stream. |
| `data_streams[n].timestamp_field` | Object | The timestamp field configuration for the data stream. |
| `data_streams[n].timestamp_field.name` | String | The name of the timestamp field, usually `@timestamp`. |
| `data_streams[n].indices` | Array | A list of the data stream's backing indexes. The last item in the array is the current write index. |
| `data_streams[n].indices[n].index_name` | String | The name of the backing index. |
| `data_streams[n].indices[n].index_uuid` | String | The UUID of the backing index. |
| `data_streams[n].generation` | Integer | The current generation of the data stream. This number increases by one with each rollover. |
| `data_streams[n].status` | String | The health status of the data stream, based on the health of its backing indexes. Valid values are `GREEN`, `YELLOW`, and `RED`. |
| `data_streams[n].template` | String | The name of the index template used to create the data stream. |
| `data_streams[n].hidden` | Boolean | Whether the data stream is hidden. |
| `data_streams[n].system` | Boolean | Whether the data stream is managed internally by OpenSearch and cannot be modified through normal user interaction. |
| `data_streams[n].ilm_policy` | String | The name of the associated Index State Management (ISM) policy, if one is configured. |
| `data_streams[n].allow_custom_routing` | Boolean | Whether the data stream allows custom routing on write requests. |
| `data_streams[n]._meta` | Object | Custom metadata attached to the data stream. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/data_stream/get`.

## Related documentation

- [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/)
- [Get data stream stats]({{site.url}}{{site.baseurl}}/api-reference/data-stream/data-stream-stats/)
