---
layout: default
title: Dangling indexes
parent: Index APIs
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/dangling-index/
---

# Dangling indexes API
**Introduced 1.0**
{: .label .label-purple }

After a node joins a cluster, dangling indexes occur if any shards exist in the node's local directory that do not already exist in the cluster. Dangling indexes can be listed, deleted, or imported.

## Endpoints

List dangling indexes:

```json
GET /_dangling
```

Import a dangling index:

```json
POST /_dangling/<index-uuid>
```

Delete a dangling index:

```json
DELETE /_dangling/<index-uuid>
```

## Path parameters

Path parameters are required.

Path parameter | Description
:--- | :---
index-uuid | UUID of index.

## Query parameters

Query parameters are optional.

Query parameter | Data type | Description
:--- | :--- | :---
accept_data_loss | Boolean | Must be set to `true` for an `import` or `delete` because OpenSearch is unaware of where the dangling index data came from.
timeout | Time units | The amount of time to wait for a response. If no response is received in the defined time period, an error is returned. Default is `30` seconds.
cluster_manager_timeout | Time units | The amount of time to wait for a connection to the cluster manager. If no response is received in the defined time period, an error is returned. Default is `30` seconds.

## Example requests

### Sample list

<!-- spec_insert_start
component: example_code
rest: GET /_dangling
-->
{% capture step1_rest %}
GET /_dangling
{% endcapture %}

{% capture step1_python %}

response = client.dangling_indices.list_dangling_indices()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Sample import

<!-- spec_insert_start
component: example_code
rest: POST /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
-->
{% capture step1_rest %}
POST /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
{% endcapture %}

{% capture step1_python %}


response = client.dangling_indices.import_dangling_index(
  index_uuid = "msdjernajxAT23RT-BupMB",
  params = { "accept_data_loss": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

 
### Sample delete

<!-- spec_insert_start
component: example_code
rest: DELETE /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
-->
{% capture step1_rest %}
DELETE /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
{% endcapture %}

{% capture step1_python %}


response = client.dangling_indices.delete_dangling_index(
  index_uuid = "msdjernajxAT23RT-BupMB",
  params = { "accept_data_loss": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response 

````json
{
    "_nodes": {
        "total": 1,
        "successful": 1,
        "failed": 0
    },
    "cluster_name": "opensearch-cluster",
    "dangling_indices": [msdjernajxAT23RT-BupMB]
}
````
