---
layout: default
title: CAT APIs
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /opensearch/catapis/
  - /opensearch/rest-api/cat/index/
  - /api-reference/cat/
---

# CAT APIs
**Introduced 1.0**
{: .label .label-purple }

You can get essential statistics about your cluster in an easy-to-understand, tabular format using the compact and aligned text (CAT) API. The CAT API is a human-readable interface that returns plain text instead of traditional JSON.

Using the CAT API, you can answer questions like which node is the elected cluster manager, what state the cluster is in, how many documents are in each index, and so on.

## Example

To see the available operations in the CAT API, use the following command:

<!-- spec_insert_start
component: example_code
rest: GET /_cat
-->
{% capture step1_rest %}
GET /_cat
{% endcapture %}

{% capture step1_python %}

response = client.cat.help()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response is an ASCII cat (`=^.^=`) and a list of operations:

```
=^.^=
/_cat/allocation
/_cat/segment_replication
/_cat/segment_replication/{index}
/_cat/shards
/_cat/shards/{index}
/_cat/cluster_manager
/_cat/nodes
/_cat/tasks
/_cat/indices
/_cat/indices/{index}
/_cat/segments
/_cat/segments/{index}
/_cat/count
/_cat/count/{index}
/_cat/recovery
/_cat/recovery/{index}
/_cat/health
/_cat/pending_tasks
/_cat/aliases
/_cat/aliases/{alias}
/_cat/thread_pool
/_cat/thread_pool/{thread_pools}
/_cat/plugins
/_cat/fielddata
/_cat/fielddata/{fields}
/_cat/nodeattrs
/_cat/repositories
/_cat/snapshots/{repository}
/_cat/templates
/_cat/pit_segments
/_cat/pit_segments/{pit_id}
```

## Optional query parameters

The root `_cat` API does not take any parameters, but individual APIs, such as `/_cat/nodes` accept the following query parameters.

Parameter | Description
:--- | :--- |
`v` |  Provides verbose output by adding headers to the columns. It also adds some formatting to help align each of the columns together. All examples in this section include the `v` parameter.
`help` | Lists the default and other available headers for a given operation.
`h`  |  Limits the output to specific headers.
`format` |  The format in which to return the result. Valid values are `json`, `yaml`, `cbor`, and `smile`.
`s` | Sorts the output by the specified columns.

### Query parameter usage examples

You can specify a query parameter to any CAT operation to obtain more specific results.

### Get verbose output

To query aliases and get verbose output that includes all column headings in the response, use the `v` query parameter.

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases?v
-->
{% capture step1_rest %}
GET /_cat/aliases?v
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response provides more details, such as names of each column in the response. 

```
alias index filter routing.index routing.search is_write_index
.kibana .kibana_1 - - - -
sample-alias1 sample-index-1 - - - -
```
Without the verbose parameter, `v`, the response simply returns the alias names:

```
.kibana .kibana_1 - - - -
sample-alias1 sample-index-1 - - - -
```

### Get all available headers

To see all the available headers, use the `help` parameter:

```
GET _cat/<operation_name>?help
```

For example, to see the available headers for the CAT aliases operation, send the following request:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases?help
-->
{% capture step1_rest %}
GET /_cat/aliases?help
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  params = { "help": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the available headers:

```
alias          | a                | alias name
index          | i,idx            | index alias points to
filter         | f,fi             | filter
routing.index  | ri,routingIndex  | index routing
routing.search | rs,routingSearch | search routing
is_write_index | w,isWriteIndex   | write index
```

### Get a subset of headers

To limit the output to a subset of headers, use the `h` parameter:

```
GET _cat/<operation_name>?h=<header_name_1>,<header_name_2>&v
```

For example, to limit aliases to only the alias name and index, send the following request:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases?h=alias,index
-->
{% capture step1_rest %}
GET /_cat/aliases?h=alias,index
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  params = { "h": "alias,index" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the requested information:

```
.kibana .kibana_1
sample-alias1 sample-index-1
```

Typically, for any operation you can find out what headers are available using the `help` parameter, and then use the `h` parameter to limit the output to only the headers that you care about.

### Sort by a header

To sort the output by a header, use the `s` parameter:

```json
GET _cat/<operation_name>?s=<header_name_1>,<header_name_2>
```

For example, to sort aliases by alias and then index, send the following request:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases?s=i,a
-->
{% capture step1_rest %}
GET /_cat/aliases?s=i,a
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  params = { "s": "i,a" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains the requested information:

```
sample-alias2 sample-index-1
sample-alias1 sample-index-2
```

### Retrieve data in JSON format

By default, CAT APIs return data in `text/plain` format.

To retrieve data in JSON format, use the `format=json` parameter:

```json
GET _cat/<operation_name>?format=json
```

For example, to retrieve aliases in JSON format, send the following request:

<!-- spec_insert_start
component: example_code
rest: GET /_cat/aliases?format=json
-->
{% capture step1_rest %}
GET /_cat/aliases?format=json
{% endcapture %}

{% capture step1_python %}


response = client.cat.aliases(
  params = { "format": "json" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains data in JSON format:

```json
[
  {"alias":".kibana","index":".kibana_1","filter":"-","routing.index":"-","routing.search":"-","is_write_index":"-"},
  {"alias":"sample-alias-1","index":"sample-index-1","filter":"-","routing.index":"-","routing.search":"-","is_write_index":"-"}
]
```

Other supported formats are [YAML](https://yaml.org/), [CBOR](https://cbor.io/), and [Smile](https://github.com/FasterXML/smile-format-specification).

## CAT API operations

The following CAT API operations are available.

### Cluster and node information
- [CAT aliases]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-aliases/)
- [CAT allocation]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-allocation/)
- [CAT cluster manager]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-cluster_manager/)
- [CAT health]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-health/)
- [CAT nodes]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-nodes/)
- [CAT node attributes]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-nodeattrs/)
- [CAT pending tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pending-tasks/)
- [CAT plugins]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-plugins/)
- [CAT repositories]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-repositories/)
- [CAT tasks]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-tasks/)
- [CAT templates]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-templates/)
- [CAT thread pool]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-thread-pool/)

### Index and document information
- [CAT count]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-count/)
- [CAT field data]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-field-data/)
- [CAT indices]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-indices/)
- [CAT PIT segments]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-pit-segments/)
- [CAT recovery]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/)
- [CAT segment replication]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-segment-replication/)
- [CAT segments]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-segments/)
- [CAT shards]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/)

### Snapshot information
- [CAT snapshots]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-snapshots/)

If you use the Security plugin, make sure you have the appropriate permissions.
{: .note }
