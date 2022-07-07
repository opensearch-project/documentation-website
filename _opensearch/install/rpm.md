---
layout: default
title: RPM
parent: Install OpenSearch
nav_order: 51
---

# RPM

The RPM Package Manager (RPM) installation provides everything you need to run OpenSearch inside Red Hat or Red Hat-based Linux Distributions.  

RPM supports CentOS 7 and 8, and Amazon Linux 2. If you have your own Java installation and set `JAVA_HOME` in your terminal application, macOS works, as well.

There are two methods for installing OpenSearch on RPM: 

## Manual method


1. Download the RPM package directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The RPM package can be download both as `x64` and `arm64`. 

2. Import the public GPG key. This key verifies that the your OpenSearch instance is signed.

   ```bash
   sudo rpm --import https://artifacts.opensearch.org/publickeys/opensearch.pgp
   ```

3. On your host, use `sudo yum install` or `sudo rpm -ivh` to install the package. 

   **x64**

   ```bash
   sudo yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
   sudo yum install opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
   ```

   ```bash
   sudo rpm -ivh opensearch-{{site.opensearch_version}}-linux-x64.rpm
   sudo rpm -ivh opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
   ```
  
   **arm64**

   ```bash
   sudo yum install opensearch-{{site.opensearch_version}}-linux-x64.rpm
   sudo yum install opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.rpm
   ```

   ```bash
   sudo rpm -ivh opensearch-{{site.opensearch_version}}-linux-x64.rpm
   sudo rpm -ivh opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.rpm
   ```
  
   Once complete, you can run OpenSearch inside your distribution.

## YUM method

YUM, an RPM package management tool, allows you to pull the RPM package from the YUM repository library. 

1. Create a repository file for both OpenSearch and OpenSearch Dashboards:

   ```bash
   sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/opensearch-2.x.repo -o /etc/yum.repos.d/opensearch-2.x.repo
   ```

   ```bash
   sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/2.x/opensearch-dashboards-2.x.repo -o /etc/yum.repos.d/opensearch-dashboards-2.x.repo
   ```
  
   To verify that the repos appear in your repo list, use `sudo yum repolist`.

2. Clean your YUM cache, to ensure a smooth installation:

   ```bash
   sudo yum clean all
   ```

3. With the repository file downloaded, list all available versions of OpenSearch and OpenSearch-Dashboards:

   ```bash
   sudo yum list opensearch --showduplicates
   sudo yum list opensearch-dashboards --showduplicates
   ```

4. Choose the version of OpenSearch you want to install: 

   ```bash
   sudo yum install opensearch
   sudo yum install opensearch-dashboards
   ```

   Unless otherwise indicated, the highest minor version of OpenSearch installs.

   To install a specific version of OpenSearch:

   ```bash
   sudo yum install 'opensearch-{{site.opensearch_version}}'
   ```

5. During installation, the installer stops to see if the GPG key matches the OpenSearch project. Verify that the `Fingerprint` matches the following:

   ```bash
   Fingerprint: c5b7 4989 65ef d1c2 924b a9d5 39d3 1987 9310 d3fc
   ```

   If correct, enter `yes` or `y`. The OpenSearch installation continues.
  
   Once complete, you can run OpenSearch inside your distribution. 

## Run OpenSearch

1. Run OpenSearch and OpenSearch Dashboards using `systemctl`.

   ```bash
   sudo systemctl start opensearch.service
   sudo systemctl start opensearch-dashboards.service
   ```

2. Send requests to the server to verify that OpenSearch is running:

   ```bash
   curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/config?v -u 'admin:admin' --insecure
   ```

3. To stop running OpenSearch, enter:

   ```bash
   sudo systemctl stop opensearch.service
   sudo systemctl stop opensearch-dashboards.service
   ```


## *(Optional)* Set up Performance Analyzer

When enabled, the Performance Analyzer plugin collects data related to the performance of your OpenSearch instance. To start the Performance Analyzer plugin, enter:

```bash
sudo systemctl start opensearch-performance-analyzer.service
```

To stop the Performance Analyzer, enter:

```bash
sudo systemctl stop opensearch-performance-analyzer.service
```

## Upgrade RPM

You can upgrade your RPM OpenSearch instance both manually and through YUM. 


### Manual 

Download the new version of OpenSearch you want to use, and then use `rpm -Uvh` to upgrade.

### YUM

To upgrade to the latest version of OpenSearch with YUM, use `sudo yum update`. You can also upgrade to a specific OpenSearch version by using `sudo yum update opensearch-<version-number>`.
