---
layout: default
title: List APIs
nav_order: 45
has_children: true
redirect_from:
  - /api-reference/list/
---

# List APIs
**Introduced 2.18**
{: .label .label-purple }

The List API retrieves statistics about indexes and shards in a paginated format. This streamlines the task of processing responses that include many indexes.

The List API supports two operations:

- [List indices]({{site.url}}{{site.baseurl}}/api-reference/list/list-indices/)
- [List shards]({{site.url}}{{site.baseurl}}/api-reference/list/list-shards/)

## Shared query parameters

All List API operations support the following optional query parameters.

Parameter | Description
:--- | :--- |
`v` |  Provides verbose output by adding headers to the columns. It also adds some formatting to help align each of the columns. All examples in this section include the `v` parameter.
`help` | Lists the default and other available headers for a given operation.
`h`  |  Limits the output to specific headers.
`format` |  The format in which to return the result. Valid values are `json`, `yaml`, `cbor`, and `smile`.
`s` | Sorts the output by the specified columns.

## Examples

The following examples show how to use the optional query parameters to customize all List API responses.


### Get verbose output

To query indexes and their statistics with a verbose output that includes all column headings in the response, use the `v` query parameter, as shown in the following example.

#### Request

<!-- spec_insert_start
component: example_code
rest: GET /_list/indices?v
-->
{% capture step1_rest %}
GET /_list/indices?v
{% endcapture %}

{% capture step1_python %}


response = client.list.indices(
  params = { "v": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Response

```json
health status index           uuid    pri rep  docs.count  docs.deleted
green  open   .kibana_1 - - - -              
yellow open    sample-index-1 - - - -
next_token null
```


### Get all available headers

To see all the available headers, use the `help` parameter with the following syntax:

```json
GET _list/<operation_name>?help
```
{% include copy-curl.html %}

#### Request

The following example list indices operation returns all the available headers:

<!-- spec_insert_start
component: example_code
rest: GET /_list/indices?help
-->
{% capture step1_rest %}
GET /_list/indices?help
{% endcapture %}

{% capture step1_python %}


response = client.list.indices(
  params = { "help": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Response

The following example displays the indexes and their health status in a table:

```json
health     | h                              | current health status
status     | s                              | open/close status
index      | i,idx                          | index name
uuid       | id,uuid                        | index uuid
pri        | p,shards.primary,shardsPrimary | number of primary shards
rep        | r,shards.replica,shardsReplica | number of replica shards
docs.count | dc,docsCount                   | available docs
```

### Get a subset of headers

To limit the output to a subset of headers, use the `h` parameter with the following syntax:

```json
GET _list/<operation_name>?h=<header_name_1>,<header_name_2>&v
```
{% include copy-curl.html %}

For any operation, you can determine which headers are available by using the `help` parameter and then using the `h` parameter to limit the output to only a subset of headers. 

#### Request

The following example limits the indexes in the response to only the index name and health status headers:

<!-- spec_insert_start
component: example_code
rest: GET /_list/indices?h=health,index
-->
{% capture step1_rest %}
GET /_list/indices?h=health,index
{% endcapture %}

{% capture step1_python %}


response = client.list.indices(
  params = { "h": "health,index" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Response

```json
green  .kibana_1
yellow sample-index-1
next_token null
```


### Sort by a header

To sort the output on a single page by a header, use the `s` parameter with the following syntax:

```json
GET _list/<operation_name>?s=<header_name_1>,<header_name_2>
```
{% include copy-curl.html %}

#### Request

The following example request sorts indexes by index name:

<!-- spec_insert_start
component: example_code
rest: GET /_list/indices?s=h,i
-->
{% capture step1_rest %}
GET /_list/indices?s=h,i
{% endcapture %}

{% capture step1_python %}


response = client.list.indices(
  params = { "s": "h,i" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Response

```json
green sample-index-2
yellow sample-index-1
next_token null
```

### Retrieve data in JSON format

By default, List APIs return data in a `text/plain` format. Other supported formats are [YAML](https://yaml.org/), [CBOR](https://cbor.io/), and [Smile](https://github.com/FasterXML/smile-format-specification).


To retrieve data in the JSON format, use the `format=json` parameter with the following syntax.

If you use the Security plugin, ensure you have the appropriate permissions.
{: .note }

#### Request

```json
GET _list/<operation_name>?help
```
{% include copy-curl.html %}

#### Request

<!-- spec_insert_start
component: example_code
rest: GET /_list/indices?format=json
-->
{% capture step1_rest %}
GET /_list/indices?format=json
{% endcapture %}

{% capture step1_python %}


response = client.list.indices(
  params = { "format": "json" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Response

The response contains data in JSON format:

```json
{
  "next_token": null,
  "indices": [
    {
      "health": "green",
      "status": "-",
      "index": ".kibana_1",
      "uuid": "-",
      "pri": "-",
      "rep": "-",
      "docs.count": "-",
      "docs.deleted": "-",
      "store.size": "-",
      "pri.store.size": "-"
    },
    {
      "health": "yellow",
      "status": "-",
      "index": "sample-index-1",
      "uuid": "-",
      "pri": "-",
      "rep": "-",
      "docs.count": "-",
      "docs.deleted": "-",
      "store.size": "-",
      "pri.store.size": "-"
    }
  ]
}
```

