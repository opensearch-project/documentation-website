---
layout: default
title: Processors
parent: Ingest APIs
has_children: true
nav_order: 10
---

# Processors

A processor is a component of an ingest pipeline that performs a specfic transformation on incoming data. [Ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) are a powerful way to transform your data before it is indexed in OpenSearch. By using ingest processors, you can make your data easier to analyze and visualize, and you can improve the performance of your queries. 

Here are a few examples of ingest processors:

- **Remove:** This processor removes a field from the incoming data. For example, you could use the remove processor to remove the ip_address field from a document.
- **Set:** This processor sets the value of a field in the incoming data. For example, you could use the set processor to set the value of the last_updated filed to the current time and date.
- **Lowercase:** This processor converts all the characters in a field to lowercase. For example, you could use the lowercase processor to convert the value of the name field to all lowercase letters.

Here is an example of an ingest pipeline that uses a few different processors.

```json
{
    "description": "This pipeline removes the ip_address field, sets the last_updated field to the current date and time, and converts the value of the name field to lowercase.", 
    "processors":[ 
        { 
            "remove": { 
                "field": "ip_address" 
            } 
        }, 
        { 
            "set": { 
                "field": "last_updated", 
                "value": "now" 
            } 
        }, 
        { 
            "lowercase": { 
                "field": "name" 
                } 
        } 
] 
}
```

The pipeline would remove the ip_address field for incoming documents, set the last_updated field to the current date and time, and convert the value of the name field to lowercase.

## Creating a processor

Here is an example to create a single field.

```json

```

Here is an example to create multiple fields.

```json

```

## Deleting a processor






## Simulating the pipeline

To simulate the pipeline, specify the pipeline in the POST request.

#### Example: Request

```json
<insert-example-request>
```

## Deleting the Ip2geo processor

To delete the `IP2geo` processor, send a DELETE request. 

#### Example: DELETE request

```json
{
    DELETE https://<host>:<port>/_ingest/pipeline/<processor>
}
```
## Deleting the data source

Delete GeoIP data source. Note that if you have processors that use the data source, the delete requests will fail. To delete the data source, you must delete all processors associated with the data source first. 

#### Example: DELETE request

```
DELETE https://<host>:<port>/_plugins/geospatial/ip2geo/datasource/_all
```

#### Example: Successful DELETE reponse

```json
{
  "acknowledged": true
}
```

#### Example: Failed DELETE response

```json
{
  "error": {
    "root_cause": [
      {
        "type": "resource_in_use_exception",
        "reason": "datasource is being used by one of processors"
      }
    ],
    "type": "resource_in_use_exception",
    "reason": "datasource is being used by one of processors"
  },
  "status": 400
}
```

## Next steps

<Do we want to link to any Data Prepper processor information?>
<What other documentation or GitHub resources should we include?>







## Next steps

- Learn about ingest processors in OpenSearch under the [Processors]() section.
- Learn about ingest pipelines in OpenSearch under the [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) section.
