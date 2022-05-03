---
layout: default
title: RPM
parent: Install OpenSearch
nav_order: 51
---

The RPM installation provides everything you need to run OpenSearch inside a Linux distribution. As such, you can also make use of YUM to install a compatible RPM OpenSearch package.

RPM supports CentOS 7 and 8, and Amazon Linux 2. If you have your own Java installation and set `JAVA_HOME` in the terminal, macOS works, as well.

There are two methods for installing OpenSearch on RPM. 

## Manual method


1. Download the RPM package directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

2. On your host, use `yum install` or `rpm -ivh` to install the package. We recommend using `yum install`, so that the required dependecies can be pulled from the YUM library. 

  ```bash
  yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
  yum install opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
  ```

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

YUM allows you to pull the RPM package from the YUM repository library. 

1. Create a repository file for both OpenSearch and OpenSearch dashboards:

  ```curl
  sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/opensearch-{{site.opensearch_version}}.repo -o /etc/yum.repos.d/{{site.opensearch_version}}.repo
  ```

  ```curl
  sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_version}}/opensearch-dashboards-{{site.opensearch_version}}.repo -o /etc/yum.repos.d/{{site.opensearch_version}}.repo
  ```

2. Navigate to your YUM repository directory:

  ```bash
  cd /etc/yum.repos.d/
  ```

3. Clean your YUM cache, to ensure a smooth installation:

  ```bash
  sudo yum clean all
  ```

3. With the repository file downloaded, list all available versions of OpenSearch:

  ```curl
  sudo yum list | grep opensearch
  ```

3. Chose the version of OpenSearch you want to install: 

  ```bash
  yum install opensearch
  yum install opensearch-dashboards
  ```

  Unless otherwise indicated, the highest minor version of OpenSearch installs.

  To install a specific version of OpenSearch

  ```bash
  yum install 'opensearch-{{site.opensearch_version}}'
  ```

5. During installation, the installer stops to see if the GPG key matches the OpenSearch project. Verify that the `Fingerprint` matches the following:

  ```
  Fingerprint: c5b7 4989 65ef d1c2 924b a9d5 39d3 1987 9310 d3fc
  ```

  If correct, enter `yes`. The OpenSearch installation continues.

6. Run OpenSearch and OpenSearch Dashboards using `systemctl`.

  ```bash
  systemctl start opensearch.service
  systemctl start opensearch-dashboards.service
  ```

  If you configure the security plugin for production use (or disable it), you can run OpenSearch using `./bin/opensearch`.

7. Open a second terminal session, and send requests to the server to verify that OpenSearch is running:

  ```bash
  curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
  curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
  ```

To stop running OpenSearch, enter:

```bash
systemctl stop opensearch.service
systemctl stop opensearch-dashboards.service
```


## (Optional) Set up Performance Analyzer

When enabled, the Performance Analyzer plugin collects data related to the performance of your OpenSearch instance. By default, the Performance Analyzer endpoints are not accessible outside the host machine.

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

2. Restart the OpenSearch service:

  ```bash
  systemctl restart opensearch.service
  ```

3. After OpenSearch is running, start the Performance Analyzer plugin:

 ```bash
 sudo systemctl start opensearch-performance-analyzer.service
 ```

 To stop the Performance Analyzer, enter:

 ```
 sudo systemctl stop opensearch-performance-analyzer.service
 ```


## Upgrade RPM

You can upgrade your RPM OpenSearch instance both manually and through YUM. 


### Manual 

Download the new version of OpenSearch you want to use, and then use `rmp -Uvh` to upgrade.

### YUM

To upgrade to the latest version of OpenSearch with YUM, use `yum upgrade`. You can also upgrade to a specific OpenSearch version by using `yum upgrade opensearch-<version-number>`.
