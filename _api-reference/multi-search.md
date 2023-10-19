---
layout: default
title: Multi-search
nav_order: 45
redirect_from: 
 - /opensearch/rest-api/multi-search/
---

# Multi-search
**Introduced 1.0**
{: .label .label-purple }

As the name suggests, the multi-search operation lets you bundle multiple search requests into a single request. OpenSearch then executes the searches in parallel, so you get back the response more quickly compared to sending one request per search. OpenSearch executes each search independently, so the failure of one doesn't affect the others.

## Example

```json
GET _msearch
{ "index": "opensearch_dashboards_sample_data_logs"}
{ "query": { "match_all": {} }, "from": 0, "size": 10}
{ "index": "opensearch_dashboards_sample_data_ecommerce", "search_type": "dfs_query_then_fetch"}
{ "query": { "match_all": {} } }

```
{% include copy-curl.html %}


## Path and HTTP methods

```
GET _msearch
GET <indices>/_msearch
POST _msearch
POST <indices>/_msearch
```


## Request body

The multi-search request body follows this pattern:

```
Metadata\n
Query\n
Metadata\n
Query\n

```

- Metadata lines include options, such as which indexes to search and the type of search.
- Query lines use the [query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/).

Just like the [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) operation, the JSON doesn't need to be minified---spaces are fine---but it does need to be on a single line. OpenSearch uses newline characters to parse multi-search requests and requires that the request body end with a newline character.


## URL parameters and metadata options

All multi-search URL parameters are optional. Some can also be applied per-search as part of each metadata line.

Parameter | Type | Description | Supported in metadata line
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`. | Yes
cancel_after_time_interval | Time | The time after which the search request will be canceled. Supported at both parent and child request levels. The order of precedence is:<br> 1. Child-level parameter<br> 2. Parent-level parameter<br> 3. [Cluster setting]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings).<br>Default is -1. | Yes
css_minimize_roundtrips | Boolean | Whether OpenSearch should try to minimize the number of network round trips between the coordinating node and remote clusters (only applicable to cross-cluster search requests). Default is `true`. | No
expand_wildcards | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`. | Yes
ignore_unavailable | Boolean | If an index from the indexes list doesn’t exist, whether to ignore it rather than fail the query. Default is `false`. | Yes
max_concurrent_searches | Integer | The maximum number of concurrent searches. The default depends on your node count and search thread pool size. Higher values can improve performance, but risk overloading the cluster. | No
max_concurrent_shard_requests | Integer | Maximum number of concurrent shard requests that each search executes per node. Default is 5. Higher values can improve performance, but risk overloading the cluster. | No
pre_filter_shard_size | Integer | Default is 128. | No
rest_total_hits_as_int | String | Whether the `hits.total` property is returned as an integer (`true`) or an object (`false`). Default is `false`. | No
search_type | String | Affects relevance score. Valid options are `query_then_fetch` and `dfs_query_then_fetch`. `query_then_fetch` scores documents using term and document frequencies for the shard (faster, less accurate), whereas `dfs_query_then_fetch` uses term and document frequencies across all shards (slower, more accurate). Default is `query_then_fetch`. | Yes
typed_keys | Boolean | Whether to prefix aggregation names with their internal types in the response. Default is `false`. | No

{% comment %}Regarding `pre_filter_shard_size`: The description from the REST API specification is unintelligible---to me, anyway. I wasn't able to learn anything from reading the source code, either, so I've included the default value and nothing else in the table above. - aetter

From the REST API specification: A threshold that enforces a pre-filter round trip to prefilter search shards based on query rewriting if the number of shards the search request expands to exceeds the threshold. This filter roundtrip can limit the number of shards significantly if for instance a shard can not match any documents based on its rewrite method ie. if date filters are mandatory to match but the shard bounds and the query are disjoint.{% endcomment %}


## Metadata-only options

Some options can't be applied as URL parameters to the entire request. Instead, you can apply them per-search as part of each metadata line. All are optional.

Option | Type | Description
:--- | :--- | :---
index | String, string array | If you don't specify an index or multiple indexes as part of the URL (or want to override the URL value for an individual search), you can include it here. Examples include `"logs-*"` and `["my-store", "sample_data_ecommerce"]`.
preference | String | The nodes or shards that you'd like to perform the search. This setting can be useful for testing, but in most situations, the default behavior provides the best search latencies. Options include `_local`, `_only_local`, `_prefer_nodes`, `_only_nodes`, and `_shards`. These last three options accept a list of nodes or shards. Examples include `"_only_nodes:data-node1,data-node2"` and `"_shards:0,1`.
request_cache | Boolean | Whether to cache results, which can improve latency for repeat searches. Default is to use the `index.requests.cache.enable` setting for the index (which defaults to `true` for new indexes).
routing | String | Comma-separated custom routing values, for example, `"routing": "value1,value2,value3"`.


## Response

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
