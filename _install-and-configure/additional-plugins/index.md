---
layout: default
title: Additional Plugins
nav_order: 20
has_children: true
redirect_from:
  - /additional-plugins/index/
---

# Built-in plugins

Members of the OpenSearch community have built countless plugins for the service. Although it isn't possible to build an exhaustive list of every plugin, since many plugins are not maintained within the OpenSearch GitHub repository, the following list of plugins are available to be installed by name using `bin/opensearch-plugin install <plugin-name>`.

| Plugin name | Earliest available version |
| :--- | :--- |
| analysis-icu | 1.0.0 |
| analysis-kuromoji | 1.0.0 |
| analysis-nori | 1.0.0 |
| analysis-phonetic | 1.0.0 |
| analysis-smartcn | 1.0.0 |
| analysis-stempel | 1.0.0 |
| analysis-ukrainian | 1.0.0 |
| discovery-azure-classic | 1.0.0 |
| discovery-ec2 | 1.0.0 |
| discovery-gce | 1.0.0 |
| ingest-attachment | 1.0.0 |
| mapper-annotated-text | 1.0.0 |
| mapper-murmur3 | 1.0.0 |
| mapper-size | 1.0.0 |
| query-insights | 2.12.0 |
| repository-azure | 1.0.0 |
| repository-gcs | 1.0.0 |
| repository-hdfs | 1.0.0 |
| repository-s3 | 1.0.0 |
| store-smb | 1.0.0 |
| transport-nio | 1.0.0 |

### `mapper-size` Plugin

The `mapper-size` plugin enables the use of the `_size` field in OpenSearch indices. This field stores the size in bytes of each document.

See [`mapper-size` Plugin]({{site.url}}{{site.baseurl}}/install-and-configure/built-in-plugins/mapper-size-plugin/) for more information about the `mapper-size` plugin.