---

layout: default
title: Delete template (deprecated)
parent: Index APIs
nav_order: 65
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/delete-template-legacy/
---

# Delete template

The Delete Template API has been deprecated. Use the new [Delete Index Template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index-template/) API.
{: .warning}

The delete template API operation deletes an index template created using the legacy `/_template` endpoint.


## Endpoints

```json
DELETE /_template/<template-name>
```

## Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter    | Type   | Description                                                 |
| :----------- | :----- | :---------------------------------------------------------- |
| `index-name` | String | The name of the index to delete. Supports wildcard expressions. |

## Query parameters

The following table lists the available query parameters. All parameters are optional.

| Parameter       | Type | Description                                                                                  |
| :-------------- | :--- | :------------------------------------------------------------------------------------------- |
| `cluster_manager_timeout` | Time | Specifies how long to wait for a connection to the cluster manager node. Default is `30s`. |
| `timeout`                 | Time    | Specifies how long to wait for the operation to complete. Default is `30s`. |

## Example request

```json
DELETE /_template/logging_template
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```

