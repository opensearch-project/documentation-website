---
layout: default
title: CAT repositories
parent: CAT APIs
nav_order: 52
has_children: false
redirect_from:
 - /opensearch/rest-api/cat/cat-repositories/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-repositories/
---

# CAT Repositories API
**Introduced 1.0**
{: .label .label-purple }

The CAT repositories operation lists all snapshot repositories for a cluster.

<!-- spec_insert_start
api: cat.repositories
component: endpoints
-->
## Endpoints
```json
GET /_cat/repositories
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.repositories
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time allowed to establish a connection to the cluster manager node. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Returns local information but does not retrieve the state from the cluster manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example request

The following example request lists all snapshot repositories in the cluster:

```json
GET _cat/repositories?v
```
{% include copy-curl.html %}


## Example response

```json
id    type
repo1   fs
repo2   s3
```
