---
layout: default
title: OpenSearch plugins
parent: Install OpenSearch
nav_order: 90
canonical_url: https://docs.opensearch.org/latest/install-and-configure/plugins/
---

# OpenSearch plugin installation

You can install individual plugins on an OpenSearch cluster.


---

#### Table of contents
1. TOC
{:toc}


---

## Install a plugin

```
bin/opensearch-plugin install <plugin-name>
```
Restart your OpenSearch node after installing a plugin.

## Remove a plugin

```
bin/opensearch-plugin remove <plugin-name>
```
Restart your OpenSearch node after removing a plugin.

## List installed plugins

To check which plugins are currently installed:

```
bin/opensearch-plugin list
```

## Available plugins

<table>
  <thead style="text-align: left">
    <tr>
      <th>OpenSearch version</th>
      <th>Plugin versions</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>1.1.0</td>
    <td>
      <pre>analysis-icu                         1.1.0
analysis-kuromoji                    1.1.0
analysis-nori                        1.1.0
analysis-phonetic                    1.1.0
analysis-smartcn                     1.1.0
analysis-stempel                     1.1.0
analysis-ukrainian                   1.1.0
discovery-azure-classic              1.1.0
discovery-ec2                        1.1.0
discovery-gce                        1.1.0
ingest-attachment                    1.1.0
mapper-annotated-text                1.1.0
mapper-murmur3                       1.1.0
mapper-size                          1.1.0
opensearch-alerting                  1.1.0.0
opensearch-anomaly-detection         1.1.0.0
opensearch-asynchronous-search       1.1.0.0
opensearch-cross-cluster-replication 1.1.0.0
opensearch-index-management          1.1.0.0
opensearch-job-scheduler             1.1.0.0
opensearch-knn                       1.1.0.0
opensearch-notebooks                 1.1.0.0
opensearch-performance-analyzer      1.1.0.0
opensearch-reports-scheduler         1.1.0.0
opensearch-security                  1.1.0.0
opensearch-sql                       1.1.0.0
repository-azure                     1.1.0
repository-gcs                       1.1.0
repository-hdfs                      1.1.0
repository-s3                        1.1.0
store-smb                            1.1.0
transport-nio                        1.1.0
</pre>
    </td>
  </tr>
  <tr>
    <td>1.0.1</td>
    <td>
      <pre>opensearch-alerting             1.0.0.0
opensearch-anomaly-detection    1.0.0.0
opensearch-asynchronous-search  1.0.0.0
opensearch-index-management     1.0.1.0
opensearch-job-scheduler        1.0.0.0
opensearch-knn                  1.0.0.0
opensearch-notebooks            1.0.0.0
opensearch-performance-analyzer 1.0.1.0
opensearch-reports-scheduler    1.0.0.0
opensearch-security             1.0.1.0
opensearch-sql                  1.0.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>1.0.0</td>
    <td>
      <pre>opensearch-alerting             1.0.0.0
opensearch-anomaly-detection    1.0.0.0
opensearch-asynchronous-search  1.0.0.0
opensearch-index-management     1.0.0.0
opensearch-job-scheduler        1.0.0.0
opensearch-knn                  1.0.0.0
opensearch-notebooks            1.0.0.0
opensearch-performance-analyzer 1.0.0.0
opensearch-reports-scheduler    1.0.0.0
opensearch-security             1.0.0.0
opensearch-sql                  1.0.0.0
</pre>
    </td>
  </tr>
  </tbody>
</table>
