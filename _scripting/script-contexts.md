---
layout: default
title: Script contexts
nav_order: 45
---

# Script contexts

A script runs in a _script context_. The context determines the variables the script receives, the value it must return, and the permitted languages. A script that is valid in one context is often invalid in another, which is why a script that works as a script field can fail when moved into an update.

Context is the unit that several other features are defined against. Compilation limits and caches are tracked per context, `script.allowed_contexts` restricts scripting by context, and a stored script can be compiled against a named context when you save it.

## Listing the contexts in your cluster

Installed plugins register their own contexts, so the authoritative list is the one your cluster reports. To list all contexts in your cluster, use the [Get Script Contexts API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-contexts/):

```json
GET _script_context
```
{% include copy-curl.html %}

Each entry names a context and lists its methods. The `execute` method provides the script's return type and any arguments passed to it, and each `get` method corresponds to a variable the script can read:

```json
{
  "contexts": [
    {
      "name": "aggregation_selector",
      "methods": [
        {
          "name": "execute",
          "return_type": "boolean",
          "params": []
        },
        {
          "name": "getParams",
          "return_type": "java.util.Map",
          "params": []
        }
      ]
    }
  ]
}
```

The response is long, because it covers every context. To list the context names alone, use the `filter_path` query parameter:

```json
GET _script_context?filter_path=contexts.name
```
{% include copy-curl.html %}

## Contexts by task

The following sections group the contexts by task. The `params` variable is available in every context and is omitted from the descriptions.

### Search and scoring

The following table lists the contexts that run during a search.

Context | Returns | Variables | Used by
:--- | :--- | :--- | :---
`score` | `double` | `doc`, `_score`, `explanation` | [`script_score` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/) and `function_score` script scoring.
`filter` | `boolean` | `doc` | [`script` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script/).
`field` | `Object` | `doc` | [Script fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields).
`derived_field` | `void` | `doc`, `emit()` | [Derived fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/).
`number_sort` | `double` | `doc`, `_score` | Numeric [script-based sort]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/).
`string_sort` | `String` | `doc`, `_score` | String script-based sort.
`terms_set` | `Number` | `doc` | The `minimum_should_match_script` of a `terms_set` query.
`similarity` | `double` | `weight`, `query`, `field`, `term`, `doc` | A scripted similarity module.
`similarity_weight` | `double` | `query`, `field`, `term` | The weight calculation of a scripted similarity.
`interval` | `boolean` | `interval` | The `script` filter of an `intervals` query.
`search` | `void` | `ctx` | Search request preprocessing.

The `score` context supplies `_score` as well as returning a score, so a script can build on the relevance that the query computed. See [Accessing the relevance score]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/#accessing-the-relevance-score).

### Aggregations

The following table lists the aggregation contexts.

Context | Returns | Variables | Used by
:--- | :--- | :--- | :---
`aggs` | `Object` | `doc`, `_score`, `value` | The `script` of a metric or bucket aggregation.
`aggs_init` | `void` | `state` | The `init_script` of a [scripted metric aggregation]({{site.url}}{{site.baseurl}}/aggregations/metric/scripted-metric/).
`aggs_map` | `void` | `doc`, `_score`, `state` | The `map_script` of a scripted metric aggregation.
`aggs_combine` | `Object` | `state` | The `combine_script` of a scripted metric aggregation.
`aggs_reduce` | `Object` | `states` | The `reduce_script` of a scripted metric aggregation.
`bucket_aggregation` | `Number` | None | [Bucket script]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-script/) pipeline aggregations.
`aggregation_selector` | `boolean` | None | Bucket selector pipeline aggregations.
`moving-function` | `double` | `params`, `values` | The `script` of a `moving_fn` pipeline aggregation.
`script_heuristic` | `double` | `params` | The `script_heuristic` of a `significant_terms` aggregation.

The four scripted metric contexts run in sequence and communicate through `state`, which `aggs_init` creates, `aggs_map` fills per document, `aggs_combine` reduces per shard, and `aggs_reduce` receives as the list `states`.

### Ingestion and updates

The following table lists the contexts that run while a document is indexed or updated.

Context | Returns | Variables | Used by
:--- | :--- | :--- | :---
`update` | `void` | `ctx` | The [Update Document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/), [Update By Query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/), and [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) APIs.
`ingest` | `void` | `ctx` | The [`script` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/script/).
`processor_conditional` | `boolean` | `ctx` | The `if` condition on any ingest processor.
`context_aware_grouping` | `String` | `ctx` | The `script` of a `context_aware_grouping` mapping, which returns the grouping key that a document's segment is chosen by.
`analysis` | `boolean` | `token` | The `condition` of a `condition` token filter.

