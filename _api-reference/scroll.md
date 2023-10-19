---
layout: default
title: Scroll
nav_order: 71
redirect_from:
 - /opensearch/rest-api/scroll/
---

# Scroll
**Introduced 1.0**
{: .label .label-purple }

You can use the `scroll` operation to retrieve a large number of results. For example, for machine learning jobs, you can request an unlimited number of results in batches.

To use the `scroll` operation, add a `scroll` parameter to the request header with a search context to tell OpenSearch how long you need to keep scrolling. This search context needs to be long enough to process a single batch of results.

Because search contexts consume a lot of memory, we suggest you don't use the `scroll` operation for frequent user queries. Instead, use the `sort` parameter with the `search_after` parameter to scroll responses for user queries.
{: .note }

## Example

To set the number of results that you want returned for each batch, use the `size` parameter:

```json
GET shakespeare/_search?scroll=10m
{
  "size": 10000
}
```
{% include copy-curl.html %}

OpenSearch caches the results and returns a scroll ID to access them in batches:

```json
"_scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
```

Pass this scroll ID to the `scroll` operation to get back the next batch of results:

```json
GET _search/scroll
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
```
{% include copy-curl.html %}

Using this scroll ID, you get results in batches of 10,000 as long as the search context is still open. Typically, the scroll ID does not change between requests, but it *can* change, so make sure to always use the latest scroll ID. If you don't send the next scroll request within the set search context, the `scroll` operation does not return any results.

If you expect billions of results, use a sliced scroll. Slicing allows you to perform multiple scroll operations for the same request, but in parallel.
Set the ID and the maximum number of slices for the scroll:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 0,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

With a single scroll ID, you get back 10 results.
You can have up to 10 IDs.

Close the search context when you’re done scrolling, because the `scroll` operation continues to consume computing resources until the timeout:

```json
DELETE _search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
```
{% include copy-curl.html %}

To close all open scroll contexts:

```json
DELETE _search/scroll/_all
```
{% include copy-curl.html %}

The `scroll` operation corresponds to a specific timestamp. It doesn't consider documents added after that timestamp as potential results.


## Path and HTTP methods

```
GET _search/scroll
POST _search/scroll
```
```
GET _search/scroll/<scroll-id>
POST _search/scroll/<scroll-id>
```

## URL parameters

All scroll parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
scroll | Time | Specifies the amount of time the search context is maintained.
scroll_id | String | The scroll ID for the search.
rest_total_hits_as_int | Boolean | Whether the `hits.total` property is returned as an integer (`true`) or an object (`false`). Default is `false`.

## Response

```json
{
  "succeeded": true,
  "num_freed": 1
}
```
