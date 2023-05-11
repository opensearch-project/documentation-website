---
layout: default
title: Common issues
nav_order: 1
has_toc: false
nav_exclude: true
redirect_from: /troubleshoot/
---

# Common issues

This page contains a list of common issues and workarounds.


## OpenSearch Dashboards fails to start

If you encounter the error `FATAL  Error: Request Timeout after 30000ms` during startup, try running OpenSearch Dashboards on a more powerful machine. We recommend four CPU cores and 8 GB of RAM.


## Requests to OpenSearch Dashboards fail with "Request must contain a osd-xsrf header"

If you run legacy Kibana OSS scripts against OpenSearch Dashboards---for example, curl commands that import saved objects from a file---they might fail with the following error:

```json
{"status": 400, "body": "Request must contain a osd-xsrf header."}
```

In this case, your scripts likely include the `"kbn-xsrf: true"` header. Switch it to the `osd-xsrf: true` header:

```
curl -XPOST -u 'admin:admin' 'https://DASHBOARDS_ENDPOINT/api/saved_objects/_import' -H 'osd-xsrf:true' --form file=@export.ndjson
```


## Multi-tenancy issues in OpenSearch Dashboards

If you're testing multiple users in OpenSearch Dashboards and encounter unexpected changes in tenant, use Google Chrome in an Incognito window or Firefox in a Private window.


## Expired certificates

If your certificates have expired, you might receive the following error or something similar:

```
ERROR org.opensearch.security.ssl.transport.SecuritySSLNettyTransport - Exception during establishing a SSL connection: javax.net.ssl.SSLHandshakeException: PKIX path validation failed: java.security.cert.CertPathValidatorException: validity check failed
Caused by: java.security.cert.CertificateExpiredException: NotAfter: Thu Sep 16 11:27:55 PDT 2021
```

To check the expiration date for a certificate, run this command:

```bash
openssl x509 -enddate -noout -in <certificate>
```


## Encryption at rest

The operating system for each OpenSearch node handles encryption of data at rest. To enable encryption at rest in most Linux distributions, use the `cryptsetup` command:

```bash
cryptsetup luksFormat --key-file <key> <partition>
```

For full documentation about the command, see [cryptsetup(8) — Linux manual page](https://man7.org/linux/man-pages/man8/cryptsetup.8.html).

{% comment %}
## Beats

If you encounter compatibility issues when attempting to connect Beats to OpenSearch, make sure you're using the Apache 2.0 distribution of Beats, not the default distribution, which uses a proprietary license.

Try this minimal output configuration for using Beats with the Security plugin:

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

If you have trouble connecting Logstash to OpenSearch, try this minimal output configuration, which works with the Security plugin:

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

The Security plugin blocks the update by script operation (`POST <index>/_update/<id>`) when field-level security, document-level security, or field masking are active. You can still update documents using the standard index operation (`PUT <index>/_doc/<id>`).


## Illegal reflective access operation in logs

This is a known issue with Performance Analyzer that shouldn't affect functionality.
