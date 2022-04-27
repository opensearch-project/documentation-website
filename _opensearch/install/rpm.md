---
layout: default
title: RPM
parent: Install OpenSearch
nav_order: 51
---

The RPM installation provides everything you need to run OpenSearch inside a Linux distribution. As such, you can also make use of YUM to install a compatible RPM OpenSearch package.

RPM supports CentOS 7 and 8, and Amazon Linux 2. If you have your own Java installation and set `JAVA_HOME` in the terminal, macOS works, as well.

There are two methods for installing OpenSearch on RPM:

## Manual method

1. Download the RPM package directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

2. On your host, use `rpm -ivh` to install the package. 

  ```bash
  rpm -ivh opensearch-{{site.opensearch_version}}-linux-x64.rpm
  rpm -ivh opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
  ```

3. Run OpenSearch and OpenSearch Dashboards using `systemctl`.

  ```bash
  systemctl start opensearch
  systemctl start opensearch-dashboards
  ```

   If you configure the security plugin for production use (or disable it), you can run OpenSearch using `./bin/opensearch`.

4. Open a second terminal session, and send requests to the server to verify that OpenSearch is running:

   ```bash
   curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
   ```

## YUM method

1. 1. Download the RPM package directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

2. Place the downloaded package manually into your `/etc/yum.repo.d/`. You can also add the OpenSearch package with the yum configuration manager, `yum-config-manager --add-repo`.

3. Use `yum` to install the package.

  ```bash
  yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
  yum install opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
  ```

4. Run OpenSearch and OpenSearch Dashboards using `systemctl`.

  ```bash
  systemctl start opensearch
  systemctl start opensearch-dashboards
  ```

   If you configure the security plugin for production use (or disable it), you can run OpenSearch using `./bin/opensearch`.

4. Open a second terminal session, and send requests to the server to verify that OpenSearch is running:

   ```bash
   curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
   ```

### (Optional) Set up Performance Analyzer

In a tarball installation, Performance Analyzer collects data when it is enabled. But in order to read that data using the REST API on port 9600, you must first manually launch the associated reader agent process:

1. Make Performance Analyzer accessible outside of the host machine

   ```bash
   cd /usr/share/opensearch # navigate to the OpenSearch home directory
   cd plugins/opensearch_performance_analyzer/pa_config/
   vi performance-analyzer.properties
   ```

   Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`:

   ```
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
   # metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
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

1. Make the CLI executable:

   ```bash
   sudo chmod +x ./bin/performance-analyzer-agent-cli
   ```

1. Launch the agent CLI:

   ```bash
   OPENSEARCH_HOME="$PWD" ./bin/performance-analyzer-agent-cli
   ```

1. In a separate window, enable the Performance Analyzer plugin:

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   If you receive the `curl: (52) Empty reply from server` error, you are likely protecting your cluster with the security plugin and you need to provide credentials. Modify the following command to use your username and password:

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. Finally, enable the Root Cause Analyzer (RCA) framework

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   Similar to step 4, if you run into `curl: (52) Empty reply from server`, run the command below to enable RCA

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

{% comment %}

### (Optional) Removing Performance Analyzer

See [Clean up Performance Analyzer files]({{site.url}}{{site.baseurl}}/plugins#optional-clean-up-performance-analyzer-files).

{% endcomment %}

## Upgrade RPM

You can upgrade your RPM OpenSearch instance both manually and through YUM. 


### Manual 

Download the new version of OpenSearch you want to use, and then use `rmp -Uvh` to upgrade.

### YUM

To upgrade to the latest version of OpenSearch with YUM, use `yum upgrade`. You can also upgrade to a specific OpenSearch version by using `yum upgrade <package-version>`.
