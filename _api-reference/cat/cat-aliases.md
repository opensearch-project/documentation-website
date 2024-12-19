---
layout: default
title: CAT aliases
parent: CAT API
redirect_from:
- /opensearch/rest-api/cat/cat-aliases/

nav_order: 1
has_children: false
---

# CAT aliases
**Introduced 1.0**
{: .label .label-purple }

The CAT aliases operation lists the mapping of aliases to indexes, plus routing and filtering information.



## Endpoints

```json
GET /_cat/aliases
GET /_cat/aliases/{name}
```


## Query parameters
Parameter | Type | Description
:--- | :--- | :---
`expand_wildcards` | String / String / String / String / List | Whether to expand wildcard expression to concrete indexes that are open, closed or both.
`format` | String | A short version of the Accept header (for example, `json`, `yaml`).
`h` | List | Comma-separated list of column names to display.
`help` | Boolean | Return help information.
`local` | Boolean | Return local information, do not retrieve the state from cluster-manager node.
`s` | List | Comma-separated list of column names or column aliases to sort by.
`v` | Boolean | Verbose mode. Display column headers.
<!-- spec_insert_end -->

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
