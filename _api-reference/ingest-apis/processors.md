---
layout: default
title: Processors
parent: Ingest APIs
has_children: true
nav_order: 10
---

# Processors

A processor is a component of an ingest pipeline that performs a specific transformation on incoming data. Processors ingest, filter, transform, enrich, and route data to an OpenSearch domain, ingesting data from a variety of sources and has a rich ecosystem of built-in processors to take care of your most complex data transformation needs. [Ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) are a powerful way to transform your data before it is indexed in OpenSearch. By using ingest processors, you can make your data easier to analyze and visualize, and you can improve the performance of your queries. 

OpenSearch includes several configurable ingest processors. To get a list of available processors, send the following request:

````
```json
GET /_nodes/ingest
```
{% include copy-curl.html %}
````

For more information about individual nodes within your OpenSearch domain, see [Nodes API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/). 

The following code examples show how to generally create, update, and delete processors and data sources in OpenSearch.

## Setting up a processor

Here is an example of how to set up a processor in OpenSearch. Remember to replace `my_index` with the actual name you want to ingest the document into, and adjust the field names and values to match your specfic use case. 

```json
# Define the processor configuration
processor_config = {
  "description": "Custom single-field processor", 
  "processors": [
    {
      "set: {
        "field": "my_field"
        "value": "default_value"
      }
    }
  ]
}

# Create the processor using the OpenSearch ingest APIs or REST API
processor_name = "my_single_field_processor"
opensearch.ingest.put.pipeline(id=processor_name, body=processor_config)

# Test the processor on a single document
document = {
  "my_field": "orignal_value"
}

# Ingest the document with the processor applied
ingest_config = {
  "pipeline": = processor_name,
  "document": document
}
result = opensearch.ingest(index="my_index", body=ingest_config)

# Check the output
print(result)
```

## Creating a data source for an ingest processor in OpenSearch

To create a data source for an ingest processor in OpenSearch, you can use the OpenSearch Dashboards API to define an index template and mapping. Here's an example of how you can create a data source with an ingest processor using JSON. Make sure you have OpenSearch running and accessible at the appropriate host and port before executing the request.

```json

PUT /_index_template/my-index-template
{
  "index_patterns": ["my-index-*"],
  "template": {
    "settings": {
      "index": {
        "number_of_shards": 1,
        "number_of_replicas": 0
      }
    },
    "mappings": {
      "properties": {
        "my_field": {
          "type": "text"
        }
      }
    }
  },
  "priority": 100,
  "composed_of": ["my-pipeline"]
}
```

| Name | Description |
|------|-------------|
| `PUT` | Request used to create a new index template. In the example, replace "my-index-template" with your desired template name. |
| `index_patterns` | Field that specifies the pattern of index names to which the template should be applied. In the example, the pattern "my-index" is used, which matches all indexes starting with "my-index." Replace it with your desired index pattern. |
|`settings` | Defines index-level settings. Adjust these values according to your requirements. |
| `mappings` | Defines the field mappings for the index. Modify the field name and data type according to your needs. |
|`priority` | Optional field that can be used to control the order in which the templates are evaluated. A higher value indicates a higher priority. | 
| `composed_of` | Field that specifes the pipeline(s) that should be applied to the document ingested into the index. In the example, replace "my-pipeline" with the actual name of your pipeline. |

## Deleting a processor or data source

To delete a processor, <insert-how-to-text> 

<SME insert example code>

To delete a data source, <insert-how-to-text> 

<SME insert example code>

## Next steps

- Learn about ingest processors in OpenSearch at [Processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/).
- Learn about ingest pipelines in OpenSearch at [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/).
