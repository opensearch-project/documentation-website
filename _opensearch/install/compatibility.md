---
layout: default
title: Compatibility
parent: Install OpenSearch
nav_order: 2
---

# Operating system compatibility

We recommend installing OpenSearch on Red Hat Enterprise Linux (RHEL) or Debian-based Linux distributions that use [systemd](https://en.wikipedia.org/wiki/Systemd), such as CentOS, Amazon Linux 2, or Ubuntu Long-Term Support (LTS). OpenSearch should work on most Linux distributions, but we only test a handful. We recommend RHEL 7 or 8, CentOS 7 or 8, Amazon Linux 2, or Ubuntu 16.04, 18.04, or 20.04 for any version of OpenSearch. OpenSearch also supports Windows Server 2019.

Avoid using a network file system for node storage in a production workflow. Using a network file system for node storage can cause performance issues in your cluster due to factors such as network conditions (like latency or limited throughput) or read/write speeds. You should use solid-state drives (SSDs) installed on the host for node storage where possible.
{: .note}

# Java compatibility

The OpenSearch distribution for Linux ships with a compatible [Adoptium JDK](https://adoptium.net/) version of Java in the `jdk` directory. To find the JDK version, run `./jdk/bin/java -version`. For example, the OpenSearch 1.0.0 tarball ships with Java 15.0.1+9 (non-LTS), OpenSearch 1.3.0 ships with Java 11.0.14.1+1 (LTS), and OpenSearch 2.0.0 ships with Java 17.0.2+8 (LTS). OpenSearch is tested with all compatible Java versions.

OpenSearch Version | Compatible Java Versions | Bundled Java Version
:---------- | :-------- | :-----------
1.0 - 1.2.x | 11, 15    | 15.0.1+9
1.3.x       | 8, 11, 14 | 11.0.14.1+1

To use a different Java installation, set the `OPENSEARCH_JAVA_HOME` or `JAVA_HOME` environment variable to the Java install location. For example:
```bash
export OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk
```