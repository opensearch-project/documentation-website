---

layout: default
title: Delete template (deprecated)
parent: Index APIs
nav_order: 65
---

Delete template API is deprecated. Please use the new [delete index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index-template/) API.
{: .warning}

# Delete template

Delete template API operation deletes an index template created using the legacy `/_template` endpoint.


## Endpoints

```json
DELETE /_template/<template-name>
```

## Path parameters

The following table lists the available path parameters.

| Parameter    | Type   | Description                                                 |
| :----------- | :----- | :---------------------------------------------------------- |
| `index-name` | String | The name of the index to delete. Supports wildcard expressions _(Required)_. |

## Query parameters

The following table lists the available query parameters. All parameters are optional.

| Parameter       | Type | Description                                                                                  |
| :-------------- | :--- | :------------------------------------------------------------------------------------------- |
| `cluster_manager_timeout` | Time | Specifies the period to wait for a connection to the cluster manager node. Default is `30s`. |
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

