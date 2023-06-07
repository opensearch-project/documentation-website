---
layout: default
title: Point in Time API
nav_order: 59
has_children: false
parent: Point in Time
redirect_from:
  - /opensearch/point-in-time-api/
---

# Point in Time API

Use the [Point in Time (PIT)]({{site.url}}{{site.baseurl}}/opensearch/point-in-time/) API to manage PITs. 

---

#### Table of contents
- TOC
{:toc}

---

## Create a PIT
Introduced 2.4
{: .label .label-purple }

Creates a PIT. The `keep_alive` query parameter is required; it specifies how long to keep a PIT.

### Path and HTTP methods

```json
POST /<target_indexes>/_search/point_in_time?keep_alive=1h&routing=&expand_wildcards=&preference= 
```

### Path parameters

Parameter | Data type | Description 
:--- | :--- | :---
target_indexes | String | The name(s) of the target index(es) for the PIT. May contain a comma-separated list or a wildcard index pattern.

### Query parameters

Parameter | Data type | Description
:--- | :--- | :---
keep_alive | Time |  The amount of time to keep the PIT. Every time you access a PIT by using the Search API, the PIT lifetime is extended by the amount of time equal to the `keep_alive` parameter. Required.
preference | String | The node or the shard used to perform the search. Optional. Default is random.
routing | String | Specifies to route search requests to a specific shard. Optional. Default is the document's `_id`. 
expand_wildcards | String | The type of index that can match the wildcard pattern. Supports comma-separated values. Valid values are the following:<br>- `all`: Match any index or data stream, including hidden ones. <br>- `open`: Match open, non-hidden indexes or non-hidden data streams. <br>- `closed`: Match closed, non-hidden indexes or non-hidden data streams. <br>- `hidden`: Match hidden indexes or data streams. Must be combined with `open`, `closed` or both `open` and `closed`.<br>- `none`: No wildcard patterns are accepted.<br> Optional. Default is `open`.
allow_partial_pit_creation | Boolean | Specifies whether to create a PIT with partial failures. Optional. Default is `true`.

#### Example request

```json
POST /my-index-1/_search/point_in_time?keep_alive=100m
```

#### Example response

```json
{
    "pit_id": "o463QQEPbXktaW5kZXgtMDAwMDAxFnNOWU43ckt3U3IyaFVpbGE1UWEtMncAFjFyeXBsRGJmVFM2RTB6eVg1aVVqQncAAAAAAAAAAAIWcDVrM3ZIX0pRNS1XejE5YXRPRFhzUQEWc05ZTjdyS3dTcjJoVWlsYTVRYS0ydwAA",
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "creation_time": 1658146050064
}
```

### Response fields

Field | Data type | Description 
:--- | :--- | :---  
pit_id | [Base64 encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary) | The PIT ID.
creation_time | long | The time the PIT was created, in milliseconds since the epoch. 

## Extend a PIT time

You can extend a PIT time by providing a `keep_alive` parameter in the `pit` object when you perform a search:

```json
GET /_search
{
  "size": 10000,
  "query": {
    "match" : {
      "user.id" : "elkbee"
    }
  },
  "pit": {
    "id":  "46ToAwMDaWR5BXV1aWQyKwZub2RlXzMAAAAAAAAAACoBYwADaWR4BXV1aWQxAgZub2RlXzEAAAAAAAAAAAEBYQADaWR5BXV1aWQyKgZub2RlXzIAAAAAAAAAAAwBYgACBXV1aWQyAAAFdXVpZDEAAQltYXRjaF9hbGw_gAAAAA==", 
    "keep_alive": "100m"
  },
  "sort": [ 
    {"@timestamp": {"order": "asc"}}
  ],
  "search_after": [  
    "2021-05-20T05:30:04.832Z"
  ]
}
```

The `keep_alive` parameter in a search request is optional. It specifies the amount by which to extend the time to keep a PIT.
{: .note}

## List all PITs
Introduced 2.4
{: .label .label-purple }

Returns all PITs in the OpenSearch cluster.

### Cross-cluster behavior

The List All PITs API returns only local PITs or mixed PITs (PITs created in both local and remote clusters). It does not return fully remote PITs. 

#### Example request

```json
GET /_search/point_in_time/_all
```

#### Example response

