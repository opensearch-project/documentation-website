---
layout: default
title: Index template exists
parent: Index templates
grand_parent: Index APIs
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/index-template-exists/
---

# Index template exists

The index template exists API operation is used to verify whether an index template exists.

## Endpoints

```json
HEAD /_index_template/<template-name>
```

## Path parameters

All path parameters are required.

| Parameter       | Type   | Description                                        |
| --------------- | ------ | -------------------------------------------------- |
| `template-name` | String | The name of the index template to check for existence. |

## Query parameters

All parameters are optional.

| Parameter                 | Type    | Description                                                                                          |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `local`                   | Boolean | If true, the request does not retrieve the state from the cluster manager node. Default is `false`. |
| `cluster_manager_timeout` | Time    | Specifies how long to wait for a connection to the cluster manager node. Default is `30s`.           |

## Example request

<!-- spec_insert_start
component: example_code
rest: HEAD /_index_template/my-template
-->
{% capture step1_rest %}
HEAD /_index_template/my-template
{% endcapture %}

{% capture step1_python %}


response = client.indices.exists_index_template(
  name = "my-template"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example responses

If the template exists, the response returns a success code:

```json
200 OK
```

If the template does not exist, the response returns a failure code:

```json
404 Not Found
```
