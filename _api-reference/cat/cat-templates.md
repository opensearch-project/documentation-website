---
layout: default
title: CAT templates
parent: CAT API
nav_order: 70
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-templates/
---

# CAT templates
**Introduced 1.0**
{: .label .label-purple }

The CAT templates operation lists the names, patterns, order numbers, and version numbers of index templates.


<!-- spec_insert_start
api: cat.templates
component: endpoints
-->
## Endpoints
```json
GET /_cat/templates
GET /_cat/templates/{name}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.templates
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

## Example requests

The following example request returns information about all templates:

```json
GET _cat/templates?v
```
{% include copy-curl.html %}

If you want to get information for a specific template or pattern:

```json
GET _cat/templates/<template_name_or_pattern>
```
{% include copy-curl.html %}


## Example response

```
name | index_patterns order version composed_of
tenant_template | [opensearch-dashboards*] | 0  |    
```

To learn more about index templates, see [Index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates).
