---
layout: default
title: RPM
parent: Install OpenSearch Dashboards
nav_order: 31
---

# Run OpenSearch Dashboards using RPM Package Manager (RPM)

OpenSearch Dashboards is the default visualization tool for data in OpenSearch. It also serves as a user interface for many of the OpenSearch plugins, including security, alerting, Index State Management, SQL, and more.

## Install OpenSearch Dashboards from a downloaded package

1. Download the RPM package for the desired version directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The RPM package can be download for both **x64** and **arm64** architectures.
1. Import the public GPG key. This key verifies that your OpenSearch instance is signed.
    ```bash
    sudo rpm --import https://artifacts.opensearch.org/publickeys/opensearch.pgp
    ```
1. From the command line interface (CLI), you can install the package with `rpm` or `yum`.
    **x64**
    ```bash
    # Install the x64 package using yum.
    sudo yum install opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
    # Install the x64 package using rpm.
    sudo rpm -ivh opensearch-dashboards-{{site.opensearch_version}}-linux-x64.rpm
    ```
    **arm64**
    ```bash
    # Install the arm64 package using yum.
    sudo yum install opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.rpm
    # Install the arm64 package using rpm.
    sudo rpm -ivh opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.rpm
    ```
1. After the installation succeeds, enable OpenSearch Dashboards as a service.
    ```bash
    sudo systemctl enable opensearch-dashboards
    ```
1. Start OpenSearch Dashboards.
    ```bash
    sudo systemctl start opensearch-dashboards
    ```
1. Verify that OpenSearch Dashboards launched correctly.
    ```bash
    sudo systemctl status opensearch-dashboards
    ```

## Install OpenSearch Dashboards from a local YUM repository

YUM, the primary package management tool for Red Hat-based operating systems, allows you to download and install the RPM package from the YUM repository library. 

1. Create a local repository file for OpenSearch Dashboards:
   ```bash
   sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/opensearch-2.x.repo -o /etc/yum.repos.d/opensearch-2.x.repo
   ```
   ```bash
   sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/2.x/opensearch-dashboards-2.x.repo -o /etc/yum.repos.d/opensearch-dashboards-2.x.repo
   ```
1. Verify that the repository was created successfully.
    ```bash
    sudo yum repolist
    ```
1. Clean your YUM cache, to ensure a smooth installation:
   ```bash
   sudo yum clean all
   ```
1. With the repository file downloaded, list all available versions of OpenSearch-Dashboards:
   ```bash
   sudo yum list opensearch-dashboards --showduplicates
   ```
1. Choose the version of OpenSearch Dashboards you want to install: 
   - Unless otherwise indicated, the highest minor version of OpenSearch installs.
   ```bash
   sudo yum install opensearch-dashboards
   ```
   - To install a specific version of OpenSearch Dashboards:**
   ```bash
   sudo yum install 'opensearch-dashboards-{{site.opensearch_version}}'
   ```
1. During installation, the installer stops to see if the GPG key matches the OpenSearch project. Verify that the `Fingerprint` matches the following:

   ```bash
   Fingerprint: c5b7 4989 65ef d1c2 924b a9d5 39d3 1987 9310 d3fc
   ```

   If correct, enter `yes` or `y`. The OpenSearch installation continues.
  
   Once complete, you can run OpenSearch inside your distribution. 