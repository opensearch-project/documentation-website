---
layout: default
title: OpenSearch quickstart guide
parent: Install OpenSearch
nav_order: 1
---

# OpenSearch Quickstart Installation

The quickest way to get started using OpenSearch and OpenSearch Dashboards is to deploy your containers with [Docker](https://www.docker.com/). For information about why Docker is fast and easy, see [Why use OpenSearch with Docker?]({{site.url}}{{site.baseurl}}/opensearch/install/docker/).

Before proceeding, you should [get Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://github.com/docker/compose) and follow the steps to install them on your machine.

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should replace `docker-compose` with `docker compose` where it appears in this guide, or you will receive an error like `-bash: docker-compose: command not found`.
{: .note}

## Starting your containers

You need a special file, called a compose file, that Docker Compose uses to define and create the containers. We provide a sample file that you can use to get started.

Learn more about working with compose files by reviewing the official [Compose specification](https://docs.docker.com/compose/compose-file/).
{: .tip}

1. Before you can run OpenSearch on your machine, you should review and apply these [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'}.
    - Disable memory paging and swapping performance on the host to improve performance.
        ```bash
        sudo swapoff -a
        ```
    - Increase the number of memory maps available to OpenSearch.
        ```bash
        # Edit the sysctl config file
        sudo vi /etc/sysctl.conf

        # Add a line to define the desired value
        # or change the value if the key exists,
        # and then save your changes.
        vm.max_map_count=262144

        # Reload the kernel parameters using sysctl
        sudo sysctl -p

        # Verify that the change was applied by checking the value
        cat /proc/sys/vm/max_map_count
        ```
1. Download the sample compose file to your host. You can use a `curl` command, or copy the file from the OpenSearch Project [documentation-website](https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml) repository.
    ```bash
    curl -O https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml
    ```
1. In your terminal application, navigate the directory containing `docker-compose.yml` and run the following command:
    ```bash
    docker-compose up -d
    ```
1. 

### Sample docker-compose.yml
```yml
version: '3'
services:
  opensearch-node1: # This is also the hostname of the container within the Docker network (i.e. https://opensearch-node1/)
    image: opensearchproject/opensearch:latest
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster # Name the cluster
      - node.name=opensearch-node1 # Name the node that will run in this container
      - discovery.seed_hosts=opensearch-node1,opensearch-node2 # Nodes to look for when discovering the cluster
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2 # Nodes eligibile to serve as cluster manager
      - bootstrap.memory_lock=true # Disable JVM heap memory swapping
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" # Set min and max JVM heap sizes to at least 50% of system RAM
    ulimits:
      memlock:
        soft: -1 # Set memlock to unlimited (no soft or hard limit)
        hard: -1
      nofile:
        soft: 65536 # Maximum number of open files for the opensearch user - set to at least 65536
        hard: 65536
    volumes:
      - opensearch-data1:/usr/share/opensearch/data # Creates volume called opensearch-data1 and mounts it to the container
    ports:
      - 9200:9200 # REST API
      - 9600:9600 # Performance Analyzer
    networks:
      - opensearch-net # All of the containers will join the same Docker bridge network
  opensearch-node2:
    image: opensearchproject/opensearch:latest # This should be the same image used for opensearch-node1 to avoid issues
    container_name: opensearch-node2
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node2
      - discovery.seed_hosts=opensearch-node1,opensearch-node2
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch-data2:/usr/share/opensearch/data
    networks:
      - opensearch-net
  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:latest # Make sure the version of opensearch-dashboards matches the version of opensearch installed on other nodes
    container_name: opensearch-dashboards
    ports:
      - 5601:5601 # Map host port 5601 to container port 5601
    expose:
      - "5601" # Expose port 5601 for web access to OpenSearch Dashboards
    environment:
      OPENSEARCH_HOSTS: '["https://opensearch-node1:9200","https://opensearch-node2:9200"]' # Define the OpenSearch nodes that OpenSearch Dashboards will query
    networks:
      - opensearch-net

volumes:
  opensearch-data1:
  opensearch-data2:

networks:
  opensearch-net:
```