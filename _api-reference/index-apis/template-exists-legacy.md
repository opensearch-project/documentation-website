---
layout: default
title: Template exists (deprecated)
parent: Index APIs
nav_order: 157
---

# Template exists

The Template Exists API has been deprecated. Use the new [Index Template Exists]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-template-exists/) API.
{: .warning}

The template exists API operation is used to verify whether one or more index templates created using the legacy `/_template` endpoint exist.

## Endpoints

```json
HEAD /_template/<template-name>
```

## Path parameters

The following table lists the available path parameters. All parameters are required.

| Parameter       | Type   | Description                                                                      |
| :-------------- | :----- | :------------------------------------------------------------------------------- |
| `template-name` | String | The name of the index template to check. Accepts wildcard expressions.               |

## Query parameters

The following table lists the available query parameters. All parameters are optional.

| Parameter                  | Type    | Description                                                                                          |
| :------------------------- | :------ | :--------------------------------------------------------------------------------------------------- |
| `flat_settings`            | Boolean | If `true`, returns settings in flat format. Default is `false`.                                       |
| `local`                    | Boolean | If `true`, the request does not retrieve the state from the cluster manager node. Default is `false`. |
| `cluster_manager_timeout` | Time    | Specifies how long to wait for a connection to the cluster manager node. Default is `30s`.           |

## Example request

```json
HEAD /_template/logging_template
```
{% include copy-curl.html %}

## Example response

If the template exists, a `200 OK` status is returned with no response body. If the template does not exist, `404 Not Found` is returned.

