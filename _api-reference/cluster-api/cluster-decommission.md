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

# Cluster Decommission API
**Introduced 1.0**
{: .label .label-purple }

The cluster decommission operation adds support decommissioning based on awareness. It greatly benefits multi-zone deployments, where awareness attributes, such as `zones`, can aid in applying new upgrades to a cluster in a controlled fashion. This is especially useful during outages, in which case, you can decommission the unhealthy zone to prevent replication requests from stalling and prevent your request backlog from becoming too large.

For more information about allocation awareness, see [Shard allocation awareness]({{site.url}}{{site.baseurl}}//opensearch/cluster/#shard-allocation-awareness).


## Endpoints

```json
PUT  /_cluster/decommission/awareness/{awareness_attribute_name}/{awareness_attribute_value}
GET  /_cluster/decommission/awareness/{awareness_attribute_name}/_status
DELETE /_cluster/decommission/awareness
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
awareness_attribute_name | String | The name of awareness attribute, usually `zone`.
awareness_attribute_value | String | The value of the awareness attribute. For example, if you have shards allocated in two different zones, you can give each zone a value of `zone-a` or `zoneb`. The cluster decommission operation decommissions the zone listed in the method.

## Example requests

### Decommissioning and recommissioning a zone

You can use the following example requests to decommission and recommission a zone:


The following example request decommissions `zone-a`:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/decommission/awareness/<zone>/<zone-a>
-->
{% capture step1_rest %}
PUT /_cluster/decommission/awareness/<zone>/<zone-a>
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_decommission_awareness(
  awareness_attribute_name = "<zone>",
  awareness_attribute_value = "<zone-a>"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If you want to recommission a decommissioned zone, you can use the `DELETE` method:

<!-- spec_insert_start
component: example_code
rest: DELETE /_cluster/decommission/awareness
-->
{% capture step1_rest %}
DELETE /_cluster/decommission/awareness
{% endcapture %}

{% capture step1_python %}

response = client.cluster.delete_decommission_awareness()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Getting zone decommission status

The following example requests returns the decommission status of all zones.

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/decommission/awareness/zone/_status
-->
{% capture step1_rest %}
GET /_cluster/decommission/awareness/zone/_status
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_decommission_awareness(
  awareness_attribute_name = "zone"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

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
