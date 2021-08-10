---
layout: default
title: Common issues
nav_order: 1
has_toc: false
redirect_from: /troubleshoot/
---

# Common issues

This page contains a list of common issues and workarounds.


## Java error during startup

You might see `[ERROR][c.a.o.s.s.t.OpenSearchSecuritySSLNettyTransport] [opensearch-node1] SSL Problem Insufficient buffer remaining for AEAD cipher fragment (2). Needs to be more than tag size (16)` when starting OpenSearch. This problem is a [known issue with Java](https://bugs.openjdk.java.net/browse/JDK-8221218) and doesn't affect the operation of the cluster.


## OpenSearch Dashboards fails to start

If you encounter the error `FATAL  Error: Request Timeout after 30000ms` during startup, try running OpenSearch Dashboards on a more powerful machine. We recommend four CPU cores and 8 GB of RAM.


## Encryption at rest

The operating system for each OpenSearch node handles encryption of data at rest. To enable encryption at rest in most Linux distributions, use the `cryptsetup` command:

```bash
cryptsetup luksFormat --key-file <key> <partition>
```

For full documentation on the command, see [the Linux man page](https://man7.org/linux/man-pages/man8/cryptsetup.8.html).

{% comment %}
## Beats

If you encounter compatibility issues when attempting to connect Beats to OpenSearch, make sure you're using the Apache 2.0 distribution of Beats, not the default distribution, which uses a proprietary license.

Try this minimal output configuration for using Beats with the security plugin:

```yml
output.elasticsearch:
  hosts: ["localhost:9200"]
  protocol: https
  username: "admin"
  password: "admin"
  ssl.certificate_authorities:
    - /full/path/to/root-ca.pem
  ssl.certificate: "/full/path/to/client.pem"
  ssl.key: "/full/path/to/client-key.pem"
```

Even if you use the OSS version, Beats might check for a proprietary plugin on the OpenSearch server and throw an error during startup. To disable the check, try adding these settings:

```yml
setup.ilm.enabled: false
setup.ilm.check_exists: false
```


## Logstash

If you have trouble connecting Logstash to OpenSearch, try this minimal output configuration, which works with the security plugin:

```conf
output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "logstash-index-test"
    user => "admin"
    password => "admin"
    ssl => true
    cacert => "/full/path/to/root-ca.pem"
    ilm_enabled => false
  }
}
```
{% endcomment %}

## Can't update by script when FLS, DLS, or field masking is active

The security plugin blocks the update by script operation (`POST <index>/_update/<id>`) when field-level security, document-level security, or field masking are active. You can still update documents using the standard index operation (`PUT <index>/_doc/<id>`).


## Illegal reflective access operation in logs

This is a known issue with Performance Analyzer that shouldn't affect functionality.


## Multi-tenancy issues in OpenSearch Dashboards

If you're testing multiple users in OpenSearch Dashboards and encounter unexpected changes in tenant, use Google Chrome in an Incognito window or Firefox in a Private window.
