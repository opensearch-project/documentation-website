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

## Endpoints

```json
GET _search/scroll
POST _search/scroll
GET _search/scroll/<scroll-id>
POST _search/scroll/<scroll-id>
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
scroll_id | String | The scroll ID for the search.

## Query parameters

All scroll parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
scroll | Time | Specifies the amount of time the search context is maintained.
scroll_id | String | The scroll ID for the search.
rest_total_hits_as_int | Boolean | Whether the `hits.total` property is returned as an integer (`true`) or an object (`false`). Default is `false`.

## Example requests

To set the number of results that you want returned for each batch, use the `size` parameter:

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

With a single scroll ID, you get back 10 results.
You can have up to 10 IDs.

Close the search context when you’re done scrolling, because the `scroll` operation continues to consume computing resources until the timeout:

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

The `scroll` operation corresponds to a specific timestamp. It doesn't consider documents added after that timestamp as potential results.

## Example response

```json
{
  "succeeded": true,
  "num_freed": 1
}
```
