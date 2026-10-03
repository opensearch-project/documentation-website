---
layout: default
title: Docker
parent: Installing OpenSearch Dashboards
nav_order: 5
redirect_from: 
  - /dashboards/install/docker/
  - /opensearch/install/docker-security/
---

# Installing OpenSearch Dashboards using Docker

You can use either Docker or Docker Compose to run OpenSearch Dashboards. The Docker Compose method is easier because you can define the entire configuration in a single file.

## Prerequisites

Install OpenSearch using Docker. For more information, see [Installing OpenSearch using Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/).

## Install OpenSearch Dashboards using Docker

If you have defined your network using `docker network create os-net` and started OpenSearch using the following command:

```bash
docker run -d --name opensearch-node -p 9200:9200 -p 9600:9600 --network os-net -e "discovery.type=single-node" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=<admin_password>" opensearchproject/opensearch:latest
```
{% include copy.html %}

Then you can start OpenSearch Dashboards using the following steps:

1. Create an `opensearch_dashboards.yml` configuration file:

    ```yaml
    server.name: opensearch_dashboards
    server.host: "0.0.0.0"
    server.customResponseHeaders : { "Access-Control-Allow-Credentials" : "true" }
    
    # Disabling HTTPS on OpenSearch Dashboards
    server.ssl.enabled: false
    
    opensearch.hosts: ["https://opensearch-node:9200"] # Using the opensearch container name
    
    opensearch.ssl.verificationMode: none
    opensearch.username: kibanaserver
    opensearch.password: kibanaserver
    opensearch.requestHeadersWhitelist: ["securitytenant","Authorization"]
    
    # Multitenancy
    opensearch_security.multitenancy.enabled: true
    opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
    opensearch_security.readonly_mode.roles: ["kibana_read_only"]
    ```
    {% include copy.html %}

1. Execute the following command to start OpenSearch Dashboards:

    ```bash
    docker run -d --name osd \
      --network os-net \
      -p 5601:5601 \
      -v ./opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml \
      opensearchproject/opensearch-dashboards:latest
    ```
    {% include copy.html %}

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

## Install OpenSearch Dashboards using Docker Compose

The [sample `docker-compose.yml`]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#sample-docker-composeyml) file on the OpenSearch Docker installation page already includes an `opensearch-dashboards` service. To install OpenSearch Dashboards using a custom configuration, follow these steps:

1. Create an `opensearch_dashboards.yml` file:
  
    ```yaml
    server.name: opensearch_dashboards
    server.host: "0.0.0.0"
    server.customResponseHeaders : { "Access-Control-Allow-Credentials" : "true" }
       
    # Disabling HTTPS on OpenSearch Dashboards
    server.ssl.enabled: false
       
    opensearch.ssl.verificationMode: none
    opensearch.username: kibanaserver
    opensearch.password: kibanaserver
    opensearch.requestHeadersWhitelist: ["securitytenant","Authorization"]
       
    # Multitenancy
    opensearch_security.multitenancy.enabled: true
    opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
    opensearch_security.readonly_mode.roles: ["kibana_read_only"]
    ```

    The `opensearch.hosts` setting must be configured if you are not passing it as an environment variable. For an example of how to configure this setting, see [Complete Docker Compose example with custom configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#complete-docker-compose-example-with-custom-configuration).
    {: .note}

1. Mount the `opensearch_dashboards.yml` file in the `opensearch-dashboards` service of your `docker-compose.yml` file:

    ```yaml
    opensearch-dashboards:
      volumes:
        - ./opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml
    ```

1. Start the containers:

    ```bash
    docker compose up -d
    ```
    {% include copy.html %}

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).
