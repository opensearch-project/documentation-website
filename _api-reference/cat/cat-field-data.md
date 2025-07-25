---
layout: default
title: CAT field data
parent: CAT API
nav_order: 15
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-field-data/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-field-data/
---

# CAT Field Data
**Introduced 1.0**
{: .label .label-purple }

The CAT Field Data operation lists the memory size used by each field per node.


## Path and HTTP methods

```json
GET _cat/fielddata?v
GET _cat/fielddata/<field_name>?v
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Example requests

```json
GET _cat/fielddata?v
```
{% include copy-curl.html %}

To limit the information to a specific field, add the field name after your query:

```json
GET _cat/fielddata/<field_name>?v
```
{% include copy-curl.html %}

If you want to get information for more than one field, separate the field names with commas:

```json
GET _cat/fielddata/field_name_1,field_name_2,field_name_3
```
{% include copy-curl.html %}

## Example response

The following response shows the memory size for all fields as 284 bytes:

```json
id                     host       ip         node       field size
1vo54NuxSxOrbPEYdkSF0w 172.18.0.4 172.18.0.4 odfe-node1 _id   284b
ZaIkkUd4TEiAihqJGkp5CA 172.18.0.3 172.18.0.3 odfe-node2 _id   284b
```
