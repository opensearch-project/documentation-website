---
layout: default
title: Compatibility
parent: Install OpenSearch
nav_order: 2
---

# Operating system and JVM compatibility

- We recommend installing OpenSearch on RHEL- or Debian-based Linux distributions that use [systemd](https://en.wikipedia.org/wiki/Systemd), such as CentOS, Amazon Linux 2, and Ubuntu (LTS). OpenSearch should work on many Linux distributions, but we only test a handful.
- The OpenSearch tarball ships with a compatible version of Java in the `jdk` directory. To find its version, run `./jdk/bin/java -version`. For example, the OpenSearch 1.0.0 tarball ships with Java 15.0.1+9 (non-LTS), while OpenSearch 1.3.0 includes Java 11.0.14.1+1 (LTS).
- OpenSearch 1.0 to 1.2.4 is built and tested with Java 15, while OpenSearch 1.3.0 is built and tested with Java 8, 11 and 14.

  To use a different Java installation, set the `OPENSEARCH_JAVA_HOME` or `JAVA_HOME` environment variable to the Java install location. We recommend Java 11 (LTS), but OpenSearch also works with Java 8.

OpenSearch version | Compatible Java versions | Recommended operating systems
:--- | :--- | :---
1.0 - 1.2.x | 11, 15 | Red Hat Enterprise Linux 7, 8; CentOS 7, 8; Amazon Linux 2; Ubuntu 16.04, 18.04, 20.04
1.3.x | 8, 11, 14 | Red Hat Enterprise Linux 7, 8; CentOS 7, 8; Amazon Linux 2; Ubuntu 16.04, 18.04, 20.04