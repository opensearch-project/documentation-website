---
layout: default
title: Compatible operating systems
nav_order: 12
canonical_url: https://docs.opensearch.org/latest/install-and-configure/os-comp/
---

OpenSearch and OpenSearch Dashboards are compatible with Red Hat Enterprise Linux (RHEL) and Debian-based Linux distributions that use [`systemd`](https://en.wikipedia.org/wiki/Systemd), such as Amazon Linux, and Ubuntu Long-Term Support (LTS). While OpenSearch and OpenSearch Dashboards should work on most Linux distributions, we only test a subset. 

## Supported operating systems

The following table lists the operating system versions that we are currently testing:

OS | Version
:---------- | :-------- 
Rocky Linux | 8
Alma Linux | 8
Amazon Linux | 2/2023
Ubuntu | 20.04
Windows Server | 2019


## Change log 

The following table lists changes made to operating system compatibility. 

<div class="table-styler"></div>

| Date       | Issue | PR | Details |
|:-----------|:-------|:-------|:--------------------------|
| 2024-07-23 | [opensearch-build Issue 4379](https://github.com/opensearch-project/opensearch-build/issues/4379) | [PR 7821](https://github.com/opensearch-project/documentation-website/pull/7821) | Remove [CentOS7](https://blog.centos.org/2023/04/end-dates-are-coming-for-centos-stream-8-and-centos-linux-7/). |
| 2024-03-08 | [opensearch-build Issue 4573](https://github.com/opensearch-project/opensearch-build/issues/4573) | [PR 6637](https://github.com/opensearch-project/documentation-website/pull/6637) | Remove CentOS8, add Almalinux8/Rockylinux8, and remove Ubuntu 16.04/18.04 because we currently only test on 20.04 |
| 2023-06-06 | [documentation-website Issue 4217](https://github.com/opensearch-project/documentation-website/issues/4217) | [PR 4218](https://github.com/opensearch-project/documentation-website/pull/4218) | Support matrix creation |