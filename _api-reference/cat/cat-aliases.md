---
layout: default
title: CAT aliases
parent: CAT API
redirect_from:
- /opensearch/rest-api/cat/cat-aliases/

nav_order: 1
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-aliases/
---

# CAT aliases
**Introduced 1.0**
{: .label .label-purple }

The CAT aliases operation lists the mapping of aliases to indexes, plus routing and filtering information.


## Path and HTTP methods

```json
GET _cat/aliases/<alias>
GET _cat/aliases
```
{% include copy-curl.html %}

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
expand_wildcards | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.

## Example requests

```json
GET _cat/aliases?v
```
{% include copy-curl.html %}

To limit the information to a specific alias, add the alias name after your query:

```json
GET _cat/aliases/<alias>?v
```
{% include copy-curl.html %}

If you want to get information for more than one alias, separate the alias names with commas:

```json
GET _cat/aliases/alias1,alias2,alias3
```
{% include copy-curl.html %}

## Example response

The following response shows that `alias1` refers to a `movies` index and has a configured filter:

```json
alias   | index     | filter  | routing.index | routing.search  | is_write_index
alias1  | movies    |   *     |      -        |       -         |      -
.opensearch-dashboards | .opensearch-dashboards_1 |   -     |      -        |       -         |      -
```

To learn more about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias).
