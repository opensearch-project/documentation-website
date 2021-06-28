---
layout: default
title: Compatibility
parent: Install OpenSearch
nav_order: 2
---

# Operating system and JVM compatibility

- We recommend installing OpenSearch on RHEL- or Debian-based Linux distributions that use [systemd](https://en.wikipedia.org/wiki/Systemd), such as CentOS, Amazon Linux 2, and Ubuntu (LTS). OpenSearch should work on many Linux distributions, but we only test a handful.
- The OpenSearch tarball ships with a compatible version of Java in the `jdk` directory. To find its version, run `./bin/opensearch --version`.

  To use a different Java installation, set the `OPENSEARCH_JAVA_HOME` environment variable to the Java install location. We recommend Java 11 (LTS), but OpenSearch also works with Java 8.

OpenSearch version | Compatible Java versions | Recommended operating systems
:--- | :--- | :---
1.x | 8, 11 | Red Hat Enterprise Linux 7, 8; CentOS 7, 8; Amazon Linux 2; Ubuntu 16.04, 18.04, 20.04
