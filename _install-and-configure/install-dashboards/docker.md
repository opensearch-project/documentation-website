---
layout: default
title: Docker
parent: Installing OpenSearch Dashboards
nav_order: 1
redirect_from: 
  - /dashboards/install/docker/
  - /opensearch/install/docker-security/
---

# Run OpenSearch Dashboards using Docker and Docker Compose

You can use either Docker or Docker Compose to run OpenSearch Dashboards. The Docker Compose method is easier as you can define all your configuration is a single file.

## Run OpenSearch Dashboards using Docker

If you have defined your network using `docker network create os-net` and started your OpenSearch using the following command:

```bash
docker run -d --name opensearch-node -p 9200:9200 -p 9600:9600 --network os-net -e "discovery.type=single-node" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=<admin_password>" opensearchproject/opensearch:latest
```
{% include copy.html %}

You can start OpenSearch Dashboards using the following steps:

1. Create `opensearch_dashboards.yml` configuration file, see following example:

    ```bash
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

2. Execute the following command to start OpenSearch Dashboards:

    ```bash
    docker run -d --name osd \
      --network os-net \
      -p 5601:5601 \
      -v ./opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml \
      opensearchproject/opensearch-dashboards:latest
    ```
    {% include copy.html %}

## Run OpenSearch Dashboards using Docker Compose

Use the following steps to run OpenSearch Dashboards using Docker Compose:

1. Create a [`docker-compose.yml`](https://docs.docker.com/compose/compose-file/) file appropriate for your environment. A sample file that includes OpenSearch Dashboards is available on the OpenSearch [Docker installation page]({{site.url}}{{site.baseurl}}/opensearch/install/docker#sample-docker-composeyml).

   You can pass a custom `opensearch_dashboards.yml` to the container in the Docker Compose file. See [Complete Docker Compose example with custom configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#complete-docker-compose-example-with-custom-configuration) for more details.
   {: .tip }

1. Create `opensearch_dashboards.yml` file, see following example:
  
    ```
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

    The `opensearch.hosts` needs to be configured if you are not passing this as environment variable, as it is done in the [Complete Docker Compose example with custom configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#complete-docker-compose-example-with-custom-configuration).
    {: .note}

1. Run `docker compose up`.

   Wait for the containers to start. Then see the [OpenSearch Dashboards documentation]({{site.url}}{{site.baseurl}}/dashboards/index/).

1. When finished, run `docker compose down`.
