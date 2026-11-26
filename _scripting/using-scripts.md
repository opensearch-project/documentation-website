---
layout: default
title: How to use scripts
nav_order: 10
---

# How to use scripts

Every OpenSearch API that accepts a script uses the same request syntax, so once you learn the shape of a `script` object you can apply it to searches, aggregations, updates, ingest pipelines, and index mappings alike:

```json
"script": {
  "lang": "painless",
  "source": "doc['price'].value * multiplier",
  "params": {
    "multiplier": 0.8
  }
}
```

The following table lists the fields of a `script` object.

Field | Data type | Description
:--- | :--- | :---
`lang` | String | The language that the script is written in. Default is `painless`.
`source` | String | The script body. Use this field for an inline script. Either `source` or `id` is required.
`id` | String | The identifier of a script that was saved with the [Create or Update Stored Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/). Use this field instead of `source` to run a stored script. Either `source` or `id` is required.
`params` | Object | Named values that OpenSearch passes into the script as variables. Optional.

## Test setup

The examples on this page and throughout the scripting documentation use an index of product records. Create the index with the following mapping:

```json
PUT scripting-products
{
  "mappings": {
    "properties": {
      "name":         { "type": "text" },
      "sku":          { "type": "keyword", "store": true },
      "brand":        { "type": "keyword", "store": true },
      "category":     { "type": "keyword" },
      "price":        { "type": "double" },
      "quantity":     { "type": "integer" },
      "ratings":      { "type": "integer" },
      "on_sale":      { "type": "boolean" },
      "release_date": { "type": "date" },
      "warehouse":    { "type": "geo_point" }
    }
  }
}
```
{% include copy-curl.html %}

Then index four products:

```json
POST scripting-products/_bulk?refresh=true
{"index":{"_id":"1"}}
{"name":"Wireless noise cancelling headphones","sku":"AUD-1001","brand":"Aurora","category":"audio","price":249.99,"quantity":42,"ratings":[5,4,5,3],"on_sale":true,"release_date":"2024-03-15","warehouse":{"lat":47.6062,"lon":-122.3321}}
{"index":{"_id":"2"}}
{"name":"Wireless earbuds","sku":"AUD-1002","brand":"Aurora","category":"audio","price":129.5,"quantity":8,"ratings":[4,4],"on_sale":false,"release_date":"2025-01-20","warehouse":{"lat":37.7749,"lon":-122.4194}}
{"index":{"_id":"3"}}
{"name":"Mechanical keyboard","sku":"ACC-2001","brand":"Northwind","category":"accessories","price":89.0,"quantity":120,"ratings":[5,5,5],"on_sale":true,"release_date":"2023-11-02","warehouse":{"lat":41.8781,"lon":-87.6298}}
{"index":{"_id":"4"}}
{"name":"Ultrawide monitor","sku":"DSP-3001","brand":"Northwind","category":"displays","price":599.0,"quantity":0,"on_sale":false,"release_date":"2025-06-10","warehouse":{"lat":30.2672,"lon":-97.7431}}
```
{% include copy-curl.html %}

## Running an inline script

An _inline_ script is specified in the `source` field of the request body. The following search applies a discount to the price of one product and returns the result as a [script field]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields), leaving the stored document untouched:

```json
GET scripting-products/_search
{
  "_source": false,
  "query": { "term": { "sku": "AUD-1001" } },
  "script_fields": {
    "sale_price": {
      "script": {
        "lang": "expression",
        "source": "doc['price'] * discount",
        "params": { "discount": 0.8 }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `sale_price` field is computed at request time:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 372,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "scripting-products",
        "_id": "1",
        "_score": 1.0,
        "fields": {
          "sale_price": [
            199.99200000000002
          ]
        }
      }
    ]
  }
}
```
</details>

## Passing values as parameters

