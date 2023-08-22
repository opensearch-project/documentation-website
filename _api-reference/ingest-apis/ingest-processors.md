---
layout: default
title: Ingest processors
parent: Ingest APIs
nav_order: 10
has_children: true
---

# Ingest processors

Ingest processors are a core component of [ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipelines/), as they preprocess documents before indexing. For example, you can remove fields, extract values from text, convert data format, or append additional information.

OpenSearch provides a standard set of ingest processors within your OpenSearch installation. For a list of processors available in OpenSearch, use the [Nodes Info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API operation:

```json
GET /_nodes/ingest
```
{% include copy-curl.html %}

To set up and deploy ingest processors, make sure you have the necessary permissions and access rights. See [Security plugin REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/) to learn more.
{:.note}

The following is a generic example of an ingest processor definition within a pipeline. Processor types and their required or optional parameters vary depending on their specific use case. See the [Related articles]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/#related-articles) section to learn more about the processor types and defining and configuring them within a pipeline.

#### Example query and description of parameters

```json
{
    "your_processor_type": {
        "your_required_parameter": "your_value",
        "your_optional_parameter": "your_optional_value"
    }
}
```

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`your_processor_type` | Required | Type of processor you want to use, such as `rename`, `set`, `append`, and so forth. Different processor types perform different actions. |
`your_required_parameter` | Required | Required parameter specific to the processor type you've chosen. It defines the main setting or action for the processor to take. |
`your_value` | Required | Replace this with the appropriate value for the chosen processor type and parameter. For example, if the processor is `rename`, then this value is the new field name you want to rename to. |
`your_optional_parameter` | Optional | Some processors have optional parameters that modify their behavior. Replace this with the optional parameter. |
`your_optional_value` | Optional | Replace this with the appropriate value for the optional parameter used. |
