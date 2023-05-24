---
layout: default
title: Processors
parent: Ingest APIs
has_children: true
nav_order: 50
---

## Processors

A processor is a component of an ingest pipieline that performs a specfic transformation on incoming data. [Ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) are a powerful way to transform your data before it is indexed in OpenSearch. By using ingest processors, you can make your data easier to analyze and visualize, and you can improve the performance of your queries. 

Here are a few examples of the many types of ingest processors:

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

The pipeline would remove th ip_address field for incoming documents, set the last_updated field to the current date and time, and convert the value of the name field to lowercase.

## Next steps

- Learn about ingest processors in OpenSearch under the Processors section.
- Learn about ingest pipelines in OpenSearch under the [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) section.