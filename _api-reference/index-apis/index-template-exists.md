---
layout: default
title: Index template exists
parent: Index APIs
nav_order: 98
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
| `local`                   | Boolean | If true, the request does not retrieve the state from the cluster manager node. Defaults to `false`. |
| `cluster_manager_timeout` | Time    | Specifies the time to wait for a connection to the cluster manager node. Default is `30s`.           |

## Example request

```json
HEAD /_index_template/my-template
```
{% include copy-curl.html %}

## Example responses

If the template exists, the response returns a success code:

```json
200 OK
```

If the template does not exist, the response returns a failure code:

```json
404 Not Found
```
