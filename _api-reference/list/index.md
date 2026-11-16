---
layout: default
title: List APIs
nav_order: 20
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
`v` |  Provides verbose output by adding headers to the columns.
`help` | Lists the default and other available headers for a given operation.
`h`  |  Limits the output to specific headers.
`format` |  The format in which to return the result. Valid values are `json`, `yaml`, `cbor`, and `smile`.
`s` | Sorts the output by the specified columns.
`next_token` | The token for fetching the next page of results. Each paginated response ends with a `next_token` value. Pass this value in the next request to retrieve the next page. When `next_token` is `null`, all results have been returned.
`size` | The maximum number of entries to return on a single page.
`sort` | The order in which entries are returned, based on index creation time. Valid values are `asc` (oldest first) and `desc` (most recently created first). Default is `asc`.

The default and allowed values of `size` differ by operation. For more information, see [List indices]({{site.url}}{{site.baseurl}}/api-reference/list/list-indices/) and [List shards]({{site.url}}{{site.baseurl}}/api-reference/list/list-shards/).

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
health status index          uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   sample-index-1 L4tj1plyQLCjGegvdEI16A   1   0          3            0      4.7kb          4.7kb
yellow open   sample-index-2 n9sq3RtJR2mMmTqJF2Xh6w   1   1          5            0      4.8kb          4.8kb
next_token null
```


### Get all available headers

To see all the available headers, use the `help` parameter with the following syntax:

```json
GET _list/{operation_name}?help
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

The response lists each available header, followed by its aliases and a description. The following example response is truncated:

```json
health                                 | h                                                    | current health status
status                                 | s                                                    | open/close status
index                                  | i,idx                                                | index name
uuid                                   | id,uuid                                              | index uuid
pri                                    | p,shards.primary,shardsPrimary                       | number of primary shards
rep                                    | r,shards.replica,shardsReplica                       | number of replica shards
docs.count                             | dc,docsCount                                         | available docs
docs.deleted                           | dd,docsDeleted                                       | deleted docs
creation.date                          | cd                                                   | index creation date (millisecond value)
creation.date.string                   | cds                                                  | index creation date (as string)
store.size                             | ss,storeSize                                         | store size of primaries & replicas
pri.store.size                         |                                                      | store size of primaries
```

### Get a subset of headers

To limit the output to a subset of headers, use the `h` parameter with the following syntax:

```json
GET _list/{operation_name}?h={header_name_1},{header_name_2}&v
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

#### Response

```json
green  sample-index-1
yellow sample-index-2
next_token null
```


### Sort by a header

To sort the output on a single page by a header, use the `s` parameter with the following syntax:

```json
GET _list/{operation_name}?s={header_name_1},{header_name_2}
```
{% include copy-curl.html %}

#### Request

The following example request sorts indexes by health status and then by index name and limits the output to the health status and index name headers:

<!-- spec_insert_start
component: example_code
rest: GET /_list/indices?s=h,i&h=health,index
-->
{% capture step1_rest %}
GET /_list/indices?s=h,i&h=health,index
{% endcapture %}

{% capture step1_python %}


response = client.list.indices(
  params = { "s": "h,i", "h": "health,index" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Response

```json
green  sample-index-1
yellow sample-index-2
next_token null
```

### Retrieve data in JSON format

By default, List APIs return data in a `text/plain` format. Other supported formats are [YAML](https://yaml.org/), [CBOR](https://cbor.io/), and [Smile](https://github.com/FasterXML/smile-format-specification).


To retrieve data in the JSON format, use the `format=json` parameter with the following syntax:

```json
GET _list/{operation_name}?format=json
```
{% include copy-curl.html %}

If you use the Security plugin, ensure you have the appropriate permissions.
{: .note }

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

#### Response

The response contains data in JSON format:

```json
{
  "next_token": null,
  "indices": [
    {
      "health": "green",
      "status": "open",
      "index": "sample-index-1",
      "uuid": "L4tj1plyQLCjGegvdEI16A",
      "pri": "1",
      "rep": "0",
      "docs.count": "3",
      "docs.deleted": "0",
      "store.size": "4.7kb",
      "pri.store.size": "4.7kb"
    },
    {
      "health": "yellow",
      "status": "open",
      "index": "sample-index-2",
      "uuid": "n9sq3RtJR2mMmTqJF2Xh6w",
      "pri": "1",
      "rep": "1",
      "docs.count": "5",
      "docs.deleted": "0",
      "store.size": "4.8kb",
      "pri.store.size": "4.8kb"
    }
  ]
}
```
