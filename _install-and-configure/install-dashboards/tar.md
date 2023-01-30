---
layout: default
title: Tarball
parent: Installing OpenSearch Dashboards
nav_order: 30
redirect_from: 
  - /dashboards/install/tar/
---

# Run OpenSearch Dashboards using the tarball

1. Download the tarball from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   # x64
   tar -zxf opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz
   cd opensearch-dashboards
   # ARM64
   tar -zxf opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz
   cd opensearch-dashboards
   ```

1. If desired, modify `config/opensearch_dashboards.yml`.

1. Run OpenSearch Dashboards:

   ```bash
   ./bin/opensearch-dashboards
   ```
