---
layout: default
title: Numeric field types
parent: Supported field types
nav_order: 15
has_children: true
redirect_from:
  - /opensearch/supported-field-types/numeric/
  - /field-types/numeric/
---

# Numeric field types

The following table lists all numeric field types that OpenSearch supports.

Field data type | Description  
:--- | :--- 
`byte` | A signed 8-bit integer. Minimum is &minus;128. Maximum is 127.
`double` | A double-precision 64-bit IEEE 754 floating-point value. Minimum magnitude is 2<sup>&minus;1074 </sup>. Maximum magnitude is (2 &minus; 2<sup>&minus;52</sup>) &middot; 2<sup>1023</sup>. The number of significant bits is 53. The number of significant digits is 15.95.
`float` | A single-precision 32-bit IEEE 754 floating-point value. Minimum magnitude is 2<sup>&minus;149 </sup>. Maximum magnitude is (2 &minus; 2<sup>&minus;23</sup>) &middot; 2<sup>127</sup>. The number of significant bits is 24. The number of significant digits is 7.22.
`half_float` | A half-precision 16-bit IEEE 754 floating-point value. Minimum magnitude is 2<sup>&minus;24 </sup>. Maximum magnitude is 65504. The number of significant bits is 11. The number of significant digits is 3.31.
`integer` | A signed 32-bit integer. Minimum is &minus;2<sup>31</sup>. Maximum is 2<sup>31</sup> &minus; 1.
`long` | A signed 64-bit integer. Minimum is &minus;2<sup>63</sup>. Maximum is 2<sup>63</sup> &minus; 1.
[`unsigned_long`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/unsigned-long/) | An unsigned 64-bit integer. Minimum is 0. Maximum is 2<sup>64</sup> &minus; 1.
`short` | A signed 16-bit integer. Minimum is &minus;2<sup>15</sup>. Maximum is 2<sup>15</sup> &minus; 1. 
[`scaled_float`](#scaled-float-field-type) | A floating-point value that is multiplied by the double scale factor and stored as a long value.

Integer, long, float, and double field types have corresponding [range field types]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/).
{: .note }

If your numeric field contains an identifier such as an ID, you can map this field as a [keyword]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) to optimize for faster term-level queries. If you need to use range queries on this field, you can map this field as a numeric field type in addition to a keyword field type.
{: .tip }

## Example

Create a mapping where integer_value is an integer field:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "integer_value" : {
        "type" : "integer"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with an integer value:

```json
PUT testindex/_doc/1 
{
  "integer_value" : 123
}
```
{% include copy-curl.html %}

## Scaled float field type

A scaled float field type is a floating-point value that is multiplied by the scale factor and stored as a long value. It takes all optional parameters taken by number field types, plus an additional scaling_factor parameter. The scale factor is required when creating a scaled float. 

Scaled floats are useful for saving disk space. Larger scaling_factor values lead to better accuracy but higher space overhead.  
{: .note }

## Scaled float example

Create a mapping where `scaled` is a scaled_float field:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "scaled" : {
        "type" : "scaled_float",
        "scaling_factor" : 10
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a scaled_float value:

```json
PUT testindex/_doc/1 
{
  "scaled" : 2.3
}
```
{% include copy-curl.html %}

The `scaled` value will be stored as 23.

## Parameters

The following table lists the parameters accepted by numeric field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`coerce` | A Boolean value that signals to truncate decimals for integer values and to convert strings to numeric values. Default is `true`.
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `true`.
`ignore_malformed` | A Boolean value that specifies to ignore malformed values and not to throw an exception. Default is `false`.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`. 
`meta` | Accepts metadata for this field.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 

Scaled float has an additional required parameter: `scaling_factor`.

Parameter | Description 
:--- | :--- 
`scaling_factor` | A double value that is multiplied by the field value and rounded to the nearest long. Required. 
