---
layout: default
title: cat aliases
parent: CAT
grand_parent: REST API reference
nav_order: 1
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-aliases/
---

# cat aliases
Introduced 1.0
{: .label .label-purple }

The cat aliases operation lists the mapping of aliases to indices, plus routing and filtering information.

## Example

```json
GET _cat/aliases?v
```

To limit the information to a specific alias, add the alias name after your query:

```json
GET _cat/aliases/<alias>?v
```

If you want to get information for more than one alias, separate the alias names with commas:

```json
GET _cat/aliases/alias1,alias2,alias3
```

## Path and HTTP methods

```
GET _cat/aliases/<alias>
GET _cat/aliases
```


## URL parameters

All cat aliases URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
expand_wildcards | Enum | Expands wildcard expressions to concrete indices. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.

## Response

The following response shows that `alias1` refers to a `movies` index and has a configured filter:

```json
alias   | index     | filter  | routing.index | routing.search  | is_write_index
alias1  | movies    |   *     |      -        |       -         |      -
.kibana | .kibana_1 |   -     |      -        |       -         |      -
```

To learn more about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias).
