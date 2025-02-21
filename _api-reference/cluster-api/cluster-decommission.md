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

The Cluster Decommission API adds support decommissioning based on awareness. It greatly benefits multi-zone deployments, where awareness attributes, such as `zones`, can aid in applying new upgrades to a cluster in a controlled fashion. This is especially useful during outages, in which case, you can decommission the unhealthy zone to prevent replication requests from stalling and prevent your request backlog from becoming too large.

For more information about allocation awareness, see [Shard allocation awareness]({{site.url}}{{site.baseurl}}//opensearch/cluster/#shard-allocation-awareness).


<!-- spec_insert_start
api: cluster.get_decommission_awareness
component: endpoints
-->
## Endpoints
```json
GET /_cluster/decommission/awareness/{awareness_attribute_name}/_status
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_decommission_awareness
component: endpoints
omit_header: true
-->
```json
PUT /_cluster/decommission/awareness/{awareness_attribute_name}/{awareness_attribute_value}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.delete_decommission_awareness
component: endpoints
omit_header: true
-->
```json
DELETE /_cluster/decommission/awareness
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_decommission_awareness
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `awareness_attribute_name` | **Required** | String | The name of the awareness attribute. |
| `awareness_attribute_value` | **Required** | String | The value of the awareness attribute. |

<!-- spec_insert_end -->

## Example requests

### Decommissioning and recommissioning a zone

You can use the following example requests to decommission and recommission a zone:


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

### Getting zone decommission status

The following example requests returns the decommission status of all zones.

```json
GET /_cluster/decommission/awareness/zone/_status
```
{% include copy-curl.html %}

#### Example responses

The following example response shows a successful zone decommission:

```json
{
      "acknowledged": true
}
```

### Getting zone decommission status

The following example response returns the decommission status of all zones:


```json
{
     "zone-1": "INIT | DRAINING | IN_PROGRESS | SUCCESSFUL | FAILED"
}
```


## Next steps

- For more information about zone awareness and weight, see [Cluster awareness]({{site.url}}{{site.baseurl}}/api-reference/cluster-awareness/).
- For more information about allocation awareness, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-6-configure-shard-allocation-awareness-or-forced-awareness).
