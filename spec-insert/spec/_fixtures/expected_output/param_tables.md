Typical Path Parameters Example

<!-- spec_insert_start
api: search
component: path_parameters
-->
## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`index` | List or String | Comma-separated list of data streams, indexes, and aliases to search. Supports wildcards (`*`). To search all data streams and indexes, omit this parameter or use `*` or `_all`.
<!-- spec_insert_end -->

Query Parameters Example with Global Parameters, Pretty Print, and Custom Columns

<!-- spec_insert_start
api: search
component: query_parameters
include_global: true
pretty: true
columns: Type, Parameter, Description, Required, Default
-->
## Query parameters


| Type    | Parameter                 | Description                                                                                                                        | Required | Default |
|:--------|:--------------------------|:-----------------------------------------------------------------------------------------------------------------------------------|:---------|:--------|
| Boolean | `analyze_wildcard`        | If true, wildcard and prefix queries are analyzed. This parameter can only be used when the q query string parameter is specified. | Required | `false` |
| String  | `analyzer`                | Analyzer to use for the query string. This parameter can only be used when the q query string parameter is specified.              |          |         |
| Boolean | `pretty`                  | Whether to pretty format the returned JSON response.                                                                               |          |         |
| Boolean | `human` <br> _DEPRECATED_ | _(Deprecated since 3.0: Use the `format` parameter instead.)_ Whether to return human readable values for statistics.              |          | `true`  |
<!-- spec_insert_end -->

Query Parameters Example with only Parameter and Description Columns

<!-- spec_insert_start
api: search
component: query_parameters
columns: Parameter, Description
omit_header: true
-->
Parameter | Description
:--- | :---
`analyze_wildcard` | **(Required)** If true, wildcard and prefix queries are analyzed. This parameter can only be used when the q query string parameter is specified. _(Default: `false`)_
`analyzer` | Analyzer to use for the query string. This parameter can only be used when the q query string parameter is specified.
<!-- spec_insert_end -->
