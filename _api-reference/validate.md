---
layout: default
title: Validate query
nav_order: 87
---

# Validate Query

The Validate Query API checks if a large query will run without running the query. The query can be sent either as a path parameter or in the request body.

## Paths and HTTP Methods

The Validate Query API contains the following paths:

```
GET <index>/_validate/query
```

## Path parameters

All path parameters are optional.

Option | Type | Description
:--- | :--- | :---
`index` | String | The index to validate the query against. If you don't specify an index or multiple indexes as part of the URL (or want to override the URL value for an individual search), you can include it here. Examples include `"logs-*"` and `["my-store", "sample_data_ecommerce"]`.
`query` | Query object | The query using [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

## Query parameters

You can use the following options in the query.

Parameter | Type | Description
:--- | :--- | :---
`all_shards` | Boolean | When `true`, validation is run against all shards instead of one shard per index. Default is `false`.
`allow_no_indices` | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
allow_partial_search_results | Boolean | Whether to return partial results if the request runs into an error or times out. Default is `true`.
`analyzer` | String | The analyzer to use in the query string. This should only be used with `q` option.
`analyze_wildcard` | Boolean | Specifies whether to analyze wildcard and prefix queries. Default is `false`. 
`default_operator` | String | Indicates whether the default operator for a string query should be `AND` or `OR`. Default is `OR`.
`df` | String | The default field in case a field prefix is not provided in the query string.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`explain` | Boolean | Whether to return details about how OpenSearch computed the document's score. Default is `false`.
`ignore_unavailable` |  Boolean | Specifies whether to include missing or closed indexes in the response and ignores unavailable shards during the search request. Default is `false`.
`lenient` | Boolean | Specifies whether OpenSearch should ignore format-based query failures (for example, querying a text field for an integer). Default is `false`. 
`rewrite` | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`q` | String | Query in the Lucene query string syntax.


## Example Responses

The following examples show how the [Explain](#explain), [Rewrite](#rewrite), and [all_shards](#rewrite-and-all_shards) query options affect the response:

### Explain 

The `explain` option gives information about why a query failed inside the explanations response option, as shown in the following response example:

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

When the query is valid, the explanation response option shows the string representation of the query. When `rewrite:` is set to `true`:, the explanation is more detailed showing the actual Lucene query that will be executed.

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

When both the `rewrite` and `all_shards` options are set to `true`, the Validate API responds with detailed information from all available shards as opposed to the default of one shard, as shown in the following response:

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
      "explanation": "(user.id:hamlet)^0.6333333 user.id:kimchy"
    }
  ]
}





