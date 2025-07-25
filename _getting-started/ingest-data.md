---
layout: default
title: Ingest data
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/getting-started/ingest-data/
---

# Ingest your data into OpenSearch

There are several ways to ingest data into OpenSearch:

- Ingest individual documents. For more information, see [Indexing documents]({{site.url}}{{site.baseurl}}/getting-started/communicate/#indexing-documents).
- Index multiple documents in bulk. For more information, see [Bulk indexing](#bulk-indexing).
- Use Data Prepper---an OpenSearch server-side data collector that can enrich data for downstream analysis and visualization. For more information, see [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/). 
- Use other ingestion tools. For more information, see [OpenSearch tools]({{site.url}}{{site.baseurl}}/tools/).

## Bulk indexing

To index documents in bulk, you can use the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/). For example, if you want to index several documents into the `students` index, send the following request:

```json
POST _bulk
{ "create": { "_index": "students", "_id": "2" } }
{ "name": "Jonathan Powers", "gpa": 3.85, "grad_year": 2025 }
{ "create": { "_index": "students", "_id": "3" } }
{ "name": "Jane Doe", "gpa": 3.52, "grad_year": 2024 }
```
{% include copy-curl.html %}

## Experiment with sample data

OpenSearch provides a fictitious e-commerce dataset that you can use to experiment with REST API requests and OpenSearch Dashboards visualizations. You can create an index and define field mappings by downloading the corresponding dataset and mapping files. 

### Create a sample index

Use the following steps to create a sample index and define field mappings for the document fields:

1. Download [ecommerce-field_mappings.json](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce-field_mappings.json). This file defines a [mapping]({{site.url}}{{site.baseurl}}/opensearch/mappings/) for the sample data you will use.
    
    To use cURL, send the following request:

    ```bash
    curl -O https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce-field_mappings.json
    ```
    {% include copy.html %}

    To use wget, send the following request:

    ```
    wget https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce-field_mappings.json
    ```
    {% include copy.html %}

1. Download [ecommerce.json](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce.json). This file contains the index data formatted so that it can be ingested by the Bulk API:
    
    To use cURL, send the following request:

    ```bash
    curl -O https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce.json
    ```
    {% include copy.html %}

    To use wget, send the following request:

    ```
    wget https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce.json
    ```
    {% include copy.html %}

1. Define the field mappings provided in the mapping file:
    ```bash
    curl -H "Content-Type: application/x-ndjson" -X PUT "https://localhost:9200/ecommerce" -ku admin:<custom-admin-password> --data-binary "@ecommerce-field_mappings.json"
    ```
    {% include copy.html %}

1. Upload the documents using the Bulk API:

    ```bash
    curl -H "Content-Type: application/x-ndjson" -X PUT "https://localhost:9200/ecommerce/_bulk" -ku admin:<custom-admin-password> --data-binary "@ecommerce.json"
    ```
    {% include copy.html %}

### Query the data

Query the data using the Search API. The following query searches for documents in which `customer_first_name` is `Sonya`:

```json
GET ecommerce/_search
{
  "query": {
    "match": {
      "customer_first_name": "Sonya"
    }
  }
}
```
{% include copy-curl.html %}

### Visualize the data

To learn how to use OpenSearch Dashboards to visualize the data, see the [OpenSearch Dashboards quickstart guide]({{site.url}}{{site.baseurl}}/dashboards/quickstart/).

## Further reading

- For information about Data Prepper, see [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/).
- For information about ingestion tools, see [OpenSearch tools]({{site.url}}{{site.baseurl}}/tools/).
- For information about OpenSearch Dashboards, see [OpenSearch Dashboards quickstart guide]({{site.url}}{{site.baseurl}}/dashboards/quickstart/).
- For information about bulk indexing, see [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/).

## Next steps

- See [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/) to learn about search options.