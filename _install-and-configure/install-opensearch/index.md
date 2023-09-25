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
  - /opensearch/install/index/
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

  Enabling the `bootstrap.memory_lock` setting will cause the JVM to reserve any memory it needs. The [Java SE Hotspot VM Garbage Collection Tuning Guide](https://docs.oracle.com/javase/9/gctuning/other-considerations.htm#JSGCT-GUID-B29C9153-3530-4C15-9154-E74F44E3DAD9) documents a default 1 gigabyte (GB) Class Metadata native memory reservation. Combined with Java heap, this may result in an error due to the lack of native memory on VMs with less memory than these requirements. To prevent errors, limit the reserved memory size using `-XX:CompressedClassSpaceSize` or `-XX:MaxMetaspaceSize` and set the size of the Java heap to make sure you have enough system memory.

- `OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m`

  Sets the size of the Java heap (we recommend half of system RAM).

- `nofile 65536`

  Sets a limit of 65536 open files for the OpenSearch user.

- `port 9600`

  Allows you to access Performance Analyzer on port 9600.

Do not declare the same JVM options in multiple locations because it can result in unexpected behavior or a failure of the OpenSearch service to start. If you declare JVM options using an environment variable, such as `OPENSEARCH_JAVA_OPTS=-Xms3g -Xmx3g`, then you should comment out any references to that JVM option in `config/jvm.options`. Conversely, if you define JVM options in `config/jvm.options`, then you should not define those JVM options using environment variables.
{: .note}

## Important system properties

OpenSearch has a number of system properties, listed in the following table, that you can specify in `config/jvm.options` or `OPENSEARCH_JAVA_OPTS` using `-D` command line argument notation.

Property | Description
:---------- | :-------- 
`opensearch.xcontent.string.length.max=<value>` | By default, OpenSearch does not impose any limits on the maximum length of the JSON string fields. To protect your cluster from potential distributed denial-of-service (DDoS) or memory issues, you can set the `opensearch.xcontent.string.length.max` system property to a reasonable limit (the maximum is 2,147,483,647), for example, `-Dopensearch.xcontent.string.length.max=5000000`.  | 
`opensearch.xcontent.fast_double_writer=[true|false]` | By default, OpenSearch serializes floating-point numbers using the default implementation provided by the Java Runtime Environment. Set this value to `true` to use the Schubfach algorithm, which is faster but may lead to small differences in precision. Default is `false`. |
