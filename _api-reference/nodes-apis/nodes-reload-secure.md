---
layout: default
title: Nodes reload secure settings
parent: Nodes APIs
nav_order: 50
---

# Nodes reload secure settings
**Introduced 1.0**
{: .label .label-purple }

The nodes reload secure settings endpoint allows you to change secure settings on a node and reload the secure settings without restarting the node.

## Path and HTTP methods

```
POST _nodes/reload_secure_settings
POST _nodes/<nodeId>/reload_secure_settings
```

## Path parameter

You can include the following optional path parameter in your request.

Parameter | Type | Description
:--- | :--- | :---
nodeId | String | A comma-separated list of nodeIds used to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters). Defaults to `_all`.

## Request fields

The request may include an optional object containing the password for the OpenSearch keystore.

```json
{
  "secure_settings_password": "keystore_password"
}
```

#### Example request

The following is an example API request:

```
POST _nodes/reload_secure_settings
```
{% include copy-curl.html %}

#### Example response

The following is an example response:

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "opensearch-cluster",
  "nodes" : {
    "t7uqHu4SSuWObK3ElkCRfw" : {
      "name" : "opensearch-node1"
    }
  }
}
```

## Required permissions

If you use the Security plugin, make sure you set the following permissions: `cluster:manage/nodes`.