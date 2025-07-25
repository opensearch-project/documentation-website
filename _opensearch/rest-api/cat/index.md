---
layout: default
title: CAT
parent: REST API reference
nav_order: 100
has_children: true
redirect_from:
  - /opensearch/catapis/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/index/
---

# cat API

You can get essential statistics about your cluster in an easy-to-understand, tabular format using the compact and aligned text (CAT) API. The cat API is a human-readable interface that returns plain text instead of traditional JSON.

Using the cat API, you can answer questions like which node is the elected master, what state is the cluster in, how many documents are in each index, and so on.

## Example

To see the available operations in the cat API, use the following command:

```
GET _cat
```

## Common URL parameters

You can use the following string parameters with your query.

Parameter | Description
:--- | :--- |
`?v` |  Makes the output more verbose by adding headers to the columns. It also adds some formatting to help align each of the columns together. All examples in this section include the `v` parameter.
`?help` | Lists the default and other available headers for a given operation.
`?h`  |  Limits the output to specific headers.
`?format` |  Outputs the result in JSON, YAML, or CBOR formats.
`?sort` | Sorts the output by the specified columns.

To see what each column represents, use the `?v` parameter:

```
GET _cat/<operation_name>?v
```

To see all the available headers, use the `?help` parameter:

```
GET _cat/<operation_name>?help
```

To limit the output to a subset of headers, use the `?h` parameter:

```
GET _cat/<operation_name>?h=<header_name_1>,<header_name_2>&v
```

Typically, for any operation you can find out what headers are available using the `?help` parameter, and then use the `?h` parameter to limit the output to only the headers that you care about.

If you use the security plugin, make sure you have the appropriate permissions.
{: .note }
