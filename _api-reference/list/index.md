---
layout: default
title: LIST API
nav_order: 10
has_children: true
redirect_from:
  - /opensearch/listapis/
  - /opensearch/rest-api/list/index/
---

# LIST API
**Introduced 2.18**
{: .label .label-purple }
You can get essential statistics about your cluster in a paginated fashion making it easier to consume large responses, with an easy-to-understand, tabular format using the compact and aligned text (CAT) along with other response formats. 

Using the LIST API, you can get answers to questions like stats of an index/indices, shards in a paginated manner.

## Example

To see the available operations in the LIST API, use the following command:

```
GET _list
```
{% include copy-curl.html %}

The response is a list of operations:

```
/_list/indices
/_list/indices/{index}
/_list/shards
/_list/shards/{index}
```

## Optional query parameters

The root `_list` API does not take any parameters, but individual APIs, such as `/_list/indices` accept the following query parameters.

Parameter | Description
:--- | :--- |
`v` |  Provides verbose output by adding headers to the columns. It also adds some formatting to help align each of the columns together. All examples in this section include the `v` parameter.
`help` | Lists the default and other available headers for a given operation.
`h`  |  Limits the output to specific headers.
`format` |  The format in which to return the result. Valid values are `json`, `yaml`, `cbor`, and `smile`.
`s` | Sorts the output by the specified columns.

### Query parameter usage examples

You can specify a query parameter to any LIST operation to obtain more specific results. The results would be displayed in pages, with `next_token` being present in the response as a last row to be used to fetch next set of pages, if any.

### Get verbose output

To query indices and their stats with verbose output that includes all column headings in the response, use the `v` query parameter.

```json
GET _list/indices?v
```
{% include copy-curl.html %}

The response provides more details, such as names of each column in the response. 

```
health status index           uuid    pri rep  docs.count  docs.deleted
green  open   .kibana_1 - - - -              
yellow open    sample-index-1 - - - -
next_token null
```
Without the verbose parameter, `v`, the response simply returns the indices and corresponding stats:

```
green  open   .kibana_1 - - - -              
yellow open    sample-index-1 - - - -
next_token null
```

### Get all available headers

To see all the available headers, use the `help` parameter:

```
GET _list/<operation_name>?help
```

For example, to see the available headers for the LIST indices operation, send the following request:

```json
GET _list/indices?help
```
{% include copy-curl.html %}

The response contains the available headers:

```
health     | h                              | current health status
status     | s                              | open/close status
index      | i,idx                          | index name
uuid       | id,uuid                        | index uuid
pri        | p,shards.primary,shardsPrimary | number of primary shards
rep        | r,shards.replica,shardsReplica | number of replica shards
docs.count | dc,docsCount                   | available docs
```

### Get a subset of headers

To limit the output to a subset of headers, use the `h` parameter:

```
GET _list/<operation_name>?h=<header_name_1>,<header_name_2>&v
```

For example, to limit indices to only the index name and health, send the following request:

```json
GET _list/indices?h=health,index
```
{% include copy-curl.html %}

The response contains the requested information:

```
green  .kibana_1
yellow sample-index-1
next_token null
```

Typically, for any operation you can find out what headers are available using the `help` parameter, and then use the `h` parameter to limit the output to only the headers that you care about.

### Sort by a header

To sort the output in a single page by a header, use the `s` parameter:

```json
GET _list/<operation_name>?s=<header_name_1>,<header_name_2>
```

For example, to sort indices by health and then by index name, send the following request:

```json
GET _list/indices?s=h,i
```
{% include copy-curl.html %}

The response contains the requested information:

```
green sample-index-2
yellow sample-index-1
next_token null
```

### Retrieve data in JSON format

By default, LIST APIs return data in `text/plain` format.

To retrieve data in JSON format, use the `format=json` parameter:

```json
GET _list/<operation_name>?format=json
```

For example, to retrieve indices in JSON format, send the following request:

```json
GET _list/indices?format=json
```
{% include copy-curl.html %}

The response contains data in JSON format:

```json
{"next_token":null,"indices":[{"health":"green","status":"-","index":".kibana_1","uuid":"-","pri":"-","rep":"-","docs.count":"-","docs.deleted":"-","store.size":"-","pri.store.size":"-"},{"health":"yellow","status":"-","index":"sample-index-1","uuid":"-","pri":"-","rep":"-","docs.count":"-","docs.deleted":"-","store.size":"-","pri.store.size":"-"}]}
```

Other supported formats are [YAML](https://yaml.org/), [CBOR](https://cbor.io/), and [Smile](https://github.com/FasterXML/smile-format-specification).

If you use the Security plugin, make sure you have the appropriate permissions.
{: .note }
