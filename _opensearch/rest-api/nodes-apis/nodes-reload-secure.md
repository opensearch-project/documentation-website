---
layout: default
title: Nodes reload secure settings
parent: Nodes APIs
grand_parent: REST API reference
nav_order: 50
---

# Nodes reload secure settings

The nodes reload secure settings endpoint allows you to change secure settings on a node and reload the secure settings without restarting the node.

## Path and HTTP methods

```
POST _nodes/reload_secure_settings
POST _nodes/<node id>/reload_secure_settings
```

## Path parameter

You can include the following optional path parameter in your request:

Parameter | Type | Description
:--- | :--- | :---
node_id | String | The names of the nodes to reload.

## HTTP request body

An optional object containing the password for the OpenSearch keystore.

````json
{
  "secure_settings_password":"keystore_password"
}
````

## Required permissions

If you use the security plugin, make sure you set the following permissions: `cluster:manage/nodes`.

### Example API query and response

The following is an example API query:

```
POST _nodes/reload_secure_settings
```

The following is an example response:

````json
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
````