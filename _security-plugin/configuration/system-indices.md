---
layout: default
title: System indices
parent: Configuration
nav_order: 15
canonical_url: https://docs.opensearch.org/latest/security/configuration/system-indices/
---

# System indices

By default, OpenSearch has a protected system index, `.opendistro_security`, which you create using [securityadmin.sh]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/). Even if your user account has read permissions for all indices, you can't directly access the data in this system index.

You can add additional system indices in in `opensearch.yml`. In addition to automatically creating `.opendistro_security`, the demo configuration adds several indices for the various OpenSearch plugins that integrate with the security plugin:

```yml
plugins.security.system_indices.enabled: true
plugins.security.system_indices.indices: [".opendistro-alerting-config", ".opendistro-alerting-alert*", ".opendistro-anomaly-results*", ".opendistro-anomaly-detector*", ".opendistro-anomaly-checkpoints", ".opendistro-anomaly-detection-state", ".opendistro-reports-*", ".opendistro-notifications-*", ".opendistro-notebooks", ".opendistro-asynchronous-search-response*"]
```

To access these indices, you must authenticate with an [admin certificate]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls#configure-admin-certificates):

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XGET 'https://localhost:9200/.opendistro_security/_search'
```

The alternative is to remove indices from the `plugins.security.system_indices.indices` list on each node and restart OpenSearch.
