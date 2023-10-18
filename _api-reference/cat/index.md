---
layout: default
title: CAT API
nav_order: 10
has_children: true
redirect_from:
  - /opensearch/catapis/
  - /opensearch/rest-api/cat/index/
---

# CAT API
**Introduced 1.0**
{: .label .label-purple }
You can get essential statistics about your cluster in an easy-to-understand, tabular format using the compact and aligned text (CAT) API. The CAT API is a human-readable interface that returns plain text instead of traditional JSON.

Using the CAT API, you can answer questions like which node is the elected master, what state is the cluster in, how many documents are in each index, and so on.

## Example

To see the available operations in the CAT API, use the following command:

```
GET _cat
```
{% include copy-curl.html %}

## Optional query parameters

You can use the following query parameters with any CAT API to filter your results.

Parameter | Description
:--- | :--- |
`v` |  Provides verbose output by adding headers to the columns. It also adds some formatting to help align each of the columns together. All examples in this section include the `v` parameter.
`help` | Lists the default and other available headers for a given operation.
`h`  |  Limits the output to specific headers.
`format` |  Returns the result in JSON, YAML, or CBOR formats.
`sort` | Sorts the output by the specified columns.

### Query parameter usage examples

You can specify a query parameter to any CAT operation to obtain more specific results.

### Get verbose output

To query aliases and get verbose output that includes all column headings in the response, use the `v` query parameter.

```json
GET _cat/aliases?v
```
{% include copy-curl.html %}

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

### Get a subset of headers

To limit the output to a subset of headers, use the `h` parameter:

```
GET _cat/<operation_name>?h=<header_name_1>,<header_name_2>&v
```

Typically, for any operation you can find out what headers are available using the `help` parameter, and then use the `h` parameter to limit the output to only the headers that you care about.

If you use the Security plugin, make sure you have the appropriate permissions.
{: .note }
