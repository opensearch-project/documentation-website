---
layout: default
title: Painless scripting language
nav_order: 30
has_children: true
---

# Painless scripting language

Painless is the default scripting language for OpenSearch and the only one that runs in every script context. Its syntax extends a subset of Java, and its compiler emits JVM bytecode, so a compiled Painless script runs at close to the speed of compiled Java.

Painless is sandboxed, which makes it safe to use for both inline and stored scripts. A script can call only the classes and methods on an allow list that OpenSearch provides, and this allow list excludes any class or method that writes files, opens sockets, spawns threads, or reads the system clock. A call to a method that the allow list omits fails at compile time with a `compile error`, so such a script never runs against your data.

The allow list is defined in the [`painless/spi` directory](https://github.com/opensearch-project/OpenSearch/tree/main/modules/lang-painless/src/main/resources/org/opensearch/painless/spi) of the OpenSearch repository. Twelve of its files cover the permitted parts of the Java standard library, one package per file---`java.lang`, `java.math`, `java.text`, `java.util`, `java.util.function`, `java.util.regex`, `java.util.stream`, `java.time`, and its `chrono`, `format`, `temporal`, and `zone` subpackages. The remaining six add the classes that specific contexts need, such as the ingest, update, and scoring contexts. Each permitted class appears as a `class` block listing the fields, constructors, and methods that are callable on it, so consult these definitions when you need to know whether a specific method is available. For an overview of what they cover, see [Available libraries]({{site.url}}{{site.baseurl}}/scripting/painless-language/#available-libraries).

## Language characteristics

Painless provides the following features:

- Optional typing: declare a variable with an explicit type (such as `int count = 0`) when the type is known, or with `def` when it varies. Explicit types compile to faster bytecode because they avoid runtime type resolution.
- A subset of Java syntax, including control flow, operators, casts, and method calls, plus scripting conveniences that Java lacks, such as the `?:` null-coalescing operator and map and list literals.
- The Java collections and string libraries. `HashMap`, `ArrayList`, `String`, `Math`, and the `java.time` classes are available, so a script can build and return structured values.
- Regular expressions, subject to a complexity budget. See [Controlling regular expressions](#controlling-regular-expressions).

For the full syntax---types, casting, operators, statements, functions, lambdas, and regular expressions---see [Painless language reference]({{site.url}}{{site.baseurl}}/scripting/painless-language/).

Painless differs from Java. Reflection, class definition, generic type parameters, and `finally` blocks are unavailable, a `catch` clause can name only exception types listed in the allow list, and a script consists of a block of statements preceded by any function declarations it needs.
{: .note}

## Testing a script

Develop a Painless script against the [Execute Inline Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/) before adding it to a search request. The API compiles and runs the script in isolation and returns its result, so a compilation error is returned immediately, with the position of the error in the script body.

The following request computes tax-inclusive prices for a list of products:

```json
POST _scripts/painless/_execute
{
  "script": {
    "source": "def totals = new HashMap(); for (int i = 0; i < params.skus.length; i++) { totals.put(params.skus[i], Math.round(params.prices[i] * params.tax_rate * 100) / 100.0) } return totals",
    "params": {
      "skus": ["AUD-1001", "ACC-2001"],
      "prices": [249.99, 89.0],
      "tax_rate": 1.08
    }
  }
}
```
{% include copy-curl.html %}

The default `painless_test` context converts the returned map to a string:

```json
{
  "result": "{AUD-1001=269.99, ACC-2001=96.12}"
}
```

To test a script that reads document fields or a relevance score, set `context` to `filter` or `score` and supply a test document in `context_setup`. For those examples, see [Execute Inline Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/).

## Working with dates

A date field read through doc values is exposed in Painless as a `ZonedDateTime`, so its components are available through the standard `java.time` accessor methods. The following search extracts the release year and month of a product from the `scripting-products` index, which is created in [Test setup]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#test-setup):

```json
GET scripting-products/_search
{
  "_source": false,
  "query": { "term": { "sku": "AUD-1001" } },
  "script_fields": {
    "release_year": {
      "script": {
        "lang": "painless",
        "source": "doc['release_date'].value.getYear()"
      }
    },
    "release_month": {
      "script": {
        "lang": "painless",
        "source": "doc['release_date'].value.getMonthValue()"
      }
    }
  }
}
```
{% include copy-curl.html %}

Both components are returned as integers:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 26,
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
          "release_month": [
            3
          ],
          "release_year": [
            2024
          ]
        }
      }
    ]
  }
}
```
</details>

The methods that report the current time, such as `ZonedDateTime.now()`, are not on the allow list, because a script whose output changes between shards or between retries produces inconsistent results and defeats caching. Pass the reference time in as a parameter instead.
{: .note}

## Controlling regular expressions

Some regular expressions run for a very long time on inputs only slightly longer than the ones they were tested against. A script containing such an expression consumes CPU on the node that runs it for as long as the expression continues to run. To bound that CPU consumption, OpenSearch limits the number of characters that a Painless regular expression can read: `script.painless.regex.enabled` defaults to `limited`, and `script.painless.regex.limit-factor` defaults to `6`, so an expression can read at most six characters for every character of input. Exceeding the limit triggers a `circuit_breaking_exception` that reports the pattern, the character limit, and the number of characters read.

The following table lists the values of `script.painless.regex.enabled`. Both this setting and `script.painless.regex.limit-factor` are static, so set them in `opensearch.yml` on every node and restart the node.

Value | Description
:--- | :---
`limited` | Regular expressions are allowed, bounded by `script.painless.regex.limit-factor`. This is the default.
`true` | Regular expressions are allowed with no character limit. An expression can then run until it completes, consuming CPU on the node for the entire time.
`false` | Regular expression syntax fails to compile.

## Methods added by plugins

An installed plugin can add classes and methods to the Painless allow list. Each addition is scoped to particular contexts, so a method that a plugin contributes to the `score` context is unavailable in the others.

The k-NN plugin adds vector distance functions that operate on `knn_vector` fields. They are ordinary Painless calls, so a script that uses one leaves `lang` as `painless`:

```json
"source": "cosineSimilarity(params.query_value, doc[params.field])"
```

For the functions available and the constraints on them, see [Painless scripting extensions]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/painless-functions/).

The same call in the `painless_test` context fails to compile with `Unknown call [cosineSimilarity]`, because the k-NN allow list does not extend to that context. Test a script that depends on a plugin's methods in the context that the plugin registered them in.
{: .note}

## Where Painless can be used

Painless runs in every script context in OpenSearch, including the following:

- Computing [script fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields) and [derived fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/) at search time
- Customizing relevance with a [`script_score` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/) or filtering with a [`script` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script/)
- [Sorting]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/) by a computed value
- Modifying documents through the [Update Document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/) and [Update By Query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/) APIs
- Transforming documents during ingestion with the [`script` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/script/)
- Building [scripted metric]({{site.url}}{{site.baseurl}}/aggregations/metric/scripted-metric/) and [bucket script]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-script/) aggregations

For the variables and return type that each context supplies, see [Script contexts]({{site.url}}{{site.baseurl}}/scripting/script-contexts/).

## Related documentation

- [Painless language reference]({{site.url}}{{site.baseurl}}/scripting/painless-language/)
- [Script contexts]({{site.url}}{{site.baseurl}}/scripting/script-contexts/)
- [Execute Inline Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/)
