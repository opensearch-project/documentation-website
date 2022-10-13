---
layout: default
title: Docker
parent: Install OpenSearch
nav_order: 3
---

# Why use Docker for OpenSearch?

[Docker](https://www.docker.com/) greatly simplifies the process of configuring and managing your OpenSearch clusters. You can pull official images from [Docker Hub](https://hub.docker.com/u/opensearchproject) or [AWS ECR](https://gallery.ecr.aws/opensearchproject/) and quickly deploy a cluster using [Docker Compose](https://github.com/docker/compose) and any of the sample Docker Compose files included in this guide. Experienced OpenSearch users can further customize their deployment by creating a custom Docker Compose file.

Docker containers are portable and will run on any compatible host that supports Docker (such as Linux, MacOS, and Windows). The portability of a Docker container offers flexibility over other installations methods, like [RPM]({{site.url}}{{site.baseurl}}/opensearch/install/rpm/) or a manual [Tarball]({{site.url}}{{site.baseurl}}/opensearch/install/tar/) installation, which both require additional configuration after downloading and unpacking.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), please refer to the official documentation on their websites.
{:.note}

## Install Docker and Docker Compose

Visit [Get Docker](https://docs.docker.com/get-docker/) for guidance on installing and configuring Docker for your environment. If you are installing Docker Engine using the CLI, then Docker, by default, will not have any constraints on available host resources. Depending on your environment, you may wish to configure resource limits in Docker. See [Runtime options with Memory, CPUs, and GPUs](https://docs.docker.com/config/containers/resource_constraints/) for information.

Docker Desktop users should set host memory utilization to a minimum of 4 GB by opening Docker Desktop and selecting **Settings** → **Resources**.
{: .tip}

Docker Compose is a utility that allows users to launch multiple containers with a single command. You pass a file to Docker Compose when you invoke it. Docker Compose reads those settings and starts the requested containers. Docker Compose is installed automatically with Docker Desktop, but users operating in a command line environment must install Docker Compose manually. You can find information about installing Docker Compose on the official [Docker Compose GitHub page](https://github.com/docker/compose).

If you need to install Docker Compose manually, and your host supports Python, you can use [pip](https://pypi.org/project/pip/) to install the [Docker Compose package](https://pypi.org/project/docker-compose/) automatically.
{: .tip}

## Important host settings

Before launching OpenSearch you should review some [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'} that can impact the performance of your services.
1. Disable memory paging and swapping performance on the host to improve performance.
   ```bash
   sudo swapoff -a
   ```
1. Increase the number of memory maps available to OpenSearch.
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

## Run OpenSearch in a Docker container

Official OpenSearch images are hosted on [Docker Hub](https://hub.docker.com/u/opensearchproject/) and [AWS Elastic Container Registry (ECR)](https://gallery.ecr.aws/opensearchproject/). If you want to inspect the images you can pull them individually using `docker pull`, such as in the following examples.

[Docker Hub](https://hub.docker.com/u/opensearchproject/):
```bash
docker pull opensearchproject/opensearch:latest
docker pull opensearchproject/opensearch-dashboards:latest
```

[AWS ECR](https://gallery.ecr.aws/opensearchproject/):
```bash
docker pull public.ecr.aws/opensearchproject/opensearch:latest
docker pull public.ecr.aws/opensearchproject/opensearch-dashboards:latest
```

To download a specific version of OpenSearch or OpenSearch Dashboards rather than the latest available version, modify the image tag where it is referenced (either in the command line or in a Docker Compose file). For example, `opensearchproject/opensearch:{{site.opensearch_version}}` will pull OpenSearch version {{site.opensearch_version}}. Refer to the official image repositories for available versions. 
{: .tip}

1. Verify that Docker is working correctly by deploying OpenSearch in a single container. The following command exposes ports 9200 (OpenSearch) and 9600 (Performance Analyzer plugin), and also sets `discovery.type` to `single-node` so that bootstrap checks succeed in this single node environment.
    ```bash
    docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" opensearchproject/opensearch:latest
    ```
1. Send a request to port 9200. The default username and password are `admin`.
    ```bash
    curl https://localhost:9200 -ku 'admin:admin'
    ```
    - You should get a response that looks like this:
      ```bash
      {
        "name" : "a937e018cee5",
        "cluster_name" : "docker-cluster",
        "cluster_uuid" : "GLAjAG6bTeWErFUy_d-CLw",
        "version" : {
          "distribution" : "opensearch",
          "number" : "2.3.0",
          "build_type" : "tar",
          "build_hash" : "6f6e84ebc54af31a976f53af36a5c69d474a5140",
          "build_date" : "2022-09-09T00:07:24.896263462Z",
          "build_snapshot" : false,
          "lucene_version" : "9.3.0",
          "minimum_wire_compatibility_version" : "7.10.0",
          "minimum_index_compatibility_version" : "7.0.0"
        },
        "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
1. Before stopping the running container, display a list of all running containers and copy the container ID for the OpenSearch node you are testing. In the following example, the container ID is `a937e018cee5`:
    ```bash
    $ docker container ls
    CONTAINER ID   IMAGE                                 COMMAND                  CREATED          STATUS          PORTS                                                                NAMES
    a937e018cee5   opensearchproject/opensearch:latest   "./opensearch-docker…"   19 minutes ago   Up 19 minutes   0.0.0.0:9200->9200/tcp, 9300/tcp, 0.0.0.0:9600->9600/tcp, 9650/tcp   wonderful_boyd
    ```
1. Stop the running container by passing the container ID to `docker stop`.
    ```bash
    docker stop <containerId>
    ```

Remember that `docker container ls` does not list stopped containers! If you would like to review stopped containers, use `docker container ls -a`. You can remove unneeded containers manually with `docker container rm <containerId_1> <containerId_2> <containerId_3> [...]` (pass all container IDs you wish to stop, separated by spaces), or if you want to remove all stopped containers you can use the shorter command `docker prune`.
{: .tip}

## Deploy an OpenSearch cluster using Docker Compose

Although it is possible to manually build an OpenSearch cluster running in Docker containers, it is far simpler to define your environment in a YAML file and let Docker Compose manage everything. The following section contains example YAML files that you can use to launch a pre-defined cluster with OpenSearch and OpenSearch Dashboards. These examples are useful for testing and development, but are not suitable for a production environment. If you don't have prior experience using Docker Compose, you may wish to review the Docker [Compose specification](https://docs.docker.com/compose/compose-file/) for guidance on syntax and formatting before making any changes to the dictionary structures in the examples.

The YAML file that defines the environment is referred to as a Docker Compose file. By default, `docker-compose` commands will first check your current directory for a file that matches any of the following names:
- `docker-compose.yml`
- `docker-compose.yaml`
- `compose.yml`
- `compose.yaml`

If none of those files exists in your current directory, the `docker-compose` command fails.

You can specify a custom file location and name when invoking `docker-compose` with the `-f` flag:
```bash
# Use a relative or absolute path to the file.
docker-compose up -f /path/to/your-file.yml
```

If this is your first time launching an OpenSearch cluster using Docker Compose, use the following example `docker-compose.yml` file. Save it in the home directory of your host and name it `docker-compose.yml`. This file will create a cluster that contains three containers: two containers running the OpenSearch service and a single container running OpenSearch Dashboards. These containers will communicate over a bridge network called `opensearch-net` and use two volumes, one for each OpenSearch node. Since this file does not explicitly disable the demo security configuration, self-signed TLS certificates are installed and internal users with default names and passwords are created.

### Sample docker-compose.yml
```yml
version: '3'
services:
  opensearch-node1: # This is also the hostname of the container within the Docker network (i.e. https://opensearch-node1/)
    image: opensearchproject/opensearch:latest # Specifying the latest available image - modify if you want a specific version
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
      - opensearch-data1:/usr/share/opensearch/data
    ports:
      - 9200:9200 # Rest API
      - 9600:9600 # Performance Analyzer
    networks:
      - opensearch-net # All of the containers will join the same network - 
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

From the directory containing `docker-compose.yml`, create and start the containers in detached mode:
```bash
docker-compose up -d
```

Verify that the service containers started correctly:
```bash
docker-compose ps
```

If a container failed to start, you can review the service logs:
```bash
# If you don't pass a service name, docker-compose will show you logs from all of the nodes
docker-compose logs <serviceName>
```

Stop the running containers in your cluster:
```bash
docker-compose down
```

`docker-compose down` will stop the running containers, but it will not remove the Docker volumes that exist on the host. If you don't care about the contents of these volumes, use the `-v` option to delete all volumes, e.g. `docker-compose down -v`.
{: .tip}

## Configure OpenSearch

Unlike the RPM distribution of OpenSearch, which requires a heavy amount of post-installation configuration, running OpenSearch clusters with Docker allows you to define the environment before the containers are even created.









{% comment %}

If you override `opensearch_dashboards.yml` settings using environment variables, as seen above, use all uppercase letters and underscores in place of periods (e.g. for `opensearch.hosts`, use `OPENSEARCH_HOSTS`).
{: .note}




You can pass a custom `opensearch.yml` file to the Docker container using the [`-v` flag](https://docs.docker.com/engine/reference/commandline/run#mount-volume--v---read-only) for `docker run`:

```bash
docker run \
-p 9200:9200 -p 9600:9600 \
-e "discovery.type=single-node" \
-v /<full-path-to>/custom-opensearch.yml:/usr/share/opensearch/config/opensearch.yml \
opensearchproject/opensearch:{{site.opensearch_version}}
```

You can perform the same operation in `docker-compose.yml` using a relative path:

```yml
services:
  opensearch-node1:
    volumes:
      - opensearch-data1:/usr/share/opensearch/data
      - ./custom-opensearch.yml:/usr/share/opensearch/config/opensearch.yml
  opensearch-node2:
    volumes:
      - opensearch-data2:/usr/share/opensearch/data
      - ./custom-opensearch.yml:/usr/share/opensearch/config/opensearch.yml
  opensearch-dashboards:
    volumes:
      - ./custom-opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml
```

You can also configure `docker-compose.yml` and `opensearch.yml` [to take your own certificates]({{site.url}}{{site.baseurl}}/opensearch/install/docker-security/) for use with the [Security]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/) plugin.


### (Optional) Set up Performance Analyzer

1. Enable the Performance Analyzer plugin:

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   If you receive the `curl: (52) Empty reply from server` error, you are likely protecting your cluster with the security plugin and you need to provide credentials. Modify the following command to use your username and password:

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. Enable the Root Cause Analyzer (RCA) framework

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   Similar to step 1, if you run into `curl: (52) Empty reply from server`, run the command below to enable RCA

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. By default, Performance Analyzer's endpoints are not accessible from outside the Docker container.

   To edit this behavior, open a shell session in the container and modify the configuration:

   ```bash
   docker ps # Look up the container id
   docker exec -it <container-id> /bin/bash
   # Inside container
   cd config/opensearch-performance-analyzer/
   vi performance-analyzer.properties
   ```

   Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`:

   ```
   # ======================== OpenSearch performance analyzer plugin config =========================

   # NOTE: this is an example for Linux. Please modify the config accordingly if you are using it under other OS.

   # WebService bind host; default to all interfaces
   webservice-bind-host = 0.0.0.0

   # Metrics data location
   metrics-location = /dev/shm/performanceanalyzer/

   # Metrics deletion interval (minutes) for metrics data.
   # Interval should be between 1 to 60.
   metrics-deletion-interval = 1

   # If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
   # metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
   # the files and wouldn't like for them to be cleaned up.
   cleanup-metrics-db-files = true

   # WebService exposed by App's port
   webservice-listener-port = 9600

   # Metric DB File Prefix Path location
   metrics-db-file-prefix-path = /tmp/metricsdb_

   https-enabled = false

   #Setup the correct path for certificates
   certificate-file-path = specify_path

   private-key-file-path = specify_path

   # Plugin Stats Metadata file name, expected to be in the same location
   plugin-stats-metadata = plugin-stats-metadata

   # Agent Stats Metadata file name, expected to be in the same location
   agent-stats-metadata = agent-stats-metadata
   ```

1. Then restart the Performance Analyzer agent:

   ```bash
   kill $(ps aux | grep -i 'PerformanceAnalyzerApp' | grep -v grep | awk '{print $2}')
   ```


## Bash access to containers

To create an interactive Bash session in a container, run `docker ps` to find the container ID. Then run:

```bash
docker exec -it <container-id> /bin/bash
```


## Install, configure or remove plugins

To run the image with a custom plugin, first create a [`Dockerfile`](https://docs.docker.com/engine/reference/builder/):

```
FROM opensearchproject/opensearch:{{site.opensearch_version}}
RUN /usr/share/opensearch/bin/opensearch-plugin install --batch <plugin-name-or-url>
```

Then run the following commands:

```bash
docker build --tag=opensearch-custom-plugin .
docker run -p 9200:9200 -p 9600:9600 -v /usr/share/opensearch/data opensearch-custom-plugin
```

You can also use a `Dockerfile` to pass your own certificates for use with the [security]({{site.url}}{{site.baseurl}}/security-plugin/) plugin, similar to the `-v` argument in [Configure OpenSearch](#configure-opensearch):

```
FROM opensearchproject/opensearch:{{site.opensearch_version}}
COPY --chown=opensearch:opensearch opensearch.yml /usr/share/opensearch/config/
COPY --chown=opensearch:opensearch my-key-file.pem /usr/share/opensearch/config/
COPY --chown=opensearch:opensearch my-certificate-chain.pem /usr/share/opensearch/config/
COPY --chown=opensearch:opensearch my-root-cas.pem /usr/share/opensearch/config/
```

Alternately, you might want to remove a plugin. This `Dockerfile` removes the security plugin:

```
FROM opensearchproject/opensearch:{{site.opensearch_version}}
RUN /usr/share/opensearch/bin/opensearch-plugin remove opensearch-security
COPY --chown=opensearch:opensearch opensearch.yml /usr/share/opensearch/config/
```

In this case, `opensearch.yml` is a "vanilla" version of the file with no plugin entries. It might look like this:

```yml
cluster.name: "docker-cluster"
network.host: 0.0.0.0
```

## Sample Docker Compose file for development

You can use this sample file as a development environment.

This sample file starts one OpenSearch node and a container for OpenSearch Dashboards with the security plugin disabled.

```yml
version: '3'
services:
  opensearch-node1:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node1
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
      - "DISABLE_INSTALL_DEMO_CONFIG=true" # disables execution of install_demo_configuration.sh bundled with security plugin, which installs demo certificates and security configurations to OpenSearch
      - "DISABLE_SECURITY_PLUGIN=true" # disables security plugin entirely in OpenSearch by setting plugins.security.disabled: true in opensearch.yml
      - "discovery.type=single-node" # disables bootstrap checks that are enabled when network.host is set to a non-loopback address
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536 # maximum number of open files for the OpenSearch user, set to at least 65536 on modern systems
        hard: 65536
    volumes:
      - opensearch-data1:/usr/share/opensearch/data
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - opensearch-net

  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:{{site.opensearch_dashboards_version}}
    container_name: opensearch-dashboards
    ports:
      - 5601:5601
    expose:
      - "5601"
    environment:
      - 'OPENSEARCH_HOSTS=["http://opensearch-node1:9200"]'
      - "DISABLE_SECURITY_DASHBOARDS_PLUGIN=true" # disables security dashboards plugin in OpenSearch Dashboards
    networks:
      - opensearch-net

volumes:
  opensearch-data1:

networks:
  opensearch-net:
```

The environment variable `"DISABLE_SECURITY_DASHBOARDS_PLUGIN=true"` disables the security dashboards plugin in OpenSearch Dashboards by removing the security dashboards plugin folder, removing all related settings in the `opensearch_dashboards.yml` file, and setting the `opensearch.hosts` entry protocol from HTTPS to HTTP.
You can't reverse this step as the security dashboards plugin is removed in the process.
To re-enable security for OpenSearch Dashboards, start a new container and set `DISABLE_SECURITY_DASHBOARDS_PLUGIN` to false or leave it unset.
{: .note}

# Docker security configuration

Before deploying to a production environment, you should replace the demo security certificates and configuration YAML files with your own. With the tarball, you have direct access to the file system, but the Docker image requires modifying the Docker storage volumes to include the replacement files.

Additionally, you can set the Docker environment variable `DISABLE_INSTALL_DEMO_CONFIG` to `true`. This change completely disables the demo installer.


## Sample Docker Compose file

```yml
version: '3'
services:
  opensearch-node1:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node1
      - discovery.seed_hosts=opensearch-node1,opensearch-node2
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
      - network.host=0.0.0.0 # required if not using the demo security configuration
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536 # maximum number of open files for the OpenSearch user, set to at least 65536 on modern systems
        hard: 65536
    volumes:
      - opensearch-data1:/usr/share/opensearch/data
      - ./root-ca.pem:/usr/share/opensearch/config/root-ca.pem
      - ./node.pem:/usr/share/opensearch/config/node.pem
      - ./node-key.pem:/usr/share/opensearch/config/node-key.pem
      - ./admin.pem:/usr/share/opensearch/config/admin.pem
      - ./admin-key.pem:/usr/share/opensearch/config/admin-key.pem
      - ./custom-opensearch.yml:/usr/share/opensearch/config/opensearch.yml
      - ./internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml
      - ./roles_mapping.yml:/usr/share/opensearch/config/opensearch-security/roles_mapping.yml
      - ./tenants.yml:/usr/share/opensearch/config/opensearch-security/tenants.yml
      - ./roles.yml:/usr/share/opensearch/config/opensearch-security/roles.yml
      - ./action_groups.yml:/usr/share/opensearch/config/opensearch-security/action_groups.yml
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - opensearch-net
  opensearch-node2:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: opensearch-node2
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node2
      - discovery.seed_hosts=opensearch-node1,opensearch-node2
      - cluster.initial_cluster_manager_nodes=opensearch-node1,opensearch-node2
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
      - network.host=0.0.0.0
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch-data2:/usr/share/opensearch/data
      - ./root-ca.pem:/usr/share/opensearch/config/root-ca.pem
      - ./node.pem:/usr/share/opensearch/config/node.pem
      - ./node-key.pem:/usr/share/opensearch/config/node-key.pem
      - ./admin.pem:/usr/share/opensearch/config/admin.pem
      - ./admin-key.pem:/usr/share/opensearch/config/admin-key.pem
      - ./custom-opensearch.yml:/usr/share/opensearch/config/opensearch.yml
      - ./internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml
      - ./roles_mapping.yml:/usr/share/opensearch/config/opensearch-security/roles_mapping.yml
      - ./tenants.yml:/usr/share/opensearch/config/opensearch-security/tenants.yml
      - ./roles.yml:/usr/share/opensearch/config/opensearch-security/roles.yml
      - ./action_groups.yml:/usr/share/opensearch/config/opensearch-security/action_groups.yml
    networks:
      - opensearch-net
  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:{{site.opensearch_dashboards_version}}
    container_name: opensearch-dashboards
    ports:
      - 5601:5601
    expose:
      - "5601"
    environment:
      OPENSEARCH_HOSTS: '["https://opensearch-node1:9200","https://opensearch-node2:9200"]' # must be a string with no spaces when specified as an environment variable
    volumes:
      - ./custom-opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml
    networks:
      - opensearch-net

volumes:
  opensearch-data1:
  opensearch-data2:

networks:
  opensearch-net:
```

Then make your changes to `opensearch.yml`. For a full list of settings, see [Security]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/). This example adds (extremely) verbose audit logging:

```yml
plugins.security.ssl.transport.pemcert_filepath: node.pem
plugins.security.ssl.transport.pemkey_filepath: node-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
plugins.security.ssl.transport.enforce_hostname_verification: false
plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: node.pem
plugins.security.ssl.http.pemkey_filepath: node-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: root-ca.pem
plugins.security.allow_default_init_securityindex: true
plugins.security.authcz.admin_dn:
  - CN=A,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA
plugins.security.nodes_dn:
  - 'CN=N,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
plugins.security.audit.type: internal_opensearch
plugins.security.enable_snapshot_restore_privilege: true
plugins.security.check_snapshot_restore_write_privileges: true
plugins.security.restapi.roles_enabled: ["all_access", "security_rest_api_access"]
cluster.routing.allocation.disk.threshold_enabled: false
opendistro_security.audit.config.disabled_rest_categories: NONE
opendistro_security.audit.config.disabled_transport_categories: NONE
```

Use this same override process to specify new [authentication settings]({{site.url}}{{site.baseurl}}/security-plugin/configuration/configuration/) in `/usr/share/opensearch/config/opensearch-security/config.yml`, as well as new default [internal users, roles, mappings, action groups, and tenants]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml/).

To start the cluster, run `docker-compose up`.

If you encounter any `File /usr/share/opensearch/config/opensearch.yml has insecure file permissions (should be 0600)` messages, you can use `chmod` to set file permissions before running `docker-compose up`. Docker Compose passes files to the container as-is.
{: .note }

Finally, you can reach OpenSearch Dashboards at http://localhost:5601, sign in, and use the **Security** panel to perform other management tasks.


## Using certificates with Docker

To use your own certificates in your configuration, add all of the necessary certificates to the volumes section of the Docker Compose file:

```yml
volumes:
- ./root-ca.pem:/full/path/to/certificate.pem
- ./admin.pem:/full/path/to/certificate.pem
- ./admin-key.pem:/full/path/to/certificate.pem
#Add other certificates
```

After replacing the demo certificates with your own, you must also include a custom `opensearch.yml` in your setup, which you need to specify in the volumes section.

```yml
volumes:
#Add certificates here
- ./custom-opensearch.yml: /full/path/to/custom-opensearch.yml
```

Remember that the certificates you specify in your Docker Compose file must be the same as the certificates listed in your custom `opensearch.yml` file. At a minimum, you should replace the root, admin, and node certificates with your own. For more information about adding and using certificates, see [Configure TLS certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls).

```yml
plugins.security.ssl.transport.pemcert_filepath: new-node-cert.pem
plugins.security.ssl.transport.pemkey_filepath: new-node-cert-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: new-root-ca.pem
plugins.security.ssl.http.pemcert_filepath: new-node-cert.pem
plugins.security.ssl.http.pemkey_filepath: new-node-cert-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: new-root-ca.pem
plugins.security.authcz.admin_dn:
  - CN=admin,OU=SSL,O=Test,L=Test,C=DE
```

To start the cluster, run `docker-compose up` as usual.

{% endcomment %}