---
layout: default
title: Cluster routing and awareness
nav_order: 16
---

# Cluster routing and awareness

To control the distribution of search or HTTP traffic, you can use the weights per awareness attribute to control the distribution of search or HTTP traffic across zones. This is commonly used for zonal deployments, heterogenous instances, and weighing traffic away from zones during zonal failure.

## HTTP and Path methods

```
PUT /_cluster/routing/awareness/<attribute>/weights
GET /_cluster/routing/awareness/<attribute>/weights?local
GET /_cluster/routing/awareness/<attribute>/weights
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
attribute | String | The name of the awareness attribute, usually `zone`. The attribute name must match the values listed in the request body when assigning weights to zones.

## Request body parameters

Parameter | Type | Description
:--- | :--- | :---
weights | JSON object | Assigns weights to attributes within the request body of the PUT request. Weights can be set in any ration, for example, 2:3:5. In a 2:3:5 ratio with three zones, for every 100 requests sent to the cluster, each zone would receive either 20, 30, or 50 search requests in a random order. When assigned a weight of `0`, the zone is cut off from an search traffic. 
_version | String | Implements Optimistic concurrency control (OCC) through versioning. The parameter uses simple versioning, such as `1`, and increments upward based  


You can assign weights to zone within the request body of the PUT request. Weights can be set in any ration, for example, 2:3:5. In a 2:3:5 ratio with three zones, for every 100 requests sent to the cluster, each zone would receive either 20, 30, or 50 search requests in a random order.

When assigned a weight of `0`, the zone is cut off from an search traffic. 

In the following example request body, `zone_1` and `zone_2` receive 50 requests each, whereas `zone_3` is cut for from receiving requests.

```
{ 
      "zone_1": "5", 
      "zone_2": "5",
      "zone_3": "0", 
}
```

## Example: Weighted round robin search

The following sample request creates a round robin shard allocation for search traffic.

### Request

```
PUT /_cluster/routing/awareness/zone/weights
{ 
      "zone_1": "1", 
      "zone_2": "1", 
      "zone_3": "0"
}
```

### Response

```
{
     "acknowledged": true
}
```

## Example: Get weight for a local node

The following sample request gets the weight for a local node as well as any zones in your cluster. This gives you the ability to see if you local node is weighted over your zones.

### Request

```
GET /_cluster/routing/awareness/zone/weights?local
```

### Response

```json
{ 
    "zone_1": "1", 
    "zone_2": "1", 
    "zone_3": "0",
    "node_weight" : "0"
}
```

## Example: Get weights for all zones

The following sample request gets weights for all zones.

### Request

```
GET /_cluster/routing/awareness/<attribute>/weights
```

### Response

OpenSearch responds with the weight of each zone.

```json
{
      "zone_1": "1", 
      "zone_2": "1", 
      "zone_3": "0"
}
```

