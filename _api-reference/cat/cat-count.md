---
layout: default
title: CAT count
parent: CAT APIs
nav_order: 10
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-count/

---

# CAT Count API
**Introduced 1.0**
{: .label .label-purple }

The CAT count operation lists the number of documents in your cluster.


<!-- spec_insert_start
api: cat.count
component: endpoints
-->
## Endpoints
```json
GET /_cat/count
GET /_cat/count/{index}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.count
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Example requests

```json
GET _cat/count?v
```
{% include copy-curl.html %}

To see the number of documents in a specific index or alias, add the index or alias name after your query:

```json
GET _cat/count/<index_or_alias>?v
```
{% include copy-curl.html %}

If you want to get information for more than one index or alias, separate the index or alias names with commas:

```json
GET _cat/count/index_or_alias_1,index_or_alias_2,index_or_alias_3
```
{% include copy-curl.html %}

## Example response

The following response shows the overall document count as 1625:

```json
epoch      | timestamp | count
1624237738 | 01:08:58  | 1625
```