Pass every value that varies between requests in `params` rather than writing it into the script body so that the script compiles once and every subsequent request reuses the compiled result. OpenSearch compiles each distinct script on first use and caches it, and compilation is slower relative to running the compiled script.

For example, the following script hardcodes the discount, so each discount value is a distinct script that is compiled separately:

```json
"source": "doc['price'] * 0.8"
```

The parameterized version compiles once and is reused for every discount:

```json
"source": "doc['price'] * discount",
"params": { "discount": 0.8 }
```

Compiling too many distinct scripts in a short window causes OpenSearch to reject further compilations with a `circuit_breaking_exception`. Raising the compilation limit treats the symptom; parameterizing the script removes the cause. For the settings that govern the limit, see [Compilation limits and caching](#compilation-limits-and-caching).
{: .note}

## Using the short script form

When a script needs no `lang` and no `params`, you can replace the `script` object with the script body as a plain string. The following update increases the number of items in stock for a product using the short form:

```json
POST scripting-products/_update/3
{
  "script": "ctx._source.quantity++"
}
```
{% include copy-curl.html %}

The short form is equivalent to the following object form:

```json
"script": {
  "source": "ctx._source.quantity++"
}
```

The document is updated and its version is incremented:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "_index": "scripting-products",
  "_id": "3",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 4,
  "_primary_term": 1
}
```
</details>

## Working with stored scripts

A _stored_ script is saved in the cluster state under an identifier and referenced by `id` instead of `source`. Storing a script keeps a single definition in one place, so callers do not repeat the script body and you can change the logic without redeploying the applications that call it.

Create a script named `stock-boosted-score` that adjusts the relevance score of matching documents by the number of items in stock:

```json
POST _scripts/stock-boosted-score
{
  "script": {
    "lang": "painless",
    "source": "_score * (1 + Math.log(1 + params.stock_weight * doc['quantity'].value))"
  }
}
```
{% include copy-curl.html %}

To have OpenSearch compile the script against a specific context at storage time, rather than at first use, append the context to the path as `_scripts/<id>/<context>`:

```json
POST _scripts/stock-boosted-score/score
{
  "script": {
    "lang": "painless",
    "source": "_score * (1 + Math.log(1 + params.stock_weight * doc['quantity'].value))"
  }
}
```
{% include copy-curl.html %}

If the script is invalid for the named context, compiling early returns the error on this request instead of on the first search that uses the script. For the list of contexts your cluster supports, use the [Get Script Contexts API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-contexts/).

To confirm that the script is saved, retrieve the stored script:

```json
GET _scripts/stock-boosted-score
```
{% include copy-curl.html %}

The response returns the language and body:

```json
{
  "_id": "stock-boosted-score",
  "found": true,
  "script": {
    "lang": "painless",
    "source": "_score * (1 + Math.log(1 + params.stock_weight * doc['quantity'].value))"
  }
}
```

To run the stored script, replace `source` with `id` and supply the parameters that the script declares:

```json
GET scripting-products/_search
{
  "query": {
    "script_score": {
      "query": { "match": { "name": "wireless" } },
      "script": {
        "id": "stock-boosted-score",
        "params": { "stock_weight": 0.5 }
      }
    }
  }
}
```
{% include copy-curl.html %}

Both matching products are returned with scores produced by the stored script:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 77,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.2791357,
    "hits": [
      {
        "_index": "scripting-products",
        "_id": "1",
        "_score": 1.2791357,
        "_source": {
          "name": "Wireless noise cancelling headphones",
          "sku": "AUD-1001",
          "brand": "Aurora",
          "category": "audio",
          "price": 249.99,
          "quantity": 42,
          "ratings": [5, 4, 5, 3],
          "on_sale": true,
          "release_date": "2024-03-15",
          "warehouse": { "lat": 47.6062, "lon": -122.3321 }
        }
      },
      {
        "_index": "scripting-products",
        "_id": "2",
        "_score": 1.1143811,
        "_source": {
          "name": "Wireless earbuds",
          "sku": "AUD-1002",
          "brand": "Aurora",
          "category": "audio",
          "price": 129.5,
          "quantity": 8,
          "ratings": [4, 4],
          "on_sale": false,
          "release_date": "2025-01-20",
          "warehouse": { "lat": 37.7749, "lon": -122.4194 }
        }
      }
    ]
  }
}
```
</details>

