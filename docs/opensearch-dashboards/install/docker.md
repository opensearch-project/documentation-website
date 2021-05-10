---
layout: default
title: Docker
parent: Install OpenSearch Dashboards
grand_parent: OpenSearch Dashboards
nav_order: 1
---

# Run OpenSearch Dashboards using Docker

You *can* start OpenSearch Dashboards using `docker run` after [creating a Docker network](https://docs.docker.com/engine/reference/commandline/network_create/) and starting OpenSearch, but the process of connecting OpenSearch Dashboards to OpenSearch is significantly easier with a Docker Compose file.

1. Run `docker pull opensearchproject/opensearch-dashboards:{{site.opensearch_version}}`.

1. Create a [`docker-compose.yml`](https://docs.docker.com/compose/compose-file/) file appropriate for your environment. A sample file that includes OpenSearch Dashboards is available on the OpenSearch [Docker installation page](../opensearch/docker/#sample-docker-compose-file).

   Just like `opensearch.yml`, you can pass a custom `opensearch_dashboards.yml` to the container in the Docker Compose file.
   {: .tip }

1. Run `docker-compose up`.

   Wait for the containers to start. Then see the [OpenSearch Dashboards documentation](../../../opensearch-dashboards/).

1. When finished, run `docker-compose down`.
