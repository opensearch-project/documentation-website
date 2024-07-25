---
layout: default
title: Segment
parent: Index APIs
nav_order: 64
---

# Segment
Introduced 1.0
{: .label .label-purple }

The Segment API provides details about the Lucene segments within index shards, as well as information about the backing indexes of data streams.


## Path and HTTP methods

```
GET /<index-name>/_segments
GET /_segments
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description 
:--- | :--- | :--- 
`<index>` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

The Segments API supports the following optional query parameters:

Parameter | Data type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
`allow_partial_search_results` | Boolean | Whether to return partial results if the request runs into an error or times out. Default is `true`.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`ignore_unavailable` | Boolean | When `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the force merge operation encounters missing or closed indexes. Default is `false`.
`verbose` | Boolean | When `true`, gives information about Lucene's memory usage. Default is `false`.

## Response body

Parameter | Data type | Description 
 :--- | :--- | :--- 
`<segment>` | String | The name of the segment made during segment creation and used to create internal file names inside of the shard directory. 
`generation` | Integer | The generation number, such as `0` incremented for each segment written and used this number to derive the segment name. 
`num_docs` | Integer | The number of documents as reported by Lucene. This setting counts nested documents separately from their parents, and excludes deleted documents and documents that were indexed recently and do not yet belong to a segment. 
`deleted_docs` | Integer | The number of deleted documents as reported by Lucene, which does not necessarily match the number of delete operations performed. The count excludes documents that were deleted recently and do not yet belong to a segment. Deleted documents are cleaned up by the automatic merge process when it makes sense to do so. OpenSearch will occasionally delete extra documents to internally track the recent history of operations on a shard. 
`size_in_bytes` | Integer | Disk space used by the segment, such as `50kb`. 
`memory_in_bytes` | Integer | The amount of segment data, measured in bytes, that is kept in memory to facilitate efficient search operations, such as `1264`. A value of `-1` indicates that OpenSearch was unable to compute this number. 
`committed` | Boolean | When `true`, the segments are synced to disk. Segments that are synced to disk can survive a hard reboot. If `false`, the data from uncommitted segments is also stored in the transaction log so that OpenSearch can replay the changes on the next start. 
`search` | Boolean | When `true`, the segment is searchable. Otherwise, the segment will likely be written to disk. Any segments written to disk must be refreshed to be searchable.
`version` | String | The version of Lucene used to write the segment. 
`compound` | Boolean | When `true`, Lucene merged all of the files from the segment into a single file to save any file descriptions.
`attributes` | Object | Shows whether high compression was enabled. 

## Example requests

The following example requests show how the Segment API works.

### Specific data stream or index

```
GET /index1/_segments
```
{% include copy-curl.html %}

### Several data streams and indexes

```
GET /index1,index2/_segments
```
{% include copy-curl.html %}

### All data streams and indexes in a cluster

```
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

