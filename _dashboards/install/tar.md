---
layout: default
title: Tarball
parent: Install OpenSearch Dashboards
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/install-and-configure/install-dashboards/tar/
---

# Run OpenSearch Dashboards using the tarball

1. Download the tarball from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   # x64
   tar -zxf opensearch-dashboards-{{site.opensearch_version}}-linux-x64.tar.gz
   cd opensearch-dashboards{% comment %}# ARM64
   tar -zxf opensearch-dashboards-{{site.opensearch_version}}-linux-arm64.tar.gz
   cd opensearch-dashboards{% endcomment %}
   ```

1. If desired, modify `config/opensearch_dashboards.yml`.

1. Run OpenSearch Dashboards:

   ```bash
   ./bin/opensearch-dashboards
   ```

1. See the [OpenSearch Dashboards documentation]({{site.url}}{{site.baseurl}}/dashboards/index/).
