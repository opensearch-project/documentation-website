---
layout: default
title: Data stream stats
parent: Index APIs
nav_order: 74
---

# Data stream stats

The Data Stream Stats API provides statistics about one or more data streams. This includes information such as the number of backing indexes, store size, and maximum timestamp. This API is useful for monitoring storage and indexing activity across data streams.

## Endpoints
```json
GET /_data_stream/_stats
GET /_data_stream/{name}/_stats
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | List or String | A comma-separated list of data streams used to limit the request. Wildcard expressions (`*`) are supported. To target all data streams in a cluster, omit this parameter or use `*`. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `error_trace` | Boolean | Whether to include the stack trace of returned errors. | `false` |
| `filter_path` | List or String | Used to reduce the response. This parameter takes a comma-separated list of filters. It supports using wildcards to match any field or part of a field's name. You can also exclude fields with "-". | N/A |
| `human` | Boolean | Whether to return human-readable values for statistics. | `false` |
| `pretty` | Boolean | Whether to pretty format the returned JSON response. | `false` |
| `source` | String | The URL-encoded request definition. Useful for libraries that do not accept a request body for non-POST requests. | N/A |

## Example

Create an index template with a matching pattern and data stream enabled:

```json
PUT /_index_template/template-logs-app
{
  "index_patterns": ["logs-app*"],
  "data_stream": {}
}
```
{% include copy-curl.html %}

Create the data stream:

```json
PUT /_data_stream/logs-app
```
{% include copy-curl.html %}

Index a document to generate backing indexes:

```json
POST /logs-app/_doc
{
  "@timestamp": "2025-06-23T10:00:00Z",
  "message": "app started"
}
```
{% include copy-curl.html %}


Retrieve data stream stats:

```json
GET /_data_stream/logs-app/_stats?human=true
```
{% include copy-curl.html %}

## Example response

The response contains storage and shard statistics for each data stream in the cluster:

```json
{
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "data_stream_count": 1,
  "backing_indices": 1,
  "total_store_size": "16.8kb",
  "total_store_size_bytes": 17304,
  "data_streams": [
    {
      "data_stream": "logs-app",
      "backing_indices": 1,
      "store_size": "16.8kb",
      "store_size_bytes": 17304,
      "maximum_timestamp": 1750673100000
    }
  ]
}
```

## Response body fields

| Field | Data type | Description |
| `_shards.total` | Integer | The total number of shards involved in the request. |
| `_shards.successful`| Integer | The number of successful shard fetches. |
| `_shards.failed`| Integer | The number of failed shard fetches. |
| `data_stream_count` | Integer | The total number of data streams returned in the response.|
| `backing_indices` | Integer | The total number of backing indexes across all data streams.|
| `total_store_size`| String| A human-readable total size of all data stream storage. Present only if `human=true`. |
| `total_store_size_bytes`| Integer | The total storage used by all data streams, in bytes. |
| `data_streams`| Array | A list of objects, one for each data stream.|
| `data_streams[n].data_stream` | String| The name of the data stream.|
| `data_streams[n].backing_indices` | Integer | The number of backing indexes for the data stream.|
| `data_streams[n].store_size`| String| Human-readable storage used by the data stream. Present only if `human=true`. |
| `data_streams[n].store_size_bytes`| Integer | The total storage used by the data stream, in bytes.|
| `data_streams[n].maximum_timestamp` | Long| The maximum timestamp across all documents in the data stream. |
