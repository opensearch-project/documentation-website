---
layout: default
title: Docker
parent: Installing OpenSearch Dashboards
nav_order: 1
redirect_from: 
  - /dashboards/install/docker/
  - /opensearch/install/docker-security/
---

# Run OpenSearch Dashboards using Docker

You *can* start OpenSearch Dashboards using `docker run` after [creating a Docker network](https://docs.docker.com/engine/reference/commandline/network_create/) and starting OpenSearch, but the process of connecting OpenSearch Dashboards to OpenSearch is significantly easier with a Docker Compose file.

1. Run `docker pull opensearchproject/opensearch-dashboards:2`.

1. Create a [`docker-compose.yml`](https://docs.docker.com/compose/compose-file/) file appropriate for your environment. A sample file that includes OpenSearch Dashboards is available on the OpenSearch [Docker installation page]({{site.url}}{{site.baseurl}}/opensearch/install/docker#sample-docker-composeyml).

   Just like `opensearch.yml`, you can pass a custom `opensearch_dashboards.yml` to the container in the Docker Compose file.
   {: .tip }

1. Run `docker-compose up`.

   Wait for the containers to start. Then see the [OpenSearch Dashboards documentation]({{site.url}}{{site.baseurl}}/dashboards/index/).

1. When finished, run `docker-compose down`.
