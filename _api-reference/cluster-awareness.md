---
layout: default
title: Cluster routing and awareness
nav_order: 16
---

# Cluster routing and awareness

The Cluster routing and awareness operations assign weights to cluster zones for weighted zonal search requests. Weighted zonal requests ensures that if one of your zones fails, you can spread HTTP and search traffic across zones with lower weights.

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

## Request body

You can assign weights to zone within the request body of the PUT request. For example, if you have zones with the value `zone_1` and `zone_2`, you can assign weights using a whole number inside the request body.

```
{ 
      "zone_1": "1", 
      "zone_2": "1", 
}
```

When assigned the same weight, the weighted value of the zones are equal. This means that traffic routes to both zones in cases of zonal failure, also called _round robin_ allocation.

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

