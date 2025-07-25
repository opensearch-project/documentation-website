---
layout: default
title: OpenSearch plugins
parent: Install OpenSearch
nav_order: 90
canonical_url: https://docs.opensearch.org/latest/install-and-configure/plugins/
---

# Standalone OpenSearch plugin installation

If you don't want to use the all-in-one OpenSearch installation options, you can install the individual plugins on a compatible OpenSearch cluster, just like any other plugin.


---

#### Table of contents
1. TOC
{:toc}


---

## Plugin compatibility

<table>
  <thead style="text-align: left">
    <tr>
      <th>OpenSearch version</th>
      <th>Plugin versions</th>
    </tr>
  </thead>
  <tbody>
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

To install plugins manually, you must have the exact version of OpenSearch installed, down to the minor version.

{% comment %}

To get a list of available OpenSearch versions on CentOS 7 and Amazon Linux 2, run the following command:

```bash
sudo yum list opensearch-oss --showduplicates
```

Then you can specify the version that you need:

```bash
sudo yum install opensearch-oss-6.7.1
```




## Install plugins

Navigate to the OpenSearch home directory (most likely, it is `/usr/share/opensearch`), and run the install command for each plugin.


### Security

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-security/opensearch-security-{{site.opensearch_major_minor_version}}.1.0.zip
```

After installing the security plugin, you can run `sudo sh /usr/share/opensearch/plugins/opensearch-security/tools/install_demo_configuration.sh` to quickly get started with demo certificates. Otherwise, you must configure it manually and run [securityadmin.sh]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/).

The security plugin has a corresponding [OpenSearch Dashboards plugin]({{site.url}}{{site.baseurl}}/opensearch-dashboards/install/plugins) that you probably want to install as well.


### Job scheduler

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-job-scheduler/opensearch-job-scheduler-{{site.opensearch_major_minor_version}}.0.0.zip
```


### Alerting

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-alerting/opensearch-alerting-{{site.opensearch_major_minor_version}}.1.0.zip
```

To install Alerting, you must first install the Job Scheduler plugin. Alerting has a corresponding [OpenSearch Dashboards plugin]({{site.url}}{{site.baseurl}}/opensearch-dashboards/install/plugins/) that you probably want to install as well.


### SQL

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-sql/opensearch-sql-{{site.opensearch_major_minor_version}}.2.0.zip
```


### Reports scheduler

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-reports-scheduler/opensearch-reports-scheduler-{{site.opensearch_major_minor_version}}.0.0.zip
```


### Index State Management

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-index-management/opensearch-index-management-{{site.opensearch_major_minor_version}}.2.0.zip
```

To install Index State Management, you must first install the Job Scheduler plugin. ISM has a corresponding [OpenSearch Dashboards plugin]({{site.url}}{{site.baseurl}}/opensearch-dashboards/install/plugins/) that you probably want to install as well.


### k-NN

k-NN is only available as part of the all-in-one installs: Docker, RPM, and Debian.


### Anomaly detection

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-anomaly-detection/opensearch-anomaly-detection-{{site.opensearch_major_minor_version}}.0.0.zip
```


### Asynchronous search

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/opensearch-asynchronous-search/opensearch-asynchronous-search-{{site.opensearch_major_minor_version}}.0.1.zip
```


### Performance Analyzer

```bash
sudo bin/opensearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-plugins/performance-analyzer/opensearch-performance-analyzer-{{site.opensearch_major_minor_version}}.0.0.zip
```

Performance Analyzer requires some manual configuration after installing the plugin:

1. Create `/usr/lib/systemd/system/opensearch-performance-analyzer.service` based on [this file](https://github.com/opensearch-project/performance-analyzer/blob/master/packaging/opensearch-performance-analyzer.service).

1. Make the CLI executable:

   ```bash
   sudo chmod +x /usr/share/opensearch/bin/performance-analyzer-agent-cli
   ```

1. Run the appropriate `postinst` script for your Linux distribution:

   ```bash
   # Debian-based distros
   sudo sh /usr/share/opensearch/plugins/opensearch-performance-analyzer/install/deb/postinst.sh 1

   # RPM distros
   sudo sh /usr/share/opensearch/plugins/opensearch-performance-analyzer/install/rpm/postinst.sh 1
   ```

1. Make Performance Analyzer accessible outside of the host machine

   ```bash
   cd /usr/share/opensearch # navigate to the OpenSearch home directory
   cd plugins/opensearch_performance_analyzer/pa_config/
   vi performance-analyzer.properties
   ```

   Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`:

   ```bash
   # ======================== OpenSearch performance analyzer plugin config =========================

   # NOTE: this is an example for Linux. Please modify the config accordingly if you are using it under other OS.

   # WebService bind host; default to all interfaces
   webservice-bind-host = 0.0.0.0

   # Metrics data location
   metrics-location = /dev/shm/performanceanalyzer/

   # Metrics deletion interval (minutes) for metrics data.
   # Interval should be between 1 to 60.
   metrics-deletion-interval = 1

   # If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
   # metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This  can be useful, if you are archiving
   # the files and wouldn't like for them to be cleaned up.
   cleanup-metrics-db-files = true

   # WebService exposed by App's port
   webservice-listener-port = 9600

   # Metric DB File Prefix Path location
   metrics-db-file-prefix-path = /tmp/metricsdb_

   https-enabled = false

   #Setup the correct path for certificates
   certificate-file-path = specify_path

   private-key-file-path = specify_path

   # Plugin Stats Metadata file name, expected to be in the same location
   plugin-stats-metadata = plugin-stats-metadata

   # Agent Stats Metadata file name, expected to be in the same location
   agent-stats-metadata = agent-stats-metadata
   ```

1. Start the OpenSearch service:

   ```bash
   sudo systemctl start opensearch.service
   ```

1. Send a test request:

   ```bash
   curl -XGET "localhost:9600/_plugins/_performanceanalyzer/metrics?metrics=Latency,CPU_Utilization&agg=avg,max&dim=ShardID&nodes=all"
   ```
{% endcomment %}

## List installed plugins

To check your installed plugins:

```bash
sudo bin/opensearch-plugin list
```


## Remove plugins

If you are removing Performance Analyzer, see below. Otherwise, you can remove the plugin with a single command:

```bash
sudo bin/opensearch-plugin remove <plugin-name>
```

Then restart OpenSearch on the node:

```bash
sudo systemctl restart opensearch.service
```

## Update plugins

OpenSearch doesn't update plugins. Instead, you have to remove and reinstall them:

```bash
sudo bin/opensearch-plugin remove <plugin-name>
sudo bin/opensearch-plugin install <plugin-name>
```
