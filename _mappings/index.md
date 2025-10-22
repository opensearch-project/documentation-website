---
layout: default
title: Mappings
nav_order: 1
nav_exclude: true
permalink: /mappings/
redirect_from: 
  - /opensearch/mappings/
  - /field-types/mappings/
  - /mappings/index/
  - /field-types/
  - /field-types/index/
  - /field-types/mappings-use-cases/
---

# Mappings

Mappings tell OpenSearch how to store and index your documents and their fields. You can specify the data type for each field (for example, `year` as `date`) to make storage and querying more efficient. 

While [dynamic mappings](#dynamic-mapping) automatically add new data and fields, using explicit mappings is recommended. Explicit mappings let you define the exact structure and data types upfront. This helps to maintain data consistency and optimize performance, especially for large datasets or high-volume indexing operations.

For example, with explicit mappings, you can ensure that `year` is treated as text and `age` as an integer instead of both being interpreted as integers by dynamic mapping.

## Dynamic mapping

When you index a document, OpenSearch adds fields automatically with dynamic mapping. You can also explicitly add fields to an index mapping.

### Dynamic mapping rules

When OpenSearch encounters a new field during indexing, it uses the following rules to determine the field type:

JSON data type | OpenSearch field type | Description
:--- | :--- | :---
`null` | No field is added | A `null` field can't be indexed or searched. When a field is set to null, OpenSearch behaves as if the field has no value.
`true` or `false` | [`boolean`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/boolean/) field | OpenSearch accepts `true` and `false` as Boolean values. An empty string is equal to `false`.
Double (for example, `1.5`) | [`float`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) field | A single-precision, 32-bit IEEE 754 floating-point number, restricted to finite values. JSON floating-point numbers are mapped to this type.
Long (for example, `1`)| [`long`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) field | A signed 64-bit number. JSON integer numbers are mapped to this type.
Object (`{}`) | [`object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/object/) field | Objects are standard JSON objects, which can have fields and mappings of their own. For example, a `movies` object can have additional properties such as `title`, `year`, and `director`.
Array (`[]`)| Depends on the first non-null value in the array | OpenSearch does not have a specific array data type. Arrays are represented as a set of values of the same data type (for example, integers or strings) associated with a field. When indexing, you can pass multiple values for a field, and OpenSearch will treat it as an array. Empty arrays are valid and recognized as array fields with zero elements---not as fields with no values.
String (`""`) | [`text`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/text/) field with [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/) subfield, or [`date`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/) field, or numeric field | A string sequence of characters. By default, strings are mapped as `text` fields with a `keyword` subfield. However, if the string matches a date format (and date detection is enabled), it becomes a `date` field. If numeric detection is enabled and the string represents a number, it becomes the appropriate numeric field type.

These are the only field types that are automatically detected. All other field types must be mapped explicitly.

### Dynamic templates

Dynamic templates are used to define custom mappings for dynamically added fields based on the data type, field name, or field path. They allow you to define a flexible schema for your data that can automatically adapt to changes in the structure or format of the input data.

You can use the following syntax to define a dynamic mapping template:

```json
PUT index
{
  "mappings": {
    "dynamic_templates": [
        {
          "fields": {
            "mapping": {
              "type": "short"
            },
            "match_mapping_type": "string",
            "path_match": "status*"
          }
        }
    ]
  }
}
```
{% include copy-curl.html %}

This mapping configuration dynamically maps any field with a name starting with `status` (for example, `status_code`) to the `short` data type if the initial value provided during indexing is a string.

### Dynamic mapping parameters

The `dynamic_templates` support the following parameters for matching conditions and mapping rules. The default value is `null`.

Parameter | Description |
----------|-------------|
`match_mapping_type` | Specifies the JSON data type (for example, string, long, double, object, binary, Boolean, date) that triggers the mapping.
`match` | A regular expression used to match field names and apply the mapping.
`unmatch` | A regular expression used to exclude field names from the mapping.
`match_pattern` | Determines the pattern matching behavior, either `regex` or `simple`. Default is `simple`.
`path_match` | Allows you to match nested field paths using a regular expression.
`path_unmatch` | Excludes nested field paths from the mapping using a regular expression.
`mapping` | The mapping configuration to apply.

### Dynamic mapping settings

OpenSearch provides several settings to control how dynamic mapping behaves when processing new fields.

#### Date detection

By default, OpenSearch automatically detects date-formatted strings and creates `date` fields. When `date_detection` is enabled (default), new string fields are checked against date patterns specified in `dynamic_date_formats`. If a match is found, a new `date` field is created with the corresponding format.

The default value for `dynamic_date_formats` is:
```
["strict_date_optional_time", "yyyy/MM/dd HH:mm:ss Z||yyyy/MM/dd Z"]
```

When you run the following example request, the `create_date` field is automatically mapped as a `date` field with the format `yyyy/MM/dd HH:mm:ss Z||yyyy/MM/dd Z`:

```json
PUT sample-index/_doc/1
{
  "create_date": "2025/05/26"
}
```
{% include copy-curl.html %}

You can disable automatic date detection by setting `date_detection` to `false`:

```json
PUT sample-index
{
  "mappings": {
    "date_detection": false
  }
}
```
{% include copy-curl.html %}

With date detection disabled, date-formatted strings will be mapped as `text` fields instead.

You can customize the date patterns used for detection by specifying your own `dynamic_date_formats`:

```json
PUT sample-index
{
  "mappings": {
    "dynamic_date_formats": ["MM/dd/yyyy", "dd-MM-yyyy"]
  }
}
```
{% include copy-curl.html %}

#### Numeric detection

While JSON supports native numeric data types, some applications may send numbers as strings. OpenSearch can automatically detect numeric strings and map them as numeric fields when `numeric_detection` is enabled.

Numeric detection is disabled by default. The recommended approach is to use explicit mappings for numeric fields.
{: .note}

To enable numeric detection, send the following request:

```json
PUT sample-index
{
  "mappings": {
    "numeric_detection": true
  }
}
```
{% include copy-curl.html %}

Then index a document containing numeric fields into the index:

```json
PUT sample-index/_doc/1
{
  "price": "19.99",
  "quantity": "5"
}
```
{% include copy-curl.html %}

With numeric detection enabled:
- The `price` field will be mapped as a `float` field
- The `quantity` field will be mapped as a `long` field

## Explicit mapping

If you know exactly which field data types you need to use, then you can specify them in your request body when creating your index, as shown in the following example request:

```json
PUT sample-index1
{
  "mappings": {
    "properties": {
      "year":    { "type" : "text" },
      "age":     { "type" : "integer" },
      "director":{ "type" : "text" }
    }
  }
}
```
{% include copy-curl.html %}

You cannot change the mapping of an existing field, you can only modify the field's mapping parameters.
{: .note}

To add mappings to an existing index or data stream, you can send a request to the `_mapping` endpoint using the `PUT` or `POST` HTTP method, as shown in the following example request:

```json
POST sample-index1/_mapping
{
  "properties": {
    "year":    { "type" : "text" },
    "age":     { "type" : "integer" },
    "director":{ "type" : "text" }
  }
}
```
{% include copy-curl.html %}

For more information about the Mapping API, see [Update mapping]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/).

## Retrieving mappings

To get all mappings for one or more indexes, use the following request:

```json
GET <index>/_mapping
```
{% include copy-curl.html %}

In the previous request, `<index>` may be an index name or a comma-separated list of index names.

To get all mappings for all indexes, use the following request:

```json
GET _mapping
```
{% include copy-curl.html %}

To get a mapping for a specific field, provide the index name and the field name:

```json
GET _mapping/field/<fields>
GET /<index>/_mapping/field/<fields>
```
{% include copy-curl.html %}

Both `<index>` and `<fields>` can be specified as either one value or a comma-separated list. For example, the following request retrieves the mapping for the `year` and `age` fields in `sample-index1`:

```json
GET sample-index1/_mapping/field/year,age
```
{% include copy-curl.html %}

The response contains the specified fields:

```json
{
  "sample-index1" : {
    "mappings" : {
      "year" : {
        "full_name" : "year",
        "mapping" : {
          "year" : {
            "type" : "text"
          }
        }
      },
      "age" : {
        "full_name" : "age",
        "mapping" : {
          "age" : {
            "type" : "integer"
          }
        }
      }
    }
  }
}
```

For more information, see [Get Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index/).

## Examples

The following examples demonstrate practical applications of OpenSearch mappings in different scenarios.

### Ignoring malformed IP addresses

The following example shows you how to create a mapping specifying that OpenSearch should ignore any documents containing malformed IP addresses that do not conform to the [`ip`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/ip/) data type. You can accomplish this by setting the `ignore_malformed` parameter to `true`.

To create an index with an `ip` mapping, use a PUT request:

```json
PUT /test-index
{
  "mappings" : {
    "properties" :  {
      "ip_address" : {
        "type" : "ip",
        "ignore_malformed": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Then add a document with a malformed IP address:

```json
PUT /test-index/_doc/1
{
  "ip_address" : "malformed ip address"
}
```
{% include copy-curl.html %}

When you query the index, the `ip_address` field will be ignored. You can query the index using the following request:

```json
GET /test-index/_search
```
{% include copy-curl.html %}

The response shows that the document was indexed successfully, but the malformed IP address field is listed in the `_ignored` array:

```json
{
  "took": 14,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "test-index",
        "_id": "1",
        "_score": 1,
        "_ignored": [
          "ip_address"
        ],
        "_source": {
          "ip_address": "malformed ip address"
        }
      }
    ]
  }
}
```

### Mapping string fields to `text` and `keyword` types

To create an index named `movies1` with a dynamic template that maps all string fields to both the `text` and `keyword` types, you can use the following request:

```json
PUT movies1
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "fields": {
              "keyword": {
                "type":  "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

This dynamic template ensures that any string fields in your documents will be indexed as both a full-text `text` type and a `keyword` type.

## Mapping parameters

Mapping parameters are used to configure the behavior of index fields. For detailed information about all available mapping parameters, see [Mapping parameters]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/).

## Metadata fields

OpenSearch automatically manages several metadata fields for each document, such as `_source`, `_id`, and `_index`. For information about all available metadata fields and their configuration options, see [Metadata fields]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/).

## Mapping limit settings

OpenSearch provides several settings to prevent mapping explosion and control mapping growth. These settings help maintain cluster performance and prevent memory issues caused by creating an excessive number of fields.

These settings can be configured when creating an index or updated for existing indexes:

```json
PUT /my-index/_settings
{
  "index.mapping.total_fields.limit": 2000
}
```
{% include copy-curl.html %}

The following table lists all available mapping limit settings. All settings are dynamic. For more information, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

| Setting | Default | Valid values | Description |
|:--- |:--- |:--- |:--- |:--- |
| `index.mapping.total_fields.limit` | `1000` | [0, ∞) | Sets the maximum number of fields allowed in an index, including regular fields, object mappings, and field aliases. Increasing this limit requires careful consideration of cluster resources. When raising this setting, consider also adjusting the `indices.query.bool.max_clause_count` setting to accommodate larger queries. |
| `index.mapping.depth.limit` | `20` | [1, 100] | Controls the maximum nesting depth for field mappings. Depth is calculated by counting the levels of nested objects, starting from the root level (depth 1 for root-level fields, depth 2 for fields within one level of object nesting, and so on). |
| `index.mapping.nested_fields.limit` | `50` | [0, ∞) | Limits the number of distinct `nested` field types in an index. Since nested fields require special handling and additional memory, this setting helps prevent excessive resource consumption. |
| `index.mapping.nested_objects.limit` | `10000` | [0, ∞) | Restricts the total number of nested JSON objects that a single document can contain across all nested field types. This prevents individual documents from consuming excessive memory during indexing. |
| `index.mapping.field_name_length.limit` | `50000` | [1, 50000] | Sets the maximum allowed length for field names. This setting can help maintain reasonable mapping sizes by preventing extremely long field names. |
| `index.mapper.dynamic` | `true` | `true`,`false` | Determines whether new fields should be dynamically added to a mapping. Setting this to `false` can prevent uncontrolled field growth. |


## Related documentation

- [Supported field types]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/)