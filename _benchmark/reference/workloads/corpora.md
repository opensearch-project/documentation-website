---
layout: default
title: corpora
parent: Workload reference
grand_parent: OpenSearch Benchmark Reference
nav_order: 70
redirect_from: /benchmark/workloads/corpora/
---

# corpora

The `corpora` element contains all the document corpora used by the workload. You can use document corpora across workloads by copying and pasting any corpora definitions. 

## Example

The following example defines a single corpus called `movies` with `11658903` documents and `1544799789` uncompressed bytes:

```json
  "corpora": [
    {
      "name": "movies",
      "documents": [
        {
          "source-file": "movies-documents.json",
          "document-count": 11658903, # Fetch document count from command line
          "uncompressed-bytes": 1544799789 # Fetch uncompressed bytes from command line
        }
      ]
    }
  ]
```

## Configuration options

Use the following options with `corpora`.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the document corpus. Because OpenSearch Benchmark uses this name in its directories, use only lowercase names without white spaces. 
`documents` | Yes | JSON array | An array of document files. 
`meta` | No | String | A mapping of key-value pairs with additional metadata for a corpus. 


Each entry in the `documents` array consists of the following options.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`source-file` | Yes | String | The file name containing the corresponding documents for the workload. When using OpenSearch Benchmark locally, documents are contained in a JSON file. When providing a `base_url`, use a compressed file format: `.zip`, `.bz2`, `.gz`, `.tar`, `.tar.gz`, `.tgz`, or `.tar.bz2`. The compressed file must have one JSON file containing the name. 
`document-count` | Yes | Integer | The number of documents in the `source-file`, which determines which client indexes correlate to which parts of the document corpus. Each N client receives an Nth of the document corpus. When using a source that contains a document with a parent-child relationship, specify the number of parent documents. 
`base-url` | No | String | An http(s), Amazon Simple Storage Service (Amazon S3), or Google Cloud Storage URL that points to the root path where OpenSearch Benchmark can obtain the corresponding source file. 
`source-format` | No | String | Defines the format OpenSearch Benchmark uses to interpret the data file specified in `source-file`. Only `bulk` is supported. 
`compressed-bytes` | No | Integer | The size, in bytes, of the compressed source file, indicating how much data OpenSearch Benchmark downloads.
`uncompressed-bytes` | No | Integer | The size, in bytes, of the source file after decompression, indicating how much disk space the decompressed source file needs. 
`target-index` | No | String | Defines the name of the index that the `bulk` operation should target. OpenSearch Benchmark automatically derives this value when only one index is defined in the `indices` element. The value of `target-index` is ignored when the `includes-action-and-meta-data` setting is `true`. 
`target-type` | No | String | Defines the document type of the target index targeted in bulk operations. OpenSearch Benchmark automatically derives this value when only one index is defined in the `indices` element and the index has only one type. The value of `target-type` is ignored when the `includes-action-and-meta-data` setting is `true`. 
`includes-action-and-meta-data` | No | Boolean | When set to `true`, indicates that the document's file already contains an `action` line and a `meta-data` line. When `false`, indicates that the document's file contains only documents. Default is `false`. 
`meta` | No | String | A mapping of key-value pairs with additional metadata for a corpus. 

