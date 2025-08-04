---
layout: default
title: Point in Time
nav_order: 25
has_children: false
parent: Search APIs
grand_parent: Search options
redirect_from:
  - /opensearch/point-in-time-api/
  - /search-plugins/point-in-time-api/
  - /search-plugins/searching-data/point-in-time-api/
---

# Point In Time API

Use the [Point in Time (PIT)]({{site.url}}{{site.baseurl}}/opensearch/point-in-time/) APIs to manage PITs. 

---

#### Table of contents
- TOC
{:toc}

---

## Create a PIT
Introduced 2.4
{: .label .label-purple }

Creates a PIT. The `keep_alive` query parameter is required; it specifies how long to keep a PIT.

### Endpoints

```json
POST /<target_indexes>/_search/point_in_time?keep_alive=1h&routing=&expand_wildcards=&preference= 
```

### Path parameters

Parameter | Data type | Description 
:--- | :--- | :---
`target_indexes` | String | The name(s) of the target index(es) for the PIT. May contain a comma-separated list or a wildcard index pattern.

### Query parameters

Parameter | Data type | Description
:--- | :--- | :---
`keep_alive` | Time |  The amount of time to keep the PIT. Every time you access a PIT by using the Search API, the PIT lifetime is extended by the amount of time equal to the `keep_alive` parameter. Required.
`preference` | String | The node or shard used to perform the search. Optional. Default is `random`.
`routing` | String | Specifies to route search requests to a specific shard. Optional. Default is the document's `_id`. 
`expand_wildcards` | String | The type of index that can match the wildcard pattern. Supports comma-separated values. Valid values are the following:<br>- `all`: Match any index or data stream, including hidden ones. <br>- `open`: Match open, non-hidden indexes or non-hidden data streams. <br>- `closed`: Match closed, non-hidden indexes or non-hidden data streams. <br>- `hidden`: Match hidden indexes or data streams. Must be combined with `open`, `closed` or both `open` and `closed`.<br>- `none`: No wildcard patterns are accepted.<br> Optional. Default is `open`.
`allow_partial_pit_creation` | Boolean | Specifies whether to create a PIT with partial failures. Optional. Default is `true`.

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

### Response body fields

Field | Data type | Description 
:--- | :--- | :---  
`pit_id` | [Base64-encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary/) | The PIT ID.
`creation_time` | long | The time at which the PIT was created, in milliseconds since the epoch. 

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

### Response body fields

Field | Data type | Description 
:--- | :--- | :---  
`pits` | Array of JSON objects | The list of all PITs. 

Each PIT object contains the following fields.

Field | Data type | Description 
:--- | :--- | :---  
`pit_id` | [Base64-encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary/) | The PIT ID.
`creation_time` | long | The time at which the PIT was created, in milliseconds since the epoch. 
`keep_alive` | long |  The amount of time to keep the PIT, in milliseconds.

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

### Request body fields

Field | Data type | Description  
:--- | :--- | :---
`pit_id` | [Base64-encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary/) or an array of binaries | The PIT IDs of the PITs to be deleted. Required.

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

### Response body fields

Field | Data type | Description  
:--- | :--- | :---
`successful` | Boolean | Whether the delete operation was successful.
`pit_id` | [Base64-encoded binary]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/binary/)  | The PIT ID of the PIT to be deleted.

## Security model

This section describes the permissions needed to use PIT API operations if you are running OpenSearch with the Security plugin enabled.

You can access all PIT API operations using the `point_in_time_full_access` role. If this role doesn't meet your needs, mix and match individual PIT permissions to suit your use case. Each action corresponds to an operation in the REST API. For example, the `indices:data/read/point_in_time/create` permission lets you create a PIT. The following are the possible permissions:

- `indices:data/read/point_in_time/create` &ndash; Create API
- `indices:data/read/point_in_time/delete` &ndash; Delete API
- `indices:data/read/point_in_time/readall` &ndash; List All PITs API
- `indices:data/read/search` &ndash; Search API
- `indices:monitor/point_in_time/segments` &ndash; PIT Segments API

For `all` API operations, such as list all and delete all, the user needs the all indexes (*) permission. For API operations such as search, create PIT, or delete list, the user only needs individual index permissions.

The PIT IDs always contain the underlying (resolved) indexes when saved. The following sections describe the required permissions for aliases and data streams.

### Alias permissions

For aliases, users must have either index **or** alias permissions for any PIT operation.

### Data stream permissions

For data streams, users must have both the data stream **and** the data stream's backing index permissions for any PIT operation. For example, the user must have permissions for the `data-stream-11` data stream and for its backing index `.ds-my-data-stream11-000001`.

If users have the data stream permissions only, they will be able to create a PIT, but they will not be able to use the PIT ID for other operations, such as search, without the backing index permissions.