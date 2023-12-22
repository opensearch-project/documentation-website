---
layout: default
title: IP address
nav_order: 30
has_children: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/ip/
  - /field-types/ip/
---

# IP address field type

An ip field type contains an IP address in IPv4 or IPv6 format. 

To represent IP address ranges, there is an IP [range field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/).
{: .note }

## Example

Create a mapping with an IP address:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "ip_address" : {
        "type" : "ip"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with an IP address:

```json
PUT testindex/_doc/1 
{
  "ip_address" : "10.24.34.0"
}
```
{% include copy-curl.html %}

Query an index for a specific IP address:

```json
GET testindex/_doc/1 
{
  "query": {
    "term": {
      "ip_address": "10.24.34.0"
    }
  }
}
```
{% include copy-curl.html %}

## Searching for an IP address and its associated network mask

You can query an index for an IP address in [Classless Inter-Domain Routing (CIDR) notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation). Using CIDR notation, specify the IP address and the prefix length (0–32), separated by `/`. For example, the prefix length of 24 will match all IP addresses with the same initial 24 bits.

#### Example query in IPv4 format

```json
GET testindex/_search 
{
  "query": {
    "term": {
      "ip_address": "10.24.34.0/24"
    }
  }
}
```
{% include copy-curl.html %}

#### Example query in IPv6 format

```json
GET testindex/_search 
{
  "query": {
    "term": {
      "ip_address": "2001:DB8::/24"
    }
  }
}
```
{% include copy-curl.html %}

If you use an IP address in IPv6 format in a `query_string` query, you need to escape `:` characters because they are parsed as special characters. You can accomplish this by wrapping the IP address in quotation marks and escaping those quotation marks with `\`.

```json
GET testindex/_search 
{
  "query" : {
    "query_string": {
      "query": "ip_address:\"2001:DB8::/24\""
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by ip field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`doc_values` | A Boolean value that specifies if the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `true`.
`ignore_malformed` | A Boolean value that specifies to ignore malformed values and not to throw an exception. Default is `false`.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`. 
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 


