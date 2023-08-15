---
layout: default
title: Range field types
nav_order: 35
has_children: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/range/
  - /field-types/range/
---

# Range field types

The following table lists all range field types that OpenSearch supports.

Field data type | Description
:--- | :---
`integer_range` | A range of [integer]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) values. 
`long_range` | A range of [long]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) values.   
`double_range` | A range of [double]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) values.  
`float_range` | A range of [float]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) values. 
`ip_range` | A range of [IP addresses]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/ip/) in IPv4 or IPv6 format. Start and end IP addresses may be in different formats.  
`date_range` | A range of [date]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/) values. Start and end dates may be in different [formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#formats). Internally, all dates are stored as unsigned 64-bit integers representing milliseconds since the epoch.

## Example

Create a mapping with a double range and a date range:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "gpa" : {
        "type" : "double_range"
      },
      "graduation_date" : {
        "type" : "date_range",
        "format" : "strict_year_month||strict_year_month_day"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a double range and a date range:

```json
PUT testindex/_doc/1
{
  "gpa" : {
    "gte" : 1.0,
    "lte" : 4.0
  },
  "graduation_date" : {
    "gte" : "2019-05-01",
    "lte" : "2019-05-15"
  }
}
```
{% include copy-curl.html %}

## IP address ranges

You can specify IP address ranges in two formats: as a range and in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation).

Create a mapping with an IP address range:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "ip_address_range" : {
        "type" : "ip_range" 
      },
      "ip_address_cidr" : {
        "type" : "ip_range" 
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with IP address ranges in both formats:

```json
PUT testindex/_doc/2
{
  "ip_address_range" : {
    "gte" : "10.24.34.0",
    "lte" : "10.24.35.255"
  },
  "ip_address_cidr" : "10.24.34.0/24"
}
```
{% include copy-curl.html %}

## Querying range fields

You can use a [Term query](#term-query) or a [Range query](#range-query) to search for values within range fields. 

### Term query

A term query takes a value and matches all range fields for which the value is within the range.

The following query will return document 1 because 3.5 is within the range [1.0, 4.0]:

```json
GET testindex/_search
{
  "query" : {
    "term" : {
      "gpa" : {
        "value" : 3.5
      }
    }
  }
}
```
{% include copy-curl.html %}

### Range query

A range query on a range field returns documents within that range. 

Query for all graduation dates in 2019, providing the date range in a "MM/dd/yyyy" format:

```json
GET testindex1/_search
{
  "query": {
    "range": {
      "graduation_date": {
        "gte": "01/01/2019",
        "lte": "12/31/2019",
        "format": "MM/dd/yyyy",
        "relation" : "within"       
      }
    }
  }
}
```
{% include copy-curl.html %}

The preceding query will return document 1 for the `within` and `intersects` relations but will not return it for the `contains` relation. For more information about relation types, see [range query parameters]({{site.url}}{{site.baseurl}}/query-dsl/term/range#parameters).

## Parameters

The following table lists the parameters accepted by range field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`coerce` | A Boolean value that signals to truncate decimals for integer values and to convert strings to numeric values. Default is `true`.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`. 
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 
