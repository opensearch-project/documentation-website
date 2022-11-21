---
layout: default
title: Quickstart guide
parent: Install OpenSearch
nav_order: 1
---

# Quickstart guide

Get started using OpenSearch and OpenSearch Dashboards by deploying your containers with [Docker](https://www.docker.com/). Before proceeding, you need to [get Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://github.com/docker/compose) installed on your local machine. 

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should replace `docker-compose` with `docker compose` where it appears in this guide.
{: .note}

## Starting your cluster

You will need a special file, called a compose file, that Docker Compose uses to define and create the containers in your cluster. We provide a sample compose file that you can use to get started. Learn more about working with compose files by reviewing the official [Compose specification](https://docs.docker.com/compose/compose-file/).

1. Before running OpenSearch on your machine, you should review and apply these [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/).
    - Disable memory paging and swapping performance on the host to improve performance.
        ```bash
        sudo swapoff -a
        ```
    - Increase the number of memory maps available to OpenSearch.
        ```bash
        # Edit the sysctl config file.
        sudo vi /etc/sysctl.conf

        # Define the max map count.
        vm.max_map_count=262144

        # Reload the kernel parameters.
        sudo sysctl -p
        ```  
1. Download the sample compose file to your host. You can download the file with command line utilities like `curl` or `wget`, or you can manually copy the file from the OpenSearch Project [documentation-website](https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml) repository from a web browser.
    ```bash
    # Using cURL:
    curl -O https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml

    # Using wget:
    wget https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml
    ```
1. In your terminal application, navigate to the directory containing the `docker-compose.yml` file you just downloaded, and run the following command to create and start the cluster as a background process.
    ```bash
    docker-compose up -d
    ```
1. Confirm that the containers are running.
    ```bash
    docker-compose ps
    ```
1. Query the OpenSearch REST API to verify that the service is running. You should use `-k` (also written as `--insecure`) to disable host name checking because the default security configuration uses demo certificates. Use `-u` to pass the default username and password (`admin:admin`).
    ```bash
    curl https://localhost:9200 -ku admin:admin
    ```
    - Sample response:
    ```json
    {
    "name" : "opensearch-node1",
    "cluster_name" : "opensearch-cluster",
    "cluster_uuid" : "Cd7SL5ysRSyuau325M3h9w",
    "version" : {
        "distribution" : "opensearch",
        "number" : "2.3.0",
        "build_type" : "tar",
        "build_hash" : "6f6e84ebc54af31a976f53af36a5c69d474a5140",
        "build_date" : "2022-09-09T00:07:12.137133581Z",
        "build_snapshot" : false,
        "lucene_version" : "9.3.0",
        "minimum_wire_compatibility_version" : "7.10.0",
        "minimum_index_compatibility_version" : "7.0.0"
    },
    "tagline" : "The OpenSearch Project: https://opensearch.org/"
    }
    ```

## Create an index and field mappings using sample data

Create an index and define field mappings using a data set provided by the OpenSearch Project. The same fictitious e-commerce data is also used for sample visualizations in OpenSearch Dashboards. To learn more, see [Getting started with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/).

1. Download [ecommerce-field_mappings.json](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_version}}/assets/examples/ecommerce-field_mappings.json). This file defines a [mapping]({{site.url}}{{site.baseurl}}/opensearch/mappings/) for the sample data you will use.
    ```bash
    wget https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_version}}/assets/examples/ecommerce-field_mappings.json
    ```
1. Download [ecommerce.json](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_version}}/assets/examples/ecommerce.json). This file contains the [index data]({{site.url}}{{site.baseurl}}/opensearch/index-data/) formatted so that it can be ingested via the bulk API. To learn more, see [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/).
    ```bash
    wget https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_version}}/assets/examples/ecommerce.json
    ```
1. Define the field mappings with the mapping file.
    ```bash
    curl -H "Content-Type: application/x-ndjson" -X PUT "https://localhost:9200/ecommerce" -ku admin:admin --data-binary "@ecommerce-field_mappings.json"
    ```
1. Upload the index to the bulk API.
    ```bash
    curl -H "Content-Type: application/x-ndjson" -X PUT "https://localhost:9200/ecommerce/_bulk" -ku admin:admin --data-binary "@ecommerce.json"
    ```
1. Query the data using the search API. The following command submits a query that will return documents where `customer_first_name` is `Sonya`.
    ```bash
    curl -H 'Content-Type: application/json' -X GET "https://localhost:9200/ecommerce/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"customer_first_name":"Sonya"}}}'
    ```

Add the query parameter `pretty=true` to OpenSearch API requests that return a JSON to see a more readable version of the response body. Otherwise the response will be a flat JSON. For more information about `pretty` and other query parameters, see [Common REST parameters]({{site.url}}{{site.baseurl}}/opensearch/common-parameters/).
{: .tip}

## Common issues

Review these common issues and suggested solutions if your containers fail to start or exit unexpectedly.

### Docker commands require elevated permissions

Eliminate the need for running your Docker commands with `sudo` by adding your user to the `docker` user group. See [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/) for more information.

```bash
sudo usermod -aG docker $USER
```

### Error message: "-bash: docker-compose: command not found"

If you installed Docker Desktop then Docker Compose is already installed on your machine. Try `docker compose` (without the hyphen) instead of `docker-compose`. See [Use Docker Compose](https://docs.docker.com/get-started/08_using_compose/).

### Error message: "docker: 'compose' is not a docker command."

If you installed Docker Engine then you must install Docker Compose separately, and you will use the command `docker-compose` (with a hyphen). See [Docker Compose](https://github.com/docker/compose).

### Error message: "max virtual memory areas vm.max_map_count [65530] is too low"

OpenSearch will fail to start if your host is not configured with a high enough max map count. Review the [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/) if you see the following errors in the service log, and set `vm.max_map_count` appropriately.

```bash
opensearch-node1         | ERROR: [1] bootstrap checks failed
opensearch-node1         | [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
opensearch-node1         | ERROR: OpenSearch did not exit normally - check the logs at /usr/share/opensearch/logs/opensearch-cluster.log
```