---
layout: default
title: Docker
parent: Install and configure
nav_order: 1
---

# Docker image

You can pull the OpenSearch Docker image just like any other image:

```bash
docker pull opensearch/opensearch:{{site.opensearch_version}}
docker pull opensearch/opensearch-dashboards{{site.opensearch_version}}
```

To check available versions, see [Docker Hub](https://hub.docker.com/u/opensearch).

OpenSearch images use `centos:7` as the base image. If you run Docker locally, we recommend allowing Docker to use at least 4 GB of RAM in **Preferences** > **Resources**.


---

#### Table of contents
1. TOC
{:toc}


---

## Run the image

To run the image for local development:

```bash
docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" opensearch/opensearch:{{site.opensearch_version}}
```

Then send requests to the server to verify that OpenSearch is up and running:

```bash
curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
curl -XGET https://localhost:9200/_cat/nodes?v -u 'admin:admin' --insecure
curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
```

To find the container ID:

```bash
docker ps
```

Then you can stop the container using:

```bash
docker stop <container-id>
```


## Start a cluster

To deploy multiple nodes and simulate a more realistic deployment, create a [docker-compose.yml](https://docs.docker.com/compose/compose-file/) file appropriate for your environment and run:

```bash
docker-compose up
```

To stop the cluster, run:

```bash
docker-compose down
```

To stop the cluster and delete all data volumes, run:

```bash
docker-compose down -v
```


#### Sample Docker Compose file

This sample file starts two data nodes and a container for OpenSearch Dashboards.

```yml
version: '3'
services:
  opensearch-node1:
    image: opensearch/opensearch:latest
    container_name: opensearch-node1
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node1
      - discovery.seed_hosts=opensearch-node1,opensearch-node2
      - cluster.initial_master_nodes=opensearch-node1,opensearch-node2
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
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
  opensearch-node2:
    image: opensearch/opensearch:latest
    container_name: opensearch-node2
    environment:
      - cluster.name=opensearch-cluster
      - node.name=opensearch-node2
      - discovery.seed_hosts=opensearch-node1,opensearch-node2
      - cluster.initial_master_nodes=opensearch-node1,opensearch-node2
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
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
    image: opensearch/opensearch-dashboards:latest
    container_name: opensearch-dashboards
    ports:
      - 5601:5601
    expose:
      - "5601"
    environment:
      OPENSEARCH_HOSTS: https://opensearch-node1:9200
    networks:
      - opensearch-net

volumes:
  opensearch-data1:
  opensearch-data2:

networks:
  opensearch-net:

```

If you override `opensearch_dashboards.yml` settings using environment variables, as seen above, use all uppercase letters and periods in place of underscores (e.g. for `opensearch.url`, specify `OPENSEARCH_URL`).
{: .note}


## Configure OpenSearch

You can pass a custom `opensearch.yml` file to the Docker container using the [`-v` flag](https://docs.docker.com/engine/reference/commandline/run/#mount-volume--v---read-only) for `docker run`:

```bash
docker run \
-p 9200:9200 -p 9600:9600 \
-e "discovery.type=single-node" \
-v /<full-path-to>/custom-opensearch.yml:/usr/share/opensearch/config/opensearch.yml \
opensearch/opensearch:{{site.opensearch_version}}
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
  opensearch-dashboards
    volumes:
      - ./custom-opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml
```

You can use this same method to [pass your own certificates](../docker-security/) to the containers for use with the [Security](../../security/configuration/) plugin.


### (Optional) Set up Performance Analyzer

1. Enable the Performance Analyzer plugin:

   ```bash
   curl -XPOST localhost:9200/_opensearch/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   If you receive the `curl: (52) Empty reply from server` error, you are likely protecting your cluster with the security plugin and you need to provide credentials. Modify the following command to use your username and password:

   ```bash
   curl -XPOST https://localhost:9200/_opensearch/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. Enable the Root Cause Analyzer (RCA) framework

   ```bash
   curl -XPOST localhost:9200/_opensearch/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   Similar to step 1, if you run into `curl: (52) Empty reply from server`, run the command below to enable RCA

   ```bash
   curl -XPOST https://localhost:9200/_opensearch/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. By default, Performance Analyzer's endpoints are not accessible from outside the Docker container.

   To edit this behavior, open a shell session in the container and modify the configuration:

   ```bash
   docker ps # Look up the container id
   docker exec -it <container-id> /bin/bash
   # Inside container
   cd plugins/opensearch_performance_analyzer/pa_config/
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


## Important settings

For production workloads, make sure the [Linux setting](https://www.kernel.org/doc/Documentation/sysctl/vm.txt) `vm.max_map_count` is set to at least 262144. On the OpenSearch Docker image, this setting is the default. To verify, start a Bash session in the container and run:

```bash
cat /proc/sys/vm/max_map_count
```

To increase this value, you have to modify the Docker image. For other install types, add this setting to the host machine's `/etc/sysctl.conf` file with the following line:

```
vm.max_map_count=262144
```

Then run `sudo sysctl -p` to reload.

The `docker-compose.yml` file above also contains several key settings: `bootstrap.memory_lock=true`, `ES_JAVA_OPTS=-Xms512m -Xmx512m`, `nofile 65536` and `port 9600`. Respectively, these settings disable memory swapping (along with `memlock`), set the size of the Java heap (we recommend half of system RAM), set a limit of 65536 open files for the OpenSearch user, and allow you to access Performance Analyzer on port 9600.


## Customize the Docker image

To run the image with a custom plugin, first create a [`Dockerfile`](https://docs.docker.com/engine/reference/builder/):

```
FROM opensearch/opensearch:{{site.opensearch_version}}
RUN /usr/share/opensearch/bin/opensearch-plugin install --batch <plugin-name-or-url>
```

Then run the following commands:

```bash
docker build --tag=opensearch-custom-plugin .
docker run -p 9200:9200 -p 9600:9600 -v /usr/share/opensearch/data opensearch-custom-plugin
```

You can also use a `Dockerfile` to pass your own certificates for use with the [Security](../../security/) plugin, similar to the `-v` argument in [Configure OpenSearch](#configure-opensearch):

```
FROM opensearch/opensearch:{{site.opensearch_version}}
COPY --chown=opensearch:opensearch opensearch.yml /usr/share/opensearch/config/
COPY --chown=opensearch:opensearch my-key-file.pem /usr/share/opensearch/config/
COPY --chown=opensearch:opensearch my-certificate-chain.pem /usr/share/opensearch/config/
COPY --chown=opensearch:opensearch my-root-cas.pem /usr/share/opensearch/config/
```

Alternately, you might want to remove a plugin. This `Dockerfile` removes the security plugin:

```
FROM opensearch/opensearch:{{site.opensearch_version}}
RUN /usr/share/opensearch/bin/opensearch-plugin remove opensearch_security
COPY --chown=opensearch:opensearch opensearch.yml /usr/share/opensearch/config/
```

In this case, `opensearch.yml` is a "vanilla" version of the file with no OpenSearch entries. It might look like this:

```yml
cluster.name: "docker-cluster"
network.host: 0.0.0.0
```
