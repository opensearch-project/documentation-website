---
layout: default
title: Lucene expression language
nav_order: 40
---

# Lucene expression language

The `expression` language compiles a single JavaScript expression into JVM bytecode. It evaluates numeric formulas over doc values and supports no statements, variable declarations, or string handling.

An expression is resolved to direct doc values accessors at compile time, so evaluating it for one document reduces to arithmetic, with no type resolution, map lookups, or method dispatch. A formula that both the Lucene expression language and [Painless]({{site.url}}{{site.baseurl}}/scripting/painless/) can express typically runs faster as an expression than as a Painless script.

The language is sandboxed and enabled for inline and stored scripts by default, and it can be used in the `score`, `field`, `filter`, `number_sort`, `aggs`, `bucket_aggregation`, `aggregation_selector`, and `terms_set` contexts. Set `lang` to `expression` to select it.

## Syntax

An expression script consists of a single expression that evaluates to a number, and the conditional `?:` operator is its only form of control flow. An expression can use the arithmetic, comparison, and bitwise operators of JavaScript along with the functions in the [Lucene expressions module](https://lucene.apache.org/core/10_5_0/expressions/org/apache/lucene/expressions/js/package-summary.html), including `abs`, `min`, `max`, `sqrt`, `pow`, `log`, the trigonometric functions, and `haversin` for geographic distance.

An expression can reference the following values:

- A document field, through `doc['field_name'].value`.
- A property or method of a field, such as `doc['field_name'].empty` or `doc['field_name'].sum()`.
- A script parameter, by its name alone. An expression references a parameter as `discount`, not as `params.discount`; using the `params` prefix fails with `Unknown variable [params]`.
- The relevance score, `_score`, which is available only in a `script_score` context.

Referencing a parameter without the `params` prefix is the syntax difference most likely to be overlooked when a script is moved from Painless to `expression`.
{: .tip}

## Numeric field API

The following table lists the properties and methods available on a numeric field.

Expression | Description
:--- | :---
`doc['field_name'].value` | The field's value, returned as a `double`.
`doc['field_name'].empty` | Whether the field has no value in this document.
`doc['field_name'].length` | The number of values that the field has in this document.
`doc['field_name'].min()` | The smallest of the field's values in this document.
`doc['field_name'].max()` | The largest of the field's values in this document.
`doc['field_name'].median()` | The median of the field's values in this document.
`doc['field_name'].avg()` | The mean of the field's values in this document.
`doc['field_name'].sum()` | The sum of the field's values in this document.

A field that is absent from the document evaluates to `0`. To substitute a different value, test `empty` first, as in `doc['ratings'].empty ? 3 : doc['ratings'].value`.

A multi-valued field evaluates to its smallest value. To select a different one, call the corresponding method, as in `doc['ratings'].sum()`.

Boolean fields are exposed as numbers, with `true` as `1` and `false` as `0`, so a Boolean can gate a calculation directly: `doc['on_sale'].value ? doc['price'].value - doc['price'].value * discount : doc['price'].value`.

The following search returns each product's mean rating, substituting `-1` for the one product that has no ratings. It uses the `scripting-products` index, which is created in [Test setup]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#test-setup):

```json
GET scripting-products/_search
{
  "_source": ["name"],
  "sort": [{ "sku": "asc" }],
  "script_fields": {
    "average_rating": {
      "script": {
        "lang": "expression",
        "source": "doc['ratings'].empty ? unrated : doc['ratings'].avg()",
        "params": { "unrated": -1 }
      }
    }
  }
}
```
{% include copy-curl.html %}

The ultrawide monitor, which has no `ratings` values, returns the substitute value:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 71,
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
        "_source": {
          "name": "Mechanical keyboard"
        },
        "fields": {
          "average_rating": [
            5.0
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
        "_source": {
          "name": "Wireless noise cancelling headphones"
        },
        "fields": {
          "average_rating": [
            4.25
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
        "_source": {
          "name": "Wireless earbuds"
        },
        "fields": {
          "average_rating": [
            4.0
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
        "_source": {
          "name": "Ultrawide monitor"
        },
        "fields": {
          "average_rating": [
            -1.0
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

Every value that an expression returns is a `double`, which is why the ratings appear as `5.0` and `-1.0` rather than as integers.

## Date field API

A date field is exposed as a number of milliseconds elapsed since the Unix epoch, so the entire numeric field API applies to it. In addition, the `date` property gives access to individual calendar components.

The following table lists the components available on a date field.

Expression | Description
:--- | :---
`doc['field_name'].date.centuryOfEra` | The century, from 1 to 2920000.
`doc['field_name'].date.dayOfMonth` | The day of the month, from 1 to 31.
`doc['field_name'].date.dayOfWeek` | The day of the week, from 1 for Monday to 7 for Sunday.
`doc['field_name'].date.dayOfYear` | The day of the year, where January 1 is 1.
`doc['field_name'].date.era` | The era, where `0` is BCE and `1` is CE.
`doc['field_name'].date.hourOfDay` | The hour, from 0 to 23.
`doc['field_name'].date.millisOfDay` | The number of milliseconds elapsed in the day, from 0 to 86399999.
`doc['field_name'].date.millisOfSecond` | The number of milliseconds elapsed in the second, from 0 to 999.
`doc['field_name'].date.minuteOfDay` | The number of minutes elapsed in the day, from 0 to 1439.
`doc['field_name'].date.minuteOfHour` | The minute, from 0 to 59.
`doc['field_name'].date.monthOfYear` | The month, from 1 for January to 12 for December.
`doc['field_name'].date.secondOfDay` | The number of seconds elapsed in the day, from 0 to 86399.
`doc['field_name'].date.secondOfMinute` | The second, from 0 to 59.
`doc['field_name'].date.year` | The year, from -292000000 to 292000000.
`doc['field_name'].date.yearOfCentury` | The year within the century, from 1 to 100.
`doc['field_name'].date.yearOfEra` | The year within the era, from 1 to 292000000.

To find the number of whole years between two date fields, subtract their years: `doc['release_date'].date.year - doc['discontinued_date'].date.year`.

## The geopoint field API

The following table lists the properties available on a [`geo_point`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/) field.

Expression | Description
:--- | :---
`doc['field_name'].empty` | Whether the field has no value in this document.
`doc['field_name'].lat` | The latitude of the point.
`doc['field_name'].lon` | The longitude of the point.

Combine these with `haversin` to compute a great-circle distance in kilometers. The following search orders products by how far their warehouse is from Washington, DC, with the origin supplied as parameters so that the same compiled script serves every user location:

```json
GET scripting-products/_search
{
  "_source": ["name", "warehouse"],
  "sort": {
    "_script": {
      "type": "number",
      "script": {
        "lang": "expression",
        "source": "haversin(lat, lon, doc['warehouse'].lat, doc['warehouse'].lon)",
        "params": { "lat": 38.9072, "lon": -77.0369 }
      },
      "order": "asc"
    }
  }
}
```
{% include copy-curl.html %}

The `sort` value on each result is the computed distance in kilometers:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "took": 12,
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
        "_source": {
          "name": "Mechanical keyboard",
          "warehouse": { "lon": -87.6298, "lat": 41.8781 }
        },
        "sort": [
          955.1850203827704
        ]
      },
      {
        "_index": "scripting-products",
        "_id": "4",
        "_score": null,
        "_source": {
          "name": "Ultrawide monitor",
          "warehouse": { "lon": -97.7431, "lat": 30.2672 }
        },
        "sort": [
          2118.1759666556795
        ]
      },
      {
        "_index": "scripting-products",
        "_id": "1",
        "_score": null,
        "_source": {
          "name": "Wireless noise cancelling headphones",
          "warehouse": { "lon": -122.3321, "lat": 47.6062 }
        },
        "sort": [
          3736.260216407672
        ]
      },
      {
        "_index": "scripting-products",
        "_id": "2",
        "_score": null,
        "_source": {
          "name": "Wireless earbuds",
          "warehouse": { "lon": -122.4194, "lat": 37.7749 }
        },
        "sort": [
          3918.550756602828
        ]
      }
    ]
  }
}
```
</details>

## Limitations

The `expression` language has the following limitations:

- Only numeric, Boolean, date, and `geo_point` fields are readable, so an expression cannot compare or concatenate strings. Reading a `keyword` field fails with a `link error` caused by `Field [sku] must be numeric, date, or geopoint`. Enabling [`fielddata`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/field-data/) on a `text` field makes it readable in Painless but not in an expression, which reports the same error.
- Stored fields and the `_source` are unavailable, so an expression cannot read a value that is not in doc values. Both are reached through `params`, which an expression does not receive, so `params._source` and `params._fields` fail with `Unknown variable [params]`.
- There is no way to test whether a field exists in the mapping. `doc['field'].empty` reports only whether a mapped field has a value in the current document. Referencing an unmapped field fails with a `link error` caused by `Field [discount] does not exist in mappings`, and wrapping the reference in `empty` produces the same failure.
- Every result is a `double`, so an expression cannot return a string, a Boolean, or a structured value.

When a formula needs any of these, use [Painless]({{site.url}}{{site.baseurl}}/scripting/painless/) instead.

## Related documentation

- [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/)
- [Accessing document fields in scripts]({{site.url}}{{site.baseurl}}/scripting/accessing-fields/)
- [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/)
