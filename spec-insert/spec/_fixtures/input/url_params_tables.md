Typical Path Parameters Example

<!-- spec_insert_start
api: search
component: path_parameters
-->
THIS
    TEXT
        SHOULD
            BE
                REPLACED
<!-- spec_insert_end -->

Query Parameters Example with Global Parameters, Pretty Print, and Custom Columns

<!-- spec_insert_start
api: search
component: query_parameters
include_global: true
pretty: true
columns: Data type, Parameter, Description, Required, Default
-->
  THIS TEXT SHOULD BE REPLACED
<!-- spec_insert_end -->

Query Parameters Example with only Parameter and Description Columns

<!-- spec_insert_start
api: search
component: query_parameters
columns: Parameter, Description
omit_header: true
-->
THIS
TEXT
SHOULD
BE
REPLACED
<!-- spec_insert_end -->

Optional Params Text

<!-- spec_insert_start
api: cat.health
component: query_parameters
include_global: true
-->
<!-- spec_insert_end -->
