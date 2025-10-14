---
layout: default
title: Additional plugins
parent: Installing plugins
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/install-and-configure/additional-plugins/index/
---

# Additional plugins

There are many more plugins available in addition to those provided by the standard distribution of OpenSearch. These additional plugins have been built by OpenSearch developers or members of the OpenSearch community. While it isn't possible to provide an exhaustive list (because many plugins are not maintained in an OpenSearch GitHub repository), the following plugins, available in the [OpenSearch/plugins](https://github.com/opensearch-project/OpenSearch/tree/main/plugins) directory on GitHub, are some of the plugins that can be installed using one of the installation options, for example, using the command `bin/opensearch-plugin install <plugin-name>`.

| Plugin name                                                                                                            | Earliest available version |
|:---|:---|
| `analysis-icu`                                                                                                           | 1.0.0                      |
| `analysis-kuromoji`                                                                                                      | 1.0.0                      |
| `analysis-nori`                                                                                                          | 1.0.0                      |
| [`analysis-phonenumber`]({{site.url}}{{site.baseurl}}/analyzers/supported-analyzers/phone-analyzers/)                  | 2.18.0                     |
| `analysis-phonetic`                                                                                                      | 1.0.0                      |
| `analysis-smartcn`                                                                                                       | 1.0.0                      |
| `analysis-stempel`                                                                                                       | 1.0.0                      |
| `analysis-ukrainian`                                                                                                     | 1.0.0                      |
| `discovery-azure-classic`                                                                                                | 1.0.0                      |
| `discovery-ec2`                                                                                                          | 1.0.0                      |
| `discovery-gce`                                                                                                          | 1.0.0                      |
| [`ingest-attachment`]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/ingest-attachment-plugin/) | 1.0.0                      |
| `ingestion-kafka`                                                                                                         | 3.0.0                      |
| `ingestion-kinesis`                                                                                                       | 3.0.0                      |
| `mapper-annotated-text`                                                                                                  | 1.0.0                      |
| `mapper-murmur3`                                                                                                         | 1.0.0                      |
| [`mapper-size`]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/mapper-size-plugin/)             | 1.0.0                      |
| `query-insights`                                                                                                         | 2.12.0                     |
| `repository-azure`                                                                                                       | 1.0.0                      |
| `repository-gcs`                                                                                                         | 1.0.0                      |
| `repository-hdfs`                                                                                                        | 1.0.0                      |
| `repository-s3`                                                                                                          | 1.0.0                      |
| `store-smb`                                                                                                              | 1.0.0                      |
| `transport-grpc`                                                                                                         | 3.0.0                      |

## Related articles

[Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
[`ingest-attachment` plugin]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/ingest-attachment-plugin/)
[`mapper-size` plugin]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/mapper-size-plugin/)
