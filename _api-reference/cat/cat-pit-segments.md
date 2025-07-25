---
layout: default
title: CAT PIT segments
parent: CAT API
nav_order: 46
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-pit-segments/
---

# CAT PIT segments

The CAT point-in-time (PIT) segments operation returns information about one or more PIT segments.

## Endpoints

<!-- spec_insert_start
api: cat.pit_segments
component: endpoints
omit_header: true
-->
```json
GET /_cat/pit_segments
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cat.all_pit_segments
component: endpoints
omit_header: true
-->
```json
GET /_cat/pit_segments/_all
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cat.pit_segments
component: query_parameters
columns: Parameter, Data type, Description, Default
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `bytes` | String | The units used to display byte values. <br> Valid values are: `b`, `kb`, `k`, `mb`, `m`, `gb`, `g`, `tb`, `t`, `pb`, `p` | N/A |
| `format` | String | A short version of the `Accept` header, such as `json` or `yaml`. | N/A |
| `h` | List | A comma-separated list of column names to display. | N/A |
| `help` | Boolean | Returns help information. | `false` |
| `s` | List | A comma-separated list of column names or column aliases to sort by. | N/A |
| `v` | Boolean | Enables verbose mode, which displays column headers. | `false` |

<!-- spec_insert_end -->

## Request body fields

Field | Data type | Description  
:--- | :--- | :---
pit_id | [Base64 encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary/) or an array of binaries | The PIT IDs of the PITs whose segments are to be listed. Required.

## Example request

```json
GET /_cat/pit_segments
{
    "pit_id": [
        "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAEWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA",
        "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAIWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA"
    ]
}
```
{% include copy.html %}

## Example response

```json
index  shard prirep ip            segment generation docs.count docs.deleted  size size.memory committed searchable version compound
index1 0     r      10.212.36.190 _0               0          4            0 3.8kb        1364 false     true       8.8.2   true
index1 1     p      10.212.36.190 _0               0          3            0 3.7kb        1364 false     true       8.8.2   true
index1 2     r      10.212.74.139 _0               0          2            0 3.6kb        1364 false     true       8.8.2   true
```

