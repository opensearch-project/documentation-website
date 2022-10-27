---
layout: default
title: Quickstart guide
parent: Install OpenSearch
nav_order: 1
---

# Quickstart guide

The quickest way to get started using OpenSearch and OpenSearch Dashboards is to deploy your containers with [Docker](https://www.docker.com/). For information about why Docker is fast and easy, see [Why use OpenSearch with Docker?]({{site.url}}{{site.baseurl}}/opensearch/install/docker/).

Before proceeding, you should [get Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://github.com/docker/compose) and follow the steps to install them on your machine.

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should replace `docker-compose` with `docker compose` where it appears in this guide.
{: .note}

## Starting your cluster

Before you can spin-up your cluster you will need a special file, called a compose file, that Docker Compose uses to define and create the containers. We provide a sample compose file that you can use to get started.

Learn more about working with compose files by reviewing the official [Compose specification](https://docs.docker.com/compose/compose-file/).
{: .tip}

1. Before you can run OpenSearch on your machine, you should review and apply these [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'}.
    - Disable memory paging and swapping performance on the host to improve performance.
        ```bash
        sudo swapoff -a
        ```
    - Increase the number of memory maps available to OpenSearch.
        ```bash
        # Edit the sysctl config file.
        sudo vi /etc/sysctl.conf

        # Add a line to define the desired value
        # or change the value if the key exists,
        # and then save your changes.
        vm.max_map_count=262144

        # Reload the kernel parameters using sysctl.
        sudo sysctl -p

        # Verify that the change was applied by checking the value.
        cat /proc/sys/vm/max_map_count
        ```  
1. Download the sample compose file to your host. You can use a `curl` command, or copy the file from the OpenSearch Project [documentation-website](https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml) repository.
    ```bash
    # Using cURL
    curl -O https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml

    # Using wget
    wget https://github.com/opensearch-project/documentation-website/tree/{{site.opensearch_version}}/assets/examples/docker-compose.yml
    ```
1. In your terminal application, navigate to the directory containing the `docker-compose.yml` file you just downloaded and run the following command:
    ```bash
    # The '-d' option runs the containers as a background process
    # so you can continue to use your terminal window. Omit the '-d'
    # 
    docker-compose up -d
    ```
1. Next step

## Common issues

Review these common issues and suggested solutions if your containers fail to start or exit unexpectedly.

### -bash: docker-compose: command not found

If you installed Docker Desktop then Docker Compose is already installed on your machine. Try `docker compose` (without the hyphen) instead of `docker-compose`. See [Use Docker Compose](https://docs.docker.com/get-started/08_using_compose/).

### docker: 'compose' is not a docker command.

If you installed Docker Engine then you must install Docker Compose separately, and you will use the command `docker-compose` (with a hyphen). See [Docker Compose](https://github.com/docker/compose).

### max virtual memory areas vm.max_map_count [65530] is too low

OpenSearch will fail to start if your host is not configured with a high enough max map count. Review the [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'} if you see the following errors in the service log, and set `vm.max_map_count` appropriately.

```bash
opensearch-node1         | ERROR: [1] bootstrap checks failed
opensearch-node1         | [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
opensearch-node1         | ERROR: OpenSearch did not exit normally - check the logs at /usr/share/opensearch/logs/opensearch-cluster.log
```