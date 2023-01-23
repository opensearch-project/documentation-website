---
layout: default
title: Cluster decommission 
nav_order: 20
---

# Cluster decommission

The cluster decommission operation adds support for zonal cluster deployments based on awareness. When a particular zone overloads with traffic, you can decommission the zone to ensure uptime during large search requests. This greatly benefits use cases with multi-zone deployment, since rolling restarts per node can take more time than decommissioning a zone. 

For more information on allocation awareness, see [Shard allocation awareness]({{site.url}}{{site.baseurl}}//opensearch/cluster/#shard-allocation-awareness)


## Path and HTTP methods

```
PUT  /_cluster/decommission/awareness/{awareness_attribute_name}/{awareness_attribute_value}
GET  /_cluster/decommission/awareness/{awareness_attribute_name}/_status
DELETE /_cluster/decommission/awareness
```

## URL parameters

Parameter | Type | Description
:--- | :--- | :---
awareness_attribute_name | String | The name of awareness attribute, usually `zone`.
awareness_attribute_value | String | The value of the awareness attribute. For example, if you have shards allocated in two different zones, you can give each zone a value of `zone-a` or `zoneb`. The cluster decommission operation decommissions the zone listed in the method.


## Example: Decommission and recommission a zone

You can use the following sample requests to decommission and recommission a zone:

### Request

The following sample request decommissions `zone-a`:

```
PUT /_cluster/decommission/awareness/<zone>/<zone-a>
```

If you want to recommission a decommissioned zone, you can use the `DELETE` method.

```
DELETE /_cluster/decommission/awareness
```

### Response

When recommissioning or decommissioning a zone, OpenSearch responds with the following:

```json
{
      "acknowledged": true
}
```

## Example: Get zone decommission status

The following sample requests returns the decommission status of all zones.

### Request

```
GET /_cluster/decommission/awareness/zone/_status
```


### Response

```json
{
     "zone-1": "INIT | DRAINING | IN_PROGRESS | SUCCESSFUL | FAILED"
}
```

## Example: Recommisson a decommissioned zone

Use the `DELETE` method to recommission a previously decommissioned zone.

### Request

```
DELETE /_cluster/decommission/awareness
```

### Response

```
{
      "acknowledged": true
}
```

## Next steps

- For more information about zone awareness and weight, see [Cluster awareness]({{site.url}}{{site.baseurl}}/api-reference/cluster-awareness/).
- For more information about allocation awareness, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-6-configure-shard-allocation-awareness-or-forced-awareness).
