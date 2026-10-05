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

You can use either Docker or Docker Compose to run OpenSearch Dashboards. The Docker Compose method is easier because the sample Compose file starts OpenSearch and OpenSearch Dashboards together.

## Prerequisites

Install OpenSearch using Docker. For more information, see [Installing OpenSearch using Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/).

## Install OpenSearch Dashboards using Docker

If you have defined your network using `docker network create os-net` and started OpenSearch using the following command:

```bash
docker run -d --name opensearch-node -p 9200:9200 -p 9600:9600 --network os-net -e "discovery.type=single-node" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD=<admin_password>" opensearchproject/opensearch:latest
```
{% include copy.html %}

Then you can start OpenSearch Dashboards using the following steps:

1. Start OpenSearch Dashboards, specifying the OpenSearch container name in the `OPENSEARCH_HOSTS` environment variable:

    ```bash
    docker run -d --name osd \
      --network os-net \
      -p 5601:5601 \
      -e 'OPENSEARCH_HOSTS=["https://opensearch-node:9200"]' \
      opensearchproject/opensearch-dashboards:latest
    ```
    {% include copy.html %}

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. If OpenSearch Dashboards runs on a remote host, replace `localhost` with the IP address or DNS name of that host. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

## Install OpenSearch Dashboards using Docker Compose

The [sample `docker-compose.yml`]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#sample-docker-composeyml) file includes an `opensearch-dashboards` service, so OpenSearch Dashboards starts together with OpenSearch. When you [deploy the cluster using Docker Compose]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#deploy-an-opensearch-cluster-using-docker-compose), no additional steps are required to install OpenSearch Dashboards.

In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. If OpenSearch Dashboards runs on a remote host, replace `localhost` with the IP address or DNS name of that host. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

## Customizing the OpenSearch Dashboards configuration

The OpenSearch Dashboards image includes a default `opensearch_dashboards.yml` file that works with the demo security configuration, so most deployments don't need to change it. To change a setting, pass it as an environment variable. The variable name is the setting name in uppercase, with dots replaced by underscores. For example, `OPENSEARCH_HOSTS` sets `opensearch.hosts`, and `OPENSEARCH_REQUESTTIMEOUT` sets `opensearch.requestTimeout`.

When using `docker run`, pass the variables with the `-e` option. When using Docker Compose, add the variables to the `environment` section of the `opensearch-dashboards` service:

```yaml
opensearch-dashboards:
  environment:
    OPENSEARCH_HOSTS: '["https://opensearch-node1:9200","https://opensearch-node2:9200"]'
    OPENSEARCH_REQUESTTIMEOUT: 60000
```

Not every setting can be passed as an environment variable. To use settings that aren't supported as environment variables, create your own `opensearch_dashboards.yml` file and mount it in the container, replacing the default file. Because the mounted file replaces the default file entirely, it must contain every setting that OpenSearch Dashboards needs, including `opensearch.hosts` and the connection credentials. For an example, see [Complete Docker Compose example with custom configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#complete-docker-compose-example-with-custom-configuration).

## Related documentation

- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
