---
layout: default
title: Get asynchronous search
parent: Asynchronous Search APIs
nav_order: 20
---

# Get asynchronous search
**Introduced 1.0**
{: .label .label-purple }

The Get Asynchronous Search API allows you to retrieve the status or results of a previously submitted asynchronous search operation. You can use this API to check whether a search has completed, retrieve partial results while it's still running, or access the final results after completion.

This API is particularly useful in workflows where you need to:
- Monitor the progress of long-running searches
- Retrieve partial results to display incremental updates to users
- Access the final search results when ready
- Extend the expiration time of stored search results

The API returns both metadata about the search status and any available results, with the same format as the standard search response.

<!-- spec_insert_start
api: asynchronous_search.get
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_asynchronous_search/{id}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The ID of the asynchronous search to retrieve. This is the ID returned when the search was created. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `keep_alive` | String | Extends the expiration time of the search results. For example, passing `2d` will extend the expiration by 2 days from the current time. If not specified, the expiration time remains unchanged. |
| `wait_for_completion_timeout` | String | The amount of time to wait for the search to complete before returning partial results. Maximum value is 300 seconds. If not specified, returns results immediately based on the current state. |

## Example request

The following request retrieves an asynchronous search with ID `FFj38GhYw82NsHg7` and extends its expiration time by 1 hour:

```json
GET /_plugins/_asynchronous_search/Fj38GhYw82NsHg7keep_alive=1h
```
{% include copy-curl.html %}

## Example response

```json
{
  "id": "Fj38GhYw82NsHg7",
  "state": "SUCCEEDED",
  "start_time_in_millis": 1663276896192,
  "expiration_time_in_millis": 1663366896192,
  "took": 3255,
  "response": {
    "took": 3255,
    "timed_out": false,
    "_shards": {
      "total": 10,
      "successful": 10,
      "skipped": 0,
      "failed": 0
    },
    "hits": {
      "total": {
        "value": 15,
        "relation": "eq"
      },
      "max_score": 1.0,
      "hits": [
        {
          "_index": "my-index",
          "_id": "1",
          "_score": 1.0,
          "_source": {
            "field1": "value1",
            "field2": "value2"
          }
        },
        // Additional hits omitted for brevity
      ]
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `expiration_time_in_millis` | Long | The UNIX timestamp in milliseconds when the asynchronous search results will expire and be deleted from the cluster. |
| `id` | String | The unique identifier for the asynchronous search request. Use this ID to check the status, get results, or delete the search. |
| `response` | Object | Contains the search results (if available) in the same format as a standard search response. May be empty if no results are available yet. |
| `start_time_in_millis` | Long | The UNIX timestamp in milliseconds when the asynchronous search was started. |
| `state` | String | The current state of the asynchronous search. Possible values include `RUNNING`, `SUCCEEDED`, `FAILED`, or `PERSISTED`. |
| `took` | Integer | The time in milliseconds that the search took to execute so far. |