---
layout: default
title: Installation quickstart
nav_order: 3
redirect_from: 
  - /about/quickstart/
  - /opensearch/install/quickstart/
  - /quickstart/
canonical_url: https://docs.opensearch.org/latest/getting-started/quickstart/
---

# Installation quickstart

To quickly get started using OpenSearch and OpenSearch Dashboards, deploy your containers using [Docker](https://www.docker.com/). For all installation guides, see [Install and upgrade OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/).

Before proceeding, you need to install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://github.com/docker/compose) on your local machine. 

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should remove the hyphen. For example, change `docker-compose` to `docker compose`.
{: .note}

## Starting your cluster

You'll need a special file, called a Compose file, that Docker Compose uses to define and create the containers in your cluster. The OpenSearch Project provides a sample Compose file that you can use to get started. Learn more about working with Compose files by reviewing the official [Compose specification](https://docs.docker.com/compose/compose-file/).

1. Before running OpenSearch on your machine, you should disable memory paging and swapping performance on the host to improve performance and increase the number of memory maps available to OpenSearch.
    
    Disable memory paging and swapping:
    
    ```bash
    sudo swapoff -a
    ```
    {% include copy.html %}

    Edit the sysctl config file that defines the host's max map count:

    ```bash
    sudo vi /etc/sysctl.conf
    ```
    {% include copy.html %}

    Set max map count to the recommended value of `262144`:
    
    ```bash
    vm.max_map_count=262144
    ```
    {% include copy.html %}

    Reload the kernel parameters:

    ```
    sudo sysctl -p
    ```  
    {% include copy.html %}

    For more information, see [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/).

1. Download the sample Compose file to your host. You can download the file with command line utilities like `curl` and `wget`, or you can manually copy [docker-compose.yml](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml) from the OpenSearch Project documentation-website repository using a web browser.

    To use cURL, send the following request:

    ```bash
    curl -O https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml
    ```
    {% include copy.html %}

    To use wget, send the following request:

    ```
    wget https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml
    ```
    {% include copy.html %}

1. In your terminal application, navigate to the directory containing the `docker-compose.yml` file you downloaded, [set up a custom admin password]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#setting-a-custom-admin-password), and run the following command to create and start the cluster as a background process:
    
    ```bash
    docker-compose up -d
    ```
    {% include copy.html %}

1. Confirm that the containers are running with the command `docker-compose ps`. You should see an output like the following:

    ```bash
    $ docker-compose ps
    NAME                    COMMAND                  SERVICE                 STATUS              PORTS
    opensearch-dashboards   "./opensearch-dashbo…"   opensearch-dashboards   running             0.0.0.0:5601->5601/tcp
    opensearch-node1        "./opensearch-docker…"   opensearch-node1        running             0.0.0.0:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, 9650/tcp
    opensearch-node2        "./opensearch-docker…"   opensearch-node2        running             9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp
    ```

1. Query the OpenSearch REST API to verify that the service is running. You should use `-k` (also written as `--insecure`) to disable hostname checking because the default security configuration uses demo certificates. Use `-u` to pass the default username and password (`admin:<custom-admin-password>`):

    ```bash
    curl https://localhost:9200 -ku admin:<custom-admin-password>
    ```
    {% include copy.html %}

    The response confirms that the installation was successful:

    ```json
    {
        "name" : "opensearch-node1",
        "cluster_name" : "opensearch-cluster",
        "cluster_uuid" : "W0B8gPotTAajhMPbC9D4ww",
        "version" : {
            "distribution" : "opensearch",
            "number" : "2.6.0",
            "build_type" : "tar",
            "build_hash" : "7203a5af21a8a009aece1474446b437a3c674db6",
            "build_date" : "2023-02-24T18:58:37.352296474Z",
            "build_snapshot" : false,
            "lucene_version" : "9.5.0",
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
        },
        "tagline" : "The OpenSearch Project: https://opensearch.org/"
    }
    ```
1. Explore OpenSearch Dashboards by opening `http://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. The default username is `admin` and the default password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.

## Common issues

Review these common issues and suggested solutions if your containers fail to start or exit unexpectedly.

### Docker commands require elevated permissions

Eliminate the need for running your Docker commands with `sudo` by adding your user to the `docker` user group. See Docker's [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/) for more information.
```bash
sudo usermod -aG docker $USER
```

### Error message: "-bash: docker-compose: command not found"

If you installed Docker Desktop, then Docker Compose is already installed on your machine. Try `docker compose` (without the hyphen) instead of `docker-compose`. See [Use Docker Compose](https://docs.docker.com/get-started/08_using_compose/).

### Error message: "docker: 'compose' is not a docker command."

If you installed Docker Engine, then you must install Docker Compose separately, and you will use the command `docker-compose` (with a hyphen). See [Docker Compose](https://github.com/docker/compose).

### Error message: "max virtual memory areas vm.max_map_count [65530] is too low"

OpenSearch will fail to start if your host's `vm.max_map_count` is too low. Review the [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/) if you see the following errors in the service log, and set `vm.max_map_count` appropriately.
```bash
opensearch-node1         | ERROR: [1] bootstrap checks failed
opensearch-node1         | [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
opensearch-node1         | ERROR: OpenSearch did not exit normally - check the logs at /usr/share/opensearch/logs/opensearch-cluster.log
```

## Other installation types

In addition to Docker, you can install OpenSearch on various Linux distributions and on Windows. For all available installation guides, see [Install and upgrade OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/).

## Further reading

You successfully deployed your own OpenSearch cluster with OpenSearch Dashboards and added some sample data. Now you're ready to learn about configuration and functionality in more detail. Here are a few recommendations on where to begin:
- [About the Security plugin]({{site.url}}{{site.baseurl}}/security/index/)
- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/)

## Next steps

- See [Communicate with OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/communicate/) to learn about how to send requests to OpenSearch.
