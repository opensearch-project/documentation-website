---
layout: default
title: Installation quickstart
nav_order: 3
redirect_from: 
  - /about/quickstart/
  - /opensearch/install/quickstart/
  - /quickstart/
---

# Installation quickstart

OpenSearch supports multiple installation methods: Docker, Debian, Helm, RPM, tarball, and Windows.
This guide uses [Docker](https://www.docker.com/) for a quick local setup. For other installation options, see the full [Install and upgrade OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/) guide.

There are two ways to get started:

* [Try OpenSearch with a single command](#option-1-try-opensearch-in-one-command) -- Great for quick demos.
* [Set up a custom Docker cluster](#option-2-set-up-a-custom-docker-cluster) -- Ideal for more control.

## Prerequisite

Before you begin, install [Docker](https://docs.docker.com/get-docker/) on your machine.

## Option 1: Try OpenSearch in one command

Use this method to quickly spin up OpenSearch on your local machine with minimal setup.

This configuration disables security and should only be used in test environments.
{: .note }

Download and run OpenSearch: 

```bash
docker pull opensearchproject/opensearch:latest && docker run -it -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" opensearchproject/opensearch:latest
```
{% include copy.html %}

This process may take some time. After it finishes, OpenSearch is now running on port `9200`. To verify that OpenSearch is running, send the following request: 

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

## Option 2: Set up a custom Docker cluster

Use [Docker Compose](https://docs.docker.com/compose/) to run a local multi-node OpenSearch and OpenSearch Dashboards cluster:

- [Set up a cluster without security](#set-up-a-cluster-without-security-for-local-development) -- Best for local development.
- [Set up a cluster with security](#set-up-a-cluster-with-security-recommended-for-most-use-cases) -- Try OpenSearch with security by installing it with default certificates.

### Set up a cluster without security (for local development)

This setup uses a development Docker Compose file with security disabled.

This configuration disables security and should only be used in test environments.
{: .note }

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
    NAME                    COMMAND                  SERVICE                 STATUS              PORTS
    opensearch-dashboards   "./opensearch-dashbo…"   opensearch-dashboards   running             0.0.0.0:5601->5601/tcp
    opensearch-node1        "./opensearch-docker…"   opensearch-node1        running             0.0.0.0:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, 9650/tcp
    opensearch-node2        "./opensearch-docker…"   opensearch-node2        running             9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp
    ```

1. To verify that OpenSearch is running, send the following request: 

    ```bash
    curl http://localhost:9200
    ```
    {% include copy.html %}

    You should get a response similar to the one in [Option 1](#option-1-try-opensearch-in-one-command). 

You can now explore OpenSearch Dashboards by opening `http://localhost:5601/`.

### Set up a cluster with security (recommended for most use cases)

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

    For more information, see [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/).

1. Download the sample Compose file to your host. You can download the file with command line utilities like `curl` and `wget`, or you can manually copy [docker-compose.yml](https://github.com/opensearch-project/documentation-website/blob/{{site.opensearch_major_minor_version}}/assets/examples/docker-compose.yml) from the OpenSearch Project documentation-website repository using a web browser.

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

1. In your terminal application, navigate to the directory containing the `docker-compose.yml` file you downloaded, [set up a custom admin password]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#setting-a-custom-admin-password), and run the following command to create and start the cluster as a background process:
    
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
    NAME                    COMMAND                  SERVICE                 STATUS              PORTS
    opensearch-dashboards   "./opensearch-dashbo…"   opensearch-dashboards   running             0.0.0.0:5601->5601/tcp
    opensearch-node1        "./opensearch-docker…"   opensearch-node1        running             0.0.0.0:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, 9650/tcp
    opensearch-node2        "./opensearch-docker…"   opensearch-node2        running             9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp
    ```

1. Verify that OpenSearch is running. You should use `-k` (also written as `--insecure`) to disable hostname checking because the default security configuration uses demo certificates. Use `-u` to pass the default username and password (`admin:<custom-admin-password>`):

    ```bash
    curl https://localhost:9200 -ku admin:<custom-admin-password>
    ```
    {% include copy.html %}

    You should get a response similar to the one in [Option 1](#option-1-try-opensearch-in-one-command). 

You can now explore OpenSearch Dashboards by opening `https://localhost:5601/` in a web browser on the same host that is running your OpenSearch cluster. The default username is `admin`, and the default password is set in your `docker-compose.yml` file in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>` setting.

## Common issues

Review these common issues and suggested solutions if your containers fail to start or exit unexpectedly.

### Docker commands require elevated permissions

Eliminate the need for running your Docker commands with `sudo` by adding your user to the `docker` user group. See Docker's [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/) for more information.
```bash
sudo usermod -aG docker $USER
```

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
- [OpenSearch Dashboards quickstart]({{site.url}}{{site.baseurl}}/dashboards/quickstart/)

## Next steps

- See [Communicate with OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/communicate/) to learn about how to send requests to OpenSearch.
