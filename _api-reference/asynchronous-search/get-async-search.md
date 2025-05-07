---
layout: default
title: Get asynchronous search
parent: Asynchronous Search APIs
nav_order: 20
---

# Get asynchronous search
**Introduced 1.0**
{: .label .label-purple }

The Get Asynchronous Search API retrieves the status or results of a previously submitted asynchronous search. You can use this API to:

- Monitor the progress of a long-running search.
- Retrieve partial results while the search is still running.
- Access the final search results after completion.
- Extend the expiration time of stored search results.

This API returns both search status metadata and any available results in the same format as a standard search response.


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
| `id` | **Required** | String | The unique ID of the asynchronous search to retrieve. This ID is returned when the search is created. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `keep_alive` | String | Extends the expiration time of the search results. For example, 2d extends the expiration by two days from the current time. |
| `wait_for_completion_timeout` | String | 	The maximum amount of time to wait for the search to complete before returning a response. Maximum is 300s. If not specified, the API returns results immediately based on the current search state. |

## Example request

The following request retrieves an asynchronous search with ID `FFj38GhYw82NsHg7` and extends its expiration time by one hour:

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

| Field  | Data type | Description  |
| :---| :---- | :--- |
| `id`     | String    | The ID of the asynchronous search.      |
| `state`    | String    | The current state of the search. Possible values: `RUNNING`, `SUCCEEDED`, `FAILED`, or `PERSISTED`.   |
| `start_time_in_millis`  | Long   | The time the search started, in UNIX epoch milliseconds.     |
| `expiration_time_in_millis` | Long   | The time the results will expire, in UNIX epoch milliseconds.  |
| `took`   | Integer   | The time the search has taken so far, in milliseconds.    |
| `response`  | Object    | The search response object, returned in the same format as a standard search. This field may be empty if no results are available yet. |
