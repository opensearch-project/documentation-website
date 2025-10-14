---
layout: default
title: CAT plugins
parent: CAT APIs
nav_order: 50
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-plugins/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-plugins/
---

# CAT Plugins API
**Introduced 1.0**
{: .label .label-purple }

The CAT plugins operation lists the names, components, and versions of the installed plugins.

<!-- spec_insert_start
api: cat.plugins
component: endpoints
-->
## Endpoints
```json
GET /_cat/plugins
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.plugins
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

The following example request lists all installed plugins:

```json
GET _cat/plugins?v
```
{% include copy-curl.html %}

## Example response

```json
name       component                       version
odfe-node2 opendistro-alerting             1.13.1.0
odfe-node2 opendistro-anomaly-detection    1.13.0.0
odfe-node2 opendistro-asynchronous-search  1.13.0.1
odfe-node2 opendistro-index-management     1.13.2.0
odfe-node2 opendistro-job-scheduler        1.13.0.0
odfe-node2 opendistro-knn                  1.13.0.0
odfe-node2 opendistro-performance-analyzer 1.13.0.0
odfe-node2 opendistro-reports-scheduler    1.13.0.0
odfe-node2 opendistro-sql                  1.13.2.0
odfe-node2 opendistro_security             1.13.1.0
odfe-node1 opendistro-alerting             1.13.1.0
odfe-node1 opendistro-anomaly-detection    1.13.0.0
odfe-node1 opendistro-asynchronous-search  1.13.0.1
odfe-node1 opendistro-index-management     1.13.2.0
odfe-node1 opendistro-job-scheduler        1.13.0.0
odfe-node1 opendistro-knn                  1.13.0.0
odfe-node1 opendistro-performance-analyzer 1.13.0.0
odfe-node1 opendistro-reports-scheduler    1.13.0.0
odfe-node1 opendistro-sql                  1.13.2.0
odfe-node1 opendistro_security             1.13.1.0
```
