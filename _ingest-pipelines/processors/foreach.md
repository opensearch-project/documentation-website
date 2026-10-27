---
layout: default
title: Foreach
parent: Ingest processors
nav_order: 110
---

<!-- vale off -->
# Foreach processor
<!-- vale on -->

The `foreach` processor is used to iterate over a list of values in an input document and apply a transformation to each value. This can be useful for tasks like processing all the elements in an array consistently, such as converting all elements in an array to lowercase or uppercase.

The following is the syntax for the `foreach` processor:

```json
{
  "foreach": {
    "field": "<field_name>",
    "processor": {
      "<processor_type>": {
        "<processor_config>": "<processor_value>"
      }
    }
  }
}
```
{% include copy.html %}

## Parameters

The following table lists the required and optional parameters for the `foreach` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The array field to iterate over.
`processor` | Required | The processor to run for each element of the array.
`ignore_missing` | Optional | If `true` and the specified field does not exist or is null, then the processor will quietly exit without modifying the document. Default is `false`.
`description` | Optional | A brief description of the processor.
`if` | Optional | A condition for running the processor.
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, then failures are ignored. Default is `false`.
`on_failure` | Optional | A list of processors to run if the processor fails.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging).

## Accessing array elements

For each array element, the `foreach` processor stores the element in the `_ingest._value` ingest metadata field and then runs the inner processor. To read or modify the current element, set the inner processor's field to `_ingest._value`. If the element is an object, access its fields using dot notation, for example, `_ingest._value.name`.

The inner processor can also read and modify any other field in the document.

While the `foreach` processor runs, `_ingest._value` always holds the current array element, which hides any value that an earlier processor stored in `_ingest._value`. When the loop ends, OpenSearch puts the earlier value back, so processors later in the pipeline can still read it.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `test-foreach` that uses the `foreach` processor to iterate over each element in the `protocols` field: 

```json
PUT _ingest/pipeline/test-foreach  
{  
  "description": "Lowercase all the elements in an array",  
  "processors": [  
    {  
      "foreach": {  
        "field": "protocols",  
        "processor": {  
          "lowercase": {  
            "field": "_ingest._value"  
          }  
        }  
      }  
    }  
  ]  
}  
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/test-foreach/_simulate  
{  
  "docs": [  
    {  
      "_index": "testindex1",  
      "_id": "1",  
      "_source": {  
        "protocols": ["HTTP","HTTPS","TCP","UDP"]  
      }  
    }  
  ]  
} 
```
{% include copy-curl.html %}

The following example response confirms that the pipeline is working as expected, showing that the four elements have been lowercased:

```json
{  
  "docs": [  
    {  
      "doc": {  
        "_index": "testindex1",  
        "_id": "1",  
        "_source": {  
          "protocols": [  
            "http",  
            "https",  
            "tcp",  
            "udp"  
          ]  
        },  
        "_ingest": {  
          "_value": null,  
          "timestamp": "2024-05-23T02:44:10.8201Z"  
        }  
      }  
    }  
  ]  
}  

```

### Step 3: Ingest a document

The following query ingests a document into an index named `testindex1`:

```json
POST testindex1/_doc/1?pipeline=test-foreach  
{  
  "protocols": ["HTTP","HTTPS","TCP","UDP"]  
}  
```
{% include copy-curl.html %}

The request indexes the document into the index `testindex1` and applies the pipeline before indexing:

```json
{  
  "_index": "testindex1",  
  "_id": "1",  
  "_version": 6,  
  "result": "created",  
  "_shards": {  
    "total": 2,  
    "successful": 1,  
    "failed": 0  
  },  
  "_seq_no": 5,  
  "_primary_term": 67  
}  
```

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

The response contains the ingested document, transformed as shown in the response in Step 2.

## Processing an array of objects

The following request removes the `internal_sku` field from each object in the `products` array:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "foreach": {
          "field": "products",
          "processor": {
            "remove": {
              "field": "_ingest._value.internal_sku"
            }
          }
        }
      }
    ]
  },
  "docs": [
    {
      "_source": {
        "order_id": "A-1001",
        "products": [
          { "name": "Wireless mouse", "price": 24.99, "internal_sku": "WM-4471" },
          { "name": "USB-C cable", "price": 9.99, "internal_sku": "UC-2210" }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows that the `internal_sku` field was removed from both objects:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "order_id": "A-1001",
          "products": [
            {
              "name": "Wireless mouse",
              "price": 24.99
            },
            {
              "name": "USB-C cable",
              "price": 9.99
            }
          ]
        },
        "_ingest": {
          "_value": null,
          "timestamp": "2026-10-14T19:40:29.753456004Z"
        }
      }
    }
  ]
}
```

## Handling failures for array elements

If the inner processor fails for an element and doesn't define `on_failure`, the `foreach` processor stops processing the array and fails.

To handle failures for individual elements, specify `on_failure` in the inner processor. In the following request, the second object in the `products` array doesn't contain the `internal_sku` field, so the `remove` processor fails for that element. The `on_failure` processor sends the document to the `failed-orders` index:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "foreach": {
          "field": "products",
          "processor": {
            "remove": {
              "field": "_ingest._value.internal_sku",
              "on_failure": [
                {
                  "set": {
                    "field": "_index",
                    "value": "failed-orders"
                  }
                }
              ]
            }
          }
        }
      }
    ]
  },
  "docs": [
    {
      "_index": "orders",
      "_source": {
        "order_id": "A-1002",
        "products": [
          { "name": "Wireless mouse", "price": 24.99, "internal_sku": "WM-4471" },
          { "name": "USB-C cable", "price": 9.99 }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows that the target index changed to `failed-orders`. Because the `on_failure` block handled the failure, the `foreach` processor continued to process the remaining elements, and the elements that were processed successfully retain their changes:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "failed-orders",
        "_id": "_id",
        "_source": {
          "order_id": "A-1002",
          "products": [
            {
              "name": "Wireless mouse",
              "price": 24.99
            },
            {
              "name": "USB-C cable",
              "price": 9.99
            }
          ]
        },
        "_ingest": {
          "_value": null,
          "timestamp": "2026-10-14T19:40:29.808936921Z"
        }
      }
    }
  ]
}
```
