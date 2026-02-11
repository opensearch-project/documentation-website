---
layout: default
title: Validate query
nav_order: 87
parent: Search APIs
redirect_from: 
 - /api-reference/validate/
canonical_url: https://docs.opensearch.org/latest/api-reference/search-apis/validate/
---

# Validate Query API

You can use the Validate Query API to validate a query without running it. The query can be sent as a path parameter or included in the request body.

## Endpoints

The Validate Query API contains the following path:

```json
GET <index>/_validate/query
```

## Path parameters

All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`index` | String | The index to validate the query against. If you don't specify an index or multiple indexes as part of the URL (or want to override the URL value for an individual search), you can include it here. Examples include `"logs-*"` and `["my-store", "sample_data_ecommerce"]`.
`query` | Query object | The query using [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`all_shards` | Boolean | When `true`, validation is run against [all shards](#rewrite-and-all_shards) instead of against one shard per index. Default is `false`.
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`.
allow_partial_search_results | Boolean | Whether to return partial results if the request encounters an error or times out. Default is `true`.
`analyzer` | String | The analyzer to use in the query string. This should only be used with the `q` option.
`analyze_wildcard` | Boolean | Specifies whether to analyze wildcard and prefix queries. Default is `false`. 
`default_operator` | String | Indicates whether the default operator for a string query should be `AND` or `OR`. Default is `OR`.
`df` | String | The default field if a field prefix is not provided in the query string.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`explain` | Boolean | Whether to return information about how OpenSearch computed the [document's score](#explain). Default is `false`.
`ignore_unavailable` |  Boolean | Specifies whether to include missing or closed indexes in the response and ignores unavailable shards during the search request. Default is `false`.
`lenient` | Boolean | Specifies whether OpenSearch should ignore format-based query failures (for example, as a result of querying a text field for an integer). Default is `false`. 
`rewrite` | Determines how OpenSearch [rewrites](#rewrite) and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`q` | String | A query in the Lucene string syntax.

## Example request

The following example request uses an index named `Hamlet` created using a `bulk` request:

<!-- spec_insert_start
component: example_code
rest: PUT /hamlet/_bulk?refresh
body: |
{"index":{"_id":1}}
{"user" : { "id": "hamlet" }, "@timestamp" : "2099-11-15T14:12:12", "message" : "To Search or Not To Search"}
{"index":{"_id":2}}
{"user" : { "id": "hamlet" }, "@timestamp" : "2099-11-15T14:12:13", "message" : "My dad says that I'm such a ham."}
-->
{% capture step1_rest %}
PUT /hamlet/_bulk?refresh
{"index":{"_id":1}}
{"user" : { "id": "hamlet" }, "@timestamp" : "2099-11-15T14:12:12", "message" : "To Search or Not To Search"}
{"index":{"_id":2}}
{"user" : { "id": "hamlet" }, "@timestamp" : "2099-11-15T14:12:13", "message" : "My dad says that I'm such a ham."}
{% endcapture %}

{% capture step1_python %}


response = client.bulk(
  index = "hamlet",
  params = { "refresh": "true" },
  body = '''
{"index":{"_id":1}}
{"user" : { "id": "hamlet" }, "@timestamp" : "2099-11-15T14:12:12", "message" : "To Search or Not To Search"}
{"index":{"_id":2}}
{"user" : { "id": "hamlet" }, "@timestamp" : "2099-11-15T14:12:13", "message" : "My dad says that I'm such a ham."}
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

You can then use the Validate Query API to validate an index query, as shown in the following example:

<!-- spec_insert_start
component: example_code
rest: GET /hamlet/_validate/query?q=user.id:hamlet
-->
{% capture step1_rest %}
GET /hamlet/_validate/query?q=user.id:hamlet
{% endcapture %}

{% capture step1_python %}


response = client.indices.validate_query(
  index = "hamlet",
  params = { "q": "user.id:hamlet" },
  body = { "Insert body here" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The query can also be sent as a request body, as shown in the following example:

<!-- spec_insert_start
component: example_code
rest: GET /hamlet/_validate/query
body: |
{
  "query" : {
    "bool" : {
      "must" : {
        "query_string" : {
          "query" : "*:*"
        }
      },
      "filter" : {
        "term" : { "user.id" : "hamlet" }
      }
    }
  }
}
-->
{% capture step1_rest %}
GET /hamlet/_validate/query
{
  "query": {
    "bool": {
      "must": {
        "query_string": {
          "query": "*:*"
        }
      },
      "filter": {
        "term": {
          "user.id": "hamlet"
        }
      }
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.validate_query(
  index = "hamlet",
  body =   {
    "query": {
      "bool": {
        "must": {
          "query_string": {
            "query": "*:*"
          }
        },
        "filter": {
          "term": {
            "user.id": "hamlet"
          }
        }
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example responses

If the query passes validation, then the response indicates that the query is `true`, as shown in the following example response, where the `valid` parameter is `true`:

```
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "valid": true
}
```

If the query does not pass validation, then OpenSearch responds that the query is `false`. The following example request query includes a dynamic mapping not configured in the `hamlet` index:

<!-- spec_insert_start
component: example_code
rest: GET /hamlet/_validate/query
body: |
{
  "query": {
    "query_string": {
      "query": "@timestamp:foo",
      "lenient": false
    }
  }
}
-->
{% capture step1_rest %}
GET /hamlet/_validate/query
{
  "query": {
    "query_string": {
      "query": "@timestamp:foo",
      "lenient": false
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.validate_query(
  index = "hamlet",
  body =   {
    "query": {
      "query_string": {
        "query": "@timestamp:foo",
        "lenient": false
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

OpenSearch responds with the following, where the `valid` parameter is `false`:

```
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "valid": false
}
```

Certain query parameters can also affect what is included in the response. The following examples show how the [Explain](#explain), [Rewrite](#rewrite), and [all_shards](#rewrite-and-all_shards) query options affect the response.

### Explain 

The `explain` option returns information about the query failure in the `explanations` field, as shown in the following example response:

```
{
  "valid" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "explanations" : [ {
    "index" : "_shakespeare",
    "valid" : false,
    "error" : "shakespeare/IAEc2nIXSSunQA_suI0MLw] QueryShardException[failed to create query:...failed to parse date field [foo]"
  } ]
}
```


### Rewrite

When the `rewrite` option is set to `true` in the request, the `explanations` option shows the Lucene query that is executed as a string, as shown in the following response:

```
{
   "valid": true,
   "_shards": {
      "total": 1,
      "successful": 1,
      "failed": 0
   },
   "explanations": [
      {
         "index": "",
         "valid": true,
         "explanation": "((user:hamlet^4.256753 play:hamlet^6.863601 play:romeo^2.8415773 plot:puck^3.4193945 plot:othello^3.8244398 ... )~4) -ConstantScore(_id:2) #(ConstantScore(_type:_doc))^0.0"
      }
   ]
}
```


### Rewrite and all_shards

When both the `rewrite` and `all_shards` options are set to `true`, the Validate Query API responds with detailed information from all available shards as opposed to only one shard (the default), as shown in the following response:

```
{
  "valid": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "explanations": [
    {
      "index": "my-index-000001",
      "shard": 0,
      "valid": true,
      "explanation": "(user.id:hamlet)^0.6333333"
    }
  ]
}
```






