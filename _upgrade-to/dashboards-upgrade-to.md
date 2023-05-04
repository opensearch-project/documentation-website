---
layout: default
title: Migrating from Kibana OSS to OpenSearch Dashboards
nav_order: 50
---

# Migrating from Kibana OSS to OpenSearch Dashboards

Kibana OSS stores its visualizations and dashboards in one or more indexes (`.kibana*`) on the Elasticsearch OSS cluster. As such, the most important step is to leave those indexes intact as you migrate from Elasticsearch OSS to OpenSearch.

Consider exporting all Kibana objects prior to starting the migration. In Kibana, choose **Stack Management**, **Saved Objects**, **Export objects**.
{: .tip }

1. After you migrate your Elasticsearch OSS cluster to OpenSearch, stop Kibana.

1. For safety, make a backup copy of `<kibana-dir>/config/kibana.yml`.

1. Extract the OpenSearch Dashboards tarball to a new directory.

1. Port your settings from `<kibana-dir>/config/kibana.yml` to `<dashboards-dir>/config/opensearch_dashboards.yml`.

   In general, settings with `elasticsearch` in their names map to `opensearch` (for example, `elasticsearch.shardTimeout` and `opensearch.shardTimeout`) and settings with `kibana` in their names map to `opensearchDashboards` (for example, `kibana.defaultAppId` and `opensearchDashboards.defaultAppId`). Most other settings use the same names.

   For a full list of OpenSearch Dashboards settings, see [opensearch_dashboards.yml](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml){:target='\_blank'}.

1. If your OpenSearch cluster uses the Security plugin, preserve and modify the default settings in `opensearch_dashboards.yml`, particularly `opensearch.username` and `opensearch.password`.

   If you disabled the Security plugin on your OpenSearch cluster, remove or comment out all `opensearch_security` settings. Then run `rm -rf plugins/security-dashboards/` to remove the Security plugin.

1. Start OpenSearch Dashboards:

   ```
   ./bin/opensearch-dashboards
   ```

1. Log in, and verify that your saved searches, visualizations, and dashboards are present.
