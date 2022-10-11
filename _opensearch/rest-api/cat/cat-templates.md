---
layout: default
title: cat templates
parent: CAT API
grand_parent: REST API reference
nav_order: 70
has_children: false
---

# cat templates
Introduced 1.0
{: .label .label-purple }

The cat templates operation lists the names, patterns, order numbers, and version numbers of index templates.

## Example

```
GET _cat/templates?v
```

If you want to get information for a specific template or pattern:

```
GET _cat/templates/{name}
```

## Path and HTTP methods

```
GET _cat/templates
```

## URL parameters

All cat templates URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index), you can specify the following parameter:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.


## Response

```
name | index_patterns order version composed_of
tenant_template | [opensearch-dashboards*] | 0  |    
```

To learn more about index templates, see [Index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates).
