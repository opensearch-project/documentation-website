---
layout: default
title: Cluster settings
nav_order: 50
parent: Cluster APIs
redirect_from:
  - /api-reference/cluster-settings/
  - /opensearch/rest-api/cluster-settings/
---

# Cluster settings
**Introduced 1.0**
{: .label .label-purple }

The cluster settings operation lets you check the current settings for your cluster, review default settings, and change settings. When you update a setting using the API, OpenSearch applies it to all nodes in the cluster.

<!-- spec_insert_start
api: cluster.get_settings
component: endpoints
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_settings
component: endpoints
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_settings
component: path_parameters
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.put_settings
component: query_parameters
-->
<!-- spec_insert_end -->

## Request body fields

The GET operation has no request body fields. All cluster setting field parameters are optional.

Not all cluster settings can be updated using the cluster settings API. You will receive the error message `"setting [cluster.some.setting], not dynamically updateable"` when trying to configure these settings through the API.
{: .note }

For a listing of all cluster settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).


## Example requests

The following example request show how to use the cluster settings API.

### Check default cluster settings

The following example request checks for default cluster settings:

```json
GET _cluster/settings?include_defaults=true
```
{% include copy-curl.html %}

### Update cluster setting

The following example updates the `cluster.max_shards_per_node` setting. For a PUT operation, the request body must contain `transient` or `persistent`, along with the setting you want to update:


```json
PUT _cluster/settings
{
   "persistent":{
      "cluster.max_shards_per_node": 500
   }
}
```
{% include copy-curl.html %}

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
