---
layout: default
title: Enabling security
parent: Configuration
nav_order: 45
---

# Enabling security

The default version of OpenSearch comes with Security features pre-installed, however if the Security plugin was [disabled]({{site.url}}{{site.baseurl}}/security/configuration/disable/) or OpenSearch was installed without security, for example, using the minimal distribution method, you can enable the plugin as follows.

A full cluster restart is necessary to enable security features.
{: .warning}

To enable security

1. Disable shard allocation and stop all nodes in order to prevent shards from moving around when the cluster is restarted.
```json
curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
  "transient": {
    "cluster.routing.allocation.enable": "none"
  }
}'
```
{% include copy.html %}
2. Install the plugin on all nodes.
```bash
bin/opensearch-plugin install opensearch-security
```
{% include copy.html %}
3. Add the necessary configuration to opensearch.yml for TLS encryption.
[Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) details different settings which need to be configured
4. Create the OPENSEARCH_INITIAL_ADMIN_PASSWORD variable.
5. Restart the nodes and reenable shard allocation.
```json
curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
  "transient": {
    "cluster.routing.allocation.enable": "all"
  }
}'
```
{% include copy.html %}
