---
layout: default
title: Migrating from Open Distro
nav_order: 30
redirect_from:
  - /clients/data-prepper/migrate-open-distro/
canonical_url: https://docs.opensearch.org/latest/data-prepper/migrate-open-distro/
---

# Migrating from Open Distro

Existing users can migrate from the Open Distro OpenSearch Data Prepper to OpenSearch Data Prepper. Beginning with OpenSearch Data Prepper version 1.1, there is only one distribution of OpenSearch Data Prepper. 

## Change your pipeline configuration

The `elasticsearch` sink has changed to `opensearch`. Therefore, change your existing pipeline to use the `opensearch` plugin instead of `elasticsearch`.

While the OpenSearch Data Prepper plugin is titled `opensearch`, it remains compatible with Open Distro and ElasticSearch 7.x.
{: .note}

## Update Docker image

In your OpenSearch Data Prepper Docker configuration, adjust `amazon/opendistro-for-elasticsearch-data-prepper` to `opensearchproject/data-prepper`. This change will download the latest OpenSearch Data Prepper Docker image.

## Next steps

For more information about OpenSearch Data Prepper configurations, see [Getting Started with OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/clients/data-prepper/get-started/).
