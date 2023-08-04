---
layout: default
title: corpora
parent: Workload reference
nav_order: 70
---

The `corpora` element contains all the document corpora used by the workload. You can use document corpora across workloads by copying and pasting any corpora definitions. 

## Example

The following example defines a single document corpus with a count of `11658903` and an uncompressed size of `1544799789` bytes.

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

Use the following options with `corpora`:

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
| `name` | Yes | String | The name the document corpus. Because OpenSearch Benchmark will use this name in its directories, use only lower case name without white spaces. |
| `documents` | Yes | String | A list of document files. |
| `meta` | No | String | A mapping of key-value pairs with additional metadata for a corpus. |


The `documents` option consists of the following options:

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
| `source-file` | Yes | String | The file name to corresponding documents. When using Benchmark locally, documents are contained in a JSON file. When providing a `base_url`, use a compressed file format; `.zip`, `.bz2`, `.gz,` `.tar`, `.tar.gz`, `.tgz` or `.tar.bz2`. The compressed file must contain one JSON file with the name. |
| `document-count` | Yes | Integer | The number of documents in the `source-file` that determines which client indexes correlate to which part of the document corpus (each N client get on N-th of the document corpus). When using a source that contains a document with a parent-child relationship, specify the number of parent documents. |
| `base-url` | No | String | An http(s), S3, or Google Storage URL that points to the root path where Benchmark can obtain the corresponding source file. |
| `source-format` | No | String | Defines the format which Benchmark interprets the data file specified in `source-file`. Only `bulk` is supported. |
| `compressed-bytes` | No | Integer | The size in bytes of the compressed source file, used to show you how much data Benchmark downloads. |
| `uncompressed-bytes` | No | Integer | The size in bytes of the source file after decompression, used to show you much disk space the decompressed source file needs. | 
| `target-index` | No | String | Defines the name of the index that the `bulk` operation should target. Benchmark automatically derives this value when only index is defined in the `indices` element. The value of `target-index` is ignored when the `includes-action-and-meta-data` setting is `true`. |
| `target-type` | No | String | Defines the document type of the target index targeted in bulk operations. Benchmark automatically derives this value when only index is defined in the `indices` element and the index has only one type. The value of `target-type` is ignored when the `includes-action-and-meta-data` setting is `true`. |
| `includes-action-and-metra-data` | No | Boolean | When set to `true`, indicates that document's file already contains an `action` and `meta-data` line. When `false`, indicates the document's file contains only documents. Default is `false`. |
| `meta` | No | String | A mapping of key-value pairs with additional metadata for a corpus. |

