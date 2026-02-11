---
layout: default
title: Cluster routing and awareness
nav_order: 50
parent: Cluster APIs
has_children: false
redirect_from:
  - /api-reference/cluster-awareness/
  - /opensearch/rest-api/cluster-awareness/
canonical_url: https://docs.opensearch.org/latest/api-reference/cluster-api/cluster-awareness/
---

# Cluster Routing And Awareness API
**Introduced 1.0**
{: .label .label-purple }

To control how search traffic is routed across zones, you can assign weights to awareness attribute values. This is useful for zonal deployments, heterogeneous clusters, or routing traffic away from unhealthy zones.

## Prerequisites

Before using this API, you must configure cluster awareness attributes and node attributes. This can be done either in the `opensearch.yml` file or through the Cluster Settings API. 

For example, to configure `zone` and `rack` awareness attributes using `opensearch.yml`, specify them as a comma-separated list:

```yaml
cluster.routing.allocation.awareness.attributes: zone,rack
```
{% include copy.html %}

Alternatively, you can use the Cluster Settings API to configure the awareness attributes:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/routing/awareness/zone/weights
body: |
{
  "weights":
  {
    "zone_1": "1",
    "zone_2": "1",
    "zone_3": "0"
  },
  "_version" : -1
}
-->
{% capture step1_rest %}
PUT /_cluster/routing/awareness/zone/weights
{
  "weights": {
    "zone_1": "1",
    "zone_2": "1",
    "zone_3": "0"
  },
  "_version": -1
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_weighted_routing(
  attribute = "zone",
  body =   {
    "weights": {
      "zone_1": "1",
      "zone_2": "1",
      "zone_3": "0"
    },
    "_version": -1
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

For more information about OpenSearch settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/).

## Endpoints

```json
PUT /_cluster/routing/awareness/<attribute>/weights
GET /_cluster/routing/awareness/<attribute>/weights?local
GET /_cluster/routing/awareness/<attribute>/weights
DELETE /_cluster/routing/awareness/<attribute>/weights
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`<attribute>` | String | The name of the configured awareness attribute (for example, `zone`). The attribute specified in the path determines which awareness attribute the weights apply to.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `local` | Boolean | Can be provided in a `GET` request only. If `true`, the request retrieves information from the node that receives the request instead of from the cluster manager node. Default is `false`.|

## Request body fields

The following table lists the available request body fields for the `PUT` and `DELETE` methods.

| Parameter  | Data type | Applicable method | Description  |
| :--- | :--- | :--- | :--- |
| `weights`  | Object    | `PUT` | Specifies custom weights for the awareness attribute values. The weights influence how search requests are distributed across zones or other awareness attribute values. Weights are relative and can use any ratio. For example, in a `2:3:5` ratio across three zones, 20%, 30%, and 50% of requests are routed to the respective zones. A weight of `0` excludes a zone from receiving search traffic. Required for the `PUT` method. |
| `_version` | Integer    | `PUT`, `DELETE` | Used for optimistic concurrency control (OCC). Ensures that changes are applied only if the current version matches, preventing conflicting updates. The version is incremented after each succesful `PUT` or `DELETE` operation. To initiate concurrency control, you must set `_version` to `-1` in the initial request. Required for the `PUT` and `DELETE` methods. |


## Example request: Weighted round-robin search

The following example request creates a round-robin shard allocation for search traffic between two zones while excluding a third zone from receiving any traffic:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/routing/awareness/zone/weights
body: |
{
  "weights":
  {
    "zone_1": "1",
    "zone_2": "1",
    "zone_3": "0"
  },
  "_version" : -1
}
-->
{% capture step1_rest %}
PUT /_cluster/routing/awareness/zone/weights
{
  "weights": {
    "zone_1": "1",
    "zone_2": "1",
    "zone_3": "0"
  },
  "_version": -1
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_weighted_routing(
  attribute = "zone",
  body =   {
    "weights": {
      "zone_1": "1",
      "zone_2": "1",
      "zone_3": "0"
    },
    "_version": -1
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

After this request, the `_version` increments to `0`.

To create a shard allocation for multiple awareness attributes, send a separate request for each attribute.

## Example request: Updating the configuration

The `PUT` request fully replaces the existing weight configuration for the specified awareness attribute. Any values omitted in the request are removed from the configuration. For example, the following request updates the weights for zones 1 and 3 and removes zone 2:

<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/routing/awareness/zone/weights
body: |
{
  "weights":
  {
    "zone_1": "2",
    "zone_3": "1"
  },
  "_version" : 0
}
-->
{% capture step1_rest %}
PUT /_cluster/routing/awareness/zone/weights
{
  "weights": {
    "zone_1": "2",
    "zone_3": "1"
  },
  "_version": 0
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_weighted_routing(
  attribute = "zone",
  body =   {
    "weights": {
      "zone_1": "2",
      "zone_3": "1"
    },
    "_version": 0
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

After this request, the `_version` increments to `1`.

## Example request: Viewing the configuration

To view the current weight configuration and its version, send the following request. Use the returned version number in subsequent update or delete requests:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/routing/awareness/zone/weights
-->
{% capture step1_rest %}
GET /_cluster/routing/awareness/zone/weights
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_weighted_routing(
  attribute = "zone"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
  "weights": {
    "zone_1": "2.0",
    "zone_3": "1.0"
  },
  "_version": 1,
  "discovered_cluster_manager": true
}
```

## Example request: Deleting the configuration

To remove a weight configuration, provide the current version in a `DELETE` request:

```json
DELETE /_cluster/routing/awareness/zone/weights
{
  "_version": 1
}
```
{% include copy-curl.html %}

After this request, the `_version` increments to `2`.

## Next steps

- For more information about zone commissioning, see [Cluster decommission]({{site.url}}{{site.baseurl}}/api-reference/cluster-decommission/).
- For more information about allocation awareness, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/#advanced-step-6-configure-shard-allocation-awareness-or-forced-awareness).
