---
layout: default
title: Installation quickstart
nav_order: 3
description: "Quickly set up a local OpenSearch and OpenSearch Dashboards cluster using Docker, then add and search sample data to get started."
redirect_from: 
  - /about/quickstart/
  - /opensearch/install/quickstart/
  - /quickstart/
---

# Installation quickstart

OpenSearch supports multiple installation methods: Docker, Debian, Helm, RPM, tarball, and Windows.

This guide uses [Docker](https://www.docker.com/) for a quick local setup. For other installation options, see [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).

The configurations on this page are intended for local testing. They either disable security or use demo certificates, and they serve OpenSearch Dashboards over HTTP. To set up OpenSearch for production, see [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Security configuration]({{site.url}}{{site.baseurl}}/security/configuration/index/).
{: .note }

There are two ways to get started:

* [Try OpenSearch with a single command](#option-1-try-opensearch-in-one-command) -- Great for quick demos.
* [Set up a custom Docker cluster](#option-2-set-up-a-custom-docker-cluster) -- Ideal for more control.

## Prerequisite

Before you begin, install [Docker](https://docs.docker.com/get-docker/) on your machine.

## Option 1: Try OpenSearch in one command

Use this method to quickly spin up OpenSearch and OpenSearch Dashboards on your local machine with minimal setup. This configuration disables security.

Start OpenSearch:

```bash
docker pull opensearchproject/opensearch:latest && docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" --name opensearch opensearchproject/opensearch:latest
```
{% include copy.html %}

Start OpenSearch Dashboards:

```bash
docker pull opensearchproject/opensearch-dashboards:latest && docker run -d -p 5601:5601 --add-host=host.docker.internal:host-gateway -e "OPENSEARCH_HOSTS=http://host.docker.internal:9200" -e "DISABLE_SECURITY_DASHBOARDS_PLUGIN=true" --name opensearch-dashboards opensearchproject/opensearch-dashboards:latest
```
{% include copy.html %}

This process may take some time. After it finishes, OpenSearch is running on port `9200` and OpenSearch Dashboards on port `5601`. To verify that OpenSearch is running, send the following request: 

```bash
curl http://localhost:9200
```
{% include copy.html %}

You should get a response that looks like this:

```json
{
  "name" : "a937e018cee5",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "GLAjAG6bTeWErFUy_d-CLw",
  "version" : {
    "distribution" : "opensearch",
    "number" : <version>,
    "build_type" : <build-type>,
    "build_hash" : <build-hash>,
    "build_date" : <build-date>,
    "build_snapshot" : false,
    "lucene_version" : <lucene-version>,
    "minimum_wire_compatibility_version" : "7.10.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

To verify that OpenSearch Dashboards has started, go to `http://localhost:5601/` in your browser.

## Option 2: Set up a custom Docker cluster

Use [Docker Compose](https://docs.docker.com/compose/) to run a local multi-node OpenSearch and OpenSearch Dashboards cluster:

- [Set up a cluster without security](#set-up-a-cluster-without-security) -- Best for local development.
- [Set up a cluster with security](#set-up-a-cluster-with-security) -- Try OpenSearch with security by installing it with default certificates.

### Set up a cluster without security

This setup uses a development Docker Compose file with security disabled.

1. Create a directory for your OpenSearch cluster (for example, `opensearch-cluster`). Create a `docker-compose.yml` file in this directory and copy the contents of the [Docker Compose file for development]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#sample-docker-compose-file-for-development) into this file.

1. Start the cluster by running the following command:

    ```bash
    docker compose up -d
    ```
    {% include copy.html %}

1. Check that the containers are running:

    ```bash
    docker compose ps
    ```
    {% include copy.html %}

    You should see an output similar to the following:

    ```bash
    NAME                    IMAGE                                            COMMAND                  SERVICE                 CREATED          STATUS          PORTS
    opensearch-dashboards   opensearchproject/opensearch-dashboards:latest   "./opensearch-dashbo…"   opensearch-dashboards   30 seconds ago   Up 30 seconds   0.0.0.0:5601->5601/tcp, [::]:5601->5601/tcp
    opensearch-node1        opensearchproject/opensearch:latest              "./opensearch-docker…"   opensearch-node1        30 seconds ago   Up 30 seconds   0.0.0.0:9200->9200/tcp, [::]:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, [::]:9600->9600/tcp, 9650/tcp
    opensearch-node2        opensearchproject/opensearch:latest              "./opensearch-docker…"   opensearch-node2        30 seconds ago   Up 30 seconds   9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp
    ```

1. To verify that OpenSearch is running, send the following request: 

    ```bash
    curl http://localhost:9200
    ```
    {% include copy.html %}

    You should get a response similar to the one in [Option 1](#option-1-try-opensearch-in-one-command). 

You can now explore OpenSearch Dashboards by opening `http://localhost:5601/`.

### Set up a cluster with security

This configuration enables security using demo certificates and requires additional system setup.

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

    ```bash
    sudo sysctl -p
    ```  
    {% include copy.html %}

    For more information, see [important system settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings).

1. Download the sample Compose file to your host. You can download the file with command line utilities like `curl` and `wget`, or you can manually copy [`docker-compose.yml`](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml) from the OpenSearch Project documentation-website repository using a web browser.

    To use cURL, send the following request:

    ```bash
    curl -O https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml
    ```
    {% include copy.html %}

    To use wget, send the following request:

    ```bash
    wget https://raw.githubusercontent.com/opensearch-project/documentation-website/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml
    ```
    {% include copy.html %}

1. First, create a custom admin password. Create (or edit) a `.env` file in the same directory as your `docker-compose.yml` file. This file stores environment variables that Docker Compose automatically reads when starting the containers. Add the following line to define the admin password:

    ```bash
    OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
    ```
    {% include copy.html %}

1. In your terminal application, navigate to the directory containing the `docker-compose.yml` file you downloaded and run the following command to create and start the cluster as a background process:
    
    ```bash
    docker compose up -d
    ```
    {% include copy.html %}

1. Confirm that the containers are running using the following command:

    ```bash
    docker compose ps
    ```
    {% include copy.html %}

    You should see an output like the following:

    ```bash
    NAME                    IMAGE                                            COMMAND                  SERVICE                 CREATED          STATUS          PORTS
    opensearch-dashboards   opensearchproject/opensearch-dashboards:latest   "./opensearch-dashbo…"   opensearch-dashboards   30 seconds ago   Up 30 seconds   0.0.0.0:5601->5601/tcp, [::]:5601->5601/tcp
    opensearch-node1        opensearchproject/opensearch:latest              "./opensearch-docker…"   opensearch-node1        30 seconds ago   Up 30 seconds   0.0.0.0:9200->9200/tcp, [::]:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, [::]:9600->9600/tcp, 9650/tcp
    opensearch-node2        opensearchproject/opensearch:latest              "./opensearch-docker…"   opensearch-node2        30 seconds ago   Up 30 seconds   9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp
    ```

1. Verify that OpenSearch is running. You should use `-k` (also written as `--insecure`) to disable hostname checking because the default security configuration uses demo certificates. Use `-u` to pass the default username and password (`admin:<custom-admin-password>`):

    ```bash
    curl https://localhost:9200 -ku admin:<custom-admin-password>
    ```
    {% include copy.html %}

    You should get a response similar to the one in [Option 1](#option-1-try-opensearch-in-one-command). 

You can now explore OpenSearch Dashboards by opening `http://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. Log in as the `admin` user using the custom admin password that you set in the `.env` file.

## Common issues

If your containers fail to start or exit unexpectedly, see [Common issues]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#common-issues) in the Docker installation guide.

## Stop the cluster

To stop the containers that you started in [Option 1](#option-1-try-opensearch-in-one-command), run the following command:

```bash
docker stop opensearch opensearch-dashboards
```
{% include copy.html %}

Option 1 doesn't mount a volume, so the containers store your data internally. To start the containers again with your data intact, use `docker start` in place of `docker stop`. Removing the containers with `docker rm` deletes their data, including any indexes that you create in the following tutorials.

To stop the cluster that you started in [Option 2](#option-2-set-up-a-custom-docker-cluster), run the following command from the directory containing your `docker-compose.yml` file:

```bash
docker compose down
```
{% include copy.html %}

This command removes the containers and the network but keeps the named volumes in which the cluster stores your data, so running `docker compose up -d` again restores the cluster with your data intact. Adding `-v` to `docker compose down` deletes the volumes and the data in them.

## Other installation types

In addition to Docker, you can install OpenSearch and OpenSearch Dashboards on various Linux distributions and on Windows. For all available installation guides, see [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).

## Further reading

You successfully deployed your own OpenSearch cluster with OpenSearch Dashboards. To learn about configuration and functionality in more detail, see the following pages:
- [About the Security plugin]({{site.url}}{{site.baseurl}}/security/index/)
- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)

## Next steps

- To learn how to send requests to OpenSearch, see [Communicate with OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/communicate/).
