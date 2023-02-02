---
layout: default
title: CAT master
parent: CAT API

nav_order: 30
has_children: false
---

# CAT master
Introduced 1.0
{: .label .label-purple }

The CAT master operation lists information that helps identify the elected master node.

## Example

```
GET _cat/master?v
```
{% include copy-curl.html %}

## Path and HTTP methods

```
GET _cat/master
```

## URL parameters

All CAT master URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/api-reference/cat/index), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.
## Response

```json
id                     |   host     |     ip     |   node
ZaIkkUd4TEiAihqJGkp5CA | 172.18.0.3 | 172.18.0.3 | opensearch-node2
```
