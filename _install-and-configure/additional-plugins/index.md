---
layout: default
title: Additional plugins
parent: Installing plugins
nav_order: 10
redirect_from:
  - /install-and-configure/additional-plugins/
---

# Additional plugins

There are many more plugins available in addition to those provided by the standard distribution of OpenSearch. These additional plugins have been built by OpenSearch developers or members of the OpenSearch community. Most are maintained in the [OpenSearch/plugins](https://github.com/opensearch-project/OpenSearch/tree/main/plugins) directory on GitHub and can be installed by name, for example, by running `bin/opensearch-plugin install <plugin-name>`. To list all plugins that you can install by name, run `bin/opensearch-plugin install --help`. Plugins maintained in a separate repository, such as `opensearch-jvector`, must be installed from a downloaded package.

The following table lists commonly used additional plugins and the earliest OpenSearch version in which each is available.

| Plugin name                                                                                                            | Earliest available version |
|:---|:---|
| `analysis-icu`                                                                                                           | 1.0.0                      |
| `analysis-kuromoji`                                                                                                      | 1.0.0                      |
| `analysis-nori`                                                                                                          | 1.0.0                      |
| [`analysis-phonenumber`]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/phone-analyzers/)                  | 2.18.0                     |
| `analysis-phonetic`                                                                                                      | 1.0.0                      |
| `analysis-smartcn`                                                                                                       | 1.0.0                      |
| [`analysis-stempel`]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/polish/)                                                                                                       | 1.0.0                      |
| [`analysis-ukrainian`]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/ukrainian/)                                                                                                     | 1.0.0                      |
| `discovery-azure-classic`                                                                                                | 1.0.0                      |
| `discovery-ec2`                                                                                                          | 1.0.0                      |
| `discovery-gce`                                                                                                          | 1.0.0                      |
| [`ingest-attachment`]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/ingest-attachment-plugin/) | 1.0.0                      |
| `ingestion-kafka`                                                                                                         | 3.0.0                      |
| `ingestion-kinesis`                                                                                                       | 3.0.0                      |
| `mapper-annotated-text`                                                                                                  | 1.0.0                      |
| `mapper-murmur3`                                                                                                         | 1.0.0                      |
| [`mapper-size`]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/mapper-size-plugin/)             | 1.0.0                      |
| [`opensearch-jvector`]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/opensearch-jvector/)       | 3.5.0                      |
| `query-insights`                                                                                                         | 2.12.0                     |
| `repository-azure`                                                                                                       | 1.0.0                      |
| `repository-gcs`                                                                                                         | 1.0.0                      |
| `repository-hdfs`                                                                                                        | 1.0.0                      |
| `repository-s3`                                                                                                          | 1.0.0                      |
| `store-smb`                                                                                                              | 1.0.0                      |
| `transport-grpc`                                                                                                         | 3.0.0                      |
| `workload-management` | 2.18.0 |

## Related documentation

- [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
- [`ingest-attachment` plugin]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/ingest-attachment-plugin/)
- [`mapper-size` plugin]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/mapper-size-plugin/)
- [`opensearch-jvector` plugin]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/opensearch-jvector/)
