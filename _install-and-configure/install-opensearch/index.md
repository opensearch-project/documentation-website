---
layout: default
title: Installing OpenSearch
nav_order: 2
has_children: true
redirect_from:
  - /opensearch/install/
  - /opensearch/install/compatibility/
  - /opensearch/install/important-settings/
  - /install-and-configure/index/
canonical_url: https://docs.opensearch.org/latest/install-and-configure/install-opensearch/index/
---

# Installing OpenSearch

This section details how to install OpenSearch on your host, including which operating systems are [compatible with OpenSearch](#operating-system-compatibility), which [ports to open](#network-requirements), and which [important settings](#important-settings) to configure on your host.

## Operating system compatibility

OpenSearch and OpenSearch Dashboards are compatible with Red Hat Enterprise Linux (RHEL) and Debian-based Linux distributions that use [`systemd`](https://en.wikipedia.org/wiki/Systemd), such as CentOS, Amazon Linux 2, and Ubuntu Long-Term Support (LTS). While OpenSearch and OpenSearch Dashboards should work on most Linux distributions, we only test a subset. 

The following table lists the operating system versions that we currently support. 

OS | Version
:---------- | :-------- 
RHEL/CentOS |	7/8
Rocky Linux |	8
Ubuntu | 16.04/18.04/20.04
Windows Server | 2019


## File system recommendations

Avoid using a network file system for node storage in a production workflow. Using a network file system for node storage can cause performance issues in your cluster due to factors such as network conditions (like latency or limited throughput) or read/write speeds. You should use solid-state drives (SSDs) installed on the host for node storage where possible.

## Java compatibility

The OpenSearch distribution for Linux ships with a compatible [Adoptium JDK](https://adoptium.net/) version of Java in the `jdk` directory. To find the JDK version, run `./jdk/bin/java -version`. For example, the OpenSearch 1.0.0 tarball ships with Java 15.0.1+9 (non-LTS), OpenSearch 1.3.0 ships with Java 11.0.14.1+1 (LTS), and OpenSearch 2.0.0 ships with Java 17.0.2+8 (LTS). OpenSearch is tested with all compatible Java versions.

OpenSearch Version | Compatible Java Versions | Bundled Java Version
:---------- | :-------- | :-----------
1.0 - 1.2.x | 11, 15    | 15.0.1+9
1.3.x       | 8, 11, 14 | 11.0.14.1+1
2.0.0       | 11, 17    | 17.0.2+8

To use a different Java installation, set the `OPENSEARCH_JAVA_HOME` or `JAVA_HOME` environment variable to the Java install location. For example:
```bash
export OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk
```

## Network requirements

The following ports need to be open for OpenSearch components.

Port number | OpenSearch component
:--- | :--- 
443 | OpenSearch Dashboards in AWS OpenSearch Service with encryption in transit (TLS)
5601 | OpenSearch Dashboards
9200 | OpenSearch REST API
9250 | Cross-cluster search
9300 | Node communication and transport
9600 | Performance Analyzer

## Important settings

For production workloads, make sure the [Linux setting](https://www.kernel.org/doc/Documentation/sysctl/vm.txt) `vm.max_map_count` is set to at least 262144. Even if you use the Docker image, set this value on the *host machine*. To check the current value, run this command:

```bash
cat /proc/sys/vm/max_map_count
```

To increase the value, add the following line to `/etc/sysctl.conf`:

```
vm.max_map_count=262144
```

Then run `sudo sysctl -p` to reload.

The [sample docker-compose.yml]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#sample-docker-composeyml) file also contains several key settings:

- `bootstrap.memory_lock=true`

  Disables swapping (along with `memlock`). Swapping can dramatically decrease performance and stability, so you should ensure it is disabled on production clusters.

- `OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m`

  Sets the size of the Java heap (we recommend half of system RAM).

- `nofile 65536`

  Sets a limit of 65536 open files for the OpenSearch user.

- `port 9600`

  Allows you to access Performance Analyzer on port 9600.

Do not declare the same JVM options in multiple locations because it can result in unexpected behavior or a failure of the OpenSearch service to start. If you declare JVM options using an environment variable, such as `OPENSEARCH_JAVA_OPTS=-Xms3g -Xmx3g`, then you should comment out any references to that JVM option in `config/jvm.options`. Conversely, if you define JVM options in `config/jvm.options`, then you should not define those JVM options using environment variables.
{: .note}