```json
{
    "pits": [
        {
            "pit_id": "o463QQEPbXktaW5kZXgtMDAwMDAxFnNOWU43ckt3U3IyaFVpbGE1UWEtMncAFjFyeXBsRGJmVFM2RTB6eVg1aVVqQncAAAAAAAAAAAEWcDVrM3ZIX0pRNS1XejE5YXRPRFhzUQEWc05ZTjdyS3dTcjJoVWlsYTVRYS0ydwAA",
            "creation_time": 1658146048666,
            "keep_alive": 6000000
        },
        {
            "pit_id": "o463QQEPbXktaW5kZXgtMDAwMDAxFnNOWU43ckt3U3IyaFVpbGE1UWEtMncAFjFyeXBsRGJmVFM2RTB6eVg1aVVqQncAAAAAAAAAAAIWcDVrM3ZIX0pRNS1XejE5YXRPRFhzUQEWc05ZTjdyS3dTcjJoVWlsYTVRYS0ydwAA",
            "creation_time": 1658146050064,
            "keep_alive": 6000000
        }
    ]
}
```

### Response fields

Field | Data type | Description 
:--- | :--- | :---  
pits | Array of JSON objects | The list of all PITs. 

Each PIT object contains the following fields.

Field | Data type | Description 
:--- | :--- | :---  
pit_id | [Base64 encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary) | The PIT ID.
creation_time | long | The time the PIT was created, in milliseconds since the epoch. 
keep_alive | long |  The amount of time to keep the PIT, in milliseconds.

## Delete PITs
Introduced 2.4
{: .label .label-purple }

Deletes one, several, or all PITs. PITs are automatically deleted when the `keep_alive` time period elapses. However, to deallocate resources, you can delete a PIT using the Delete PIT API. The Delete PIT API supports deleting a list of PITs by ID or deleting all PITs at once.

### Cross-cluster behavior

The Delete PITs by ID API fully supports deleting cross-cluster PITs. 

The Delete All PITs API deletes only local PITs or mixed PITs (PITs created in both local and remote clusters). It does not delete fully remote PITs. 

#### Example request: Delete all PITs

```json
DELETE /_search/point_in_time/_all
```

If you want to delete one or several PITs, specify their PIT IDs in the request body.

### Request fields

Field | Data type | Description  
:--- | :--- | :---
pit_id | [Base64 encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary) or an array of binaries | The PIT IDs of the PITs to be deleted. Required.

#### Example request: Delete PITs by ID

```json
DELETE /_search/point_in_time

{
    "pit_id": [
        "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAEWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA",
        "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAIWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA"
    ]
}
```

#### Example response

For each PIT, the response contains a JSON object with a PIT ID and a `successful` field that specifies whether the deletion was successful. Partial failures are treated as failures. 

```json
{
    "pits": [
        {
            "successful": true,
            "pit_id": "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAEWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA"
        },
        {
            "successful": false,
            "pit_id": "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAIWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA"
        }
    ]
}
```

### Response fields

Field | Data type | Description  
:--- | :--- | :---
successful | Boolean | Whether the delete operation was successful.
pit_id | [Base64 encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary)  | The PIT ID of the PIT to be deleted.

## PIT segments
Introduced 2.4
{: .label .label-purple }

Similarly to the [CAT Segments API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-segments), the PIT Segments API provides low-level information about the disk utilization of a PIT by describing its Lucene segments. The PIT Segments API supports listing segment information of a specific PIT by ID or of all PITs at once.

#### Example request: PIT segments of all PITs

```json
GET /_cat/pit_segments/_all
```

If you want to list segments for one or several PITs, specify their PIT IDs in the request body.

### Request fields

Field | Data type | Description  
:--- | :--- | :---
pit_id | [Base64 encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary) or an array of binaries | The PIT IDs of the PITs whose segments are to be listed. Required.

#### Example request: PIT segments of PITs by ID

```json
GET /_cat/pit_segments

{
    "pit_id": [
        "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAEWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA",
        "o463QQEPbXktaW5kZXgtMDAwMDAxFkhGN09fMVlPUkVPLXh6MUExZ1hpaEEAFjBGbmVEZHdGU1EtaFhhUFc4ZkR5cWcAAAAAAAAAAAIWaXBPNVJtZEhTZDZXTWFFR05waXdWZwEWSEY3T18xWU9SRU8teHoxQTFnWGloQQAA"
    ]
}
```

#### Example response

```json
index  shard prirep ip            segment generation docs.count docs.deleted  size size.memory committed searchable version compound
index1 0     r      10.212.36.190 _0               0          4            0 3.8kb        1364 false     true       8.8.2   true
index1 1     p      10.212.36.190 _0               0          3            0 3.7kb        1364 false     true       8.8.2   true
index1 2     r      10.212.74.139 _0               0          2            0 3.6kb        1364 false     true       8.8.2   true
```

## PIT settings

You can specify the following settings for a PIT.

Setting | Description | Default 
:--- | :--- | :---
point_in_time.max_keep_alive | A cluster-level setting that specifies the maximum value for the `keep_alive` parameter. | 24h
search.max_open_pit_context | A node-level setting that specifies the maximum number of open PIT contexts for the node. | 300