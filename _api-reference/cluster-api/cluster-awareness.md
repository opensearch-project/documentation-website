---
layout: default
title: Cluster routing and awareness
nav_order: 20
parent: Cluster APIs
has_children: false
redirect_from:
  - /api-reference/cluster-awareness/
  - /opensearch/rest-api/cluster-awareness/
---

# Cluster routing and awareness
**Introduced 1.0**
{: .label .label-purple }

To control the distribution of search or HTTP traffic, you can use the weights per awareness attribute to control the distribution of search or HTTP traffic across zones. This is commonly used for zonal deployments, heterogeneous instances, and routing traffic away from zones during zonal failure.

## Path and HTTP methods

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
weights | JSON object | Assigns weights to attributes within the request body of the PUT request. Weights can be set in any ratio, for example, 2:3:5. In a 2:3:5 ratio with 3 zones, for every 100 requests sent to the cluster, each zone would receive either 20, 30, or 50 search requests in a random order. When assigned a weight of `0`, the zone does not receive any search traffic. 
_version | String | Implements optimistic concurrency control (OCC) through versioning. The parameter uses simple versioning, such as `1`, and increments upward based on each subsequent modification. This allows any servers from which a request originates to validate whether or not a zone has been modified. 


In the following example request body, `zone_1` and `zone_2` receive 50 requests each, whereas `zone_3` is prevented from receiving requests:

```
{ 
      "weights":
      {
        "zone_1": "5", 
        "zone_2": "5", 
        "zone_3": "0"
      }
      "_version" : 1
}
```

## Example: Weighted round robin search

The following example request creates a round robin shard allocation for search traffic by using an undefined ratio:

#### Request

```json
PUT /_cluster/routing/awareness/zone/weights
{ 
      "weights":
      {
        "zone_1": "1", 
        "zone_2": "1", 
        "zone_3": "0"
      }
      "_version" : 1
}
```
{% include copy-curl.html %}

#### Response

```
{
     "acknowledged": true
}
```


## Example: Getting weights for all zones

The following example request gets weights for all zones.

#### Request

```json
GET /_cluster/routing/awareness/zone/weights
```
{% include copy-curl.html %}

#### Response

OpenSearch responds with the weight of each zone:

```json
{
      "weights":
      {
      
        "zone_1": "1.0", 
        "zone_2": "1.0", 
        "zone_3": "0.0"
      },
      "_version":1
}
```

## Example: Deleting weights

You can remove your weight ratio for each zone using the `DELETE` method.

#### Request

```json
DELETE /_cluster/routing/awareness/zone/weights
```
{% include copy-curl.html %}

#### Response

```json
{
   "_version":1
}
```

## Next steps

- For more information about zone commissioning, see [Cluster decommission]({{site.url}}{{site.baseurl}}/api-reference/cluster-decommission/).
- For more information about allocation awareness, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-6-configure-shard-allocation-awareness-or-forced-awareness).
