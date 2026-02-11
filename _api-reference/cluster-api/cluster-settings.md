---
layout: default
title: Cluster settings
nav_order: 50
parent: Cluster APIs
redirect_from:
  - /api-reference/cluster-settings/
  - /opensearch/rest-api/cluster-settings/
canonical_url: https://docs.opensearch.org/latest/api-reference/cluster-api/cluster-settings/
---

# Cluster Settings API
**Introduced 1.0**
{: .label .label-purple }

The cluster settings operation lets you check the current settings for your cluster, review default settings, and change settings. When you update a setting using the API, OpenSearch applies it to all nodes in the cluster.

## Endpoints

```json
GET _cluster/settings
PUT _cluster/settings
```

## Path parameters

All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
flat_settings | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of `"cluster": { "max_shards_per_node": 500 }` is `"cluster.max_shards_per_node": "500"`.
include_defaults (GET only) | Boolean | Whether to include default settings as part of the response. This parameter is useful for identifying the names and current values of settings you want to update.
cluster_manager_timeout | Time unit | The amount of time to wait for a response from the cluster manager node. Default is `30 seconds`.
timeout (PUT only) | Time unit | The amount of time to wait for a response from the cluster. Default is `30 seconds`.

## Request body fields

The GET operation has no request body fields. All cluster setting field parameters are optional.

Not all cluster settings can be updated using the cluster settings API. You will receive the error message `"setting [cluster.some.setting], not dynamically updateable"` when trying to configure these settings through the API.
{: .note }

For a listing of all cluster settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).


## Example requests

The following example request show how to use the cluster settings API.

### Check default cluster settings

The following example request checks for default cluster settings:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/settings?include_defaults=true
-->
{% capture step1_rest %}
GET /_cluster/settings?include_defaults=true
{% endcapture %}

{% capture step1_python %}


response = client.cluster.get_settings(
  params = { "include_defaults": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Update cluster setting

The following example updates the `cluster.max_shards_per_node` setting. For a PUT operation, the request body must contain `transient` or `persistent`, along with the setting you want to update:


<!-- spec_insert_start
component: example_code
rest: PUT /_cluster/settings
body: |
{
   "persistent":{
      "cluster.max_shards_per_node": 500
   }
}
-->
{% capture step1_rest %}
PUT /_cluster/settings
{
  "persistent": {
    "cluster.max_shards_per_node": 500
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.cluster.put_settings(
  body =   {
    "persistent": {
      "cluster.max_shards_per_node": 500
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

For more information about transient settings, persistent settings, and precedence, see [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/).

## Example response

The following example response shows that the persistent cluster setting, `max_shard_per_node`, has been updated:

```json
{
   "acknowledged":true,
   "persistent":{
      "cluster":{
         "max_shards_per_node":"500"
      }
   },
   "transient":{}
}
```
