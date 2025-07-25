---
layout: default
title: cat templates
parent: CAT
grand_parent: REST API reference
nav_order: 70
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-templates/
---

# cat templates
Introduced 1.0
{: .label .label-purple }

The cat templates operation lists the names, patterns, order numbers, and version numbers of index templates.

## Example

```
GET _cat/templates?v
```

If you want to get information for more than one template, separate the template names with commas:

```
GET _cat/shards/template_name_1,template_name_2,template_name_3
```

## Path and HTTP methods

```
GET _cat/templates
```

## URL parameters

All cat templates URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameter:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.


## Response

```
name | index_patterns order version composed_of
tenant_template | [kibana*] | 0  |    
```

To learn more about index templates, see [Index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates).
