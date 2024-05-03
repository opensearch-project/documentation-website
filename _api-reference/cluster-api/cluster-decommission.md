---
layout: default
title: Cluster decommission 
nav_order: 30
parent: Cluster APIs
has_children: false
redirect_from: 
  - /api-reference/cluster-decommission/
  - /opensearch/rest-api/cluster-decommission/
---

# Cluster decommission
**Introduced 1.0**
{: .label .label-purple }

The cluster decommission operation adds support decommissioning based on awareness. It greatly benefits multi-zone deployments, where awareness attributes, such as `zones`, can aid in applying new upgrades to a cluster in a controlled fashion. This is especially useful during outages, in which case, you can decommission the unhealthy zone to prevent replication requests from stalling and prevent your request backlog from becoming too large.

For more information about allocation awareness, see [Shard allocation awareness]({{site.url}}{{site.baseurl}}//opensearch/cluster/#shard-allocation-awareness).


## HTTP and Path methods

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


## Example: Decommissioning and recommissioning a zone

You can use the following example requests to decommission and recommission a zone:

#### Request

The following example request decommissions `zone-a`:

```json
PUT /_cluster/decommission/awareness/<zone>/<zone-a>
```
{% include copy-curl.html %}

If you want to recommission a decommissioned zone, you can use the `DELETE` method:

```json
DELETE /_cluster/decommission/awareness
```
{% include copy-curl.html %}

#### Response


```json
{
      "acknowledged": true
}
```

## Example: Getting zone decommission status

The following example requests returns the decommission status of all zones.

#### Request

```json
GET /_cluster/decommission/awareness/zone/_status
```
{% include copy-curl.html %}

#### Response

```json
{
     "zone-1": "INIT | DRAINING | IN_PROGRESS | SUCCESSFUL | FAILED"
}
```


## Next steps

- For more information about zone awareness and weight, see [Cluster awareness]({{site.url}}{{site.baseurl}}/api-reference/cluster-awareness/).
- For more information about allocation awareness, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-6-configure-shard-allocation-awareness-or-forced-awareness).
