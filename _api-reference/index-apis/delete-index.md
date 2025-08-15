---
layout: default
title: Delete index
parent: Index APIs
nav_order: 60
redirect_from:
  - /opensearch/rest-api/index-apis/delete-index/
---

# Delete Index API
**Introduced 1.0**
{: .label .label-purple }

If you no longer need an index, you can use the delete index API operation to delete it.

## Endpoints

```json
DELETE /<index-name>
```

## Query parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are all (match all indexes), open (match open indexes), closed (match closed indexes), hidden (match hidden indexes), and none (do not accept wildcard expressions), which must be used with open, closed, or both. Default is `open`.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for the response to return. Default is `30s`.

## Example request

<!-- spec_insert_start
component: example_code
rest: DELETE /sample-index
-->
{% capture step1_rest %}
DELETE /sample-index
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete(
  index = "sample-index"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response
```json
{
  "acknowledged": true
}
```
