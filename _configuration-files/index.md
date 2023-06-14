---
layout: default
title: Configuration files
nav_order: 1
has_children: true
has_toc: false
nav_exclude: false
---

# Configuration files

You can find `opensearch.yml` in `/usr/share/opensearch/config/opensearch.yml` (Docker) or `/etc/opensearch/opensearch.yml` (most Linux distributions) on each node.

You can edit the `OPENSEARCH_PATH_CONF=/etc/opensearch` to change the config directory location. This variable is sourced from `/etc/default/opensearch`(Debian package) and `/etc/sysconfig/opensearch`(RPM package).

If you set your customized `OPENSEARCH_PATH_CONF` variable, be aware that other default environment variables will not be loaded.

You don't mark settings in `opensearch.yml` as persistent or transient, and settings use the flat form:

```yml
cluster.name: my-application
action.auto_create_index: true
compatibility.override_main_response_version: true
```

The demo configuration includes a number of settings for the Security plugin that you should modify before using OpenSearch for a production workload. To learn more, see [Security]({{site.url}}{{site.baseurl}}/security/).