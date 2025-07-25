---
layout: default
title: Segment
parent: Index APIs
nav_order: 64
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/segment/
---

# Segment
Introduced 1.0
{: .label .label-purple }

The Segment API provides details about the Lucene segments within index shards as well as information about the backing indexes of data streams.


## Endpoints

```json
GET /<index>/_segments
GET /_segments
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description 
:--- | :--- | :--- 
`<index>` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`ignore_unavailable` | Boolean | When `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the force merge operation encounters missing or closed indexes. Default is `false`.
`verbose` | Boolean | When `true`, provides information about Lucene's memory usage. Default is `false`.


## Example requests

The following example requests show you how to use the Segment API.

### Specific data stream or index

```json
GET /index1/_segments
```
{% include copy-curl.html %}

### Several data streams and indexes

```json
GET /index1,index2/_segments
```
{% include copy-curl.html %}

### All data streams and indexes in a cluster

```json
GET /_segments
```
{% include copy-curl.html %}

## Example response

```json
{
  "_shards": ...
  "indices": {
    "test": {
      "shards": {
        "0": [
          {
            "routing": {
              "state": "STARTED",
              "primary": true,
              "node": "zDC_RorJQCao9xf9pg3Fvw"
            },
            "num_committed_segments": 0,
            "num_search_segments": 1,
            "segments": {
              "_0": {
                "generation": 0,
                "num_docs": 1,
                "deleted_docs": 0,
                "size_in_bytes": 3800,
                "memory_in_bytes": 1410,
                "committed": false,
                "search": true,
                "version": "7.0.0",
                "compound": true,
                "attributes": {
                }
              }
            }
          }
        ]
      }
    }
  }
}
```

## Response body fields

Parameter | Data type | Description 
 :--- | :--- | :--- 
`<segment>` | String | The name of the segment used to create internal file names in the shard directory. 
`generation` | Integer | The generation number, such as `0`, incremented for each written segment and used to name the segment. 
`num_docs` | Integer | The number of documents, obtained from Lucene. Nested documents are counted separately from their parents. Deleted documents, as well as recently indexed documents that are not yet assigned to a segment, are excluded.
`deleted_docs` | Integer | The number of deleted documents, obtained from Lucene, which may not match the actual number of delete operations performed. Recently deleted documents that are not yet assigned to a segment are excluded. Deleted documents are automatically merged when appropriate. OpenSearch will occasionally delete extra documents in order to track recent shard operations.
`size_in_bytes` | Integer | The amount of disk space used by the segment, for example, `50kb`. 
`memory_in_bytes` | Integer | The amount of segment data, measured in bytes, that is kept in memory to facilitate efficient search operations, such as `1264`. A value of `-1` indicates that OpenSearch was unable to compute this number. 
`committed` | Boolean | When `true`, the segments are synced to disk. Segments synced to disk can survive a hard reboot. If `false`, then uncommitted segment data is stored in the transaction log as well so that changes can be replayed at the next startup. 
`search` | Boolean | When `true`, segment search is enabled. When `false`, the segment may have already been written to disk and require a refresh in order to be searchable.
`version` | String | The Lucene version used to write the segment. 
`compound` | Boolean | When `true`, indicates that Lucene merged all segment files into one file in order to save any file descriptions.
`attributes` | Object | Shows if high compression was enabled. 

