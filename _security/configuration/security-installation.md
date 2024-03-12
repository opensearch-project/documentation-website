---
layout: default
title: Security installation
parent: Configuration
nav_order: 60
---

# Security installation

The default version of OpenSearch comes with Security features pre-installed, however if the Security plugin was [disabled]({{site.url}}{{site.baseurl}}/security/configuration/disable/) or OpenSearch was installed without security, for example, using the minimal distribution method, you can enable the plugin as follows. 

Full cluster restart is necessary to enable security features
{: .label .label-red }

## Installation steps for prod cluster

1. Disable shard allocation and stop all nodes in order to prevent shards from moving around when the cluster is restarted.
  You need to disable in order to prevent shards moving around when the cluster is restarted.
```json
  PUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
  "transient": {
    "cluster.routing.allocation.enable": "none"
  }
}'
```
{% include copy-curl.html %}
2. Install plugin on all nodes
```bash
bin/opensearch-plugin install opensearch-security
```
{% include copy.html %}
3. Add necessary configuration to opensearch.yml for TLS encryption
[Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) details different settings which need to be configured
4. Create OPENSEARCH_INITIAL_ADMIN_PASSWORD variable
5. Restart the nodes and reenable shard allocation
```json
  PUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
  "transient": {
    "cluster.routing.allocation.enable": "all"
  }
}'
```
{% include copy-curl.html %}
