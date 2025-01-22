---
layout: default
title: CAT aliases
parent: CAT API
redirect_from:
- /opensearch/rest-api/cat/cat-aliases/

nav_order: 1
has_children: false
---

# CAT aliases
**Introduced 1.0**
{: .label .label-purple }

The CAT aliases operation lists the mapping of aliases to indexes, plus routing and filtering information.



<!-- spec_insert_start
api: cat.aliases
component: endpoints
-->
## Endpoints
```json
GET /_cat/aliases
GET /_cat/aliases/{name}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.aliases
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with open, closed, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->


## Example requests

```json
GET _cat/aliases?v
```
{% include copy-curl.html %}

To limit the information to a specific alias, add the alias name after your query:

```json
GET _cat/aliases/<alias>?v
```
{% include copy-curl.html %}

If you want to get information for more than one alias, separate the alias names with commas:

```json
GET _cat/aliases/alias1,alias2,alias3
```
{% include copy-curl.html %}

## Example response

The following response shows that `alias1` refers to a `movies` index and has a configured filter:

```json
alias   | index     | filter  | routing.index | routing.search  | is_write_index
alias1  | movies    |   *     |      -        |       -         |      -
.opensearch-dashboards | .opensearch-dashboards_1 |   -     |      -        |       -         |      -
```

To learn more about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias).
