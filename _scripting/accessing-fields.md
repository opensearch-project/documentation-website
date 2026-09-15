---
layout: default
title: Accessing document fields in scripts
nav_order: 20
---

# Accessing document fields in scripts

A script reads document data through variables that OpenSearch injects before running the script. The variables available to a script depend on its context: a script that modifies a document during an update receives a different set of variables than one that scores a search result. Choosing the right access path matters for performance, because a search or aggregation script runs once per candidate document and reading the `_source` field requires far more resources per document than reading doc values.

This page describes the access paths and the variables that the main context families provide. For the variables and return type of every individual context, see [Script contexts]({{site.url}}{{site.baseurl}}/scripting/script-contexts/).

The examples on this page use the `scripting-products` index. To create it, see [Test setup]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#test-setup).

## Update scripts

Scripts in the [Update Document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/), [Update By Query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/), and [Reindex]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/) APIs receive a single `ctx` variable. The following table lists the `ctx` fields.

Field | Description
:--- | :---
`ctx._source` | The document [`_source`]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/), as a modifiable map. Assign to its entries to change the document that OpenSearch writes.
`ctx.op` | The operation to apply to the document. Set it to `index` to write the modified document, `delete` to remove it, or `noop` to leave it unchanged and skip the write.
`ctx._index`, `ctx._id`, and other [metadata fields]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/index/) | Metadata for the document being processed. Some of these are read-only.

The following update records a delivery for document `4`, which has a `quantity` of `0`. The script reads `ctx._source.quantity`, adds the received units to it, and derives `on_sale` from the resulting value. If no units were received, it sets `ctx.op` to `noop` so that OpenSearch skips the write:

```json
POST scripting-products/_update/4
{
  "script": {
    "lang": "painless",
    "source": "if (params.received == 0) { ctx.op = 'noop' } else { ctx._source.quantity += params.received; ctx._source.on_sale = ctx._source.quantity > 20 }",
    "params": { "received": 25 }
  }
}
```
{% include copy-curl.html %}

The `result` field reports that the document was written, and `_version` is incremented:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "_index": "scripting-products",
  "_id": "4",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 5,
  "_primary_term": 1
}
```
</details>

The document now has a `quantity` of `25` and an `on_sale` value of `true`. Sending the same request with `"received": 0` takes the `noop` branch, which returns `"result": "noop"` and leaves `_version` unchanged.

An update script reads and modifies document data only through `ctx._source`. None of the three access paths described in the following sections are available to it: `doc` fails to compile with `cannot resolve symbol [doc]`, and `params._source` and `params._fields` are `null`, so reading a field from either one fails at runtime with a `null_pointer_exception`.
{: .note}

## Search and aggregation scripts

Scripts in searches and aggregations run once for every document that could match, which on a large index means the script executes millions of times for a single request. [Script fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields) are the exception: they run once per returned result, so they are bound by the page size rather than the index size.

These scripts read field values through doc values, the `_source` field, or stored fields. The following table summarizes the three access types.

Access type | Syntax | Resource usage | Use when
:--- | :--- | :--- | :---
Doc values | `doc['field']` | Lowest | Scoring, sorting, filtering, or aggregating on numbers, dates, geopoints, or keywords.
`_source` | `params._source.field` | Highest | A script field needs a JSON object, a `text` field, or exact original values for the results on one page.
Stored fields | `params._fields['field'].value` | High | The `_source` is large and the script needs only a few small fields from it.

Scripts that contribute to scoring or sorting also receive `_score`, the relevance score of the current document.

### Doc values

The fastest way to read a field in a script is by using [doc values]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/). Doc values store field values in a column-oriented structure that is built at index time and read directly from disk, which is the access pattern a script needs: one field, many documents. Access a field using the `doc['field_name']` syntax.

Doc values are enabled by default on every field type except analyzed [`text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/) fields.

The following search computes the total inventory value of each audio product by multiplying its price by the number of items in stock. It reads both variables from doc values:

```json
GET scripting-products/_search
{
  "_source": false,
  "query": { "term": { "category": "audio" } },
  "script_fields": {
    "inventory_value": {
      "script": {
        "lang": "expression",
        "source": "doc['price'] * doc['quantity']"
      }
    }
  }
}
```
{% include copy-curl.html %}

