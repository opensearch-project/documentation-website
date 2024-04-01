---
layout: default
title: Ingest data
nav_order: 40
---

# Ingest your data into OpenSearch

## Create an index and field mappings using sample data

Create an index and define field mappings using a dataset provided by the OpenSearch Project. The same fictitious e-commerce data is also used for sample visualizations in OpenSearch Dashboards. To learn more, see [Getting started with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/).

1. Download [ecommerce-field_mappings.json](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce-field_mappings.json). This file defines a [mapping]({{site.url}}{{site.baseurl}}/opensearch/mappings/) for the sample data you will use.
    ```bash
    # Using cURL:
    curl -O https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce-field_mappings.json

    # Using wget:
    wget https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce-field_mappings.json
    ```
1. Download [ecommerce.json](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce.json). This file contains the index data formatted so that it can be ingested by the bulk API. To learn more, see [index data]({{site.url}}{{site.baseurl}}/opensearch/index-data/) and [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/).
    ```bash
    # Using cURL:
    curl -O https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce.json

    # Using wget:
    wget https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/ecommerce.json
    ```
1. Define the field mappings with the mapping file.
    ```bash
    curl -H "Content-Type: application/x-ndjson" -X PUT "https://localhost:9200/ecommerce" -ku admin:<custom-admin-password> --data-binary "@ecommerce-field_mappings.json"
    ```
1. Upload the index to the bulk API.
    ```bash
    curl -H "Content-Type: application/x-ndjson" -X PUT "https://localhost:9200/ecommerce/_bulk" -ku admin:<custom-admin-password> --data-binary "@ecommerce.json"
    ```
1. Query the data using the search API. The following command submits a query that will return documents where `customer_first_name` is `Sonya`.
    ```bash
    curl -H 'Content-Type: application/json' -X GET "https://localhost:9200/ecommerce/_search?pretty=true" -ku admin:<custom-admin-password> -d' {"query":{"match":{"customer_first_name":"Sonya"}}}'
    ```
    
1. Access OpenSearch Dashboards by opening `http://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. The default username is `admin` and the password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.
1. On the top menu bar, go to **Management > Dev Tools**.
1. In the left pane of the console, enter the following:
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
1. Choose the triangle icon at the top right of the request to submit the query. You can also submit the request by pressing `Ctrl+Enter` (or `Cmd+Enter` for Mac users). To learn more about using the OpenSearch Dashboards console for submitting queries, see [Running queries in the console]({{site.url}}{{site.baseurl}}/dashboards/run-queries/).