The document-modifying contexts expose document data through `ctx`. The `doc` variable is unavailable, so a script that references it in an update fails to compile. See [Update scripts]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/#update-scripts).

### Templates and testing

The following table lists the remaining general-purpose contexts.

Context | Returns | Variables | Used by
:--- | :--- | :--- | :---
`painless_test` | `Object` | None | The default context of the [Execute Inline Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/).
`template` | `String` | None | [Search templates]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/), written in `mustache`.

### Plugin contexts

The following table lists contexts registered by plugins. They appear only when the corresponding plugin is installed.

Context | Returns | Variables | Registered by
:--- | :--- | :--- | :---
`trigger` | `boolean` | `ctx` | Alerting, for monitor trigger conditions.
`ranklib` | `void` | None | Learning to Rank, for `ranklib` models.

## Language support by context

Painless runs in every context. The special-purpose languages are restricted, so a script in one of them fails outside its supported contexts. Use the [Get Script Languages API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-language/) to see the mapping for your cluster:

```json
GET _script_language
```
{% include copy-curl.html %}

The following table summarizes the languages you can write scripts in.

Language | Contexts
:--- | :---
`painless` | Every context
`expression` | `score`, `field`, `filter`, `number_sort`, `aggs`, `bucket_aggregation`, `aggregation_selector`, `terms_set`
`mustache` | `template`
`knn` | `score`
`ranklib` | `ranklib`

The `expression` language is unavailable in `update`, `ingest`, and `string_sort` because it cannot read the `_source` and cannot return a string. See [Limitations]({{site.url}}{{site.baseurl}}/scripting/expressions/#limitations).

## Writing a script for a context

Matching your script to the context means supplying the right return value and using the variables that context provides. The `derived_field` context illustrates both: it returns `void` and reports its value by calling `emit()` instead of returning it.

The following search defines a derived field that labels each product by price tier, using the `scripting-products` index created in [Test setup]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#test-setup):

```json
GET scripting-products/_search
{
  "_source": false,
  "derived": {
    "price_tier": {
      "type": "keyword",
      "script": { "source": "emit(doc['price'].value >= 200 ? 'premium' : 'standard')" }
    }
  },
  "query": { "match_all": {} },
  "sort": [{ "sku": "asc" }],
  "fields": ["price_tier"]
}
```
{% include copy-curl.html %}

Each result carries the emitted value:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
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
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "scripting-products",
        "_id": "3",
        "_score": null,
        "fields": {
          "price_tier": [
            "standard"
          ]
        },
        "sort": [
          "ACC-2001"
        ]
      },
      {
        "_index": "scripting-products",
        "_id": "1",
        "_score": null,
        "fields": {
          "price_tier": [
            "premium"
          ]
        },
        "sort": [
          "AUD-1001"
        ]
      },
      {
        "_index": "scripting-products",
        "_id": "2",
        "_score": null,
        "fields": {
          "price_tier": [
            "standard"
          ]
        },
        "sort": [
          "AUD-1002"
        ]
      },
      {
        "_index": "scripting-products",
        "_id": "4",
        "_score": null,
        "fields": {
          "price_tier": [
            "premium"
          ]
        },
        "sort": [
          "DSP-3001"
        ]
      }
    ]
  }
}
```
</details>

## Compiling a stored script against a context

Naming a context when you store a script makes OpenSearch compile it immediately, so a script that is invalid for that context fails on the store request rather than on the first search that uses it. See [Working with stored scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#working-with-stored-scripts).

## Restricting and configuring by context

The following settings operate on contexts:

- `script.allowed_contexts` limits the cluster to a named set of contexts, which reduces where a script can run at all. See [Restricting the allowed contexts]({{site.url}}{{site.baseurl}}/scripting/script-security/#restricting-the-allowed-contexts).
- `script.context.<context>.max_compilations_rate`, `.cache_max_size`, and `.cache_expire` configure compilation and caching for one context without affecting the others. See [Script context settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/script-and-resource-settings/#script-context-settings).

## Related documentation

- [Painless language reference]({{site.url}}{{site.baseurl}}/scripting/painless-language/)
- [Accessing document fields in scripts]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/)
- [Get Script Contexts API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-contexts/)
