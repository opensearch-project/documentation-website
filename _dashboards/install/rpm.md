---
layout: default
title: RPM
parent: Install OpenSearch Dashboards
nav_order: 31
---

# Run OpenSearch Dashboards using RPM

1. Create a repository file for OpenSearch Dashboards:

   ```bash
   sudo curl -SL https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/2.x/opensearch-dashboards-2.x.repo -o /etc/yum.repos.d/opensearch-2.x.repo
   ```

2. Clean your YUM cache, to ensure a smooth installation:

   ```bash
   sudo yum clean all
   ```

3. With the repository file downloaded, list all available versions of OpenSearch:

   ```bash
   sudo yum list | grep opensearch-dashboards
   ```

4. Choose the version of OpenSearch Dashboards you want to install:

   ```bash
   sudo yum install opensearch-dashboards
   ```

   Unless otherwise indicated, the highest minor version of OpenSearch Dashboards installs.

5. During installation, the installer stops to see if the GPG key matches the OpenSearch project. Verify that the `Fingerprint` matches the following:

   ```bash
   Fingerprint: c5b7 4989 65ef d1c2 924b a9d5 39d3 1987 9310 d3fc
   ```

   If correct, enter `yes` or `y`. The OpenSearch Dashboards installation continues.

6. Run OpenSearch Dashboards using `systemctl`.

   ```bash
   sudo systemctl start opensearch-dashboards.service
   ```

7. To stop running OpenSearch Dashboards, enter

   ```bash
   sudo systemctl stop opensearch-dashboards.service
   ```