When a stored script is no longer referenced, delete it by sending the following request:

```json
DELETE _scripts/stock-boosted-score
```
{% include copy-curl.html %}

Deleting a script does not invalidate the requests that reference it. A search that names a deleted script fails at request time, so remove the callers first.
{: .warning}

Because the cluster state stores these scripts, creating, retrieving, and deleting them are cluster-level operations that require the `cluster:admin/script/put`, `cluster:admin/script/get`, and `cluster:admin/script/delete` permissions. For more information, see [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).

## Storing search templates

The `_scripts` endpoint also stores _search templates_: complete search requests written in the `mustache` language with placeholders in place of the values that change between calls. A caller supplies the template identifier and the placeholder values instead of the full request body, which keeps a frequently repeated query in one reviewed definition. For more information, see [Search Templates API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/).

## Compilation limits and caching

OpenSearch caches compiled scripts so that a script is recompiled only when its definition changes. Additionally, OpenSearch limits how often new compilations can occur so that a high number of unique scripts cannot consume a node's CPU on compilation. Exceeding the limit fails the request with a `circuit_breaking_exception`.

By default, every script context has its own cache and its own compilation rate, so heavy recompilation in one context does not evict the cached scripts of another. Setting `script.max_compilations_rate` to an explicit rate replaces the per-context caches and rates with one shared cache and a single cluster-wide limit. A separate setting caps the size of an individual script; a script that approaches that cap is a sign that the logic belongs in a plugin. For the settings that control caching, compilation rate, and script size, along with their defaults, see [Script and resource settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/script-and-resource-settings/).

To confirm that caching is working as intended, check the `script` section of the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) response, which reports `compilations`, `cache_evictions`, and `compilation_limit_triggered` per node:

```json
GET _nodes/stats/script
```
{% include copy-curl.html %}

A `compilations` count that continues to increase while the workload is unchanged indicates scripts that hardcode values that should be passed in `params`. An increasing `cache_evictions` count indicates a cache that is too small for the number of distinct scripts in use.

## Reading script errors

When a script fails, OpenSearch returns the failure as a `script_exception` whose `reason` distinguishes a `compile error` raised when the script cannot be parsed, from a `runtime error` raised when a compiled script fails on a particular document. For example, the following incorrect query omits the right-hand side of a multiplication:

```json
GET scripting-products/_search
{
  "script_fields": {
    "sale_price": {
      "script": { "source": "doc['price'].value *" }
    }
  }
}
```
{% include copy-curl.html %}

The `script_stack` field marks the position of the error in the script body with a caret:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "error": {
    "root_cause": [
      {
        "type": "script_exception",
        "reason": "compile error",
        "script_stack": [
          "doc['price'].value *",
          "                    ^---- HERE"
        ],
        "script": "doc['price'].value *",
        "lang": "painless",
        "position": {
          "offset": 20,
          "start": 0,
          "end": 20
        }
      }
    ],
    "type": "search_phase_execution_exception",
    "reason": "all shards failed"
  },
  "status": 400
}
```
</details>

The `position` object provides the same location as a count of characters from the start of the script body: `offset` is the position of the error, and `start` and `end` bound the surrounding region. Counting characters is useful when the script is generated rather than handwritten, because the caret in `script_stack` is difficult to map back to the generating code.

## Related documentation

- [Accessing document fields in scripts]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/)
- [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/)
- [Script APIs]({{site.url}}{{site.baseurl}}/api-reference/script-apis/)