Each result includes the computed field:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 3,
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
    "max_score": 1.0,
    "hits": [
      {
        "_index": "scripting-products",
        "_id": "1",
        "_score": 1.0,
        "fields": {
          "inventory_value": [
            10499.58
          ]
        }
      },
      {
        "_index": "scripting-products",
        "_id": "2",
        "_score": 1.0,
        "fields": {
          "inventory_value": [
            1036.0
          ]
        }
      }
    ]
  }
}
```
</details>

Doc values return scalar values, such as numbers, dates, geopoints, and terms, or arrays of scalars for a multi-valued field. They cannot return a JSON object, so a script that needs the structure of a nested object must read the `_source` instead.

#### Handling missing fields

Reading `doc['field']` for a field that is absent from the mapping raises a `script_exception` with the reason `runtime error`, caused by `No field found for [discount] in mapping`. In Painless, guard the access with `doc.containsKey('field')`:

```json
"source": "doc.containsKey('discount') ? doc['discount'].value : 0"
```

An `expression` script has no equivalent guard, because the language provides no way to test whether a field exists in the mapping. It can only distinguish a field that is mapped but absent from the current document, using `doc['field'].empty`. For more information, see [Lucene expression language]({{site.url}}{{site.baseurl}}/scripting/expressions/).
{: .note}

#### Reading text fields

In Painless, the `doc['field']` syntax works on an analyzed `text` field only when [`fielddata`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/field-data/) is enabled on it, and it returns the analyzed terms rather than the original string. Enabling `fielddata` loads every term in the field into the JVM heap, which consumes both memory and CPU and can destabilize a node. Map a `keyword` subfield and have the script read the subfield instead.
{: .warning}

### The document _source

The `_source` field contains the original JSON document body that was indexed. To read the `_source`, use the `params._source.field_name` syntax. To read a nested field, use the full path. For example, the `warehouse` field of the test index is a `geo_point` indexed as `{"lat": 47.6062, "lon": -122.3321}`, so its latitude is read as `params._source.warehouse.lat`.

The following search assembles a catalog label from two `_source` fields:

```json
GET scripting-products/_search
{
  "_source": false,
  "query": { "term": { "sku": "AUD-1002" } },
  "script_fields": {
    "catalog_label": {
      "script": {
        "lang": "painless",
        "source": "params._source.brand + ': ' + params._source.name"
      }
    }
  }
}
```
{% include copy-curl.html %}

The concatenated label is returned with the result:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 23,
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
        "_id": "2",
        "_score": 1.0,
        "fields": {
          "catalog_label": [
            "Aurora: Wireless earbuds"
          ]
        }
      }
    ]
  }
}
```
</details>

Reading `_source` is much slower than reading doc values because OpenSearch must load and parse the entire stored JSON body to read one field. The `_source` field is optimized for returning many fields from a few documents; doc values are optimized for returning one field from many documents.

Use `_source` when a script field builds output for the results on a single page, and when the value you need is a JSON object or a `text` field that doc values cannot supply. For scoring, sorting, filtering, and aggregating, use doc values.
{: .note}

### Stored fields

A field mapped using [`"store": true`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) is written to the index separately from the `_source` and can be read with the `params._fields['field_name'].value` syntax. In the test index, `sku` and `brand` are stored fields.

The `.value` suffix is required. `params._fields['field_name']` on its own returns the internal field lookup object rather than a value, and returning it from a script field fails with `cannot write xcontent for unknown value of type`. Use `.value` for the first value and `.values` for the full list when the field has more than one value.
{: .note}

The following search combines the `brand` and `sku` stored fields into a single identifier:

```json
GET scripting-products/_search
{
  "_source": false,
  "query": { "term": { "sku": "AUD-1001" } },
  "script_fields": {
    "brand_sku": {
      "script": {
        "lang": "painless",
        "source": "params._fields['brand'].value + ' ' + params._fields['sku'].value"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the combined value:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 9,
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
          "brand_sku": [
            "Aurora AUD-1001"
          ]
        }
      }
    ]
  }
}
```
</details>

The `_source` field is itself a stored field, so reading a stored field requires approximately the same amount of time and memory as reading `_source`. Unlike a stored field, `_source` returns the exact JSON that was indexed: it preserves the difference between `null` and an absent field, and between a single-element array and a scalar.

Stored fields reduce read time when the `_source` is large but the script needs a few small values from it: storing those values individually avoids loading the whole body. In all other cases, marking a field as stored increases index size without reducing read time.

### Accessing the relevance score

Scripts in a [`script_score` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/), a [`function_score` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score/), a [script-based sort]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/), and aggregations receive a `_score`, the relevance score that the enclosing query computed for the current document. Reading `_score` lets a script adjust the ranking that the query produced, so textual relevance still contributes to the final order.

The following search scales each product's text relevance by the number of items in stock, promoting products that both match the query and are available in quantity. Dividing the quantity by 10 keeps the boost proportionate, so the number in stock shifts the ranking without dominating it:

```json
GET scripting-products/_search
{
  "_source": ["name", "quantity"],
  "query": {
    "function_score": {
      "query": { "match": { "name": "wireless" } },
      "script_score": {
        "script": {
          "lang": "expression",
          "source": "_score * (1 + doc['quantity'] / 10)"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The headphones outrank the earbuds despite a weaker text match, because far more headphones are in stock:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 4,
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
    "max_score": 0.5083568,
    "hits": [
      {
        "_index": "scripting-products",
        "_id": "1",
        "_score": 0.5083568,
        "_source": {
          "quantity": 42,
          "name": "Wireless noise cancelling headphones"
        }
      },
      {
        "_index": "scripting-products",
        "_id": "2",
        "_score": 0.3282812,
        "_source": {
          "quantity": 8,
          "name": "Wireless earbuds"
        }
      }
    ]
  }
}
```
</details>

## Related documentation

- [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/)
- [Lucene expression language]({{site.url}}{{site.baseurl}}/scripting/expressions/)
