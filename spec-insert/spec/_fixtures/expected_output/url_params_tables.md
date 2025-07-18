Typical Path Parameters Example

<!-- spec_insert_start
api: search
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List or String | Comma-separated list of data streams, indexes, and aliases to search. Supports wildcards (`*`). To search all data streams and indexes, omit this parameter or use `*` or `_all`. <br> Valid values are: `_all`, `_any`, and `_none`. |

<!-- spec_insert_end -->

Query Parameters Example with Global Parameters, Pretty Print, and Custom Columns

<!-- spec_insert_start
api: search
component: query_parameters
include_global: true
pretty: true
columns: Data type, Parameter, Description, Required, Default
-->
## Query parameters

The following table lists the available query parameters.

| Data type      | Parameter                 | Description                                                                                                                        | Required     | Default |
|:---------------|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------|:-------------|:--------|
| Boolean        | `analyze_wildcard`        | If true, wildcard and prefix queries are analyzed. This parameter can only be used when the q query string parameter is specified. | **Required** | `false` |
| String         | `analyzer`                | Analyzer to use for the query string. This parameter can only be used when the q query string parameter is specified.              | _Optional_   | N/A     |
| List or String | `expand_wildcards`        | Comma-separated list of expand wildcard options. <br> Valid values are: `open`, `closed`, `none`, and `all`.                       | _Optional_   | N/A     |
| Boolean        | `pretty`                  | Whether to pretty format the returned JSON response.                                                                               | _Optional_   | N/A     |
| Boolean        | `human` <br> _DEPRECATED_ | _(Deprecated since 3.0: Use the `format` parameter instead.)_ Whether to return human readable values for statistics.              | _Optional_   | `true`  |

<!-- spec_insert_end -->

Query Parameters Example with only Parameter and Description Columns

<!-- spec_insert_start
api: search
component: query_parameters
columns: Parameter, Description
omit_header: true
-->

| Parameter | Description |
| :--- | :--- |
| `analyze_wildcard` | **(Required)** If true, wildcard and prefix queries are analyzed. This parameter can only be used when the q query string parameter is specified. _(Default: `false`)_ |
| `analyzer` | Analyzer to use for the query string. This parameter can only be used when the q query string parameter is specified. |
| `expand_wildcards` | Comma-separated list of expand wildcard options. <br> Valid values are: `open`, `closed`, `none`, and `all`. |

<!-- spec_insert_end -->

Optional Params Text

<!-- spec_insert_start
api: cat.health
component: query_parameters
include_global: true
-->
## Query parameters

The following table lists the available query parameters.

| Parameter | Required | Data type | Description | Default |
| :--- | :--- | :--- | :--- | :--- |
| `expand_wildcard` | **Required** | String | Whether to expand wildcard expression to concrete indices that are open, closed, or both. For more information, see [cat health API]({{site.url}}{{site.baseurl}}/api-reference/cat/health/). <br> Valid values are: <br> - `open`: Expand wildcards to open indices only. <br> - `closed`: Expand wildcards to closed indices only. <br> - `master`: Expand wildcards for cluster manager nodes only. | N/A |
| `pretty` | _Optional_ | Boolean | Whether to pretty format the returned JSON response. | N/A |
| `human` <br> _DEPRECATED_ | _Optional_ | Boolean | _(Deprecated since 3.0: Use the `format` parameter instead.)_ Whether to return human readable values for statistics. | `true` |

<!-- spec_insert_end -->
