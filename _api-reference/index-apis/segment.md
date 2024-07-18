---
layout: default
title: Segment
parent: Index APIs
nav_order: 66
---

# Segment API
Introduced 1.0
{: .label .label-purple }

The Segment API returns information about Lucene segments inside of index shards and information about the backing indexes of data streams.

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

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
allow_partial_search_results | Boolean | Whether to return partial results if the request runs into an error or times out. Default is `true`.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`ignore_unavailable` | Boolean | When `true`, OpenSearch ignores missing or closed indexes. If `false`, OpenSearch returns an error if the force merge operation encounters missing or closed indexes. Default is `false`.
`verbose` | Boolean | When `true`, gives information about Lucene's memory usage. Default is `false`.

## Response body

Parameter | Type | Description 
 :--- | :--- | :--- 
`<segment>` | String | The name of the segment, such as `_segment`. The name is generated during the creation of the segment and used to create internal file names in the shard directory. 
`generation` | Integer | The generation number, such as `0`. OpenSearch increments this generation number for each segment written. OpenSearch then uses this number to derive the segment name. 
`num_docs` | Integer | The number of documents as reported by Lucene. This excludes deleted documents and counts any nested documents separately from their parents. It also excludes documents which were indexed recently and do not yet belong to a segment. 
`deleted_docs` | Integer | The number of deleted documents as reported by Lucene, which may be higher or lower than the number of delete operations you have performed. This number excludes deletes that were performed recently and do not yet belong to a segment. Deleted documents are cleaned up by the automatic merge process if it makes sense to do so. Also, Elasticsearch creates extra deleted documents to internally track the recent history of operations on a shard. 
`size_in_bytes` | Integer | Disk space used by the segment, such as `50kb`. 
`memory_in_bytes` | Integer | The number of bytes of segment data stored in memory for efficient search, such as 1264. A value of `-1` indicates OpenSearch was unable to compute this number. 
`committed` | Boolean | When `true`, the segments is synced to disk. Segments that are synced can survive a hard reboot. If false, the data from uncommitted segments is also stored in the transaction log so that Elasticsearch is able to replay changes on the next start. 
`search` | Boolean | When `true`, the segment is searchable. If false, the segment has most likely been written to disk but needs a refresh to be searchable. 
`version` | String | The version of Lucene used to write the segment. 
`compound` | Boolean | When `true`, Lucene merged all files from the segment into a single file to save file descriptors. 
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

