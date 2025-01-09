---
layout: default
title: CAT field data
parent: CAT API
nav_order: 15
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-field-data/
---

# CAT Field Data
**Introduced 1.0**
{: .label .label-purple }

The CAT Field Data operation lists the memory size used by each field per node.

<!-- spec_insert_start
api: cat.fielddata
component: endpoints
-->
## Endpoints

```json
GET /_cat/fielddata
GET /_cat/fielddata/{fields}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: cat.fielddata
component: query_parameters
columns: Parameter,Type,Description,Default
include_deprecated: false
-->
## Query parameters


Parameter | Type | Description | Default
:--- | :--- | :--- | :---
`bytes` | String | The units used to display byte values. | 
`format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | 
`h` | List | A comma-separated list of column names to display. | 
`help` | Boolean | Return help information. | `false`
`s` | List | A comma-separated list of column names or column aliases to sort by. | 
`v` | Boolean | Enables verbose mode, which displays column headers. | `false`
<!-- spec_insert_end -->

## Example requests

```json
GET _cat/fielddata?v
```
{% include copy-curl.html %}

To limit the information to a specific field, add the field name after your query:

```json
GET _cat/fielddata/<field_name>?v
```
{% include copy-curl.html %}

If you want to get information for more than one field, separate the field names with commas:

```json
GET _cat/fielddata/field_name_1,field_name_2,field_name_3
```
{% include copy-curl.html %}

## Example response

The following response shows the memory size for all fields as 284 bytes:

```json
id                     host       ip         node       field size
1vo54NuxSxOrbPEYdkSF0w 172.18.0.4 172.18.0.4 odfe-node1 _id   284b
ZaIkkUd4TEiAihqJGkp5CA 172.18.0.3 172.18.0.3 odfe-node2 _id   284b
```
