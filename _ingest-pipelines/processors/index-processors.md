---
layout: default
title: Ingest processors
nav_order: 30
has_children: true
has_toc: false
redirect_from:
   - /api-reference/ingest-apis/ingest-processors/
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/index-processors/
---

# Ingest processors

Ingest processors are a core component of [ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/index/). They preprocess documents before indexing. For example, you can remove fields, extract values from text, convert data formats, or append additional information.

OpenSearch provides a standard [set of ingest processors](#supported-processors) within your OpenSearch installation. For a list of processors available in OpenSearch, use the [Nodes Info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API operation:

```json
GET /_nodes/ingest?filter_path=nodes.*.ingest.processors
```
{% include copy-curl.html %}

To set up and deploy ingest processors, make sure you have the necessary permissions and access rights. See [Security plugin REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/) to learn more.
{:.note}

## Supported processors

Processor types and their required or optional parameters vary depending on your specific use case. OpenSearch supports the following ingest processors. For tutorials on using these processors in an OpenSerch pipeline, go to each processor's respective documentation. 

Processor type | Description
:--- | :--- 
`append` | Adds one or more values to a field in a document. 
`bytes` | Converts a human-readable byte value to its value in bytes.
`convert` | Changes the data type of a field in a document.
`copy` | Copies an entire object in an existing field to another field.
`csv` | Extracts CSVs and stores them as individual fields in a document. 
`date` | Parses dates from fields and then uses the date or timestamp as the timestamp for a document.
`date_index_name` | Indexes documents into time-based indexes based on a date or timestamp field in a document. 
`dissect` | Extracts structured fields from a text field using a defined pattern. 
`dot_expander` | Expands a field with dots into an object field. 
`drop` |Drops a document without indexing it or raising any errors.
`fail` | Raises an exception and stops the execution of a pipeline. 
`foreach` | Allows for another processor to be applied to each element of an array or an object field in a document.
`geoip` | Adds information about the geographical location of an IP address.
`geojson-feature` | Indexes GeoJSON data into a geospatial field.
`grok` | Parses and structures unstructured data using pattern matching. 
`gsub` | Replaces or deletes substrings within a string field of a document. 
`html_strip` | Removes HTML tags from a text field and returns the plain text content. 
`ip2geo` | Adds information about the geographical location of an IPv4 or IPv6 address.
`join` | Concatenates each element of an array into a single string using a separator character between each element. 
`json` | Converts a JSON string into a structured JSON object. 
`kv` | Automatically parses key-value pairs in a field.
`lowercase` | Converts text in a specific field to lowercase letters.
`pipeline` | Runs an inner pipeline.
`remove` | Removes fields from a document.
`script` | Runs an inline or stored script on incoming documents. 
`set` | Sets the value of a field to a specified value.
`sort` | Sorts the elements of an array in ascending or descending order.
`sparse_encoding` | Generates a sparse vector/token and weights from text fields for neural sparse search using sparse retrieval. 
`split` | Splits a field into an array using a separator character.
`text_embedding` | Generates vector embeddings from text fields for semantic search.
`text_image_embedding` | Generates combined vector embeddings from text and image fields for multimodal neural search.
`trim` | Removes leading and trailing white space from a string field.
`uppercase` | Converts text in a specific field to uppercase letters.
`urldecode` | Decodes a string from URL-encoded format.
`user_agent` | Extracts details from the user agent sent by a browser to its web requests. 
