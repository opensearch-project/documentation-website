---
layout: default
title: System indexes
parent: Configuration
nav_order: 4
redirect_from:
 - /security-plugin/configuration/system-indices/
---

# System indexes

By default, OpenSearch has a protected system index, `.opendistro_security`, which is used to store the Security configuration YAML files. You create this index using [securityadmin.sh]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/). Even with a user account that has read permissions for all indexes, you can't directly access the data in this system index.

Instead, you first need to authenticate with an [admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates) to gain access:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XGET 'https://localhost:9200/.opendistro_security/_search'
```

When Security is installed, the demo configuration automatically creates the `.opendistro_security` system index. It also adds several other indexes for the various OpenSearch plugins that integrate with the Security plugin:

```yml
plugins.security.system_indices.enabled: true
plugins.security.system_indices.indices: [".opendistro-alerting-config", ".opendistro-alerting-alert*", ".opendistro-anomaly-results*", ".opendistro-anomaly-detector*", ".opendistro-anomaly-checkpoints", ".opendistro-anomaly-detection-state", ".opendistro-reports-*", ".opendistro-notifications-*", ".opendistro-notebooks", ".opendistro-asynchronous-search-response*"]
```

You can add additional system indexes in `opensearch.yml`. An alternative way to remove a system index is to delete it from the `plugins.security.system_indices.indices` list on each node and restart OpenSearch.

