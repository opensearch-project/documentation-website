---
layout: default
title: Multi-search
parent: Search APIs
nav_order: 20
redirect_from: 
 - /opensearch/rest-api/multi-search/
 - /api-reference/multi-search/
---

# Multi-Search API
**Introduced 1.0**
{: .label .label-purple }

As the name suggests, the multi-search operation lets you bundle multiple search requests into a single request. OpenSearch then executes the searches in parallel, so you get back the response more quickly compared to sending one request per search. OpenSearch executes each search independently, so the failure of one doesn't affect the others.


<!-- spec_insert_start
api: msearch
component: endpoints
-->
## Endpoints
```json
GET  /_msearch
POST /_msearch
GET  /{index}/_msearch
POST /{index}/_msearch
```
<!-- spec_insert_end -->

Specifying an index in the path sets the default target for any searches whose metadata line does not include an `index` field. If you omit the path parameter and a search's metadata line also does not specify an `index`, the search runs against all indexes.


## Query parameters and metadata options

All parameters are optional. Some can also be applied per-search as part of each metadata line.

Parameter | Type | Description | Supported in metadata line
:--- | :--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`. | Yes
`cancel_after_time_interval` | Time | The time after which the search request will be canceled. Supported at both parent and child request levels. The order of precedence is:<br> 1. Child-level parameter<br> 2. Parent-level parameter<br> 3. [Cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings/).<br>Default is -1. | Yes
`ccs_minimize_roundtrips` | Boolean | Whether OpenSearch should try to minimize the number of network round trips between the coordinating node and remote clusters (only applicable to cross-cluster search requests). Default is `true`. | No
`expand_wildcards` | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`. | Yes
`ignore_unavailable` | Boolean | If an index or shard from the indexes list doesn't exist, whether to ignore it rather than fail the query. Default is `false`. | Yes
`include_named_queries_score` | Boolean | Whether to return scores for named queries. Default is `false`. | No
`max_concurrent_searches` | Integer | The maximum number of concurrent searches. The default depends on your node count and search thread pool size. Higher values can improve performance, but risk overloading the cluster. | No
`max_concurrent_shard_requests` | Integer | Maximum number of concurrent shard requests that each search executes per node. Default is 5. Higher values can improve performance, but risk overloading the cluster. | No
`pre_filter_shard_size` | Integer | A threshold that triggers a pre-filter round trip to eliminate shards that cannot match the query (for example, because a date range filter falls outside the shard's bounds). When unspecified, the pre-filter phase runs if the request targets more than 128 shards, targets a read-only index, or sorts on an indexed field. Default is `128`. | No
`rest_total_hits_as_int` | String | Whether the `hits.total` property is returned as an integer (`true`) or an object (`false`). Default is `false`. | No
`routing` | String | Comma-separated custom routing values used to route all searches in the request to specific shards. To set routing for individual searches, use the `routing` option in the metadata line instead. | No
`search_type` | String | Affects relevance score. Valid options are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using term and document frequencies for the shard (faster, less accurate), whereas `dfs_query_then_fetch` uses term and document frequencies across all shards (slower, more accurate). Default is `query_then_fetch`. | Yes
`typed_keys` | Boolean | Whether to prefix aggregation names with their internal types in the response. Default is `false`. | No


## Metadata-only options

Some options can't be applied as parameters to the entire request. Instead, you can apply them per-search as part of each metadata line. All are optional.

Option | Type | Description
:--- | :--- | :---
`index` | String, string array | If you don't specify an index or multiple indexes as part of the URL (or want to override the URL value for an individual search), you can include it here. Examples include `"logs-*"` and `["my-store", "sample_data_ecommerce"]`.
`preference` | String | The nodes or shards that you'd like to perform the search. This setting can be useful for testing, but in most situations, the default behavior provides the best search latencies. Options include `_local`, `_only_local`, `_prefer_nodes`, `_only_nodes`, and `_shards`. These last three options accept a list of nodes or shards. Examples include `"_only_nodes:data-node1,data-node2"` and `"_shards:0,1`.
`request_cache` | Boolean | Whether to cache results, which can improve latency for repeat searches. Default is to use the `index.requests.cache.enable` setting for the index (which defaults to `true` for new indexes).
`routing` | String | Comma-separated custom routing values, for example, `"routing": "value1,value2,value3"`. Unlike `routing` at the query parameter level, which applies to all searches in the request, this option targets routing for an individual search only.

## Request body

The multi-search request body uses newline-delimited JSON (NDJSON) format, alternating between metadata and query lines:

```
Metadata\n
Query\n
Metadata\n
Query\n

```

- Metadata lines include options, such as which indexes to search and the type of search. A metadata line can be empty (`{}`) if no per-search overrides are needed.
- Query lines use the [query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/).

Just like the [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) operation, the JSON doesn't need to be minified---spaces are fine---but it does need to be on a single line. OpenSearch uses newline characters to parse multi-search requests and requires that the request body end with a newline character.

When sending requests to this endpoint, set the `Content-Type` header to `application/x-ndjson`.
{: .note}

### Query body fields

Each query line accepts the same parameters as the [Search API]({{site.url}}{{site.baseurl}}/api-reference/search/) request body. The following table lists the most commonly used fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `query` | Object | The query DSL expression to execute. See [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/). |
| `aggregations` | Object | Aggregations to run alongside the search. See [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/). |
| `from` | Integer | The starting offset for returned hits. Default is `0`. |
| `size` | Integer | The number of hits to return. Default is `10`. |
| `sort` | Array or Object | The fields and order by which to sort results. |
| `_source` | Boolean, String, or Object | Controls which fields are included in the `_source` of each hit. |
| `highlight` | Object | Highlight configuration for matched fields. |


## Example: Searching multiple indexes

The following example runs queries against multiple indexes, specifying the target index in each metadata line:


<!-- spec_insert_start
component: example_code
rest: GET /_msearch
body: |
{ "index": "opensearch_dashboards_sample_data_logs"}
{ "query": { "match_all": {} }, "from": 0, "size": 10}
{ "index": "opensearch_dashboards_sample_data_ecommerce", "search_type": "dfs_query_then_fetch"}
{ "query": { "match_all": {} } }
-->
{% capture step1_rest %}
GET /_msearch
{ "index": "opensearch_dashboards_sample_data_logs"}
{ "query": { "match_all": {} }, "from": 0, "size": 10}
{ "index": "opensearch_dashboards_sample_data_ecommerce", "search_type": "dfs_query_then_fetch"}
{ "query": { "match_all": {} } }
{% endcapture %}

{% capture step1_python %}


response = client.msearch(
  body = '''
{ "index": "opensearch_dashboards_sample_data_logs"}
{ "query": { "match_all": {} }, "from": 0, "size": 10}
{ "index": "opensearch_dashboards_sample_data_ecommerce", "search_type": "dfs_query_then_fetch"}
{ "query": { "match_all": {} } }
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example: Using a default index

When you specify an index in the URL path, that index serves as the default for any searches whose metadata line does not include an `index` field. The following example runs two queries against the `products` index without repeating the index name in each metadata line:

<!-- spec_insert_start
component: example_code
rest: GET /products/_msearch
body: |
{}
{"query": {"match": {"product_name": "headphones"}}, "size": 1}
{}
{"query": {"range": {"price": {"gte": 30, "lte": 50}}}}
-->
{% capture step1_rest %}
GET /products/_msearch
{}
{"query": {"match": {"product_name": "headphones"}}, "size": 1}
{}
{"query": {"range": {"price": {"gte": 30, "lte": 50}}}}
{% endcapture %}

{% capture step1_python %}


response = client.msearch(
  index = "products",
  body = '''
{}
{"query": {"match": {"product_name": "headphones"}}, "size": 1}
{}
{"query": {"range": {"price": {"gte": 30, "lte": 50}}}}
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Using search templates

The multi-search API supports [search templates]({{site.url}}{{site.baseurl}}/search-plugins/search-template/) through the `_msearch/template` endpoint. This lets you execute parameterized searches, separating the query structure from the values passed at search time.

### Example: Inline templates

The following request uses inline templates to run two parameterized searches in a single call:

```json
GET _msearch/template
{"index": "products"}
{"source": {"query": {"match": {"product_name": "{{search_term}}"}}}, "params": {"search_term": "wireless"}}
{"index": "products"}
{"source": {"query": {"range": {"price": {"lte": "{{max_price}}"}}}}, "params": {"max_price": "75"}}

```

### Example: Stored templates

You can also reference pre-registered templates by ID. First, create the stored templates:

```json
POST _scripts/product_search_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "multi_match": {
          "query": "{{query_text}}",
          "fields": ["product_name", "description"]
        }
      },
      "size": "{{result_count}}"
    }
  }
}
```
{% include copy-curl.html %}

```json
POST _scripts/price_range_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "range": {
          "price": {
            "gte": "{{min_price}}",
            "lte": "{{max_price}}"
          }
        }
      },
      "size": "{{result_count}}"
    }
  }
}
```
{% include copy-curl.html %}

Then use the stored templates in a multi-search request:

```json
GET _msearch/template
{"index": "products"}
{"id": "product_search_template", "params": {"query_text": "bluetooth speaker", "result_count": "5"}}
{"index": "products"}
{"id": "price_range_template", "params": {"min_price": "20", "max_price": "100", "result_count": "3"}}

```

## Example response

OpenSearch returns an array with the results of each search in the same order as the multi-search request.

```json
{
  "took" : 2150,
  "responses" : [
    {
      "took" : 2149,
      "timed_out" : false,
      "_shards" : {
        "total" : 1,
        "successful" : 1,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : {
          "value" : 10000,
          "relation" : "gte"
        },
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "opensearch_dashboards_sample_data_logs",
            "_id" : "_fnhBXsBgv2Zxgu9dZ8Y",
            "_score" : 1.0,
            "_source" : {
              "agent" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
              "bytes" : 4657,
              "clientip" : "213.116.129.196",
              "extension" : "zip",
              "geo" : {
                "srcdest" : "CN:US",
                "src" : "CN",
                "dest" : "US",
                "coordinates" : {
                  "lat" : 42.35083333,
                  "lon" : -86.25613889
                }
              },
              "host" : "artifacts.opensearch.org",
              "index" : "opensearch_dashboards_sample_data_logs",
              "ip" : "213.116.129.196",
              "machine" : {
                "ram" : 16106127360,
                "os" : "ios"
              },
              "memory" : null,
              "message" : "213.116.129.196 - - [2018-07-30T14:12:11.387Z] \"GET /opensearch_dashboards/opensearch_dashboards-1.0.0-windows-x86_64.zip HTTP/1.1\" 200 4657 \"-\" \"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)\"",
              "phpmemory" : null,
              "referer" : "http://twitter.com/success/ellison-onizuka",
              "request" : "/opensearch_dashboards/opensearch_dashboards-1.0.0-windows-x86_64.zip",
              "response" : 200,
              "tags" : [
                "success",
                "info"
              ],
              "timestamp" : "2021-08-02T14:12:11.387Z",
              "url" : "https://artifacts.opensearch.org/downloads/opensearch_dashboards/opensearch_dashboards-1.0.0-windows-x86_64.zip",
              "utc_time" : "2021-08-02T14:12:11.387Z",
              "event" : {
                "dataset" : "sample_web_logs"
              }
            }
          },
          ...
        ]
      },
      "status" : 200
    },
    {
      "took" : 1473,
      "timed_out" : false,
      "_shards" : {
        "total" : 1,
        "successful" : 1,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : {
          "value" : 4675,
          "relation" : "eq"
        },
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "opensearch_dashboards_sample_data_ecommerce",
            "_id" : "efnhBXsBgv2Zxgu9ap7e",
            "_score" : 1.0,
            "_source" : {
              "category" : [
                "Women's Clothing"
              ],
              "currency" : "EUR",
              "customer_first_name" : "Gwen",
              "customer_full_name" : "Gwen Dennis",
              "customer_gender" : "FEMALE",
              "customer_id" : 26,
              "customer_last_name" : "Dennis",
              "customer_phone" : "",
              "day_of_week" : "Tuesday",
              "day_of_week_i" : 1,
              "email" : "gwen@dennis-family.zzz",
              "manufacturer" : [
                "Tigress Enterprises",
                "Gnomehouse mom"
              ],
              "order_date" : "2021-08-10T16:24:58+00:00",
              "order_id" : 576942,
              "products" : [
                {
                  "base_price" : 32.99,
                  "discount_percentage" : 0,
                  "quantity" : 1,
                  "manufacturer" : "Tigress Enterprises",
                  "tax_amount" : 0,
                  "product_id" : 22182,
                  "category" : "Women's Clothing",
                  "sku" : "ZO0036600366",
                  "taxless_price" : 32.99,
                  "unit_discount_amount" : 0,
                  "min_price" : 14.85,
                  "_id" : "sold_product_576942_22182",
                  "discount_amount" : 0,
                  "created_on" : "2016-12-20T16:24:58+00:00",
                  "product_name" : "Jersey dress - black/red",
                  "price" : 32.99,
                  "taxful_price" : 32.99,
                  "base_unit_price" : 32.99
                },
                {
                  "base_price" : 28.99,
                  "discount_percentage" : 0,
                  "quantity" : 1,
                  "manufacturer" : "Gnomehouse mom",
                  "tax_amount" : 0,
                  "product_id" : 14230,
                  "category" : "Women's Clothing",
                  "sku" : "ZO0234902349",
                  "taxless_price" : 28.99,
                  "unit_discount_amount" : 0,
                  "min_price" : 13.05,
                  "_id" : "sold_product_576942_14230",
                  "discount_amount" : 0,
                  "created_on" : "2016-12-20T16:24:58+00:00",
                  "product_name" : "Blouse - june bug",
                  "price" : 28.99,
                  "taxful_price" : 28.99,
                  "base_unit_price" : 28.99
                }
              ],
              "sku" : [
                "ZO0036600366",
                "ZO0234902349"
              ],
              "taxful_total_price" : 61.98,
              "taxless_total_price" : 61.98,
              "total_quantity" : 2,
              "total_unique_products" : 2,
              "type" : "order",
              "user" : "gwen",
              "geoip" : {
                "country_iso_code" : "US",
                "location" : {
                  "lon" : -118.2,
                  "lat" : 34.1
                },
                "region_name" : "California",
                "continent_name" : "North America",
                "city_name" : "Los Angeles"
              },
              "event" : {
                "dataset" : "sample_ecommerce"
              }
            }
          },
         ...
        ]
      },
      "status" : 200
    }
  ]
}
```

## Response body fields

The following table lists the top-level response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `took` | Integer | The total time, in milliseconds, for OpenSearch to process all searches in the request. |
| `responses` | Array | An array of search response objects, returned in the same order as the corresponding searches in the request. If a particular search fails completely, the array entry for that search contains an `error` object and a `status` code instead of the normal search response. |

The following table lists the fields within each entry of the `responses` array.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `took` | Integer | The time, in milliseconds, for OpenSearch to process the individual search. |
| `timed_out` | Boolean | Whether the search timed out before completing. |
| `_shards` | Object | Information about the number of shards involved in the search, including `total`, `successful`, `skipped`, and `failed` counts. |
| `hits` | Object | The search results, including `total` hit count, `max_score`, and an array of matching `hits`. |
| `status` | Integer | The HTTP status code for the individual search result. A value of `200` indicates success. |

## Partial responses

If one or more shards fail during execution, the multi-search API still returns results from the successful shards. Each individual search response in the `responses` array includes a `_shards` object that reports how many shards succeeded and how many failed, allowing you to determine whether results are complete.
