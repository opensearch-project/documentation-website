---
layout: default
title: Ingest-attachment plugin
parent: Installing plugins
nav_order: 20

---

# Ingest-attachment plugin

The Ingest-attachment plugin enables OpenSearch to extract content and other information from files using the Apache text extraction library [Tika](https://tika.apache.org/).
Supported document formats include PPT, PDF, RTF, ODF and many more ([Tika Supported Document Formats](https://tika.apache.org/2.9.2/formats.html)).

The input field must be a base64-encoded binary.

## Installing the plugin

Install the `ingest-attachment` plugin using the following command:

```sh
./bin/opensearch-plugin install ingest-attachment
```

## Attachment processor options

| Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `field` | yes | - | The field to get base64 encoded binary from. |
| `target_field` | no | attachment | The field that holds the attachment information. |
| `properties` | no | all properties | An array of properties, which should be stored. Can be `content`, `language`, `date`, `title`, `author`, `keywords`, `content_type`, `content_length`. |
| `indexed_chars` | no | `100_000` | The number of character used for extraction to prevent fields from becoming to large. Use `-1` for no limit. |
| `indexed_chars_field` | no | `null` | The field name from which you can overwrite the number of chars being used for extraction, for example, `indexed_chars`. |
| `ignore_missing` | no | `false` | When `true`, the processor exits without modifying the document when the specified field doesn't exist. |

## Example

The following steps show how to get started with the Ingest-attachment plugin.

### Create an index to store your attachments

The following command creates an index for storing your attachments:

```json
PUT /example-attachment-index
{
  "mappings": {
    "properties": {}
  }
}
```

### Create a pipeline with attachment processor

The following command creates a pipeline wihch contains the attachment processor:

```json
PUT _ingest/pipeline/attachment
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data"
      }
    }
  ]
}
```

### Store an attachment

Convert the attachment to base64 string, to pass it as `data`. 
The following example `base64` command passes a attachment file `lorem.rtf`:


```sh
base64 lorem.rtf
```

You can use Node.js to read the `base64` file, as shown in the following commands: 

```typescript
import * as fs from "node:fs/promises";
import path from "node:path";

const filePath = path.join(import.meta.dirname, "lorem.rtf");
const base64File = await fs.readFile(filePath, { encoding: "base64" });

console.log(base64File);
```

The following base64 string is for an `.rtf` file containing the text

`Lorem ipsum dolor sit amet`:
`e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0=`.

```json
PUT example-attachment-index/_doc/lorem_rtf?pipeline=attachment
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0="
}
```

### Query results

With the attachment processed, you can now search through the data using search queries, as shown in the following example:

```json
POST example-attachment-index/_search
{
  "query": {
    "match": {
      "attachment.content": "ipsum"
    }
  }
}
```

OpenSearch responds with the following:

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.1724279,
    "hits": [
      {
        "_index": "example-attachment-index",
        "_id": "lorem_rtf",
        "_score": 1.1724279,
        "_source": {
          "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0=",
          "attachment": {
            "content_type": "application/rtf",
            "language": "pt",
            "content": "Lorem ipsum dolor sit amet",
            "content_length": 28
          }
        }
      }
    ]
  }
}
```

## Extracted Information

The following fields can be extracted using the plugin:

- `content`
- `language`
- `date`
- `title`
- `author`
- `keywords`
- `content_type`
- `content_length`

To extract only a subset of these fields, define them in the `properties` of the
pipelines processor, as shown in the following example:

```json
PUT _ingest/pipeline/attachment
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data",
        "properties": ["content", "title", "author"]
      }
    }
  ]
}
```

## Limit the extracted content

To prevent extracting too many characters and overload the node memory, the default limit is `100_000`.
You can change this value using the setting `indexed_chars`. For example, you can use `-1` for unlimited characters but you need to make sure you have enough of a HEAP size to extract the content of large documents.


You can also define this limit per document using the `indexed_chars_field` request field.
If a document contains `indexed_chars_field, it will overwrite the `indexed_chars` setting, as shown in the following example:

```json
PUT _ingest/pipeline/attachment
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data",
        "indexed_chars" : 10,
        "indexed_chars_field" : "max_chars",
      }
    }
  ]
}
```

With the attachment pipeline set, you can extract 10 characters with specifying max character in the request, as shown in the following example:

```json
PUT example-attachment-index/_doc/lorem_rtf?pipeline=attachment
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0="
}
```

Alternatively, you can change the `max_char` per document, as shown in the following example:

```json
PUT example-attachment-index/_doc/lorem_rtf?pipeline=attachment
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0=",
  "max_chars": 15
}
```
