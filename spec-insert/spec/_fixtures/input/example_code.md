<!-- spec_insert_start
component: example_code
rest: GET /_cat/health?pretty=true&human=false
include_client_setup:
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
component: example_code
rest: GET /{index}/_search?analyzer=standard&expand_wildcards=all
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
skip: true
component: example_code
rest: GET /{index}/_search?analyzer=standard&expand_wildcards=all
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
component: example_code
rest: PUT /_settings?expand_wildcards=all
body: |
  {
    "index": {
      "number_of_replicas": 2
    }
  }
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
component: example_code
rest: POST /_bulk?expand_wildcards=all
body: |
  {"index":{"_index":"test","_id":"1"}}
  {"field1":"value1"}
  {"delete":{"_index":"test","_id":"2"}}
include_client_setup: 
-->
<!-- spec_insert_end -->