---
layout: default
title: Migrating from Open Distro Data Prepper
parent: Data Prepper
<<<<<<< HEAD:_data-prepper/migrate-open-distro.md
nav_order: 11
=======
nav_order: 2
>>>>>>> main:_clients/data-prepper/migrate-open-distro.md
---

# Migrating from Open Distro Data Prepper

Beginning with Data Prepper 1.1, there is only one distribution of Data Prepper: OpenSearch Data Prepper. This document helps existing users migrate from the Open Distro Data Prepper to OpenSearch Data Prepper.

## Change your pipeline configuration

The `elasticsearch` sink has changed to `opensearch`. Therefore, change your existing pipeline to use the `opensearch` plugin instead of `elasticsearch`.

While the Data Prepper plugin is titled `opensearch`, it remains compatible with Open Distro and ElasticSearch 7.x.
{: .note}

## Update Docker image

In your Data Prepper Docker configuration, adjust `amazon/opendistro-for-elasticsearch-data-prepper` to `opensearchproject/data-prepper`. This change will download the latest Data Prepper Docker image.

## Next steps

For more information about Data Prepper configurations, see [Getting Started with Data Prepper]({{site.url}}{{site.baseurl}}/clients/data-prepper/get-started/).
