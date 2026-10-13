---
layout: default
title: CAT plugins
parent: CAT APIs
nav_order: 50
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-plugins/
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

<!-- spec_insert_start
component: example_code
rest: GET /_cat/plugins?v
-->
{% capture step1_rest %}
GET /_cat/plugins?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.plugins(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
name             component                            version
opensearch-node1 analysis-icu                         3.3.2
opensearch-node1 opensearch-alerting                  3.3.2.0
opensearch-node1 opensearch-anomaly-detection         3.3.2.0
opensearch-node1 opensearch-asynchronous-search       3.3.2.0
opensearch-node1 opensearch-cross-cluster-replication 3.3.2.0
opensearch-node1 opensearch-custom-codecs             3.3.2.0
opensearch-node1 opensearch-flow-framework            3.3.2.0
opensearch-node1 opensearch-geospatial                3.3.2.0
opensearch-node1 opensearch-index-management          3.3.2.0
opensearch-node1 opensearch-job-scheduler             3.3.2.0
opensearch-node1 opensearch-knn                       3.3.2.0
opensearch-node1 opensearch-ml                        3.3.2.0
opensearch-node1 opensearch-neural-search             3.3.2.0
opensearch-node1 opensearch-notifications             3.3.2.0
opensearch-node1 opensearch-observability             3.3.2.0
opensearch-node1 opensearch-security                  3.3.2.0
opensearch-node1 opensearch-sql                       3.3.2.0
```

## Response columns

The following table lists all response columns. In the `h` and `s` query parameters, specify either the column name or its alias. To return this list from your cluster, send `GET /_cat/plugins?help`.

Column | Alias | Description
:--- | :--- | :---
`id` | - | The unique node identifier.
`name` | `n` | The node name.
`component` | `c` | The plugin component name.
`version` | `v` | The plugin version.
`description` | `d` | The plugin description and details.

To display specific columns, use the `h` query parameter. The following example request returns only the node name, component, and version columns:

```json
GET /_cat/plugins?v&h=name,component,version
```
{% include copy-curl.html %}

The response contains only the requested columns:

```json
name             component                            version
opensearch-node1 opensearch-alerting                  3.8.0.0
opensearch-node1 opensearch-anomaly-detection         3.8.0.0
opensearch-node1 opensearch-asynchronous-search       3.8.0.0
...
```

The following example request uses column aliases to return the node ID, component, and plugin description:

```json
GET /_cat/plugins?v&h=id,c,d
```
{% include copy-curl.html %}

The response contains the requested columns:

```json
id                     c                                    d
6It0uQ1AR06IDC4nMstPQw opensearch-alerting                  Amazon OpenSearch alerting plugin
6It0uQ1AR06IDC4nMstPQw opensearch-anomaly-detection         OpenSearch anomaly detector plugin
6It0uQ1AR06IDC4nMstPQw opensearch-asynchronous-search       Provides support for asynchronous search
...
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:monitor/nodes/info`.
