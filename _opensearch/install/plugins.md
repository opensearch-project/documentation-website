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

The install command takes a plugin id, which may be any of the following:

- An official OpenSearch plugin name
- Maven coordinates to a plugin zip file
- A URL to a plugin zip file

If you're installing an official OpenSearch plugin, use:
```
bin/opensearch-plugin install <plugin-name>
```

For a plugin installed via zip, use:
```
bin/opensearch-plugin install <name|Zip File|Url>
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
  <tr>
    <td>1.2.4</td>
    <td>
      <pre>opensearch-alerting                  1.2.4.0
opensearch-anomaly-detection         1.2.4.0
opensearch-asynchronous-search       1.2.4.0
opensearch-cross-cluster-replication 1.2.4.0
opensearch-index-management          1.2.4.0
opensearch-job-scheduler             1.2.4.0
opensearch-knn                       1.2.4.0
opensearch-observability             1.2.4.0
opensearch-performance-analyzer      1.2.4.0
opensearch-reports-scheduler         1.2.4.0
opensearch-security                  1.2.4.0
opensearch-sql                       1.2.4.0
</pre>
</td>
</tr>
    <td>1.2.3</td>
    <td>
      <pre>opensearch-alerting                  1.2.3.0
opensearch-anomaly-detection         1.2.3.0
opensearch-asynchronous-search       1.2.3.0
opensearch-cross-cluster-replication 1.2.3.0
opensearch-index-management          1.2.3.0
opensearch-job-scheduler             1.2.3.0
opensearch-knn                       1.2.3.0
opensearch-observability             1.2.3.0
opensearch-performance-analyzer      1.2.3.0
opensearch-reports-scheduler         1.2.3.0
opensearch-security                  1.2.3.0
opensearch-sql                       1.2.3.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.2</td>
    <td>
      <pre>opensearch-alerting                  1.2.2.0
opensearch-anomaly-detection         1.2.2.0
opensearch-asynchronous-search       1.2.2.0
opensearch-cross-cluster-replication 1.2.2.0
opensearch-index-management          1.2.2.0
opensearch-job-scheduler             1.2.2.0
opensearch-knn                       1.2.2.0
opensearch-observability             1.2.2.0
opensearch-performance-analyzer      1.2.2.0
opensearch-reports-scheduler         1.2.2.0
opensearch-security                  1.2.2.0
opensearch-sql                       1.2.2.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.1</td>
    <td>
      <pre>opensearch-alerting                  1.2.1.0
opensearch-anomaly-detection         1.2.1.0
opensearch-asynchronous-search       1.2.1.0
opensearch-cross-cluster-replication 1.2.1.0
opensearch-index-management          1.2.1.0
opensearch-job-scheduler             1.2.1.0
opensearch-knn                       1.2.1.0
opensearch-observability             1.2.1.0
opensearch-performance-analyzer      1.2.1.0
opensearch-reports-scheduler         1.2.1.0
opensearch-security                  1.2.1.0
opensearch-sql                       1.2.1.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.0</td>
    <td>
      <pre>opensearch-alerting                  1.2.0.0
opensearch-anomaly-detection         1.2.0.0
opensearch-asynchronous-search       1.2.0.0
opensearch-cross-cluster-replication 1.2.0.0
opensearch-index-management          1.2.0.0
opensearch-job-scheduler             1.2.0.0
opensearch-knn                       1.2.0.0
opensearch-observability             1.2.0.0
opensearch-performance-analyzer      1.2.0.0
opensearch-reports-scheduler         1.2.0.0
opensearch-security                  1.2.0.0
opensearch-sql                       1.2.0.0
</pre>
</td>
</tr>
<tr>
  <td>1.1.0</td>
  <td>
    <pre>opensearch-alerting                  1.1.0.0
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
