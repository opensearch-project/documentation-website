---
layout: default
title: CAT field data
parent: CAT API
nav_order: 15
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-field-data/
---

# CAT fielddata
**Introduced 1.0**
{: .label .label-purple }

The CAT fielddata operation lists the memory size used by each field per node.

## Example

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

## Path and HTTP methods

```
GET _cat/fielddata?v
GET _cat/fielddata/<field_name>?v
```

## URL parameters

All CAT fielddata URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameter:

Parameter | Type | Description
:--- | :--- | :---
bytes | Byte size | Specify the units for byte size. For example, `7kb` or `6gb`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Response

The following response shows the memory size for all fields as 284 bytes:

```json
id                     host       ip         node       field size
1vo54NuxSxOrbPEYdkSF0w 172.18.0.4 172.18.0.4 odfe-node1 _id   284b
ZaIkkUd4TEiAihqJGkp5CA 172.18.0.3 172.18.0.3 odfe-node2 _id   284b
```
