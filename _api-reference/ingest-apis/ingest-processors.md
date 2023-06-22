---
layout: default
title: Ingest processors
parent: Ingest APIs
nav_order: 50
has_children: true
---

# Ingest processors

Ingest processors have a crucial role in preparing and enriching data before it is stored and analyzed and improving data quality and usability. They are a set of functionalities or operations applied to incoming data during the ingestion process and allow for real-time data transformation, manipulation, and enrichment. 

Ingest processors are a core component of data processing [pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipelines/). They preprocess and shape data as it enters a system, making it more suitable for downstream operations such as indexing, analysis, or storage. They have a range of capabilities--data extraction, validation, filtering, enrichment, and normalization--that can be performed on different aspects of the data, such as extracting specific fields, converting data types, removing or modifying unwanted data, or enriching data with additional information. 

OpenSearch provides a standard set of ingest processors within your OpenSearch installation. For a list of processors available in OpenSearch, use the [nodes info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API:

```json
GET /_nodes/ingest
```
{% include copy-curl.html %}

To configure and deploy ingest processors, make sure you have the necessary permissions and access rights. You can learn more about the processor types within their respective documentation.
{: .note}

## Set up a processor

Following is an example of how to set up a processor in OpenSearch. Replace `my_index` with the actual name you want to ingest the document into, and adjust the field names and values to match your specfic use case. 

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

## Create data source for ingest processor

To create a data source for an ingest processor in OpenSearch, you can use the OpenSearch Dashboards API to define an index template and mapping. Following is an example of how you can create a data source with an ingest processor. Make sure you have OpenSearch running and accessible at the appropriate host and port before deploying the request.

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


