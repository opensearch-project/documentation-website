---
layout: default
title: Ingest-attachment plugin
parent: Installing plugins
nav_order: 20

---

# Ingest-attachment plugin

The `ingest-attachment` plugin enables OpenSearch to extract content and other
information from files using the Apache text extraction library
[Tika](https://tika.apache.org/).
Supported document formats include PPT, PDF, RTF, ODF and many more.

The input field must be a base64 encoded binary.

## Installing the plugin

You can install the `ingest-attachment` plugin using the following command:

```sh
./bin/opensearch-plugin install ingest-attachment
```

## Attachment processor options

| Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| field | yes | - | The field to get base64 encoded binary from. |
| target_field| no | attachment | The field that will hold the attachment information. |
| properties | no | all properties | Array of properties, which should be stored. Can be `content`, `language`, `date`, `title`, `author`, `keywords`, `content_type`, `content_length` |
| indexed_chars | no | `100_000` | The number of chars being used for extraction to prevent huge fields. Use `-1` for no limit. |
| indexed_chars_field | no | `null` | Field name from which you can overwrite the number of chars being used for extraction. See `indexed_chars`. |
| ignore_missing | no | `false` | If `true` and field does not exist, the processor quietly exits without modifying the document. |

## Basic Example

After starting up a cluster, you can create an index, add an attachment and search, as shown in following examples.

### Create an index to store your attachments to

```json
PUT /example-attachment-index
{
  "mappings": {
    "properties": {}
  }
}
```

### Create a pipeline with attachment processor

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

Convert the attachment to base64 string, to pass it as `data`.\
In this example usage of in Unix-like system is shown using `base64` command.

```sh
base64 lorem.rtf
```

In NodeJs you could read a file to base64 like this.

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

Searching now by `content` works as shown below.

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

The search will create a hit like this.

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

There are several fields, which can be extracted from the given binary.

- `content`
- `language`
- `date`
- `title`
- `author`
- `keywords`
- `content_type`
- `content_length`

To extract only a subset of these fields, define them in the `properties` of the
pipelines processor

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

To prevent extracting too many chars and overload the node memory,
the number of chars being used for extraction is limited by default to `100_000`.
You can change this value by setting `indexed_chars`.
Use `-1` for unlimited chars but ensure when setting this that your node
will have enough HEAP to extract the content of very big documents.

You can also define this limit per document by extracting from a given field
the limit to set.
If the document has that field, it will overwrite the `indexed_chars` setting.
To set this field, define the `indexed_chars_field` setting.

The example pipeline

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

can be used without specifying `max_chars` limiting the content to have `10` chars,

```json
PUT example-attachment-index/_doc/lorem_rtf?pipeline=attachment
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0="
}
```

or with `max_chars` set individually for this one document limiting to `15` chars.

```json
PUT example-attachment-index/_doc/lorem_rtf?pipeline=attachment
{
  "data": "e1xydGYxXGFuc2kNCkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0DQpccGFyIH0=",
  "max_chars": 15
}
```
