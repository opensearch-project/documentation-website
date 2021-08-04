---
layout: default
title: Multi search
parent: REST API reference
nav_order: 130
---

# Multi search
Introduced 1.0
{: .label .label-purple }

The multi-search operation lets you bundle multiple search requests and send them to your OpenSearch cluster in a single request. This operation executes searches in parallel, so you get back the response more quickly as compared to independent search requests. It also executes each request independently, so the failure of one request doesn't affect the others.

The multi-search request body follows this pattern:

```
header\n
body\n
header\n
body\n
```

OpenSearch uses newline characters to parse multi-search requests and requires that each request ends with a newline character.

## Example

```json
GET _msearch
{"index":"opensearch_dashboards_sample_data_logs"}
{"query":{"match_all":{}},"from":0,"size":10}
{"index":"opensearch_dashboards_sample_data_ecommerce","search_type":"dfs_query_then_fetch"}
{"query":{"match_all":{}}}
```

## Path and HTTP methods

```
GET <target>/_msearch
```

## URL parameters

All multi-search URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indices. Default is `true`.
`css_minimize_roundtrips` | Boolean | If true, network roundtrips between the local node and remote clusters are minimized for cross-cluster search requests. Default is `true`.
`expand_wildcards` | Enum | Expands wildcard expressions to concrete indices. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.
`ignore_unavailable` | Boolean | If an index from the indices list doesn’t exist, whether to ignore it rather than fail the query. Default is `false`.
`max_concurrent_searches` | Integer | Maximum number of searches executed in parallel. Default is `max(1, (number of of data nodes * min(search thread pool size, 10)))`.
`max_concurrent_shard_requests` | Integer | Maximum number of concurrent shard requests that each sub-search request executes per node. Default is 5. If you have an environment where a very low number of concurrent search requests is expected, a higher value of this parameter might improve performance.
`pre_filter_shard_size` | Integer | Defines a threshold that enforces a round-trip to pre-filter search shards that cannot possibly match. This filter phase can limit the number of searched shards significantly. For instance, if a date range filter is applied, then all indices that don't contain documents within that date range are skipped. Default is 128.
`rest_total_hits_as_int` | String | Whether the `hits.total` property is returned as an integer or an object. Default is `false`.
`search_type` | String | Whether global term and document frequencies are used when calculating the relevance score. Valid choices are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using local term and document frequencies for the shard. It's usually faster but less accurate. `dfs_query_then_fetch` scores documents using global term and document frequencies across all shards. It's usually slower but more accurate. Default is `query_then_fetch`.
`typed_keys` | Boolean | Whether aggregation names are prefixed by their internal types in the response. Default is `false`.

## Response

You get back the responses in an array form, where the search response for each search request matches its order in the original multi-search request.

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
            "_type" : "_doc",
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
            "_type" : "_doc",
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
