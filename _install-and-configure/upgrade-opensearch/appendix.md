---
layout: default
title: Upgrade Appendix
parent: Upgrading OpenSearch
nav_order: 99
---

# Upgrade Appendix

Refer to the topics in this appendix for additional supporting documentation, such as example API requests and configuration files that were used for testing and validation of steps in upgrade procedures. If you would like to request specific topics to include in this appendix, please comment on the [upgrade and migration documentation meta issue](https://github.com/opensearch-project/documentation-website/issues/2830) in the [OpenSearch Project](https://github.com/opensearch-project) on GitHub.

## Rolling upgrade

Validation was performed by upgrading an Elasticsearch 7.10.2 cluster to OpenSearch 1.3.7; however, this process can be applied to any **N→N+1** version upgrade of OpenSearch on any platform. Certain commands, such as listing running containers in Docker, are included as an aid to the reader, but the specific commands used on your host(s) will be different depending on your distribution and host operating system.