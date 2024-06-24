---
layout: default
title: cat field data
parent: CAT
grand_parent: REST API reference
nav_order: 15
has_children: false
canonical_url: https://opensearch.org/docs/latest/api-reference/cat/cat-field-data/
---

# cat fielddata
Introduced 1.0
{: .label .label-purple }

The cat fielddata operation lists the memory size used by each field per node.

## Example

```json
GET _cat/fielddata?v
```

To limit the information to a specific field, add the field name after your query:

```json
GET _cat/fielddata/<field_name>?v
```

If you want to get information for more than one field, separate the field names with commas:

```json
GET _cat/aliases/field_name_1,field_name_2,field_name_3
```

## Path and HTTP methods

```
GET _cat/fielddata?v
GET _cat/fielddata/<field_name>?v
```

## URL parameters

All cat fielddata URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameter:

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
