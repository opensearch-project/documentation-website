---
layout: default
title: Scroll
parent: Search APIs
nav_order: 30
redirect_from:
 - /opensearch/rest-api/scroll/
 - /api-reference/scroll/
---

# Scroll API
**Introduced 1.0**
{: .label .label-purple }

You can use the `scroll` operation to retrieve a large number of results. For example, for machine learning jobs, you can request an unlimited number of results in batches.

To use the `scroll` operation, add a `scroll` parameter to the request header with a search context to tell OpenSearch how long you need to keep scrolling. This search context needs to be long enough to process a single batch of results.

Because search contexts consume a lot of memory, we suggest you don't use the `scroll` operation for frequent user queries. Instead, use the `sort` parameter with the `search_after` parameter to scroll responses for user queries.
{: .note }

Note the following performance considerations:

- For the most efficient scrolling when you don't need relevance scoring, sort by `_doc`. This disables scoring and returns documents in their natural index order, which is the fastest way to iterate over all documents in an index.
- Only the initial search response includes aggregation results. Subsequent scroll requests return only the next batch of hits.
- Each open scroll context prevents segment merging on the associated shards and consumes file handles and heap memory. Close scroll contexts as soon as you no longer need them.
- The maximum number of open scroll contexts is controlled by the `search.max_open_scroll_context` cluster setting, which defaults to 500.

<!-- spec_insert_start
api: scroll
component: endpoints
-->
## Endpoints
```json
GET  /_search/scroll
POST /_search/scroll
GET  /_search/scroll/{scroll_id}
POST /_search/scroll/{scroll_id}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `scroll_id` | String | The scroll ID for the search. We recommend specifying the scroll ID in the request body instead because scroll IDs can be very long. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `scroll` | String | The amount of time to extend the search context. This value overrides the duration set in the original search request's `scroll` parameter. Cannot exceed the `search.max_keep_alive` cluster setting. | None |
| `scroll_id` | String | The scroll ID for the search. We recommend specifying the scroll ID in the request body instead of as a query parameter because scroll IDs can be very long. | None |
| `rest_total_hits_as_int` | Boolean | Whether the `hits.total` property is returned as an integer (`true`) or an object (`false`). | `false` |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `scroll` | String | The amount of time to extend the search context for the next scroll request. If both the query parameter and request body field are specified, the query parameter takes precedence. |
| `scroll_id` | String | Required. The scroll ID returned by the initial search request or the previous scroll request. |

## Example request

The following example demonstrates the scroll workflow from initiating a scroll operation to retrieving all results.

### Step 1: Start the scroll operation

To begin scrolling, send an initial search query with a `scroll` parameter that specifies how long to keep the search context alive (for example, `10m` for 10 minutes). Use the `size` parameter to set how many results to return in each batch:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search?scroll=10m
body: |
{
  "size": 10000
}
-->
{% capture step1_rest %}
GET /shakespeare/_search?scroll=10m
{
  "size": 10000
}
{% endcapture %}

{% capture step1_python %}


response = client.search(
  index = "shakespeare",
  params = { "scroll": "10m" },
  body =   {
    "size": 10000
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

OpenSearch caches the results and returns a scroll ID to access them in batches:

```json
"_scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
```

### Step 2: Retrieve subsequent batches

Pass this scroll ID to the `scroll` operation to get back the next batch of results:

<!-- spec_insert_start
component: example_code
rest: GET /_search/scroll
body: |
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
-->
{% capture step1_rest %}
GET /_search/scroll
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
{% endcapture %}

{% capture step1_python %}


response = client.scroll(
  body =   {
    "scroll": "10m",
    "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Using this scroll ID, you get results in batches of 10,000 as long as the search context is still open. Typically, the scroll ID does not change between requests, but it *can* change, so make sure to always use the latest scroll ID. If you don't send the next scroll request within the set search context, the `scroll` operation does not return any results.

### Detecting the end of results

When you've scrolled through all results, the final batch contains an empty `hits` array:

```json
{
  "_scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==",
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

When `hits.hits` is an empty array, you've retrieved all available results and should stop scrolling. Make sure to close the scroll context to free up resources.

### Using sliced scroll

If you expect billions of results, use a sliced scroll. Slicing allows you to perform multiple scroll operations for the same request, but in parallel.
Set the ID and the maximum number of slices for the scroll:

<!-- spec_insert_start
component: example_code
rest: GET /shakespeare/_search?scroll=10m
body: |
{
  "slice": {
    "id": 0,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
-->
{% capture step1_rest %}
GET /shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 0,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.search(
  index = "shakespeare",
  params = { "scroll": "10m" },
  body =   {
    "slice": {
      "id": 0,
      "max": 10
    },
    "query": {
      "match_all": {}
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Each slice produces its own independent scroll ID. With `"max": 10`, you initiate 10 separate scroll operations (IDs 0 through 9), each returning a distinct subset of the data. You then scroll each slice independently until all slices are exhausted. The number of slices is limited by the `index.max_slices_per_scroll` setting, which defaults to `1024`.

### Step 3: Close the scroll context

Close the search context when you're done scrolling because the `scroll` operation continues to consume computing resources until the timeout:

<!-- spec_insert_start
component: example_code
rest: DELETE /_search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
-->
{% capture step1_rest %}
DELETE /_search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
{% endcapture %}

{% capture step1_python %}


response = client.clear_scroll(
  scroll_id = "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==",
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To close all open scroll contexts:

<!-- spec_insert_start
component: example_code
rest: DELETE /_search/scroll/_all
-->
{% capture step1_rest %}
DELETE /_search/scroll/_all
{% endcapture %}

{% capture step1_python %}


response = client.clear_scroll(
  scroll_id = "_all",
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Results from a scrolling search reflect the state of the index at the time of the initial search request. Documents indexed or modified after the scroll was initiated do not appear in scroll results, even if they match the query.
{: .important}

## Example response

The scroll operation returns the same response structure as the search API, including `_scroll_id`, `hits`, `_shards`, and timing information.

The clear scroll operation returns the following response:

```json
{
  "succeeded": true,
  "num_freed": 1
}
```

## Response body fields

The following table lists the response body fields for the scroll operation.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_scroll_id` | String | The scroll ID to use for the next scroll request. This value may change between requests, so always use the most recently returned ID. |
| `took` | Integer | The time, in milliseconds, that the request took to complete. |
| `timed_out` | Boolean | Whether the request timed out before completing. |
| `_shards` | Object | Information about the shards involved, including `total`, `successful`, `skipped`, and `failed` counts. |
| `hits` | Object | The search results, including the `total` hit count and the array of matching documents. When scrolling is complete, `hits.hits` is an empty array. |

The following table lists the response body fields for the clear scroll operation.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `succeeded` | Boolean | Whether the scroll context was successfully released. |
| `num_freed` | Integer | The number of scroll contexts that were freed. |

## Related documentation

- [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/)
- [Point in Time API]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time-api/)
